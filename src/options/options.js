const optionNames = Array.from(document.querySelectorAll('#options input')).map(elem => elem.id)
console.log('loaded options', optionNames)

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

async function watchForSecretOptions () {
	let lastClick = 0
	let consecutiveClicks = 0
	let secretShown = false

	document.body.addEventListener('click', () => {
		if (secretShown) return

		if (lastClick - (lastClick = Date.now()) < 500) {
			consecutiveClicks++
		} else {
			consecutiveClicks = 0
		}

		if (consecutiveClicks >= 5) {
			Array.from(document.querySelectorAll('.secret')).forEach(el => {
				el.style.display = 'block'
			})
			secretShown = true
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

watchForSecretOptions()
restoreOptions()
