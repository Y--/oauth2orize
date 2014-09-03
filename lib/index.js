/**
 * Module dependencies.
 */
var fs = require('fs')
  , path = require('path')
  , Server = require('./server');


/**
 * Create an OAuth 2.0 server.
 *
 * @return {Server}
 * @api public
 */
function createServer() {
  var server = new Server();
  return server;
}

// expose createServer() as the module
exports = module.exports = createServer;

/**
 * Export `.createServer()`.
 */
exports.createServer = createServer;


/**
 * Export middleware.
 */
exports.errorHandler = require('./middleware/errorHandler');

/**
 * Auto-load bundled grants.
 */
exports.grant = {};

fs.readdirSync(__dirname + '/grant').forEach(function(filename) {
  if (/\.js$/.test(filename)) {
    var name = path.basename(filename, '.js');
    exports.grant.__defineGetter__(name,
      function load() { return require('./grant/' + name); });
  }
});

// alias grants
exports.grant.authorizationCode = exports.grant.code;
exports.grant.implicit = exports.grant.token;

/**
 * Auto-load bundled exchanges.
 */
exports.exchange = {};

fs.readdirSync(__dirname + '/exchange').forEach(function(filename) {
  if (/\.js$/.test(filename)) {
    var name = path.basename(filename, '.js');
    exports.exchange.__defineGetter__(name,
      function load() { return require('./exchange/' + name); });
  }
});

// alias exchanges
exports.exchange.code = exports.exchange.authorizationCode;

/**
 * Export errors.
 */
exports.AuthorizationError = require('./errors/authorizationerror');
exports.TokenError = require('./errors/tokenerror');
