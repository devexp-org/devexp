// Enable all ES6 features
// TODO: Move babel config to it's own file (for reusing).
require('babel/register')({
    loose: ['es6.classes', 'es6.modules', 'es6.properties.computed', 'es6.templateLiterals'],
    optional: ['es7.decorators', 'es7.classProperties', 'es7.functionBind']
});

var path = require('path'),
    config = require('app/core/config'),
    mulilistener = require('app/server/multilistener'),
    app,
    port,
    logger;

config.init({ path: path.join(__dirname, 'app/config') });

/**
 * Log
 */
logger = require('app/core/logger');

/**
 * Main Server Module
 */
app = require('app/server');
port = process.env.PORT || config.load('server').port;

/**
 * Start Server
 */
mulilistener(app, port);
logger.info('App started on http://localhost:' + port);
