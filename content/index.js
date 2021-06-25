console.log('ogs-helper: hello world!')

function exitAnalyzeMode () {
	iter = document.evaluate("//*[contains(text(), 'Back to Game')]", document.body, null, XPathResult.ANY_TYPE);
	const button = iter && iter.iterateNext()
	if (button) button.click()
}

const think_id = 'ogs-helper-thinking-button'
const timer_id = 'ogs-helper-timer'

function setPointerEventsDisabled (state) {
	document.querySelector('div.Goban:nth-child(1)').style.pointerEvents = state ? 'none' : ''
}

function setThinkButtonDisabled (state) {
	const think = document.getElementById(think_id)
	if (think) {
		think.disabled = state
	}
}

function thinkMode ({ thinkTime }) {
	let counter = thinkTime || 60

	const timerDiv = document.createElement('div')
	timerDiv.id = timer_id
	timerDiv.style.top = document.getElementById('NavBar').offsetHeight + 'px'
	timerDiv.innerText = counter
	document.body.appendChild(timerDiv)

	setThinkButtonDisabled(true)
	setPointerEventsDisabled(true)

	const interval = setInterval(() => {
		try {
			const timer = document.getElementById(timer_id)

			if (timer) {
				timer.innerText = --counter
			}

			if (!timer || counter === 0) {
				clearInterval(interval)

				const timer = document.getElementById(timer_id)
				if (timer) timer.remove()

				setThinkButtonDisabled(false)
				setPointerEventsDisabled(false)
			}

		} catch (e) {
			console.error(e)
		}
	}, 1000)
}

function removeTimer () {
	const timer = document.getElementById(timer_id)
	if (timer) timer.remove()
}

function addThinkButton (thinkTime) {
	const thinkInserted = document.getElementById(think_id)
	if (thinkInserted) {
		return
	}

	const parentSpan = document.querySelector('.play-buttons > span:nth-child(2)')
	if (!parentSpan) {
		return
	}

	const button = document.createElement('button')
	button.className = 'sm primary bold'
	button.innerText = 'Think'
	button.id = think_id
	button.disabled = !!document.getElementById(timer_id)
	button.onclick = thinkMode.bind(null, thinkTime)
	parentSpan.insertBefore(button, parentSpan.firstChild)
}

function removeThinkButton () {
	const think = document.getElementById(think_id)
	if (think) think.remove()
}

function disableThinkButton () {
	removeThinkButton()
	removeTimer()
	setPointerEventsDisabled(false)
}

async function init () {
	const options = await browser.storage.sync.get(null)
	console.log('ogs-helper: loaded options', options)

	// TODO: do a background-based message pass instead
	setInterval(async () => {
		const newOptions = await browser.storage.sync.get(null)
		Object.assign(options, newOptions)
	}, 1000)

	const mainArea = document.querySelector('.MainGobanView')
	const observer = new MutationObserver(() => {
		try {
			if (options.noAnalyze) exitAnalyzeMode()

			if (options.thinkButton) addThinkButton(options)
			else disableThinkButton()
		} catch (e) {
			console.error(e)
		}
	})

	observer.observe(mainArea, {
		childList: true,
		subtree: true,
		attributes: true
	})
}

function cleanUp () {
	disableThinkButton()
}

cleanUp()
init()
