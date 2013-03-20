// open socket connection
var socket = io.connect('/resolvedyet');

var DomainsViewModel = function () {

    this.domainQuery = $.observable('');

    this.resultToAdd = $.observableArray([]); 

    this.allResults = $.observableArray([]); 

    this.startMonitor = function () {
        socket.emit('startmonitor', this.domainQuery());
    };

    this.addResult = function () {

        var results = this.allResults(),
            result = this.resultToAdd(),
            key = ($.indexOf(this.allDomains(), result.domain)),
            now = $.moment().format('h:mma');

        // make sure domain isn't already being monitored
        if (key !== -1) {

            var current = results[key],
                cn = current.nameservers.join(', '),
                rn = result.nameservers.join(', '),
                ca = current.arecords.join(', '),
                ra = result.arecords.join(', '),
                cc = current.crecords.join(', '),
                rc = result.crecords.join(', '),
                cm, rm;

            if ( $.isString(current.mxrecords[0]) ) {
                cm = current.mxrecords[0];
            } else {
                cm = $.map(current.mxrecords, function(i) { return JSON.stringify(i); }).join(', ');
            }

            if ( $.isString(result.mxrecords[0]) ) {
                rm = result.mxrecords[0];
            } else {
                rm = $.map(result.mxrecords, function(i) { return JSON.stringify(i); }).join(', ');
            }

            if ( ( cn === rn ) && ( !current.nschanged ) ) {
                result.nameserverText = cn;
                result.nscls = current.nscls;
                result.nschanged = false;
            } else {
                result.nameserverText = rn;
                result.nschanged = true;
                result.nscls = 'listing changed';
            }
            if ( ( ca === ra ) && ( !current.achanged ) ) {
                result.arecordsText = ca;
                result.acls = current.acls;
                result.achanged = false;
            } else {
                result.arecordsText = ra;
                result.achanged = true;
                result.acls = 'listing changed';
            }
            if ( ( cc === rc ) && ( !current.cchanged ) ) {
                result.crecordsText = cc;
                result.ccls = current.ccls;
                result.cchanged = false;
            } else {
                result.crecordsText = rc;
                result.cchanged = true;
                result.ccls = 'listing changed';
            }
            if ( ( cm === rm ) && ( !current.mxchanged ) ) {
                result.mxrecordsText = cm;
                result.mxcls = current.mxcls;
                result.mxchanged = false;
            } else {
                result.mxrecordsText = rm;
                result.mxchanged = true;
                result.mxcls = 'listing changed';
            }

            if ( result.nschanged || results.achanged || result.cchanged || result.mxchanged ) {
                result.ts = current.ts;
                result.meta = 'CHANGED - This record changed at ' + result.ts;
            } else {
                result.ts = now;
                result.meta = 'UNCHANGED - Last checked at ' + result.ts;
            }

            results[key] = result;
            this.allResults(results);

        } else {

            result.nameserverText = result.nameservers.join(', ');
            result.arecordsText = result.arecords.join(', ');
            result.crecordsText = result.crecords.join(', ');

            if ( $.isString(result.mxrecords[0]) ) {
                result.mxrecordsText = result.mxrecords[0];
            } else {
                result.mxrecordsText = $.map(result.mxrecords, function(i) { return JSON.stringify(i); }).join(', ');
            }

            result.ts = now;
            result.meta = 'NOW MONITORING - Last checked at ' + result.ts;
            result.nschanged = false;
            result.achanged = false;
            result.cchanged = false;
            result.mxchanged = false;
            result.nscls = 'listing unchanged';
            result.acls = 'listing unchanged';
            result.ccls = 'listing unchanged';
            result.mxcls = 'listing unchanged';

            this.allResults.unshift(result);

        }

        this.domainQuery("");

    };

    this.allDomains = function () {
        return $.pluck(this.allResults(), 'domain');
    };

};

$.domReady(function () {

    var domains = new DomainsViewModel();
    $.applyBindings(domains);

    // focus input
    $('#domain').get(0).focus();

    // connect
    socket.emit('connect');

    // setup notify event
    socket.on('notify', function (title, msg) {
        alert(msg);
    });

    // updated results received
    socket.on('updatedrecords', function(result) {
        domains.resultToAdd(result);
        domains.addResult();
        $('#domain').get(0).focus();
    });

});
