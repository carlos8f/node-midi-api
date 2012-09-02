var es = require('event-stream');

module.exports = function () {
  var stream = es.through(write)
    , channel = 0
    , q = []

  function write (data) {
    if (data[0] === 'rest') {
      q.push(function (cb) {
        setTimeout(cb, data[1]);
      });
    }
    else {
      q.push(function (cb) {
        stream.emit('data', data);
        cb();
      });
    }
  };

  function drain () {
    if (stream.paused) {
      return;
    }
    if (q.length) {
      q.shift().call(stream, function () {
        process.nextTick(drain);
      });
    }
    else {
      process.nextTick(drain);
    }
  }

  stream.on('drain', drain);

  stream.channel = function (ch) {
    channel = ch;
    return stream;
  };

  function encodeChannel (status) {
    return status << 4 | channel;
  }

  stream.send = function (status, data1, data2) {
    stream.write(fill([encodeChannel(status), data1, data2]));
    return stream;
  };

  function fill (message) {
    for (var i = 0; i < 3; i++) {
      if (typeof message[i] === 'undefined') {
        message[i] = 0;
      }
    }
    return message;
  }

  stream.control = function (data1, data2) {
    return stream.send(0xB, data1, data2);
  };

  stream.bank = function (number) {
    return stream.control(0, number);
  };

  stream.program = function (number) {
    return stream.control(0xC, number);
  };

  stream.noteOn = function (number, velocity) {
    return stream.send(0x9, number, velocity);
  };

  stream.noteOff = function (number, velocity) {
    return stream.send(0x8, number, velocity);
  };

  stream.rest = function (ms) {
    stream.write(['rest', ms]);
    return stream;
  };

  drain();

  return stream;
};