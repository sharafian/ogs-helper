import { watchMutations, wait } from './utils/index'
import { features } from './features/index.js'

function isGameActive () {
  const gameState = document.querySelector('.game-state')
  return gameState && !gameState.innerText.includes('wins')
}

function isInGame () {
  return document.location.pathname.startsWith('/game/')
}

function getDimensions () {
  return `${window.innerWidth}:${window.innerHeight}`
}

function watchOptions (options, cb) {
  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return
    console.log('SYNC STORAGE CHANGED', changes)
    for (const key of Object.keys(changes)) {
      options[key] = changes[key].newValue
    }
    cb()
  })
}

async function loadOptions () {
  return browser.storage.sync.get(null)
}

async function init () {
  // Clean up elements left over from a previous version of the script
  features.map(f => f.cleanUp?.({}))

  let optionsChanged = false
  const options = await loadOptions()
  watchOptions(options, () => { optionsChanged = true })

  let currentUrl = window.location.href
  let dimensions = getDimensions()
  let observer

  while (true) {
    let gameActive = true
    features.map(f => f.cleanUp?.(options))

    // On game page, activate features' handler when play area is changed so features can be injected
    if (isInGame() && isGameActive()) {
      observer = watchMutations('.play-controls', () => {
        if (isGameActive()) {
          features.map(f => f.onPlayAreaMutation?.(options))
        } else {
          gameActive = false
        }
      })
    }

    // Wait for the options to change or the URL to change; currently this is a polling loop
    while (true) {
      if (optionsChanged) {
        optionsChanged = false
        break
      } else if (currentUrl !== (currentUrl = window.location.href)) {
        break
      // Re-establish play area features when window is resized; sometimes it was causing buttons to disappear
      } else if (dimensions !== (dimensions = getDimensions())) {
        break
      } else if (!gameActive) {
        break
      } else {
        await wait(1000)
      }
    }

    if (observer) {
      observer.disconnect()
    }
  }
}

init()
  .catch(e => {
    console.error(e)
  })
