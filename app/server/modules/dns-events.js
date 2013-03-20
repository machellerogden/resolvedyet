
/*
 * DNS Socket Events
 */

module.exports = function(app){

    var dnstools = require('./dns-tools');

    app.io.of('/resolvedyet').on('connection', function (socket) {
        socket.on('startmonitor', dnstools.startMonitor);
        socket.on('connect', dnstools.connect);
        socket.on('disconnect', dnstools.disconnect);
    });

};
