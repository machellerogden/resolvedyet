# open socket connection
socket = io.connect '/resolvedyet'

class DomainsViewModel
    constructor: ->
        @domainQuery = $.observable ''
        @resultToAdd = $.observableArray []
        @allResults = $.observableArray []
        @startMonitor = ->
            socket.emit 'startmonitor', @domainQuery()
        @addResult = ->
            results = @allResults()
            result = @resultToAdd()
            key = $.indexOf @allDomains(), result.domain
            now = $.moment().format 'h:mma'
            # make sure domain isn't already being monitored
            if key != -1
                current = results[key]
                cn = current.NS.join ', '
                rn = result.NS.join ', '
                ca = current.A.join ', '
                ra = result.A.join ', '
                cc = current.CNAME.join ', '
                rc = result.CNAME.join ', '
                if $.isString current.MX[0]
                    cm = current.MX[0]
                else
                    cm = $.map( current.MX, (i) -> JSON.stringify i ).join ', '
                if $.isString result.MX[0]
                    rm = result.MX[0]
                else
                    rm = $.map( result.MX, (i) -> JSON.stringify i ).join ', '
                if ( ( cn == rn ) && ( !current.nschanged ) )
                    result.nameserverText = cn
                    result.nscls = current.nscls
                    result.nschanged = false
                else
                    result.nameserverText = rn
                    result.nschanged = true
                    result.nscls = 'listing changed'
                if ( ( ca == ra ) && ( !current.achanged ) )
                    result.arecordsText = ca
                    result.acls = current.acls
                    result.achanged = false
                else
                    result.arecordsText = ra
                    result.achanged = true
                    result.acls = 'listing changed'
                if ( ( cc == rc ) && ( !current.cchanged ) )
                    result.crecordsText = cc
                    result.ccls = current.ccls
                    result.cchanged = false
                else
                    result.crecordsText = rc
                    result.cchanged = true
                    result.ccls = 'listing changed'
                if ( ( cm == rm ) && ( !current.mxchanged ) )
                    result.mxrecordsText = cm
                    result.mxcls = current.mxcls
                    result.mxchanged = false
                else
                    result.mxrecordsText = rm
                    result.mxchanged = true
                    result.mxcls = 'listing changed'

                if result.nschanged || results.achanged || result.cchanged || result.mxchanged
                    result.ts = current.ts
                    result.meta = 'CHANGED - This record changed at ' + result.ts
                else
                    result.ts = now
                    result.meta = 'UNCHANGED - Last checked at ' + result.ts

                results[key] = result
                @allResults results
            else
                console.log 'result: ', result
                result.nameserverText = result.NS.join ', '
                result.arecordsText = result.A.join ', '
                result.crecordsText = result.CNAME.join ', '
                if $.isString result.MX[0]
                    result.mxrecordsText = result.MX[0]
                else
                    result.mxrecordsText = $.map(result.MX, (i) -> JSON.stringify i ).join ', '
                result.ts = now
                result.meta = 'NOW MONITORING - Last checked at ' + result.ts
                result.nschanged = false
                result.achanged = false
                result.cchanged = false
                result.mxchanged = false
                result.nscls = 'listing unchanged'
                result.acls = 'listing unchanged'
                result.ccls = 'listing unchanged'
                result.mxcls = 'listing unchanged'
                @allResults.unshift result
            @domainQuery ""
        @allDomains = ->
            $.pluck @allResults(), 'domain'

$.domReady( ->
    domains = new DomainsViewModel()
    $.applyBindings domains
    # focus input
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
