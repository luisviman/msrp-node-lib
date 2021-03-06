var net = require('net');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = function(MsrpSdk) {
    var msrpTracingEnabled = false;
    var config = MsrpSdk.Config;

    /**
     * MSRP server
     * @param  {object} config Holds the MSRP Server configuation
     * @return {object}        The MSRP Server object
     */
    var Server = function() {
        var server = this;
        server.config = config;
        msrpTracingEnabled = config.traceMsrp;

        this.sessions = {};

        this.server = net.createServer(function(socket) {
            // TODO: INBOUND -  Remove next line
            MsrpSdk.Logger.warn('CALLING SOCKET HANDLER FROM SERVER');

            // TODO: INBOUND - Review this
            socket = new MsrpSdk.SocketHandler(socket);
        });
    };

    // TODO: Is Server emitting something now?
    util.inherits(Server, EventEmitter);

    Server.prototype.start = function(done) {
        var server = this;
        this.server.listen(config.port, config.host, function() {
            var serv = server.server.address();
            MsrpSdk.Logger.info('MSRP TCP server listening on ' + serv.address + ':' + serv.port);
            if (msrpTracingEnabled) {
                MsrpSdk.Logger.info('MSRP tracing enabled');
            }

            if (done) {
                done();
            }
        }).on('error', function(error) {
            MsrpSdk.Logger.warn(error);
            if (done) {
                done(error);
            }
        });
    };

    MsrpSdk.Server = Server;
};
