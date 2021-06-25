console.log('hello world!')

function exitAnalyzeMode () {
	iter = document.evaluate("//*[contains(text(), 'Back to Game')]", document.body, null, XPathResult.ANY_TYPE);
	const button = iter && iter.iterateNext()
	if (button) button.click()
}

const think_id = 'ogs-helper-thinking-button'
const timer_id = 'ogs-helper-timer'

function disablePointerEvents () {
	document.querySelector('div.Goban:nth-child(1)').style.pointerEvents = 'none'
}

function enablePointerEvents () {
	document.querySelector('div.Goban:nth-child(1)').style.pointerEvents = ''
}

function setThinkButtonDisabled (state) {
	const think = document.getElementById(think_id)
	if (think) {
		think.disabled = state
	}
}

function thinkingMode () {
	let counter = 60

	const timerDiv = document.createElement('div')
	timerDiv.style.position = 'fixed'
	timerDiv.style.top = 0
	timerDiv.style.left = 0
	timerDiv.id = timer_id
	timerDiv.innerText = counter
	document.body.appendChild(timerDiv)

	setThinkButtonDisabled(true)

	const interval = setInterval(() => {
		timerDiv.innerText = --counter
		if (counter === 0) {
			try {
				clearInterval(interval)

				const timer = document.getElementById(timer_id)
				if (timer) timer.remove()

				setThinkButtonDisabled(false)
			} catch (e) {
				console.error(e)
			}
		}
	}, 10)
}

function addThinkingButton () {
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
	button.onclick = thinkingMode
	parentSpan.appendChild(button)
}

// TODO: do this on a mutation event instead
setInterval(() => {
	try {
		exitAnalyzeMode()
		addThinkingButton()
	} catch (e) {
		console.error(e)
	}
}, 100)
