var coremidi = require('coremidi')
  , midi = require('../')()
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