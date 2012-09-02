var es = require('event-stream');

module.exports = function () {
  var stream = es.through()
    , channel = 0

  stream.channel = function (ch) {
    channel = ch;
    return stream;
  };

  function encodeChannel (status) {
    return status << 4 | channel;
  }

  stream.channel = function (ch) {
    channel = ch;
    return stream;
  };

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
    stream.send(0xB, data1, data2);
    return stream;
  };

  stream.bank = function (number) {
    stream.control(0, number);
    return stream;
  };

  stream.program = function (number) {
    stream.control(0xC, number);
    return stream;
  };

  stream.noteOn = function (number, velocity) {
    stream.send(0x9, number, velocity);
    return stream;
  };

  stream.noteOff = function (number, velocity) {
    stream.send(0x8, number, velocity);
    return stream;
  };

  return stream;
};