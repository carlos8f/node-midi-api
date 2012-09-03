var coremidi = require('coremidi')
  , api = require('../')({end: true})
    .bank(2)
    .program(33)
    .rest(500)

function maj7 (root) {
  api
    .noteOn(root)
    .noteOn(root + 4)
    .noteOn(root + 7)
    .noteOn(root + 11)
    .rest(1000)
    .noteOff()
}

maj7(60)
maj7(61)
maj7(62)
maj7(63)

api.pipe(coremidi.stream())