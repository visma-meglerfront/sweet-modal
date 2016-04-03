module.exports =
	###*
	 * Check if we're in mobile-mode
	 *
	 * @return {Boolean}
	###
	isMobile: () ->
		window.matchMedia('screen and (max-width: 420px)').matches

	###*
	 * Validate a set of params.
	 * Throws errors if anything's invalid.
	 *
	 * @param  {Object} params Params to check
	 *
	 * @return {Boolean}       true
	###
	validate: (params) ->
		# Check arguments before continuing
		
		isInvalidTabs = typeof(params.title) is 'object' and not typeof(params.content) is 'object' or
			typeof(params.content) is 'object' and not typeof(params.title) is 'object'

		if isInvalidTabs and params.content.length != params.title.length
			throw 'Title and Content count did not match.'

		return true

	###*
	 * Get the size of an object.
	 *
	 * @param  {Object} obj Object to get size of
	 *
	 * @return {int}        Size
	###
	objectSize: (obj) ->
		Object.keys(obj).length