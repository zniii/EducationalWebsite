const express = require("express");
const compression = require("compression");
const cors = require("cors");
const { router } = require("../api/routes");
const { morganMiddleware } = require("../api/middleware");
const upload = require("express-fileupload");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const swagger_path = path.resolve(__dirname, "../api/swagger/swagger.yml");
const swaggerDocument = yaml.load(swagger_path);

const expressConfig = (app) => {
    const corsOptions = {
        origin: "*",
    };

    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(compression());
    app.use(morganMiddleware);
    app.use(express.static("../../uploads"));
    app.use(upload());
    app.use("/api/", router);
    app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    return app;
};

module.exports = { expressConfig };
