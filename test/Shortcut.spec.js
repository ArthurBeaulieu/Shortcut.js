import Shortcut from '../src/Shortcut.js'
'use strict';


// Working component, must be delete after each test because of singleton
let AppShortcut = null;


describe('Shortcut unit test', () => {


  it('Component construction', done => {
    AppShortcut = new Shortcut();
    // Component existence
    expect(AppShortcut).not.toEqual(undefined);
    expect(AppShortcut).not.toEqual(null);
    expect(AppShortcut).toEqual(Shortcut.instance); // TODO report this on Logger and Custo
    // Component proper construction
    expect(AppShortcut._singleKey).toEqual([]);
    expect(AppShortcut._multiKey).toEqual([]);
    expect(AppShortcut.version).toEqual('0.0.1');
    AppShortcut.destroy();
    AppShortcut = null;
    done();
  });


});
