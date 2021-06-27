const optionNames = [ 'noAnalyze', 'thinkButton', 'thinkTime' ]

function valueField (element) {
	if (element.type === 'checkbox') return 'checked'
	else return 'value'
}

async function restoreOptions () {
	function setCurrentChoice (option, state) {
		document.getElementbyId(option).value = state
	}

	browser.storage.sync.get(null).then(options => {
		for (const key of optionNames) {
			if (options[key]) {
				const field = document.getElementById(key)
				field[valueField(field)] = options[key]
			}
		}
	})
}

for (const key of optionNames) {
	const field = document.getElementById(key)
	field.addEventListener('change', () => {
		browser.storage.sync.set({
			[key]: field[valueField(field)]
		})
	})
}

restoreOptions()
