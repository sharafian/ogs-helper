const HIDE_RANK_STYLE_ID = 'ogs-helper-hide-rank-style'
const HIDE_RANK_STYLE_CONTENT = '.Player-rank { display: none; }'

function removeStyle () {
  const style = document.getElementById(HIDE_RANK_STYLE_ID)
  if (style) {
    style.remove()
  }
}

function addStyle () {
  if (document.getElementById(HIDE_RANK_STYLE_ID)) {
    return
  }

  const style = document.createElement('style')

  style.id = HIDE_RANK_STYLE_ID
  style.innerHTML = HIDE_RANK_STYLE_CONTENT

  document.head.appendChild(style)
}

export function onPlayAreaMutation (options) {
  if (options.hideRanks) {
    addStyle()
  } else {
    removeStyle()
  }
}

export function cleanUp (options) {
  removeStyle()
}
