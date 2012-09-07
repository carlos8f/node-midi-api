var through = require('through');

module.exports = function (options) {
  var stream = through(write)
    , channel = 0
    , q = []
    , notesOn = {}

  options || (options = {});
  if (typeof options.end === 'undefined') options.end = true;

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
    if (!stream.paused && q.length) {
      q.shift().call(stream, function (err) {
        if (err) {
          stream.emit('error', err);
          return stream.end();
        }
        if (!q.length && options.end) return stream.end();
        drain();
      });
    }
    else {
      process.nextTick(drain);
    }
  }

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
    return stream.send(0xC, number);
  };

  stream.noteOn = function (number, velocity) {
    notesOn[channel] || (notesOn[channel] = {});
    notesOn[channel][number] = true;
    return stream.send(0x9, number, velocity || 127);
  };

  stream.noteOff = function (number, velocity) {
    if (typeof number === 'undefined') {
      if (!notesOn[channel]) return stream;
      Object.keys(notesOn[channel]).forEach(noteOff);
      return stream;
    }
    return noteOff(number, velocity);
  };

  function noteOff (number, velocity) {
    if (!notesOn[channel] || !notesOn[channel][number]) return stream;
    delete notesOn[channel][number];
    return stream.send(0x8, parseInt(number, 10), velocity);
  }

  stream.rest = function (ms) {
    stream.write(['rest', ms]);
    return stream;
  };

  drain();

  return stream;
};