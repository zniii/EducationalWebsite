const {
    getAffiliationBySlug,
    insertAffiliation,
    getAllAffiliation,
    getAllAffiliationAdmin,
    updateAffiliation,
    deleteAffiliation,
    getFacultyByAffiliation,
    getInstituteByAffiliation,
    getNotesAndQuestionByAffiliation,
} = require("../controller/affiliation.controller");
const { Logger } = require("../lib/logger");
const route = require("express").Router();

route.post("/", async (req, res) => {
    try {
        const result = await insertAffiliation(req.body);
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
        const result = await getAllAffiliationAdmin();
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
        const result = await getAffiliationBySlug(req.params.slug);
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

route.get("/:slug/subject", async (req,res) => {
    try{
        const result = await getNotesAndQuestionByAffiliation(req.params.slug, req.query.sub);
        return res.status(200).json({
            message: "Executed successfully",
            data: result,
        })
    }catch(error){
        return res.status(500).json({
            message: "Operation Failed",
            data: error.message,
        })
    }
})



route.get("/", async (req, res) => {
    try {
        const result = await getAllAffiliation(req.query.page, req.query.limit);
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

route.get("/:slug/institute", async (req, res) => {
    try {
        const result = await getInstituteByAffiliation(
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

route.get("/:slug/faculty", async (req, res) => {
    try {
        const result = await getFacultyByAffiliation(
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
        const result = await updateAffiliation(req.params.slug, req.body);
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
        const result = await deleteAffiliation(req.params.slug, req.query.status);
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
