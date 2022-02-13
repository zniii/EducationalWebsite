const {
    deleteLevel,
    getAllLevel,
    getAllLevelAdmin,
    getLevelBySlug,
    insertLevel,
    updateLevel,
    getSubjectByLevel,
} = require("../controller/level.controller");
const { Logger } = require("../lib/logger");
const route = require("express").Router();

route.post("/", async (req, res) => {
    try {
        const result = await insertLevel(req.body);
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

route.get("/admin", async (req,res) => {
    try {
        const result = await getAllLevelAdmin(
            req.query.type
        );
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
})

route.get("/:slug", async (req, res) => {
    try {
        const result = await getLevelBySlug(req.params.slug);
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

route.get("/", async (req, res) => {
    try {
        const result = await getAllLevel(
            req.query.page,
            req.query.limit,
            req.query.type
        );
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

route.get("/:slug/subject", async (req, res) => {
    try {
        const result = await getSubjectByLevel(
            req.query.page,
            req.query.limit,
            req.params.slug
        );
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

route.put("/:slug", async (req, res) => {
    try {
        const result = await updateLevel(req.params.slug, req.body);
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

route.delete("/:slug", async (req, res) => {
    try {
        const result = await deleteLevel(req.params.slug, req.query.status);
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
