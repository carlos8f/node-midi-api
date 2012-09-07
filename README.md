midi-api
========

an API to simplify MIDI message generation

[![build status](https://secure.travis-ci.org/carlos8f/node-midi-api.png)](http://travis-ci.org/carlos8f/node-midi-api)

Examples
--------

### Playing chords

```javascript
var coremidi = require('coremidi')
  , midi = require('midi-api')()
    .bank(2)
    .program(33)
    .rest(500)

function maj7 (root) {
  midi
    .noteOff()
    .noteOn(root)
    .noteOn(root + 4)
    .noteOn(root + 7)
    .noteOn(root + 11)
}

maj7(44)
midi.rest(200)
maj7(45)
midi.rest(200)
maj7(46)
midi.rest(200)
maj7(47)
midi
  .rest(1000)
  .noteOff()
  .rest(400)

midi.pipe(coremidi())
```

### Playing scales

```javascript
var coremidi = require('coremidi')
  , midi = require('midi-api')()
    .bank(2)
    .program(4)
    .rest(500)

function scale (root) {
  var scale = [ 0, 2, 2, 1, 2, 2, 2, 1 ]
    , backwards = []

  ;(function next (pitch) {
    if (scale.length) {
      var interval = scale.shift()
      backwards.push(interval)
      pitch += interval
    }
    else {
      var interval = backwards.pop()
      if (!interval) {
        midi
          .rest(400)
          .noteOff()
          .rest(500)

        return;
      }
      pitch -= interval
    }

    midi
      .noteOff()
      .noteOn(pitch)
      .rest(200)

    next(pitch)

  })(root)
}

scale(60)
scale(61)
scale(62)
scale(63)
midi.rest(500)

midi.pipe(coremidi())
```

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT

- Copyright (C) 2012 Carlos Rodriguez (http://s8f.org/)
- Copyright (C) 2012 Terra Eclipse, Inc. (http://www.terraeclipse.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.