dns = require 'dns'

class DnsMonitor

    constructor: ->

        # socket event - connect
        @connect = ->
            # set socket.connected to true on connect
            @connected = true

        # socket event - disconnect
        @disconnect = ->
            # set socket.connected to false on disconnect
            @connected = false

        # socket event - start
        @start = (domain) ->

            # socket reference
            socket = @

            # method - process records
            processRecords = (records, err) ->
                # if no error and defined...
                if ( (!err) && (typeof records != 'undefined') )
                    # ...sort the records
                    records.sort()
                # otherwise...
                else
                    # ...set to `[ "No Records" ]`
                    records = [ "No Records" ]

            # method - get records
            getRecords = (type, cb) ->
                # ensure type is uppercase
                type = type.toUpperCase()
                # if this is a nameserver query...
                if type == 'NS'
                    # ...use dns.resolveNS
                    dns.resolveNs domain, (err, records) ->
                        cb processRecords(records, err)
                # otherwise...
                else
                    #  ...use dns.resolve and pass in a type
                    dns.resolve domain, type, (err, records) ->
                        cb processRecords(records, err)

            # method - monitor loop
            monitorLoop = (cb) ->
                # initiaize response
                records = {}
                # set domain
                records.domain = domain
                # set record types
                types = [ 'ns', 'a', 'cname', 'mx' ]
                # await all deferreds in this block
                await
                    # loop through types in parallel
                    for t in types
                        # get records for each type with deferred as callback
                        getRecords t, defer records[t]
                # when done, socket.emit records to client
                socket.emit 'updatedrecords', records
                # do this again in 2.5 minutes
                setTimeout cb, 150000

            # execute - if domain isn't falsy...
            if domain
                # ...and only while the client is connected...
                while socket.connected
                    # ...start the monitor loop
                    await monitorLoop defer()

# export new instance of DnsMonitor
module.exports = new DnsMonitor()
