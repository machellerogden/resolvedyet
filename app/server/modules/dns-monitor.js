// Generated by IcedCoffeeScript 1.4.0c
(function() {
  var DnsMonitor, dns, iced, __iced_k, __iced_k_noop;

  iced = require('iced-coffee-script').iced;
  __iced_k = __iced_k_noop = function() {};

  dns = require('dns');

  DnsMonitor = (function() {

    function DnsMonitor() {
      this.connect = function() {
        return this.connected = true;
      };
      this.disconnect = function() {
        return this.connected = false;
      };
      this.start = function(domain, pollingrate) {
        var getRecords, monitorLoop, processRecords, socket, ___iced_passed_deferral, __iced_deferrals, __iced_k,
          _this = this;
        __iced_k = __iced_k_noop;
        ___iced_passed_deferral = iced.findDeferral(arguments);
        socket = this;
        processRecords = function(records, err) {
          if ((!err) && (typeof records !== 'undefined')) {
            return records.sort();
          } else {
            return records = [];
          }
        };
        getRecords = function(type, cb) {
          type = type.toUpperCase();
          if (type === 'NS') {
            return dns.resolveNs(domain, function(err, records) {
              return cb(processRecords(records, err));
            });
          } else {
            return dns.resolve(domain, type, function(err, records) {
              return cb(processRecords(records, err));
            });
          }
        };
        monitorLoop = function(cb) {
          var records, t, types, ___iced_passed_deferral1, __iced_deferrals, __iced_k,
            _this = this;
          __iced_k = __iced_k_noop;
          ___iced_passed_deferral1 = iced.findDeferral(arguments);
          records = {};
          records.domain = domain;
          types = ['ns', 'a', 'cname', 'mx'];
          (function(__iced_k) {
            var _i, _len;
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral1,
              filename: "dns-monitor.coffee",
              funcname: "monitorLoop"
            });
            for (_i = 0, _len = types.length; _i < _len; _i++) {
              t = types[_i];
              getRecords(t, __iced_deferrals.defer({
                assign_fn: (function(__slot_1, __slot_2) {
                  return function() {
                    return __slot_1[__slot_2] = arguments[0];
                  };
                })(records, t),
                lineno: 63
              }));
            }
            __iced_deferrals._fulfill();
          })(function() {
            console.log('updatedrecords: ', records);
            socket.emit('updatedrecords', records);
            return setTimeout(cb, pollingrate);
          });
        };
        if (domain) {
          (function(__iced_k) {
            var _results, _while;
            _results = [];
            _while = function(__iced_k) {
              var _break, _continue, _next;
              _break = function() {
                return __iced_k(_results);
              };
              _continue = function() {
                return iced.trampoline(function() {
                  return _while(__iced_k);
                });
              };
              _next = function(__iced_next_arg) {
                _results.push(__iced_next_arg);
                return _continue();
              };
              if (!socket.connected) {
                return _break();
              } else {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "dns-monitor.coffee",
                    funcname: "start"
                  });
                  monitorLoop(__iced_deferrals.defer({
                    lineno: 73
                  }));
                  __iced_deferrals._fulfill();
                })(_next);
              }
            };
            _while(__iced_k);
          })(__iced_k);
        } else {
          return __iced_k();
        }
      };
    }

    return DnsMonitor;

  })();

  module.exports = new DnsMonitor();

}).call(this);
