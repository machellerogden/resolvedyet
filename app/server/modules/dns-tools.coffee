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
    await dnstools.getRecords domain, 'NS', defer nameservers
    await dnstools.getRecords domain, 'A', defer arecords
    await dnstools.getRecords domain, 'CNAME', defer crecords
    await dnstools.getRecords domain, 'MX', defer mxrecords
    records.nameservers = nameservers
    records.arecords = arecords
    records.crecords = crecords
    records.mxrecords = mxrecords
    socket.emit 'updatedrecords', records
    setTimeout cb, 15000

dnstools.startMonitor = (domain) ->
    socket = @
    if domain
        while socket.connected
            await dnstools.monitorLoop domain, socket, defer()

module.exports = dnstools
