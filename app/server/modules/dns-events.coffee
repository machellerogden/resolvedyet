# DNS Socket Events
module.exports = (io) ->
    dnstools = require './dns-tools'
    io.of('/resolvedyet').on 'connection', (socket) ->
        socket.on 'startmonitor', dnstools.startMonitor
        socket.on 'connect', dnstools.connect
        socket.on 'disconnect', dnstools.disconnect
