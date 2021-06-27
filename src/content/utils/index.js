export function watchMutations (selector, cb) {

	const elem = document.querySelector(selector)
	if (!elem) {
		return
	}

	const observer = new MutationObserver(cb)

	observer.observe(elem, {
		childList: true,
		subtree: true,
		attributes: true
	})

	cb()
	return observer
}

export async function wait (ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export function containsUpdate (old, updated) {
	for (const key of Object.keys(updated)) {
		if (updated[key] !== old[key]) {
			return true
		}
	}
}
