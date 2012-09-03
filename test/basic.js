var midi = require('../')()

describe('basic test', function () {
  it('plays', function (done) {
    var messages = [], restStart;

    midi.on('data', function (message) {
      messages.push(message);
      if (messages.length === 3) {
        assert.deepEqual(messages, [[ 176, 0, 0 ], [ 192, 50, 0 ], [ 144, 60, 127 ]]);
        restStart = new Date();
      }
      else if (messages.length === 4) {
        assert.deepEqual(message, [ 128, 60, 0 ]);
        assert((new Date().getTime() - restStart.getTime()) >= 200);
      }
      else if (messages.length === 5) {
        assert.deepEqual(message, [ 144, 72, 127]);
        restStart = new Date();
      }
      else if (messages.length === 6) {
        assert.deepEqual(message, [ 128, 72, 0 ]);
        assert((new Date().getTime() - restStart.getTime()) >= 200);
      }
    });
    midi
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
});