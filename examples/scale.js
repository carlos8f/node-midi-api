var coremidi = require('coremidi')
  , api = require('../')({end: true})
    .bank(2)
    .program(4)
    .rest(1000)

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
        api
          .rest(400)
          .noteOff()
          .rest(500)

        return;
      }
      pitch -= interval
    }

    api
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

api.pipe(coremidi.stream())