module.exports = (app) ->

    # CORS headers
    app.all '/*', (req, res, next) ->
        res.header 'Access-Control-Allow-Origin', '*'
        res.header 'Access-Control-Allow-Headers', 'X-Requested-With,Content-Type'
        res.header 'Access-Control-Request-Method', 'GET,POST'
        next()

    # domain query
    app.get '/', (req, res) ->
        res.render 'domainquery', { title: 'resolvedyet' }
