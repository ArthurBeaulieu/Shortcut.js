'use strict';


class Shortcut {


  constructor() {
    // If an instance of Shortcut already exists, we just return it
    if (!!Shortcut.instance) {
      return Shortcut.instance;
    }
    // Set object instance
    Shortcut.instance = this;
    /** @private
     * @member {object[]} - Single key saved shortcuts */
    this._singleKey = [];
    /** @private
     * @member {object[]} - Multi keys saved shortcuts */    
    this._multiKey = [];
    /** @public
     * @member {string} - Component version */
    this.version = '0.0.1';
    // Save singleton scope for testShortcuts method to be able to properly remove event on demand
    this._testShortcuts = this._testShortcuts.bind(this);
    // Retun singleton to the caller
    return this;
  }


  destroy() {
    // Remove all existing eventListener
    this._removeEvents();
    // Delete object attributes
    Object.keys(this).forEach(key => {
      delete this[key];
    });
    // Clear singleton instance
    Shortcut.instance = null;
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  --------------------------------------  SHORTCUT JS INTERN METHODS  ------------------------------------------  */
  /*                                                                                                                  */
  /*  The following methods are made to abstract the event listeners from the JavaScript layer, so you can easily     */
  /*  --------------------------------------------------------------------------------------------------------------- */


  _addEvents() {
    // Listen to keyboard's key down event
    document.addEventListener('keydown', this._testShortcuts);
  }


  _removeEvents() {
    // Revoke listener on keyboard's key down event    
    document.removeEventListener('keydown', this._testShortcuts);
  }


  _testShortcuts(event) {
    if (!(event.ctrlKey && event.shiftKey && event.key === 'R')) {
      event.preventDefault();
    }

    if (event.ctrlKey || event.altKey || event.shiftKey) { // Multi key shortcut
      this._multiKeyEvent(event);
    } else { // Single key shortcut
      this._singleKeyEvent(event);
    }
  }


  _singleKeyEvent(event) {
    // Iterate over registered single key shortcut to fire it if one matches
    for (let i = 0; i < this._singleKey.length; ++i) {
      // Check that event is active and flatten key string to compare
      if (!this._singleKey[i].pause && event.key.toLowerCase() === this._singleKey[i].key) {
        this._singleKey[i].fire(this);
      }
    }
  }


  _multiKeyEvent(event) {
    for (let i = 0; i < this._multiKey.length; ++i) {
      // Handy shortcut variable to work with
      const sh = this._multiKey[i];
      // Check that event is active and flatten key string to compare
      if (!sh.pause && event.key.toLowerCase() === sh.key) {
        switch (sh.modifierCount) {
          case 1: // 2 key strokes
            if ((sh.modifiers.ctrlKey && event.ctrlKey)
            || (sh.modifiers.altKey && event.altKey)
            || (sh.modifiers.shiftKey && event.shiftKey)) {
              sh.fire();
            }
            break;
          case 2: // 3 key strokes
            if ((sh.modifiers.ctrlKey && event.ctrlKey && sh.modifiers.altKey && event.altKey)
            || (sh.modifiers.ctrlKey && event.ctrlKey && sh.modifiers.shiftKey && event.shiftKey)
            || (sh.modifiers.altKey && event.altKey && sh.modifiers.shiftKey && event.shiftKey)) {
              sh.fire();
            }
            break;
          case 3: // 4 key strokes
            if ((sh.modifiers.ctrlKey && event.ctrlKey
            && sh.modifiers.altKey && event.altKey
            && sh.modifiers.shiftKey && event.shiftKey)) {
              sh.fire();
            }
            break;
        }
      }
    }
  }


  _getModifiersCount(keyString) {
    const modifiers = {
      ctrlKey: /ctrl/i.test(keyString),
      altKey: /alt/i.test(keyString),
      shiftKey: /shift/i.test(keyString)
    };
    // Count modifiers that are set to true and update count with it
    let count = 0;
    Object.values(modifiers).reduce((a, item) => count = a + item, 0);
    // Return count value
    return count;
  }


  _setAllPauseFlag(value) {
    // Iterate over both arays to update pause flag on each registered shortcut
    for (let i = 0; i < this._singleKey.length; ++i) {
      this._setPauseStatus(this._singleKey[i].keyString, value);
    }

    for (i = 0; i < this._multiKey.length; ++i) {
      this._setPauseStatus(this._multiKey[i].keyString, value);
    }
  }


  _setOnePauseFlag(keyString, value) {
    if (this._getModifiersCount(keyString) === 0) {
      for (let i = 0; i < this._singleKey.length; ++i) {
        if (this._singleKey[i].keyString === keyString) {
          this._singleKey[i].pause = value;
        }
      }
    } else {
      for (let i = 0; i < this._multiKey.length; ++i) {
        if (this._multiKey[i].keyString === keyString) {
          this._multiKey[i].pause = value;
        }
      }
    }
  }


  _shortcutAlreadyExist(keyString) {
    // Parse single or multi shortcuts depending on modifiers count to find maching one
    if (this._getModifiersCount(keyString) === 0) {    
      for (let i = 0; i < this._singleKey.length; ++i) {
        if (this._singleKey[i].keyString === keyString) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < this._multiKey.length; ++i) {
        if (this._multiKey[i].keyString === keyString) {
          return true;
        }
      }
    }
    // False by default to allow the shortcut creation
    return false;
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  --------------------------------------  SHORTCUT JS PUBLIC METHOD  -------------------------------------------  */
  /*                                                                                                                  */
  /*  The following methods are made to register shortcut, to remove them, or to pause/resume all shortcuts.          */
  /*  --------------------------------------------------------------------------------------------------------------- */


  register(keyString, fire) {
    if (!this._shortcutAlreadyExist(keyString)) {
      // First shortcut to be registered ; listen to keyboard key down event
      if (this._singleKey.length === 0 && this._multiKey.length === 0) {
        this._addEvents();
      }
      // New shortcut internals
      const shortcut = {
        keyString: keyString,
        modifiers: { // Regex insensitive to string case to search for modifiers
          ctrlKey: /ctrl/i.test(keyString),
          altKey: /alt/i.test(keyString),
          shiftKey: /shift/i.test(keyString)
        },
        modifierCount: this._getModifiersCount(keyString),
        key: keyString[keyString.length - 1].toLowerCase(),
        paused: false,
        fire: fire
      };
      // Save shortcut to its appropriated array
      if (this._getModifiersCount(keyString) === 0) {
        this._singleKey.push(shortcut);
      } else {    
        this._multiKey.push(shortcut);
      }
    }
  }


  remove(keyString) {
    // Reverse parsing to ensure proper slicing of shortcut arrays    
    if (this._getModifiersCount(keyString) === 0) {    
      for (let i = this._singleKey.length - 1; i >= 0; i--) {
        if (this._singleKey[i].key === keyString.toLowerCase()) {
          this._singleKey.splice(i, 1);
        }
      }
    } else {
      for (let i = this._multiKey.length - 1; i >= 0; i--) {
        if (this._multiKey[i].key === keyString.toLowerCase()) {
          this._multiKey.splice(i, 1);
        }
      }
    }
    // In case there are no remaining shortcut, we remove listener on keyboard's key down event
    if (this._singleKey.length === 0 && this._multiKey.length === 0) {
      this._removeEvents();
    }
  }


  removeAll() {
    // Clear all saved shortcut
    this._singleKey = [];
    this._multiKey = [];
    // Remove listener on keyboard's key down
    this._removeEvents();
  }


  resume(keyString) {
    this._setOnePauseFlag(keyString, false);
  }


  pause(keyString) {
    this._setOnePauseFlag(keyString, true);
  }


  resumeAll() {
    this._setAllPauseFlag(false);
  }


  pauseAll() {
    this._setAllPauseFlag(true);
  }


}


export default Shortcut;
