/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

module.exports = function(io){
  io.on('connection', function (socket) {
    socket.emit('news', { hw: 'hello world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
};