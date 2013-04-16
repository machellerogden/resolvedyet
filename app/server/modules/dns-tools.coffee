dns = require 'dns'
dnstools = {}

dnstools.connect = ->
    @connected = true

dnstools.disconnect = ->
    @connected = false

dnstools.getRecords = (domain, type, cb) ->
    norecords = [ "No Records" ]
    if type == 'NS'
        dns.resolveNs domain, (err, records) ->
            if ( (!err) && (typeof records != 'undefined') )
                result = records
            else
                result = norecords
            result.sort()
            cb(result)
    else
        dns.resolve domain, type, (err, records) ->
            if ( (!err) && (typeof records != 'undefined') )
                result = records
            else
                result = norecords
            result.sort()
            cb(result)

dnstools.monitorLoop = (domain, socket, cb) ->
    records = {}
    records.domain = domain
    types = [ 'NS', 'A', 'CNAME', 'MX' ]
    await
        for t,i in types
            dnstools.getRecords domain, t, defer records[t]
    socket.emit 'updatedrecords', records
    setTimeout cb, 150000

dnstools.startMonitor = (domain) ->
    socket = @
    if domain
        while socket.connected
            await dnstools.monitorLoop domain, socket, defer()

module.exports = dnstools
