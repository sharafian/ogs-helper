const optionNames = [ 'noAnalyze', 'thinkButton', 'thinkTime' ]

function valueField (element) {
	if (element.type === 'checkbox') return 'checked'
	else return 'value'
}

function saveOptions (e) {
	e.preventDefault()
	console.log('saving options')

	const save = document.getElementById('save')
	save.disabled = true

	const options = {}
	for (const key of optionNames) {
		const field = document.getElementById(key)
		console.log(key, valueField(field))
		options[key] = field[valueField(field)] 
	}

	browser.storage.sync.set(options).then(() => {
		console.log('completed options save;', options)
		save.disabled = false
	})
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

restoreOptions().then(() => {
	document.getElementById('options').addEventListener('submit', saveOptions)
	console.log('hello world')
})
