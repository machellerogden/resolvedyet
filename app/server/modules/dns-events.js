
/*
 * DNS Socket Events
 */

module.exports = function(io){

    var dnstools = require('./dns-tools');

    io.of('/resolvedyet').on('connection', function (socket) {
        socket.on('startmonitor', dnstools.startMonitor);
        socket.on('connect', dnstools.connect);
        socket.on('disconnect', dnstools.disconnect);
    });

};
