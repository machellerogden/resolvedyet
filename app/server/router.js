module.exports = function (app) {

    app.all('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
        res.header('Access-Control-Request-Method', 'GET,POST');
        next();
    });

    app.get('/', function (req, res) {
        res.render('domainquery', {
            title: 'resolvedyet'
        });
    });

};
