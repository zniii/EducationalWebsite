const { getSearchResult } = require("../controller/search.controller");
const { Logger } = require("../lib/logger");
const route = require("express").Router();

route.get("/", async (req, res) => {
    try {
        const result = await getSearchResult(req.query.search);
        return res.status(200).json({
            message: "Executed successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Operation Failed",
            data: error.message,
        });
    }
});

module.exports = route;
