const morgan = require("morgan");

const { Logger } = require("../lib/logger");

const stream = {
    write: (message) => Logger.http(message),
};

const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    { stream }
);

module.exports = { morganMiddleware };
