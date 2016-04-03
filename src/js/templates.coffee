module.exports = 
	overlay: """
		<div class="sweet-modal-overlay">
		</div>
	"""

	modal: """
		<div class="sweet-modal-box">
			<div class="sweet-modal-close"><a href="javascript:void(0);" class="sweet-modal-close-link"></a></div>
			<div class="sweet-modal-title-wrap">
				<div class="sweet-modal-title"><h2></h2></div>
			</div>
			
			<div class="sweet-modal-content">
			</div>
		</div>
	"""

	buttons: """
		<div class="sweet-modal-buttons">\
		</div>\
	"""

	tabs:
		links: """
			<div class="sweet-modal-tabs-links">
				<ul>
				</ul>
			</div>
		"""

		content: """
			<div class="sweet-modal-tabs-content">
			</div>
		"""

		link: """
			<li>
				<a href="#modal-{TAB_ID}">
					<span class="icon"></span>
					<label></label>
				</a>
			</li>
		"""

		tab: """
			<div class="sweet-modal-tab" data-tab="modal-{TAB_ID}">
			</div>
		"""

	icons:
		error: """
			<div class="sweet-modal-icon sweet-modal-error">
				<span class="sweet-modal-x-mark">
					<span class="sweet-modal-line sweet-modal-left"></span>
					<span class="sweet-modal-line sweet-modal-right"></span>
				</span>
			</div>
		"""

		warning: """
			<div class="sweet-modal-icon sweet-modal-warning">
				<span class="sweet-modal-body"></span>
				<span class="sweet-modal-dot"></span>
			</div>
		"""

		info: """
			<div class="sweet-modal-icon sweet-modal-info"></div>
		"""

		success: """
			<div class="sweet-modal-icon sweet-modal-success">
				<span class="sweet-modal-line sweet-modal-tip"></span>
				<span class="sweet-modal-line sweet-modal-long"></span>
				<div class="sweet-modal-placeholder"></div>
				<div class="sweet-modal-fix"></div>
			</div>
		"""

	prompt: """
		<div class="sweet-modal-prompt">
			<input type="{TYPE}" placeholder="{PLACEHOLDER}" value="{VALUE}" />
		</div>
	"""

	prepare: (tpl, strings) ->
		matches = tpl.match(/\{([A-Z0-9_\-]+)\}/g) || []

		for m in matches
			lookup = m.replace(/\{|\}/g, '')
			replacement = strings[lookup]

			if replacement is undefined
				replacement = '{' + lookup + '}';

			tpl = tpl.replace(new RegExp(m, 'g'), replacement)

		return tpl