
/*
 * DNS Tools
 */

(function(){

    var _ = require('underscore'),
        async = require('async'),
        Deferred = require('JQDeferred'),
        request = require('request'),
        dns = require('dns'),
        moment = require('moment');

    function DnsTools() {

        var dnstools = this,
            records = {};
        
        dnstools.connect = function () {
            var socket = this;
            socket.connected = true;
        };

        dnstools.disconnect = function () {
            var socket = this;
            socket.connected = false;
        };

        dnstools.startMonitor = function (domain) {

            var socket = this,
                isConnected = function () { return socket.connected; },
                updateClient = function () { socket.emit('updatedrecords', records); },
                getNs, getA, getCname, getMx;

            // promise constructor
            function getRecords(type, reference) {
                var method = (type === 'NS') ? 'resolveNs' : 'resolve';
                return function () {
                    return Deferred(function(dfd){
                        dns[method](domain, function(err, results){
                            if ( (!err) && (typeof results !== 'undefined') ) {
                                records[reference] = results;
                            } else {
                                records[reference] = [ "No Records" ];
                            }
                            records[reference].sort();
                            dfd.resolve();
                        });
                    }).promise();
                };
            }

            // promises
            getNs = getRecords('NS','nameservers');
            getA = getRecords('A','arecords');
            getCname = getRecords('CNAME','crecords');
            getMx = getRecords('MX','mxrecords');

            // whilst callback
            function doResolve (callback) {
                Deferred.when(getNs(), getA(), getCname(), getMx())
                        .done(updateClient)
                        .fail(function(){
                            console.log('trouble!');
                        });
                // wait 2.5 mins between requests
                setTimeout(callback, 150000);
            }

            if (domain) {
                records.domain = domain;
                async.whilst(
                    isConnected,
                    doResolve,
                    function (error) { if (error) { console.log('error: ', error); } }
                );
            }
        };

    }

    module.exports = new DnsTools();

}());
