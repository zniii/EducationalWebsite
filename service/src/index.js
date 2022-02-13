const { Logger } = require("./api/lib/logger");
require("dotenv").config();
const { createServer } = require("./server");
const { dbConnect } = require("./config");
const { PORT } = require("./constants");

const startServer = () => {
    const app = createServer();

    return app.listen(PORT, async () => {
        Logger.info(`Server is listening on port ${PORT}`);
        dbConnect();
    });
};

startServer();
