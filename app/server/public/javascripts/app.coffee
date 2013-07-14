# open socket connection
socket = io.connect '/resolvedyet'

class DomainsViewModel
    constructor: ->

        # property - domain query
        @domainQuery = $.observable ''

        # property - result to add
        @resultToAdd = $.observableArray []

        # property - results
        @allResults = $.observableArray []

        # method - emit startMonitor with domain query
        @startMonitor = ->
            socket.emit 'startmonitor', @domainQuery()

        # method - loops through listings, checks and sets changed status and creates output text
        # yes, it's a bit messy and very poorly structured -- will be refactored soon
        @addResult = ->

            # reference to results
            results = @allResults()

            console.log 'results #{results}'

            # reference to result to add
            result = @resultToAdd()

            # the current time
            now = $.moment().format 'h:mma'

            # attempt to get key of domain and...
            key = $.indexOf @allDomains(), result.domain

            # ...check key to make sure domain isn't already being monitored
            if key != -1

                # set current result
                current = results[key]

                # process listings
                for k,v in current
                    if k == 'domain'
                        return
                    if k == 'mx'
                        if $.isString v[0] then current[k] = v[0] else current[k] = $.map( v, (i) -> JSON.stringify i ).join ', '
                        if $.isString result[k][0] then result[k] = result[k][0] else rm = $.map( result.mx, (i) -> JSON.stringify i ).join ', '
                    else
                        current[k] = v.join ', '
                        result[k] = v.join ', '

                # check for change in nameservers
                if ( ( current.ns == result.ns ) && ( !current.nschanged ) )
                    # set result text
                    result.nameserverText = current.ns
                    # set changed false
                    result.nschanged = false
                    # set css class
                    result.nscls = current.nscls
                else
                    # set result text
                    result.nameserverText = result.ns
                    # set changed true
                    result.nschanged = true
                    # set css class
                    result.nscls = 'listing changed'

                # check for change in a records
                if ( ( current.a == result.a ) && ( !current.achanged ) )
                    # set result text
                    result.arecordsText = current.a
                    # set changed false
                    result.achanged = false
                    # set css class
                    result.acls = current.acls
                else
                    # set result text
                    result.arecordsText = result.a
                    # set changed true
                    result.achanged = true
                    # set css class
                    result.acls = 'listing changed'

                # check for change in cname records
                if ( ( current.cname == result.cname ) && ( !current.cchanged ) )
                    # set result text
                    result.crecordsText = current.cname
                    # set changed false
                    result.cchanged = false
                    # set css class
                    result.ccls = current.ccls
                else
                    # set result text
                    result.crecordsText = result.cname
                    # set changed true
                    result.cchanged = true
                    # set css class
                    result.ccls = 'listing changed'

                # check for change in mx records
                if ( ( current.mx == result.mx ) && ( !current.mxchanged ) )
                    # set result text
                    result.mxrecordsText = current.mx
                    # set changed false
                    result.mxchanged = false
                    # set css class
                    result.mxcls = current.mxcls
                else
                    # set result text
                    result.mxrecordsText = result.mx
                    # set changed true
                    result.mxchanged = true
                    # set css class
                    result.mxcls = 'listing changed'

                # did anything change?
                if result.nschanged || results.achanged || result.cchanged || result.mxchanged
                    # update timestamp
                    result.ts = current.ts
                    # set status to changed
                    result.meta = 'CHANGED - This record changed at ' + result.ts
                else
                    # update timestamp
                    result.ts = now
                    # set status to unchanged
                    result.meta = 'UNCHANGED - Last checked at ' + result.ts

                # update results
                results[key] = result
                @allResults results

            else
                # set result texts
                result.nameserverText = result.ns.join ', '
                result.arecordsText = result.a.join ', '
                result.crecordsText = result.cname.join ', '
                if $.isString result.mx[0] then result.mxrecordsText = result.mx[0] else result.mxrecordsText = $.map(result.mx, (i) -> JSON.stringify i ).join ', '

                # update timestamp
                result.ts = now

                # set status to monitoring
                result.meta = 'NOW MONITORING - Last checked at ' + result.ts

                # set changed false on all record types
                result.nschanged = false
                result.achanged = false
                result.cchanged = false
                result.mxchanged = false

                # set css classes on each record type
                result.nscls = 'listing unchanged'
                result.acls = 'listing unchanged'
                result.ccls = 'listing unchanged'
                result.mxcls = 'listing unchanged'

                # add to results
                @allResults.unshift result

            # reset domain query
            @domainQuery ""

        # property - domains
        @allDomains = ->
            # pluck domains from results
            $.pluck @allResults(), 'domain'

# on document ready...
$.domReady( ->

    # create knockout store from model
    domains = new DomainsViewModel()

    # apply knockout data bindings
    $.applyBindings domains

    # focus on input
    $('#domain').get(0).focus()

    # connect
    socket.emit 'connect'

    # setup notify event
    socket.on 'notify', (title, msg) -> alert msg

    # updated results received
    socket.on 'updatedrecords', (result) ->
        domains.resultToAdd result
        domains.addResult()
        $('#domain').get(0).focus()

)
