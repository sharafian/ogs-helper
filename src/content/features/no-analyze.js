import { thinkMode } from './think-button'

export function onPlayAreaMutation (options) {
  if (options.noAnalyze || options.analyzeToThink) {
    const iter = document.evaluate("//button[contains(text(), 'Back to Game')]", document.body, null, XPathResult.ANY_TYPE);
    const button = iter && iter.iterateNext()
    if (button) {
      button.click()
      if (options.analyzeToThink) {
        thinkMode(options)
      }
    }
  }
}
