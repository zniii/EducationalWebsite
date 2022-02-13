const {
    deleteInstitute,
    getAllInstitute,
    getAllInstituteAdmin,
    getInstituteBySlug,
    insertInstitute,
    updateInstitute,
} = require("../controller/institute.controller");
const { Logger } = require("../lib/logger");
const route = require("express").Router();

route.post("/", async (req, res) => {
    try {
        const result = await insertInstitute(req.body);
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
        const result = await getAllInstituteAdmin(req.query.type);
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
        const result = await getInstituteBySlug(req.params.slug);
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
        const result = await getAllInstitute(
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

route.put("/:slug", async (req, res) => {
    try {
        const result = await updateInstitute(req.params.slug, req.body);
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
        const result = await deleteInstitute(req.params.slug, req.query.status);
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
