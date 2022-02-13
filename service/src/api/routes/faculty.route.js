const {
    deleteFaculty,
    getAllFaculty,
    getAllFacultyAdmin,
    getFacultyBySlug,
    insertFaculty,
    updateFaculty,
    getInstituteByFaculty,
    getSubjectByFaculty,
    getAffiliationByFaculty,
} = require("../controller/faculty.controller");
const { Logger } = require("../lib/logger");
const route = require("express").Router();

route.post("/", async (req, res) => {
    try {
        const result = await insertFaculty(req.body);
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

route.get("/admin", async (req,res)=> {
    try {
        const result = await getAllFacultyAdmin();
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
        // const result = await getFacultyBySlug(req.params.slug);
        const result = await getFacultyBySlug(
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

route.get("/", async (req, res) => {
    try {
        const result = await getAllFaculty(req.query.page, req.query.limit);
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
        const result = await getInstituteByFaculty(
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

route.get("/:slug/subject", async (req, res) => {
    try {
        const result = await getSubjectByFaculty(
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
        const result = await getAffiliationByFaculty(
            req.params.slug,
        );
        return res.status(200).json({
            message: "Executed Successfully",
            data: result,
        })
    }catch(error){
        return res.status(500).json({
            message: "Operation Failed",
            data: error.message,
        })
    }
})

route.put("/:slug", async (req, res) => {
    try {
        const result = await updateFaculty(req.params.slug, req.body);
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
        const result = await deleteFaculty(req.params.slug, req.query.status);
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
