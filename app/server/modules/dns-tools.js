
/*
 * DNS Socketware
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
                getNs = function () {
                    return Deferred(function(dfd){
                        dns.resolveNs(domain, function(err, nameservers){
                            if ( (!err) && (typeof nameservers !== 'undefined') ) {
                                records.nameservers = nameservers;
                            } else {
                                records.nameservers = ["No Records"];
                            }
                            records.nameservers.sort();
                            dfd.resolve();
                        });
                    }).promise();
                },
                getA = function () {
                    return Deferred(function(dfd){
                        dns.resolve(domain, 'A', function (err, arecords){
                            if ( (!err) && (typeof arecords !== 'undefined') ) {
                                records.arecords = arecords;
                            } else {
                                records.arecords = ["No Records"];
                            }
                            records.arecords.sort();
                            dfd.resolve();
                        });
                    }).promise();
                },
                getCname = function () {
                    return Deferred(function(dfd){
                        dns.resolve(domain, 'CNAME', function (err, crecords){
                            if ( (!err) && (typeof crecords !== 'undefined') ) {
                                records.crecords = crecords;
                            } else {
                                records.crecords = ["No Records"];
                            }
                            records.crecords.sort();
                            dfd.resolve();
                        });
                    }).promise();
                },
                getMx = function () {
                    return Deferred(function(dfd){
                        dns.resolve(domain, 'MX', function (err, mxrecords){
                            if ( (!err) && (typeof mxrecords !== 'undefined') ) {
                                records.mxrecords = mxrecords;
                            } else {
                                records.mxrecords = ["No Records"];
                            }
                            records.mxrecords.sort();
                            dfd.resolve();
                        });
                    }).promise();
                },
                doResolve = function (callback) {
                    Deferred.when(getNs(), getA(), getCname(), getMx())
                            .done(updateClient)
                            .fail(function(){
                                console.log('trouble!');
                            });
                    // wait 2.5 mins between requests
                    setTimeout(callback, 150000);
                };
            if (domain) {
                records.domain = domain;
                async.whilst(
                    isConnected,
                    doResolve,
                    function (error) { if (error) { console.log('error: ', error); } }
                );
            }
        };

    };

    module.exports = new DnsTools();

}());
