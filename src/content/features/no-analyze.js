function isGameActive () {
	const iter = document.evaluate("//button[contains(text(), 'Rematch')]", document.body, null, XPathResult.ANY_TYPE);
	const button = iter && iter.iterateNext()
	return !button
}

export function onPlayAreaMutation (options) {
	if (options.noAnalyze && isGameActive()) {
		const iter = document.evaluate("//button[contains(text(), 'Back to Game')]", document.body, null, XPathResult.ANY_TYPE);
		const button = iter && iter.iterateNext()
		if (button) button.click()
	}
}
