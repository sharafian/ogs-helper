# OGS Helper

This is a browser extension that implements some additional features/settings that I want to use on [OGS](https://online-go.com).

You can click the extension's icon to enable these features individually. The list of features is as follows:

## Disable Analyze Mode

Prevents the bad habit of using analyze mode during games instead of reading in your head. When it detects that you've entered analyze mode,
the extension will immediately exit back to the game.

(Right now this is a little janky, allowing the analyze mode UI to flash for an instant)

## Think Button

Adds a "Think" button to the in-game controls, next to the "Pass" button (I'm working on a way to prevent any accidental passing).

When the "Think" button is pressed, the board is locked for a minute (this timeout is configurable). The idea here is to set yourself a time out to
prevent hasty moves. A timeout in the upper left will show remaining seconds.

If the timeout needs to be stopped, you can simply reload the page or open the extension popup and disable the "Think" button.

# TODOs

- [ ] Use a non-interval based way of adding button/toggling analyze mode
- [ ] Subscribe to settings updates instead of polling
- [ ] Publish to webstores (FF and chrome should be enough)
- [ ] Make the timer prettier
- [ ] Make the options page prettier