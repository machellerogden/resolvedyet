# DNS Tools

_ = require 'underscore'
async = require 'async'
request = require 'request'
dns = require 'dns'
moment = require 'moment'
dnstools = {}

dnstools.connect = ->
    @connected = true
    return

dnstools.disconnect = ->
    @connected = false
    return

dnstools.startMonitor = (domain) ->
    socket = @
    if domain
        async.whilst(
            -> socket.connected,
            (callback) ->
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
                setTimeout callback, 150000
            ,
            (err) -> console.log('whilst stopped')
        )

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

module.exports = dnstools;
