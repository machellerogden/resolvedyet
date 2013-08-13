(function() {

    module.exports = function(app) {
        var express, nib, stylus;

        express = require('express');
        stylus = require('stylus');
        nib = require('nib');
        app.configure(function() {
            app.set('port', process.env.PORT || 8080);
            app.set('views', app.root + '/app/server/views');
            app.set('view engine', 'jade');
            app.use(express.favicon(app.root + '/app/server/public/favicon.ico'));
            app.use(express.logger('dev'));
            app.use(express.bodyParser());
            app.use(express.methodOverride());
            app.use(express.cookieParser('changeToSomethingMoreSecure'));
            app.use(express.session());
            app.use(app.router);
            app.use(stylus.middleware({
                src: app.root + '/app/server/public',
                desc: app.root + '/app/server/public',
                debug: true,
                compile: function(str, path) {
                    return stylus(str).set('filename', path).set('compress', true).use(nib());
                }
            }));
            app.use(express["static"](app.root + '/app/server/public'));
        });
        app.configure('development', function() {
            app.use(express.errorHandler());
        });
    };

}());
