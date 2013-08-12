requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'javascripts/lib',
    paths: {
        app: '../app'
    }
});

require(["/socket.io/socket.io.js", "ender"], function () {

    var DomainsModel,
        socket;

    // open socket connection
    socket = io.connect('/resolvedyet');

    DomainsModel = function () {
        this.domainQuery = $.observable('');
        this.allResults = $.observableArray([]);
        this.startMonitor = function () {
            socket.emit('startmonitor', this.domainQuery(), 150000);
        };
        this.processResult = function (result) {
            var k, v, sorted;
            for (k in result) {
                v = result[k];
                if (k === 'domain') continue;
                if ($.isString(v)) {
                    continue;
                } else if ($.isArray(v)) {
                    if (v.length === 0) {
                        result[k] = "No Results";
                    } else if ($.isString(v[0])) {
                        result[k].sort();
                        result[k] = result[k].join(', ');
                    } else if ($.isObject(v[0])) {
                        if (v[0].hasOwnProperty('priority')) {
                            result[k] = $.sortBy(result[k], 'priority');
                        }
                        result[k] = $.map(result[k], function(i) {
                            return JSON.stringify(i);
                        }).join(', ');
                    }
                }
            }
            return result;
        };
        this.initResult = function (result, now) {
            var k;
            // update timestamp
            result.ts = now;
            // set status to monitoring
            result.meta = 'NOW MONITORING - Last checked at ' + result.ts;
            for (k in result) {
                if (k === 'domain') continue;
                result[k + 'changed'] = false;
                result[k + 'cls'] = 'listing unchanged';
            }
            return result;
        };
        this.markChanges = function (current, result, now) {
            var k, cv, rv;
            for (k in result) {
                cv = current[k];
                rv = result[k];
                if (k === 'domain') continue;
                if ((rv === cv) && (!current[k + 'changed'])) {
                    result[k + 'changed'] = false;
                    result[k + 'cls'] = 'listing unchanged';
                } else {
                    result[k + 'changed'] = true;
                    result[k + 'cls'] = 'listing changed';
                }
            }
            // did anything change?
            if (result.nschanged || results.achanged || result.cchanged || result.mxchanged) {
                result.ts = current.ts;
                result.meta = 'CHANGED - This record changed at ' + result.ts;
            } else {
                result.ts = now;
                result.meta = 'UNCHANGED - Last checked at ' + result.ts;
            }
            return result;
        };
        this.addResult = function (result) {
            var current, key, now, result, results, rm;
            results = this.allResults();
            now = $.moment().format('h:mma');

            // attempt to get key of domain and...
            key = $.indexOf(this.allDomains(), result.domain);

            // if the result already exists
            if (key !== -1) {

                // set current result
                current = results[key];

                // process results
                current = this.processResult(results[key]);
                result = this.processResult(result);

                // mark changes
                result = this.markChanges(current, result, now);

                // update results
                results[key] = result;
                this.allResults(results);

            } else {

                // process result
                result = this.processResult(result);

                // initialize result
                result = this.initResult(result, now);

                // add to results
                this.allResults.unshift(result);

            }

            // reset domain query
            this.domainQuery("");

        };

        // property - domains
        this.allDomains = function() {
            // pluck domains from results
            return $.pluck(this.allResults(), 'domain');
        };

    }

    // on document ready...
    $.domReady(function () {

        var domainsModel;

        // create knockout stores
        domainsModel = new DomainsModel();

        // apply knockout data bindings
        $.applyBindings(domainsModel);

        // focus on input
        $('#domain').get(0).focus();

        // set results display to block now that we're all loaded up to -- hidden initially to avoid empty list flash
        $('ul#results').css('display', 'block')

        // connect
        socket.emit('connect');

        // setup notify event
        socket.on('notify', function(title, msg) {
            alert(msg);
        });

        // updated results received
        socket.on('updatedrecords', function(result) {
            domainsModel.addResult(result);
            $('#domain').get(0).focus();
        });

    });

});
