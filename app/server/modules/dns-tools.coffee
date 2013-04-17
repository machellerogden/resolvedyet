dns = require 'dns'
dnstools = {}

dnstools.connect = ->
    @connected = true

dnstools.disconnect = ->
    @connected = false

dnstools.processRecords = (records, err) ->
    if ( (!err) && (typeof records != 'undefined') )
        result = records
    else
        result = [ "No Records" ]
    result.sort()

dnstools.getRecords = (domain, type, cb) ->
    if type == 'NS'
        dns.resolveNs domain, (err, records) ->
            result = dnstools.processRecords records, err
            cb(result)
    else
        dns.resolve domain, type, (err, records) ->
            result = dnstools.processRecords records, err
            cb(result)

dnstools.monitorLoop = (domain, socket, cb) ->
    records = {}
    records.domain = domain
    types = [ 'NS', 'A', 'CNAME', 'MX' ]
    # resolve in parallel
    await
        for t in types
            dnstools.getRecords domain, t, defer records[t]
    socket.emit 'updatedrecords', records
    setTimeout cb, 150000

dnstools.startMonitor = (domain) ->
    socket = @
    if domain
        while socket.connected
            await dnstools.monitorLoop domain, socket, defer()

module.exports = dnstools
