dns = require 'dns'

class DnsTools
    constructor: ->
        @connect = ->
            @connected = true
        @disconnect = ->
            @connected = false
        @startMonitor = (domain) ->
            socket = @
            processRecords = (records, err) ->
                if ( (!err) && (typeof records != 'undefined') )
                    records.sort()
                else
                    records = [ "No Records" ]
            getRecords = (type, cb) ->
                if type == 'NS'
                    dns.resolveNs domain, (err, records) ->
                        cb processRecords(records, err)
                else
                    dns.resolve domain, type, (err, records) ->
                        cb processRecords(records, err)
            monitorLoop = (cb) ->
                records = {}
                records.domain = domain
                types = [ 'NS', 'A', 'CNAME', 'MX' ]
                await
                    for t in types
                        getRecords t, defer records[t]
                socket.emit 'updatedrecords', records
                setTimeout cb, 150000
            if domain
                while socket.connected
                    await monitorLoop defer()

module.exports = new DnsTools()
