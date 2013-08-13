var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app);

app.root = __dirname;

global.io = require('socket.io').listen(server);
global.io.set('log level', 1);
global.io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

require(app.root + '/app/config')(app);
require(app.root + '/app/server/router')(app);
require(app.root + '/app/server/modules/dns-events');

server.listen(8080);
