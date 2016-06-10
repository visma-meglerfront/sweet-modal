###*!
 * For copyright information see COPYRIGHT.
###
(($) ->
	###*
	 * The SweetModal class.
	 * It is used to keep track of running instances
	 * and controlling them.
	 *
	 * @type {Function}
	###
	SweetModal = require './SweetModal.class.coffee'

	###*
	 * Some helpers used.
	 *
	 * @type {Object}
	###
	helpers = require './helpers.coffee'

	###*
	 * Templates
	 *
	 * @type {Object}
	###
	templates = require './templates.coffee'

	###*
	 * Default constructor for opening modals.
	###
	$.sweetModal = (props, message) ->
		if typeof props is 'string'
			if message is undefined
				props =
					content: props
			else
				props =
					title: props,
					content: message

		# Make it an alert if:
		# - it has no title
		# - it has title + icon
		if not props.title or props.icon and props.title
			props.type = $.sweetModal.TYPE_ALERT
			props.classes = props.classes || ['alert']

		# Merge params with default settings
		params = $.extend({}, $.sweetModal.defaultSettings, props)

		# Fallbacks for older code using $.confirm
		if params.content.length < 1
			params.content = params.message

		if typeof params.onDisplay is 'function'
			params.onOpen = params.onDisplay

		# Assign callbacks
		callbacks =
			onOpen: params.onOpen
			onClose: params.onClose

		# Apply callbacks
		params.onOpen = ($overlay) ->
			$.sweetModal.defaultCallbacks.onOpen()

			if typeof callbacks.onOpen is 'function'
				callbacks.onOpen($overlay)

		params.onClose = () ->
			$.sweetModal.defaultCallbacks.onClose()

			if typeof callbacks.onClose is 'function'
				callbacks.onClose()

		# Validate params
		helpers.validate(params)

		# Construct modal
		modal = new SweetModal(params)
		modal.open()

		$.sweetModal.storage.openModals.push(modal)

		# return handle
		return modal

	###*
	 * Open up a confirm dialog.
	 * This has varying argument configuration!
	 *
	 * @param  {string}                arg1  Message or Title
	 * @param  {string|function|null}  arg2  Message, Success Callback or null
	 * @param  {function|null}         arg3  Success Callback, Error Callback or null
	 * @param  {function|null}         arg4  Error Callback or null
	 *
	 * @return {SweetModal}
	###
	$.sweetModal.confirm = (arg1, arg2, arg3, arg4) ->
		title = ''

		if typeof arg1 is 'string' and
			(typeof arg2 is 'function' or
			 arg2 is undefined or
			 arg2 is null)

			content = arg1
			successCallback = arg2 || () ->
			errorCallback = arg3 || () ->

		else if typeof arg1 is 'string' and typeof arg2 is 'string' and
			(typeof(arg3) is 'function' or
			 arg3 is undefined or
			 arg3 is null)

			title = arg1
			content = arg2
			successCallback = arg3 || () ->
			errorCallback = arg4 || () ->

		else
			throw 'Invalid argument configuration.'

		# create modal
		return $.sweetModal(
			title: title
			content: content

			buttons:
				'cancel':
					label: $.sweetModal.defaultSettings.confirm.cancel.label
					action: errorCallback
					classes: $.sweetModal.defaultSettings.confirm.cancel.classes

				'ok':
					label: $.sweetModal.defaultSettings.confirm.yes.label
					action: successCallback
					classes: $.sweetModal.defaultSettings.confirm.yes.classes

			classes: ['alert', 'confirm']
			showCloseButton: false
			blocking: true
		)

	###*
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
	###
	$.sweetModal.prompt = (title, placeholder = '', value = '', successCallback = null, errorCallback = null) ->
		# prepare content template
		content = $(templates.prepare(templates.prompt, 
			TYPE: 'text'
			PLACEHOLDER: placeholder
			VALUE: value
		))

		# create buttons
		buttons = {}
		successCallback = successCallback || () ->
		errorCallback = errorCallback || () ->

		# create modal
		return $.sweetModal(
			title: title
			content: content.wrap('<div />').parent().html()

			buttons:
				cancel:
					label: $.sweetModal.defaultSettings.confirm.cancel.label
					action: errorCallback
					classes: $.sweetModal.defaultSettings.confirm.cancel.classes

				ok:
					label: $.sweetModal.defaultSettings.confirm.ok.label
					classes: $.sweetModal.defaultSettings.confirm.ok.classes
					action: () ->
						successCallback($('.sweet-modal-prompt input').val())


			classes: ['prompt']
			showCloseButton: false
			blocking: true,

			onOpen: ($overlay) ->
				$overlay.find('input').focus()
		);

	$.sweetModal.allModalsClosed = () ->
		$.sweetModal.storage.openModals.length is 0

	# Defaults
	
	###*
	 * Default Settings for $.sweetModal
	 *
	 * @type {Object}
	 *###
	$.sweetModal.defaultSettings =
		title: ''
		message: ''
		content: ''
		icon: ''

		classes: []
		showCloseButton: true
		blocking: false
		timeout: null
		theme: $.sweetModal.THEME_LIGHT
		type: $.sweetModal.TYPE_MODAL
		width: 'auto'

		buttons: {}

		confirm:
			yes:
				label: 'Yes',
				classes: 'greenB'

			ok:
				label: 'OK',
				classes: 'greenB'

			cancel:
				label: 'Cancel',
				classes: 'redB bordered flat'

		onOpen: null
		onClose: null

	$.sweetModal.defaultCallbacks =
		onOpen: () ->
			# Pin Layout
			$('body').css(
				overflow: 'hidden'
			)

			# Blur
			$('#content_wrap').addClass('blurred')

		onClose: () ->
			if $.sweetModal.allModalsClosed()
				# Unpin layout
				$('body').css(
					overflow: 'auto'
				)

				# Unblur
				$('#content_wrap').removeClass('blurred')

	$.sweetModal.storage =
		openModals: []

	# Adapters
	
	###*
	 * Adapter for $.confirm compatibility. This is used to be fully compatible
	 * with code using Tutorialzine's $.confirm plugin, by which this plugin was inspired.
	 *
	 * http://tutorialzine.com/2010/12/better-confirm-box-jquery-css3/
	###
	if typeof $.confirm isnt 'function'
		$.confirm = $.sweetModal
		$.confirm.close = $.sweetModal.closeAll

	###*
	 * Override native functions to call $.sweetModal:
	 * - alert
	###
	$.sweetModal.mapNativeFunctions = () ->
		window.alert = (message) ->
			$.sweetModal(message)

	# Constants

	###*
	 * All styles for all the components.
	 * You can mix and match individually.
	 *
	 * @type {Object}
	###
	$.sweetModal.THEME_COMPONENTS = {
		LIGHT_OVERLAY: 'light-overlay',
		LIGHT_MODAL: 'light-modal',
		DARK_OVERLAY: 'dark-overlay',
		DARK_MODAL: 'dark-modal'
	};

	###*
	 * Light Theme-Constant
	 *
	 * @type {Array}
	###
	$.sweetModal.THEME_LIGHT = [
		$.sweetModal.THEME_COMPONENTS.LIGHT_OVERLAY,
		$.sweetModal.THEME_COMPONENTS.LIGHT_MODAL
	]

	###*
	 * Dark Theme-Constant
	 *
	 * @type {Array}
	###
	$.sweetModal.THEME_DARK = [
		$.sweetModal.THEME_COMPONENTS.DARK_OVERLAY,
		$.sweetModal.THEME_COMPONENTS.DARK_MODAL
	]

	###*
	 * Mixed Theme-Constant
	 *
	 * @type {Array}
	###
	$.sweetModal.THEME_MIXED = [
		$.sweetModal.THEME_COMPONENTS.DARK_OVERLAY,
		$.sweetModal.THEME_COMPONENTS.LIGHT_MODAL
	]

	$.sweetModal.TYPE_ALERT = 'alert'
	$.sweetModal.TYPE_MODAL = 'modal'

	$.sweetModal.ICON_SUCCESS = 'success';
	$.sweetModal.ICON_ERROR = 'error';
	$.sweetModal.ICON_WARNING = 'warning';
)(jQuery)