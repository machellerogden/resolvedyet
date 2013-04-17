module.exports = (io) ->

    dnsMonitor = require './dns-monitor'

    io.of('/resolvedyet').on 'connection', (socket) ->
        socket.on 'startmonitor', dnsMonitor.start
        socket.on 'connect', dnsMonitor.connect
        socket.on 'disconnect', dnsMonitor.disconnect
