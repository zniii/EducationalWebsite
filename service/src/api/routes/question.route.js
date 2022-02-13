const {
    getAllQuestion,
    getAllQuestionAdmin,
    getQuestionBySlug,
    updateQuestion,
    insertQuestion,
    updateStatusQuestion,
    deleteResourceBySlug,
    addResourceBySlug,
} = require("../controller/question.controller");
const { Logger } = require("../lib/logger");
const route = require("express").Router();
const uuid = require("uuid");

route.post("/", async (req, res) => {
    try {
        const data = req.body;
        let file;
        let result;
        if (req.files) {
            file = req.files.file;
        }
        let filename;
        if (file) {
            filename = `${uuid.v4()}-${file.name}`;
            file.mv((filepath = `uploads/${filename}`), (err) => {
                if (err) {
                    throw { message: err };
                }
            });
            result = await insertQuestion(data, filename);
        } else {
            result = await insertQuestion(data);
        }
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
        const result = await getAllQuestionAdmin();
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
        const result = await getQuestionBySlug(req.params.slug);
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
        const result = await getAllQuestion(req.query.page, req.query.limit);
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
        const result = await updateStatusQuestion(req.params.slug, req.query.status);
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

route.delete("/:slug", async (req,res) => {
    try{
        const result = await deleteResourceBySlug(req.params.slug, req.query.id);
        return res.status(200).json({
            message: "Executed Successfully",
            data: result,
        })
    }catch(error) {
        return res.status(500).json({
            message: "Operation Failed",
            data: error.message,
        })
    }
})

route.post("/:slug", async (req,res) => {
    try{
        const data = req.body;
        let file;
        let result;
        if (req.files) {
            file = req.files.file;
        }
        let filename;
        filename = `${uuid.v4()}-${file.name}`;
        file.mv((filepath = `uploads/${filename}`), (err) => {
            if (err) {
                throw { message: err };
            }
        });
        result = await addResourceBySlug(req.params.slug, data, filename);
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


module.exports = route;
