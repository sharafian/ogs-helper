const think_id = 'ogs-helper-thinking-button'
const timer_id = 'ogs-helper-timer'
const think_meme_id = 'ogs-helper-think-meme'
const think_meme_time = 2500

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
export function thinkMode ({ thinkTime, thinkMarkThink }) {
  let counter = thinkTime || 60

  if (document.getElementById(timer_id)) {
    return
  }

  const timerDiv = document.createElement('div')
  timerDiv.id = timer_id
  timerDiv.style.top = document.getElementById('NavBar').offsetHeight + 'px'
  timerDiv.innerText = counter
  document.body.appendChild(timerDiv)

  if (thinkMarkThink) {
    if (!document.getElementById(think_meme_id)) {
      const img = document.createElement('img')
      img.src = 'https://i.kym-cdn.com/photos/images/original/002/090/663/33c.png'
      img.id = think_meme_id
      document.body.appendChild(img)
      setTimeout(() => {
        img.remove()
      }, think_meme_time)
    }
  }

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

function removeThinkMeme () {
  const meme = document.getElementById(think_meme_id)
  if (meme) think.remove()
}

function disableThinkButton (options) {
  removeThinkButton()
  if (!options.analyzeToThink) {
    removeTimer()
    removeThinkMeme()
    setPointerEventsDisabled(false)
  }
}

export function onPlayAreaMutation (options) {
  if (options.thinkButton !== false) {
    addThinkButton(options)
  } else {
    disableThinkButton(options)
  }
}

export function cleanUp (options) {
  disableThinkButton(options)
}
