const {
    getAllNote,
    getAllNoteAdmin,
    getNoteBySlug,
    insertNote,
    deleteResourceBySlug,
    updateStatusBySlug,
    addNoteResource,
} = require("../controller/note.controller");
const { Logger } = require("../lib/logger");
const route = require("express").Router();
const uuid = require("uuid");

route.post("/", async (req, res) => {
    try {
        const data = req.body;
        let file;
        if (req.files) {
            file = req.files.file;
        }
        let filename;
        let result;
        if (file) {
            filename = `${uuid.v4()}-${file.name}`;
            file.mv((filepath = `uploads/${filename}`), (err) => {
                if (err) {
                    throw { message: err };
                }
            });
            result = await insertNote(data, filename);
        } else {
            result = await insertNote(data);
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

route.get("/admin", async (req, res) => {
    try {
        const result = await getAllNoteAdmin();
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
        const result = await getNoteBySlug(req.params.slug);
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
        const result = await getAllNote(req.query.page, req.query.limit);
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
        const result = await updateStatusBySlug(req.params.slug, req.query.status);
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
        result = await addNoteResource(req.params.slug, data, filename);
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
