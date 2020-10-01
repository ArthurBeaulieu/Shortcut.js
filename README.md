# Shortcut.js

![](https://badgen.net/badge/version/1.0.0/blue)
[![License](https://img.shields.io/github/license/ArthurBeaulieu/Shortcut.js.svg)](https://github.com/ArthurBeaulieu/Shortcut.js/blob/master/LICENSE.md)
![](https://badgen.net/badge/documentation/written/green)
![](https://badgen.net/badge/test/passed/green)
![](https://badgen.net/badge/dependencies/none/green)

`Shortcut.js` is a JavaScript ES6 component that offers a global keyboard event handler. This way one can declare and react to any combination of keys. It also offers several useful methods to manipulates those registered keyboard events.

With ~5Ko minified, `Shortcut.js` is designed to be stable and remain as light as possible. It is meant to be used application wide so all your components can react to keyboard events.

# Get Started

This repository was made to store documentation, test bench and source code. If you want to include this component in your project, you either need the src/Shortcut.js file if you have an assets bundler in your project, or use the dist/Shortcut.min.js to use the minified component. This minified file is compiled in ES5 JavaScript for compatibility reasons. The unminified file is, in the contrary, coded in ES6 JavaScript.

Here's an example on how to create a custom event handler :

```javascript
/* Import the Js component */
import Shortcut from 'src/Shortcut.js';
/* Create a basic shortcut handler */
const myShortcutHandler = new Shortcut();
/* ...Or, you can provide several options to customize the handler */
const myShortcutHandler = new Shortcut({
  keyEvent: 'keydown', // 'keydown' or 'keyup' or 'keypressed'
  autoRepeat: true // If key is kept pushed, do event have to repeat ?
});
```

If you want to update the shortcut handler options, you can use `updateKeyEvent(string)` or `updateAutoRepeat(boolean)`. Refer to the [documentation](https://arthurbeaulieu.github.io/Shortcut.js/doc/) for allowed values.

The handler is now ready to register and react to keyboard events.

## Manipulate a keyboard event

To register a keyboard event, you must call the `register` method and give it a string for the key to listen (case insensitive), and a callback to fire each time it is pressed.

```javascript
myShortcutHandler.register('F', () => {
  alert('Pay respect');
});
```

When declaring a multi key event, all modifiers must be placed before the actual key, meaning the actual key is the last character of the string (also case insensitive). The `+` char in the following example is used for clarity but is not mandatory. One can use the following modifiers : `ctrl`, `alt`, `shift`. There is no modifiers order to respect.

```javascript
myShortcutHandler.register('Ctrl+Alt+Shift+F', () => {
  alert('Pay triple respect');
});
```

You can also control those events to pause or resume them on demand.

```javascript
// Pause a keyboard event using its definition string
myShortcutHandler.pause('F');
myShortcutHandler.pause('Ctrl+Alt+Shift+F');
// Resume it using its definition string
myShortcutHandler.resume('F');
myShortcutHandler.resume('Ctrl+Alt+Shift+F');
// ...Or use the global pause/resume method
myShortcutHandler.pauseAll();
myShortcutHandler.resumeAll();
```

To remove the listener of this keyboard event, simply use the following methods.

```javascript
// Remove a keyboard event using its definition string
myShortcutHandler.remove('Ctrl+Alt+Shift+F');
// ...Or, remove all subscribed keyboard events
myShortcutHandler.removeAll();
```

You're now good to go! If however you need more information, you can read the online [documentation](https://arthurbeaulieu.github.io/Shortcut.js/doc/).

# Development

If you clone this repository, you can `npm install` to install development dependencies. This will allow you to build dist file, run the component tests or generate the documentation ;

- `npm run build` to generate the minified file ;
- `npm run dev` to watch for any change in source code ;
- `npm run web-server` to launch a local development server ;
- `npm run doc` to generate documentation ;
- `npm run test` to perform all tests at once ;
- `npm run testdev` to keep browsers open to debug tests ;
- `npm run beforecommit` to perform tests, generate doc and bundle the JavaScript.

To avoid CORS when locally loading the example HTML file, run the web server. Please do not use it on a production environment. Unit tests are performed on both Firefox and Chrome ; ensure you have both installed before running tests, otherwise they might fail.

If you have any question or idea, feel free to DM or open an issue (or even a PR, who knows) ! I'll be glad to answer your request.
