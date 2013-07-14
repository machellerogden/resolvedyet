express = require 'express'
http = require 'http'
app = express()
server = http.createServer app
app.root = __dirname

app.io = require('socket.io').listen server
app.io.set 'log level', 1
app.io.set 'transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']

require(app.root + '/app/config') app
require(app.root + '/app/server/router') app
require(app.root + '/app/server/modules/dns-events') app.io

server.listen 8080
