module.exports = function() {

    var dnsMonitor = require('./dns-monitor');

    global.io.of('/resolvedyet').on('connection', function (socket) {
        socket.on('startmonitor', dnsMonitor.start);
        socket.on('connect', dnsMonitor.connect);
        socket.on('disconnect', dnsMonitor.disconnect);
    });

}();
