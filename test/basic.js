var api = require('../')
  , es = require('event-stream')

describe('basic test', function () {
  var stream = api();

  it('plays', function (done) {
    var messages = [], restStart;

    stream.on('data', function (message) {
      messages.push(message);
      if (messages.length === 3) {
        assert.deepEqual(messages, [[ 176, 0, 0 ], [ 176, 12, 0 ], [ 144, 60, 127 ]]);
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
        done();
      }
    });
    stream
      .bank(0)
      .program(0)
      .noteOn(60, 127)
      .rest(200)
      .noteOff(60)
      .noteOn(72, 127)
      .rest(200)
      .noteOff(72)
  });
});