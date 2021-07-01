import { watchMutations, wait, containsUpdate } from './utils/index'
import { features } from './features/index.js'

function isInGame () {
  return document.location.pathname.startsWith('/game/')
}

function getDimensions () {
  return `${window.innerWidth}:${window.innerHeight}`
}

async function loadOptions () {
  return browser.storage.sync.get(null)
}

async function init () {
  // Clean up elements left over from a previous version of the script
  features.map(f => f.cleanUp?.({}))

  const options = await loadOptions()
  let currentUrl = window.location.href
  let dimensions = getDimensions()
  let observer

  while (true) {
    // On game page, activate features' handler when play area is changed so features can be injected
    if (isInGame()) {
      features.map(f => f.cleanUp?.(options))
      observer = watchMutations('.play-controls', () => {
        features.map(f => f.onPlayAreaMutation?.(options))
      })
    }

    // Wait for the options to change or the URL to change; currently this is a polling loop
    while (true) {
      const newOptions = await loadOptions()

      if (containsUpdate(options, newOptions)) {
        Object.assign(options, newOptions)
        break
      } else if (currentUrl !== (currentUrl = window.location.href)) {
        break
      // Re-establish play area features when window is resized; sometimes it was causing buttons to disappear
      } else if (dimensions !== (dimensions = getDimensions())) {
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
