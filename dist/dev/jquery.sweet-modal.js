/*!
 * SweetModal: Sweet, easy and powerful modals and dialogs
 * v1.3.1, 2016-06-11
 * http://github.com/adeptoas/sweet-modal
 *
 * Copyright (c) 2016 Adepto.as AS · Oslo, Norway
 * Dual licensed under the MIT and GPL licenses.
 *
 * See LICENSE-MIT.txt and LICENSE-GPL.txt
 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SweetModal, helpers, templates,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

helpers = require('./helpers.coffee');

templates = require('./templates.coffee');

SweetModal = (function() {
  var $overlay, params;

  params = {};

  $overlay = null;

  function SweetModal(params1) {
    this.params = params1;
    this.close = bind(this.close, this);
  }

  SweetModal.prototype.getParams = function() {
    return this.params;
  };


  /**
  	 * Construct the buttons.
  	 *
  	 * @param  {jQueryObject} $modal Modal Overlay Container
  	 *
  	 * @return {jQueryObject}        Buttons Container
   */

  SweetModal.prototype._constructButtons = function($modal) {
    var $button, $buttons, label, name, obj, ref;
    $buttons = $(templates.buttons);
    if (typeof this.params.buttons === 'object' && helpers.objectSize(this.params.buttons) > 0) {
      ref = this.params.buttons;
      for (name in ref) {
        obj = ref[name];
        obj = $.extend({
          label: void 0,
          action: function() {},
          classes: '',
          "class": ''
        }, obj);
        if (obj.classes.length < 1) {
          obj.classes = obj["class"];
        }
        if (obj.label || obj.label === '') {
          label = obj.label;
        } else {
          label = name;
        }
        $button = $('<a href="javascript:void(0);" class="button ' + obj.classes + '">' + label + '</a>');
        $button.bind('click', {
          buttonObject: obj,
          parentObject: this
        }, function(e) {
          var result;
          e.preventDefault();
          result = e.data.buttonObject.action(e.data.parentObject);
          if (result === void 0 || result !== false) {
            return e.data.parentObject.close();
          }
        });
        $buttons.append($button);
      }
      $modal.append($buttons);
    }
    return $buttons;
  };


  /**
  	 * Construct the title.
  	 *
  	 * @param  {jQueryObject} $overlay Overlay Container
  	 * @param  {jQueryObject} $modal   Modal Container
   */

  SweetModal.prototype._constructTitle = function($overlay, $modal) {
    var $icon, $modalTabs, $modalTabsUL, $modalTitle, $tpl, icon, key, label, ref, value;
    if (typeof this.params.title === 'string') {
      if (this.params.title !== '') {
        return $modal.find('.sweet-modal-title h2').html(this.params.title);
      } else {
        return $modal.find('.sweet-modal-title-wrap').remove();
      }
    } else if (typeof this.params.title === 'object') {
      $overlay.addClass('tabbed');
      $modalTitle = $modal.find('.sweet-modal-title');
      $modalTitle.find('h2').remove();
      $modalTabs = $(templates.tabs.links);
      $modalTabsUL = $modalTabs.find('ul');
      ref = this.params.title;
      for (key in ref) {
        value = ref[key];
        $tpl = $(templates.prepare(templates.tabs.link, {
          TAB_ID: key
        }));
        label = icon = false;
        if (typeof value === 'string') {
          label = value;
          icon = false;
        } else {
          label = value.label || false;
          icon = value.icon || false;
        }
        if (icon) {
          $icon = $tpl.find('a .icon').html(icon);
          if (value.iconCSS) {
            $icon.find('img, svg').css(value.iconCSS);
          }
        } else {
          $tpl.find('a .icon').remove();
        }
        if (!label) {
          $tpl.find('a label').remove();
        }
        $tpl.find('a label').text(label);
        $modalTabsUL.append($tpl);
      }
      $modalTabsUL.find('li:first-child').addClass('active');
      return $modalTitle.append($modalTabs);
    } else {
      throw 'Invalid title type.';
    }
  };


  /**
  	 * Construct the content.
  	 *
  	 * @param  {jQueryObject} $overlay Overlay Container
  	 * @param  {jQueryObject} $modal   Modal Container
  	 *
  	 * @return {[type]}          [description]
   */

  SweetModal.prototype._constructContent = function($overlay, $modal) {
    var $modalContent, $tpl, key, m, ref, value;
    if (typeof this.params.content === 'string') {
      if (m = this.params.content.match(/^\S+youtu\.?be\S+(?:v=|\/v\/)(\w+)$/)) {
        this.params.content = '<iframe width="100%" height="400" src="https://www.youtube.com/embed/' + m[1] + '" frameborder="0" allowfullscreen></iframe>';
      }
      if (this.params.icon !== '') {
        $overlay.addClass('sweet-modal-has-icon');
        switch (this.params.icon) {
          case $.sweetModal.ICON_SUCCESS:
            this.params.content = templates.icons.success + this.params.content;
            break;
          case $.sweetModal.ICON_ERROR:
            this.params.content = templates.icons.error + this.params.content;
            break;
          case $.sweetModal.ICON_WARNING:
            this.params.content = templates.icons.warning + this.params.content;
        }
      }
      $modal.find('.sweet-modal-content').html(this.params.content);
    } else {
      $modalContent = $(templates.tabs.content);
      ref = this.params.content;
      for (key in ref) {
        value = ref[key];
        $tpl = $(templates.prepare(templates.tabs.tab, {
          TAB_ID: key
        }));
        $tpl.append(value);
        $modalContent.append($tpl);
      }
      $modalContent.find('.sweet-modal-tab:not(:first-child)').hide();
      $modal.find('.sweet-modal-content').html($modalContent);
    }
    $modal.addClass(this.params.classes.join(' '));
    return $overlay.append($modal);
  };


  /**
  	 * Generate a jQuery DOM object from this object.
  	 *
  	 * @return {jQueryObject} Final modal (overlay container)
   */

  SweetModal.prototype.tojQueryObject = function() {
    var $modal;
    if (this.$overlay) {
      return this.$overlay;
    }
    $overlay = $(templates.overlay).addClass(this.params.theme ? this.params.theme.join(' ') : $.sweetModal.THEME_LIGHT.join(' '));
    $modal = $(templates.modal);
    if (!this.params.showCloseButton) {
      $modal.find('.sweet-modal-close').remove();
    }
    if (this.params.width !== 'auto') {
      $modal.css({
        width: this.params.width,
        left: '50%',
        transform: 'translateX(-50%)'
      });
    }
    this._constructButtons($modal);
    this._constructTitle($overlay, $modal);
    this._constructContent($overlay, $modal);
    this.$overlay = $overlay;
    return $overlay;
  };


  /**
  	 * Open this modal.
  	 *
  	 * @return {SweetModal}
   */

  SweetModal.prototype.open = function() {
    var $icon, scope;
    scope = this;
    $overlay = this.tojQueryObject();
    $('body').append(this.$overlay);
    $overlay.click((function(_this) {
      return function(e) {
        if (e.target.hasClass === void 0 || !e.target.hasClass('sweet-modal-clickable')) {
          if (_this.params.blocking) {
            return _this.bounce();
          } else {
            return _this.close();
          }
        }
      };
    })(this)).delay(100).queue(function() {
      $(this).addClass('open');
      return scope.params.onOpen(scope.tojQueryObject());
    });
    $overlay.find('.sweet-modal-box').click(function(e) {
      if (e.target.hasClass === void 0 || !e.target.hasClass('sweet-modal-clickable')) {
        return e.stopPropagation();
      }
    });
    if ($overlay.find('.sweet-modal-icon').length > 0) {
      $icon = $overlay.find('.sweet-modal-icon');
      switch (this.params.icon) {
        case $.sweetModal.ICON_SUCCESS:
          $icon.delay(80).queue(function() {
            $icon.addClass('animate');
            $icon.find('.sweet-modal-tip').addClass('animateSuccessTip');
            return $icon.find('.sweet-modal-long').addClass('animateSuccessLong');
          });
          break;
        case $.sweetModal.ICON_WARNING:
          $icon.addClass('pulseWarning');
          $icon.find('.sweet-modal-body, .sweet-modal-dot').addClass('pulseWarningIns');
          break;
        case $.sweetModal.ICON_ERROR:
          $icon.delay(240).queue(function() {
            $icon.addClass('animateErrorIcon');
            return $icon.find('.sweet-modal-x-mark').addClass('animateXMark');
          });
      }
    }
    if (this.params.timeout) {
      setTimeout((function(_this) {
        return function() {
          return _this.close();
        };
      })(this), this.params.timeout);
    }
    this.resize();
    this.appendListeners();
    return this;
  };

  SweetModal.prototype.bounce = function() {
    $overlay = this.tojQueryObject();
    $overlay.addClass('bounce');
    return setTimeout(function() {
      return $overlay.removeClass('bounce');
    }, 300);
  };


  /**
  	 * Resize this modal for the environment.
  	 *
  	 * @return {SweetModal}
   */

  SweetModal.prototype.resize = function() {
    var $modalBox, mobileView;
    $overlay = this.tojQueryObject();
    $modalBox = $overlay.find('.sweet-modal-box');
    mobileView = window.matchMedia('screen and (max-width: 914px)').matches;
    if (!mobileView) {
      $(window).resize(function() {
        if ($modalBox.height() > $(window).height()) {
          return $modalBox.css({
            top: '0',
            marginTop: '96px'
          });
        } else {
          return $modalBox.css({
            top: '50%',
            marginTop: -$modalBox.height() / 2 - 6
          });
        }
      });
      $(window).trigger('resize');
    } else {
      $modalBox.removeAttr('style');
    }
    return this;
  };


  /**
  	 * Append the listeners to this Modal.
  	 *
  	 * @return {SweetModal}
   */

  SweetModal.prototype.appendListeners = function() {
    $overlay = this.tojQueryObject();
    $overlay.find('.sweet-modal-close-link').off('click').click((function(_this) {
      return function() {
        return _this.close();
      };
    })(this));
    $overlay.find('.sweet-modal-tabs-links a').off('click').click(function(e) {
      var $innerOverlay, tabHref;
      e.preventDefault();
      tabHref = $(this).attr('href').replace('#', '');
      $innerOverlay = $(this).closest('.sweet-modal-overlay');
      $innerOverlay.find('.sweet-modal-tabs-links li').removeClass('active').find('a[href=\'#' + tabHref + '\']').closest('li').addClass('active');
      return $innerOverlay.find('.sweet-modal-tabs-content .sweet-modal-tab').hide().filter('[data-tab=' + tabHref + ']').show();
    });
    return this;
  };


  /**
  	 * Close this modal.
  	 *
  	 * @return {SweetModal}
   */

  SweetModal.prototype.close = function() {
    var modal;
    $overlay = this.tojQueryObject();
    $.sweetModal.storage.openModals = (function() {
      var i, len, ref, results;
      ref = $.sweetModal.storage.openModals;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        modal = ref[i];
        if (modal.getParams() !== this.getParams()) {
          results.push(modal);
        }
      }
      return results;
    }).call(this);
    $overlay.removeClass('open');
    this.params.onClose();
    setTimeout((function(_this) {
      return function() {
        return $overlay.remove();
      };
    })(this), 300);
    return this;
  };

  return SweetModal;

})();

module.exports = SweetModal;


},{"./helpers.coffee":2,"./templates.coffee":4}],2:[function(require,module,exports){
module.exports = {

  /**
  	 * Check if we're in mobile-mode
  	 *
  	 * @return {Boolean}
   */
  isMobile: function() {
    return window.matchMedia('screen and (max-width: 420px)').matches;
  },

  /**
  	 * Validate a set of params.
  	 * Throws errors if anything's invalid.
  	 *
  	 * @param  {Object} params Params to check
  	 *
  	 * @return {Boolean}       true
   */
  validate: function(params) {
    var isInvalidTabs;
    isInvalidTabs = typeof params.title === 'object' && !typeof params.content === 'object' || typeof params.content === 'object' && !typeof params.title === 'object';
    if (isInvalidTabs && params.content.length !== params.title.length) {
      throw 'Title and Content count did not match.';
    }
    return true;
  },

  /**
  	 * Get the size of an object.
  	 *
  	 * @param  {Object} obj Object to get size of
  	 *
  	 * @return {int}        Size
   */
  objectSize: function(obj) {
    return Object.keys(obj).length;
  }
};


},{}],3:[function(require,module,exports){

/**!
 * For copyright information see COPYRIGHT.
 */
(function($) {

  /**
  	 * The SweetModal class.
  	 * It is used to keep track of running instances
  	 * and controlling them.
  	 *
  	 * @type {Function}
   */
  var SweetModal, helpers, templates;
  SweetModal = require('./SweetModal.class.coffee');

  /**
  	 * Some helpers used.
  	 *
  	 * @type {Object}
   */
  helpers = require('./helpers.coffee');

  /**
  	 * Templates
  	 *
  	 * @type {Object}
   */
  templates = require('./templates.coffee');

  /**
  	 * Default constructor for opening modals.
   */
  $.sweetModal = function(props, message) {
    var callbacks, modal, params;
    if (typeof props === 'string') {
      if (message === void 0) {
        props = {
          content: props
        };
      } else {
        props = {
          title: props,
          content: message
        };
      }
    }
    if (!props.title || props.icon && props.title) {
      props.type = $.sweetModal.TYPE_ALERT;
      props.classes = props.classes || ['alert'];
    }
    params = $.extend({}, $.sweetModal.defaultSettings, props);
    if (params.content.length < 1) {
      params.content = params.message;
    }
    if (typeof params.onDisplay === 'function') {
      params.onOpen = params.onDisplay;
    }
    callbacks = {
      onOpen: params.onOpen,
      onClose: params.onClose
    };
    params.onOpen = function($overlay) {
      $.sweetModal.defaultCallbacks.onOpen();
      if (typeof callbacks.onOpen === 'function') {
        return callbacks.onOpen($overlay);
      }
    };
    params.onClose = function() {
      $.sweetModal.defaultCallbacks.onClose();
      if (typeof callbacks.onClose === 'function') {
        return callbacks.onClose();
      }
    };
    helpers.validate(params);
    modal = new SweetModal(params);
    modal.open();
    $.sweetModal.storage.openModals.push(modal);
    return modal;
  };

  /**
  	 * Open up a confirm dialog.
  	 * This has varying argument configuration!
  	 *
  	 * @param  {string}                arg1  Message or Title
  	 * @param  {string|function|null}  arg2  Message, Success Callback or null
  	 * @param  {function|null}         arg3  Success Callback, Error Callback or null
  	 * @param  {function|null}         arg4  Error Callback or null
  	 *
  	 * @return {SweetModal}
   */
  $.sweetModal.confirm = function(arg1, arg2, arg3, arg4) {
    var content, errorCallback, successCallback, title;
    title = '';
    if (typeof arg1 === 'string' && (typeof arg2 === 'function' || arg2 === void 0 || arg2 === null)) {
      content = arg1;
      successCallback = arg2 || function() {};
      errorCallback = arg3 || function() {};
    } else if (typeof arg1 === 'string' && typeof arg2 === 'string' && (typeof arg3 === 'function' || arg3 === void 0 || arg3 === null)) {
      title = arg1;
      content = arg2;
      successCallback = arg3 || function() {};
      errorCallback = arg4 || function() {};
    } else {
      throw 'Invalid argument configuration.';
    }
    return $.sweetModal({
      title: title,
      content: content,
      buttons: {
        'cancel': {
          label: $.sweetModal.defaultSettings.confirm.cancel.label,
          action: errorCallback,
          classes: $.sweetModal.defaultSettings.confirm.cancel.classes
        },
        'ok': {
          label: $.sweetModal.defaultSettings.confirm.yes.label,
          action: successCallback,
          classes: $.sweetModal.defaultSettings.confirm.yes.classes
        }
      },
      classes: ['alert', 'confirm'],
      showCloseButton: false,
      blocking: true
    });
  };

  /**
  	 * Open up a prompt dialog.
  	 * This is incompatible to the browser's built-in prompt-function, if
  	 * $.sweetModal.mapNativeFunctions is not used.
  	 *
  	 * @param  {string}   title             Title
  	 * @param  {string}   placeholder       Placeholder, default ''
  	 * @param  {string}   value             Value, default ''
  	 * @param  {function} successCallback   Success Callback, default () ->
  	 * @param  {function} errorCallback     Error Callback, default () ->
  	 *
  	 * @return {SweetModal}
   */
  $.sweetModal.prompt = function(title, placeholder, value, successCallback, errorCallback) {
    var buttons, content;
    if (placeholder == null) {
      placeholder = '';
    }
    if (value == null) {
      value = '';
    }
    if (successCallback == null) {
      successCallback = null;
    }
    if (errorCallback == null) {
      errorCallback = null;
    }
    content = $(templates.prepare(templates.prompt, {
      TYPE: 'text',
      PLACEHOLDER: placeholder,
      VALUE: value
    }));
    buttons = {};
    successCallback = successCallback || function() {};
    errorCallback = errorCallback || function() {};
    return $.sweetModal({
      title: title,
      content: content.wrap('<div />').parent().html(),
      buttons: {
        cancel: {
          label: $.sweetModal.defaultSettings.confirm.cancel.label,
          action: errorCallback,
          classes: $.sweetModal.defaultSettings.confirm.cancel.classes
        },
        ok: {
          label: $.sweetModal.defaultSettings.confirm.ok.label,
          classes: $.sweetModal.defaultSettings.confirm.ok.classes,
          action: function() {
            return successCallback($('.sweet-modal-prompt input').val());
          }
        }
      },
      classes: ['prompt'],
      showCloseButton: false,
      blocking: true,
      onOpen: function($overlay) {
        return $overlay.find('input').focus();
      }
    });
  };
  $.sweetModal.allModalsClosed = function() {
    return $.sweetModal.storage.openModals.length === 0;
  };

  /**
  	 * Default Settings for $.sweetModal
  	 *
  	 * @type {Object}
  	 *
   */
  $.sweetModal.defaultSettings = {
    title: '',
    message: '',
    content: '',
    icon: '',
    classes: [],
    showCloseButton: true,
    blocking: false,
    timeout: null,
    theme: $.sweetModal.THEME_LIGHT,
    type: $.sweetModal.TYPE_MODAL,
    width: 'auto',
    buttons: {},
    confirm: {
      yes: {
        label: 'Yes',
        classes: 'greenB'
      },
      ok: {
        label: 'OK',
        classes: 'greenB'
      },
      cancel: {
        label: 'Cancel',
        classes: 'redB bordered flat'
      }
    },
    onOpen: null,
    onClose: null
  };
  $.sweetModal.defaultCallbacks = {
    onOpen: function() {
      $('body').css({
        overflow: 'hidden'
      });
      return $('#content_wrap').addClass('blurred');
    },
    onClose: function() {
      if ($.sweetModal.allModalsClosed()) {
        $('body').css({
          overflow: 'auto'
        });
        return $('#content_wrap').removeClass('blurred');
      }
    }
  };
  $.sweetModal.storage = {
    openModals: []
  };

  /**
  	 * Adapter for $.confirm compatibility. This is used to be fully compatible
  	 * with code using Tutorialzine's $.confirm plugin, by which this plugin was inspired.
  	 *
  	 * http://tutorialzine.com/2010/12/better-confirm-box-jquery-css3/
   */
  if (typeof $.confirm !== 'function') {
    $.confirm = $.sweetModal;
    $.confirm.close = $.sweetModal.closeAll;
  }

  /**
  	 * Override native functions to call $.sweetModal:
  	 * - alert
   */
  $.sweetModal.mapNativeFunctions = function() {
    return window.alert = function(message) {
      return $.sweetModal(message);
    };
  };

  /**
  	 * All styles for all the components.
  	 * You can mix and match individually.
  	 *
  	 * @type {Object}
   */
  $.sweetModal.THEME_COMPONENTS = {
    LIGHT_OVERLAY: 'light-overlay',
    LIGHT_MODAL: 'light-modal',
    DARK_OVERLAY: 'dark-overlay',
    DARK_MODAL: 'dark-modal'
  };

  /**
  	 * Light Theme-Constant
  	 *
  	 * @type {Array}
   */
  $.sweetModal.THEME_LIGHT = [$.sweetModal.THEME_COMPONENTS.LIGHT_OVERLAY, $.sweetModal.THEME_COMPONENTS.LIGHT_MODAL];

  /**
  	 * Dark Theme-Constant
  	 *
  	 * @type {Array}
   */
  $.sweetModal.THEME_DARK = [$.sweetModal.THEME_COMPONENTS.DARK_OVERLAY, $.sweetModal.THEME_COMPONENTS.DARK_MODAL];

  /**
  	 * Mixed Theme-Constant
  	 *
  	 * @type {Array}
   */
  $.sweetModal.THEME_MIXED = [$.sweetModal.THEME_COMPONENTS.DARK_OVERLAY, $.sweetModal.THEME_COMPONENTS.LIGHT_MODAL];
  $.sweetModal.TYPE_ALERT = 'alert';
  $.sweetModal.TYPE_MODAL = 'modal';
  $.sweetModal.ICON_SUCCESS = 'success';
  $.sweetModal.ICON_ERROR = 'error';
  return $.sweetModal.ICON_WARNING = 'warning';
})(jQuery);


},{"./SweetModal.class.coffee":1,"./helpers.coffee":2,"./templates.coffee":4}],4:[function(require,module,exports){
module.exports = {
  overlay: "<div class=\"sweet-modal-overlay\">\n</div>",
  modal: "<div class=\"sweet-modal-box\">\n	<div class=\"sweet-modal-close\"><a href=\"javascript:void(0);\" class=\"sweet-modal-close-link\"></a></div>\n	<div class=\"sweet-modal-title-wrap\">\n		<div class=\"sweet-modal-title\"><h2></h2></div>\n	</div>\n	\n	<div class=\"sweet-modal-content\">\n	</div>\n</div>",
  buttons: "<div class=\"sweet-modal-buttons\"></div>",
  tabs: {
    links: "<div class=\"sweet-modal-tabs-links\">\n	<ul>\n	</ul>\n</div>",
    content: "<div class=\"sweet-modal-tabs-content\">\n</div>",
    link: "<li>\n	<a href=\"#modal-{TAB_ID}\">\n		<span class=\"icon\"></span>\n		<label></label>\n	</a>\n</li>",
    tab: "<div class=\"sweet-modal-tab\" data-tab=\"modal-{TAB_ID}\">\n</div>"
  },
  icons: {
    error: "<div class=\"sweet-modal-icon sweet-modal-error\">\n	<span class=\"sweet-modal-x-mark\">\n		<span class=\"sweet-modal-line sweet-modal-left\"></span>\n		<span class=\"sweet-modal-line sweet-modal-right\"></span>\n	</span>\n</div>",
    warning: "<div class=\"sweet-modal-icon sweet-modal-warning\">\n	<span class=\"sweet-modal-body\"></span>\n	<span class=\"sweet-modal-dot\"></span>\n</div>",
    info: "<div class=\"sweet-modal-icon sweet-modal-info\"></div>",
    success: "<div class=\"sweet-modal-icon sweet-modal-success\">\n	<span class=\"sweet-modal-line sweet-modal-tip\"></span>\n	<span class=\"sweet-modal-line sweet-modal-long\"></span>\n	<div class=\"sweet-modal-placeholder\"></div>\n	<div class=\"sweet-modal-fix\"></div>\n</div>"
  },
  prompt: "<div class=\"sweet-modal-prompt\">\n	<input type=\"{TYPE}\" placeholder=\"{PLACEHOLDER}\" value=\"{VALUE}\" />\n</div>",
  prepare: function(tpl, strings) {
    var i, len, lookup, m, matches, replacement;
    matches = tpl.match(/\{([A-Z0-9_\-]+)\}/g) || [];
    for (i = 0, len = matches.length; i < len; i++) {
      m = matches[i];
      lookup = m.replace(/\{|\}/g, '');
      replacement = strings[lookup];
      if (replacement === void 0) {
        replacement = '{' + lookup + '}';
      }
      tpl = tpl.replace(new RegExp(m, 'g'), replacement);
    }
    return tpl;
  }
};


},{}]},{},[3]);
