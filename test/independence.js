var midiapi = require('../')

describe('independence', function () {
  var a, b;
  beforeEach(function () {
    a = midiapi()
      .channel(0)
    b = midiapi()
      .channel(1)
  });

  it("no data collision", function (done) {
    b.once('data', function (message) {
      throw new Error('instance not separate');
    });
    a
      .bank(0)
      .program(50)
      .noteOn(60)
      .rest(200)
      .noteOff()
      .noteOn(72)
      .rest(200)
      .noteOff()
      .once('end', done)
  });

  it("rests separately", function (done) {
    var start = new Date()
      , ended = 0
      , margin = 10

    function end () {
      ended++;
      if (ended === 2) done();
    }

    function assertDelta (delta, target) {
      if (delta < target - margin) assert.fail(delta, target - margin);
      if (delta > target + margin) assert.fail(delta, target + margin);
    }

    a.on('data', function (message) {
      assert.equal(message[1], 50);
      var delta = (new Date().getTime()) - start.getTime();
      assertDelta(delta, 1000);
    });
    a.once('end', end);

    b.on('data', function (message) {
      assert.equal(message[1], 60);
      var delta = (new Date().getTime()) - start.getTime();
      assertDelta(delta, 500);
    });
    b.once('end', end);

    a.rest(1000).noteOn(50);
    b.rest(500).noteOn(60);
  });
});