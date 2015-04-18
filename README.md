Phaser template project
=======================

Setup
-----

Running the following:

```
npm install
bower install
gulp serve
```

... should give you a dev server.

Note that access to `Phaser` and `PIXI` are no longer provided
by calls to `require()`. Instead, pluck these objects from the global browser
scope like:

```
const Phaser = global.Phaser;
const PIXI = global.PIXI;
```

or, using object destructuring (which, in my opinion, is slightly neater):

```
const { Phaser, PIXI } = global;
```

All other modules, either those installed via `npm` or from our own
`src/js` directory, should be accessed via `require()`.

TODOS
-----

With time difference we may need to work for a while with no input from others
Add features that need to be done, and mark your name if you are working on it.

* Enemy classes
* Bullet Manager __(Kenny)__
* Bullet collision
* Player movement/control
* Level loading/scrolling __(Owen)__
* Something to define levels - bg layers and enemy distribution (_Tiled?_)
* Slot machine functionality for mixing and matching weapon bits, arrays of
  available weapon classes, available graphics, and third array could contain
  dicts of the other options that all Weapons share. Extra fast or high rate
  of fire, or large bullets, or bullets that grow over time.
* Art - lots of ridiculous weapon sprites
* If there is time - a couple weapons that shift gravity over time to create
  sine wave patterns or bullets that circle while moving in a direction.
