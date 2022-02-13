const mongoose = require("mongoose");
const { Logger } = require("../api/lib/logger");
function dbConnect() {
    mongoose.connect(process.env.MONGO_CONNECTION, (err) => {
        if (!err) {
            Logger.info("Connected to the database.");
        } else {
            Logger.info(
                `[${err}, Connection with the database could not be established.]`
            );
        }
    });
}

module.exports = { dbConnect };
