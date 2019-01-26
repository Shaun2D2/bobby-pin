const bodyParser = require('body-parser');
const express = require('express');
const http = require( 'http');

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

module.exports = (config) => {    
    /**
     * setup the app
     */
    const app = express();
    
    /**
     * set port for app
     */
    app.set('port', normalizePort(process.env.PORT || '3000'));

    /**
     * register middlewares
     */
    [
        bodyParser.urlencoded({ extended: false }),
        bodyParser.json(),
        ...config.before
    ].forEach(ware => app.use(ware));

    /**
     * serve up public assets on local host
     */
    config.staticRoutes.forEach(route => express.static(route));
    
    /**
     * register routes
     */
    router(config.routes, app);
    
    /**
     * handle a 404 
     */
    app.use(function(req, res) {
        res.status(404).json({ code: 404, message: 'resource not found' });
    });
    
    /**
     * handling applciation errors
     */
    app.use(function(err, req, res) {
        res.status(500).json({ code: 500, message: 'unexpected error.' });
    });

    /**
     * create the server
     */
    const server = http.createServer(app);
    
    server.listen(port);
    server.on('error', onError);
    
    console.log(`app running on ${port} in ${process.env.NODE_ENV || 'dev'} mode`);
}
