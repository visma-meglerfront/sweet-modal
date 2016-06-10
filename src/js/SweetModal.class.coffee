helpers = require('./helpers.coffee')
templates = require('./templates.coffee')

class SweetModal
	params = {}
	$overlay = null

	constructor: (@params) ->

	getParams: () ->
		this.params

	###*
	 * Construct the buttons.
	 *
	 * @param  {jQueryObject} $modal Modal Overlay Container
	 *
	 * @return {jQueryObject}        Buttons Container
	###
	_constructButtons: ($modal) ->
		$buttons = $(templates.buttons)

		if typeof @params.buttons is 'object' and helpers.objectSize(@params.buttons) > 0
			for name, obj of @params.buttons
				obj = $.extend(
					label: undefined
					action: () ->
					classes: ''
					class: ''
				, obj)

				# Fallback for $.confirm code
				if obj.classes.length < 1
					obj.classes = obj.class

				# Label-option override
				if obj.label or obj.label is ''
					label = obj.label
				else
					label = name

				# Construct single button
				$button = $('<a href="javascript:void(0);" class="button ' + obj.classes + '">' + label + '</a>')

				# Add callback
				$button.bind('click', { buttonObject: obj, parentObject: @ }, (e) ->
					e.preventDefault()

					result = e.data.buttonObject.action(e.data.parentObject)

					if result is undefined or result isnt false
						e.data.parentObject.close()
				)

				# Add button to butttons container
				$buttons.append($button)

			# Add all buttons to the modal
			$modal.append($buttons)

		return $buttons

	###*
	 * Construct the title.
	 *
	 * @param  {jQueryObject} $overlay Overlay Container
	 * @param  {jQueryObject} $modal   Modal Container
	###
	_constructTitle: ($overlay, $modal) ->
		if typeof @params.title is 'string'
			if @params.title isnt ''
				$modal.find('.sweet-modal-title h2').html(@params.title)
			else
				$modal.find('.sweet-modal-title-wrap').remove()
		else if typeof @params.title is 'object'
			$overlay.addClass('tabbed')

			$modalTitle = $modal.find('.sweet-modal-title')
			$modalTitle.find('h2').remove()

			$modalTabs = $(templates.tabs.links)
			$modalTabsUL = $modalTabs.find('ul')

			for key, value of @params.title
				$tpl = $(templates.prepare(templates.tabs.link,
					TAB_ID: key
				));

				label = icon = false

				if typeof value is 'string'
					label = value
					icon = false
				else
					label = value.label || false
					icon = value.icon || false

				if icon
					$icon = $tpl.find('a .icon').html(icon)

					if value.iconCSS
						$icon.find('img, svg').css(value.iconCSS)
				else
					$tpl.find('a .icon').remove()

				if not label
					$tpl.find('a label').remove();

				$tpl.find('a label').text(label);
				$modalTabsUL.append($tpl);

			$modalTabsUL.find('li:first-child').addClass('active')
			$modalTitle.append($modalTabs)
		else
			throw 'Invalid title type.'

	###*
	 * Construct the content.
	 *
	 * @param  {jQueryObject} $overlay Overlay Container
	 * @param  {jQueryObject} $modal   Modal Container
	 *
	 * @return {[type]}          [description]
	###
	_constructContent: ($overlay, $modal) ->
		if typeof @params.content is 'string'
			# Check if it is a YouTUbe Link
			if m = @params.content.match(/^\S+youtu\.?be\S+(?:v=|\/v\/)(\w+)$/)
				@params.content = '<iframe width="100%" height="400" src="https://www.youtube.com/embed/' + m[1] + '" frameborder="0" allowfullscreen></iframe>'

			if @params.icon isnt ''
				$overlay.addClass('sweet-modal-has-icon')

				switch @params.icon
					when $.sweetModal.ICON_SUCCESS
						@params.content = templates.icons.success + @params.content

					when $.sweetModal.ICON_ERROR
						@params.content = templates.icons.error + @params.content

					when $.sweetModal.ICON_WARNING
						@params.content = templates.icons.warning + @params.content

			$modal.find('.sweet-modal-content').html(@params.content)
		else
			$modalContent = $(templates.tabs.content)

			for key, value of @params.content
				$tpl = $(templates.prepare(templates.tabs.tab,
					TAB_ID: key
				))

				$tpl.append(value)
				$modalContent.append($tpl)

			$modalContent.find('.sweet-modal-tab:not(:first-child)').hide()
			$modal.find('.sweet-modal-content').html($modalContent)

		$modal.addClass(@params.classes.join(' '))
		$overlay.append($modal)

	###*
	 * Generate a jQuery DOM object from this object.
	 *
	 * @return {jQueryObject} Final modal (overlay container)
	###
	tojQueryObject: () ->
		if @$overlay
			return @$overlay

		# Construct Basics
		$overlay = $(templates.overlay).addClass(if @params.theme then @params.theme.join(' ') else $.sweetModal.THEME_LIGHT.join(' '))
		$modal = $(templates.modal)

		# Hide close button, if requested
		if not @params.showCloseButton
			$modal.find('.sweet-modal-close').remove()

		# Change width, if requested
		if @params.width isnt 'auto'
			$modal.css(
				width: @params.width
				left: '50%'
				transform: 'translateX(-50%)'
			)

		# Construct Buttons
		@_constructButtons($modal)

		# Construct Title
		@_constructTitle($overlay, $modal)

		# Construct Modal
		@_constructContent($overlay, $modal);

		@$overlay = $overlay

		return $overlay

	###*
	 * Open this modal.
	 *
	 * @return {SweetModal} 
	###
	open: () ->
		scope = @
		$overlay = @tojQueryObject()
		$('body').append(@$overlay)

		$overlay.click((e) =>
			if e.target.hasClass is undefined or not e.target.hasClass('sweet-modal-clickable')
				if @params.blocking
					@bounce()
				else
					@close()
		).delay(100).queue(() ->
			$(this).addClass('open')
			scope.params.onOpen(scope.tojQueryObject())
		)

		$overlay.find('.sweet-modal-box').click((e) ->
			if e.target.hasClass is undefined or not e.target.hasClass('sweet-modal-clickable')
				e.stopPropagation()
		)

		# Animate Icons, if available
		if $overlay.find('.sweet-modal-icon').length > 0
			$icon = $overlay.find('.sweet-modal-icon')

			switch @params.icon
				when $.sweetModal.ICON_SUCCESS
					$icon.delay(80).queue () ->
						$icon.addClass('animate')
						$icon.find('.sweet-modal-tip').addClass('animateSuccessTip')
						$icon.find('.sweet-modal-long').addClass('animateSuccessLong')

				when $.sweetModal.ICON_WARNING
					$icon.addClass('pulseWarning')
					$icon.find('.sweet-modal-body, .sweet-modal-dot').addClass('pulseWarningIns')

				when $.sweetModal.ICON_ERROR
					$icon.delay(240).queue () ->
						$icon.addClass('animateErrorIcon')
						$icon.find('.sweet-modal-x-mark').addClass('animateXMark')

		# Auto-close if timeout is set
		if @params.timeout
			setTimeout(() =>
				@close()
			, @params.timeout)

		@resize()
		@appendListeners()

		return @

	bounce: () ->
		$overlay = @tojQueryObject()

		$overlay.addClass('bounce')

		setTimeout(() ->
			$overlay.removeClass('bounce')
		, 300)

	###*
	 * Resize this modal for the environment.
	 *
	 * @return {SweetModal}
	###
	resize: () ->
		$overlay = @tojQueryObject()
		$modalBox = $overlay.find('.sweet-modal-box')

		mobileView = window.matchMedia('screen and (max-width: 914px)').matches

		if not mobileView
			$(window).resize(() ->
				if $modalBox.height() > $(window).height()
					$modalBox.css(
						top: '0'
						marginTop: '96px'
					)
				else
					$modalBox.css(
						top: '50%'
						marginTop: -$modalBox.height() / 2 - 6
					)
			)

			$(window).trigger('resize')
		else
			$modalBox.removeAttr('style')

		return @

	###*
	 * Append the listeners to this Modal.
	 *
	 * @return {SweetModal}
	###
	appendListeners: () ->
		$overlay = @tojQueryObject()

		# Close Link
		$overlay.find('.sweet-modal-close-link').off('click').click(() =>
			@close()
		)

		# Tab-Switcher
		$overlay.find('.sweet-modal-tabs-links a').off('click').click((e) ->
			e.preventDefault()

			tabHref = $(this).attr('href').replace('#', '')
			$innerOverlay = $(this).closest('.sweet-modal-overlay');

			$innerOverlay.find('.sweet-modal-tabs-links li')
				.removeClass('active')
				.find('a[href=\'#' + tabHref + '\']')
					.closest('li')
						.addClass('active')

			$innerOverlay.find('.sweet-modal-tabs-content .sweet-modal-tab')
				.hide()
				.filter('[data-tab=' + tabHref + ']')
					.show()
		)

		return @

	###*
	 * Close this modal.
	 *
	 * @return {SweetModal}
	###
	close: () =>
		$overlay = @tojQueryObject()

		# Remove modal from stack
		$.sweetModal.storage.openModals = (modal for modal in $.sweetModal.storage.openModals when modal.getParams() isnt @.getParams())

		$overlay.removeClass('open')
		@params.onClose()

		setTimeout(() =>
			$overlay.remove()
		, 300)
		
		return @

# Export
module.exports = SweetModal