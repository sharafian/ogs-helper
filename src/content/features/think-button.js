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

// Export because analyzeToThink feature uses this in no-analyze
export function thinkMode ({ thinkTime }) {
	let counter = thinkTime || 60

	if (document.getElementById(timer_id)) {
		return
	}

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

function addThinkButton (options) {
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
	button.onclick = thinkMode.bind(null, options)
	parentSpan.insertBefore(button, parentSpan.firstChild)
}

function removeThinkButton () {
	const think = document.getElementById(think_id)
	if (think) think.remove()
}

function disableThinkButton (options) {
	removeThinkButton()
	if (!options.analyzeToThink) {
		removeTimer()
		setPointerEventsDisabled(false)
	}
}

export function onPlayAreaMutation (options) {
	if (options.thinkButton) {
		addThinkButton(options)
	} else {
		disableThinkButton(options)
	}
}

export function cleanUp () {
	disableThinkButton({})
}
