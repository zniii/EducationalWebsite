const route = require("express").Router();
const fs = require("fs");
//const ap = require("../../../uploads")
route.get("/:filename", async (req, res) => {
    //const readStream = fs.createReadStream(`/home/lymn/Cloudyfox-Internship/pathshala/service/uploads/${req.params.filename}`);
    try {
        const exists = fs.existsSync(
            (filename = `uploads/${req.params.filename}`)
        );
        if (!exists) {
            throw { message: "file not found." };
        }
        const readStream = fs.createReadStream(
            (filename = `uploads/${req.params.filename}`)
        );
        res.header({
            "Content-type": "application/octet-stream",
            "Content-Disposition": `attachment;  Filename= ${req.params.filename}`,
        });
        return readStream.pipe(res);
    } catch (error) {
        return res.status(500).json({
            message: "Operation failed",
            data: error.message,
        });
    }
});

module.exports = route;
