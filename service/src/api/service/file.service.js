//TODO this handels all  the file related operations
const express = require("express");
const multer = require("multer");
const uuid = require("uuid");
const fs = require("fs");

const app = express();

const id = uuid.v4();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, (filename = "uploads"));
    },
    filename: (req, file, cb) => {
        const { originalFilename } = file;
        cb(null, `${id}-${originalname}`);
    },
});

const upload = multer({ storage });

async function uploadFile(file) {
    upload.single(file);
    return storage.filename;
}

// app.get("/file/:filename", (req, res)=> {
//     const readStream = fs.createReadStream(`./uploads/${req.params.filename}`);
//     res.header({
//         "Content-type":"application/octet-stream",
//         "Content-Disposition":`attachment;  Filename= ${req.params.filename}`
//     });
//     readStream.pipe(res);
// });

module.exports = { uploadFile };
