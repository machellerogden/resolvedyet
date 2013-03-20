
/*
 * DNS Tools
 */

var _ = require('underscore')
    , async = require('async')
    , request = require('request')
    , dns = require('dns')
    , moment = require('moment')
    , dnstools = {};

dnstools.connect = function () {
    var socket = this;
    socket.connected = true;
};

dnstools.disconnect = function () {
    var socket = this;
    socket.connected = false;
};

dnstools.getRecords = function (domain) {
    var socket = this;
    if (domain) {
        
        async.whilst(
            function () { return socket.connected; },
            function (callback) {
                console.log('resolving name servers for ' + domain);
                // resolve nameserver
                dns.resolveNs(domain, function(err, nameservers){
                    console.log('addresses: ', nameservers);
                    var result = {
                        domain: domain
                    };
                    if ( (!err) && (typeof nameservers !== 'undefined') ) {
                        result.nameservers = nameservers;
                    } else {
                        result.nameservers = ["No Records"];
                    }
                    result.nameservers.sort();
                    dns.resolve(domain, 'A', function (err, arecords){
                        if ( (!err) && (typeof arecords !== 'undefined') ) {
                            result.arecords = arecords;
                        } else {
                            result.arecords = ["No Records"];
                        }
                        result.arecords.sort();
                        dns.resolve(domain, 'CNAME', function (err, crecords){
                            if ( (!err) && (typeof crecords !== 'undefined') ) {
                                result.crecords = crecords;
                            } else {
                                result.crecords = ["No Records"];
                            }
                            result.crecords.sort();
                            dns.resolve(domain, 'MX', function (err, mxrecords){
                                if ( (!err) && (typeof mxrecords !== 'undefined') ) {
                                    result.mxrecords = mxrecords;
                                } else {
                                    result.mxrecords = ["No Records"];
                                }
                                result.mxrecords.sort();
                                socket.emit('updatedresult', result);
                            });
                        });
                    });
                });
                // 2.5 mins
                setTimeout(callback, 150000);
            },
            function (err) {
                console.log('whilst stopped');
            }
        );
        
    }
};

module.exports = dnstools;
