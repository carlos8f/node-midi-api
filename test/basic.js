var api = require('../')
  , es = require('event-stream')

describe('basic test', function () {
  var stream = api();

  it('plays', function (done) {
    var messages = [];
    stream.on('data', function (message) {
      messages.push(message);
      if (messages.length == 4) {
        assert.deepEqual(messages, [[ 176, 0, 0 ], [ 176, 12, 0 ], [ 144, 60, 127 ], [ 128, 60, 0 ]]);
        done();
      }
    });
    stream
      .bank(0)
      .program(0)
      .noteOn(60, 127)
      .noteOff(60)
  });
});