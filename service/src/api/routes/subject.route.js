const {
    deleteSubject,
    getAllSubject,
    getAllSubjectAdmin,
    getSubjectBySlug,
    insertSubject,
    updateSubject,
    getNoteBySubject,
    getQuestionBySubject,
    getAffiliationBySubject
} = require("../controller/subject.controller");
const { Logger } = require("../lib/logger");
const route = require("express").Router();

route.post("/", async (req, res) => {
    try {
        const result = await insertSubject(req.body);
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

route.get("/admin", async (req, res) => {
    try {
        const result = await getAllSubjectAdmin();
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

route.get("/:slug", async (req, res) => {
    try {
        const result = await getSubjectBySlug(req.params.slug);
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
        const result = await getAllSubject(req.query.page, req.query.limit);
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

route.get("/:slug/note", async (req, res) => {
    try {
        const result = await getNoteBySubject(
            req.query.page,
            req.query.limit,
            req.query.institute,
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

route.get("/:slug/question", async (req, res) => {
    try {
        const result = await getQuestionBySubject(
            req.query.page,
            req.query.limit,
            req.query.institute,
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

route.get("/:slug/affiliation", async (req,res) => {
    try{
        const result = await getAffiliationBySubject(req.params.slug);
        return res.status(200).json({
            message: "Executed Successfully",
            data: result,
        })
    }catch(error){
        return res.status(200).json({
            message: "Operation Failed",
            data: error.message,
        })
    }
})

route.put("/:slug", async (req, res) => {
    try {
        const result = await updateSubject(req.params.slug, req.body);
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
        const result = await deleteSubject(req.params.slug, req.query.status);
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
