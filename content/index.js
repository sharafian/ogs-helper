function debug ({ debug }, ...message) {
	if (debug) {
		console.log('ogs-helper:', ...message)
	}
}

function isGameActive () {
	iter = document.evaluate("//button[contains(text(), 'Rematch')]", document.body, null, XPathResult.ANY_TYPE);
	const button = iter && iter.iterateNext()
	return !button
}

function exitAnalyzeMode () {
	if (isGameActive()) {
		iter = document.evaluate("//button[contains(text(), 'Back to Game')]", document.body, null, XPathResult.ANY_TYPE);
		const button = iter && iter.iterateNext()
		if (button) button.click()
	}
}

const think_id = 'ogs-helper-thinking-button'
const timer_id = 'ogs-helper-timer'

function setPointerEventsDisabled (state) {
	const goban = document.querySelector('div.Goban:nth-child(1)')
	if (goban) {
		goban.style.pointerEvents = state ? 'none' : ''
	}
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

let observer

function setUpPlayArea (options) {
	debug(options, 'detected mutation; refreshing')
	try {
		if (options.noAnalyze) exitAnalyzeMode()

		if (options.thinkButton) addThinkButton(options)
		else disableThinkButton()
	} catch (e) {
		console.error(e)
	}
}

function isInGame () {
	return document.location.pathname.startsWith('/game/')
}

function watchMutations (options, cb) {
	stopWatchingMutations()

	const playArea = document.querySelector('.play-controls')
	if (!playArea) {
		debug(options, 'not in play, no watch for mutations')
		return
	}

	observer = new MutationObserver(cb)

	observer.observe(playArea, {
		childList: true,
		subtree: true,
		attributes: true
	})

	cb()
}

function stopWatchingMutations () {
	if (observer) {
		observer.disconnect()
	}
}

function containsUpdate (old, updated) {
	for (const key of Object.keys(updated)) {
		if (updated[key] !== old[key]) {
			return true
		}
	}
}

async function init () {
	const options = await browser.storage.sync.get(null)
	let currentUrl = window.location.href

	// TODO: do a background-based message pass instead
	setInterval(async () => {
		const newOptions = await browser.storage.sync.get(null)
		if (containsUpdate(options, newOptions)) {
			Object.assign(options, newOptions)
			setUpPlayArea(options)
		}

		if (currentUrl !== (currentUrl = window.location.href)) {
			if (isInGame()) {
				debug(options, 'Entered game; watching for mutations on play area')
				watchMutations(options, setUpPlayArea.bind(null, options))
			} else {
				debug(options, 'Not in game; disabling mutation watcher')
				stopWatchingMutations()
			}
		}
	}, 1000)

	if (isInGame()) {
		watchMutations(options, setUpPlayArea.bind(null, options))
	}

	debug(options, 'initialized; ready to go!')
}

function cleanUp () {
	disableThinkButton()
	stopWatchingMutations()
}

cleanUp()
init()
