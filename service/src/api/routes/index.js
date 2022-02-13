const router = require("express").Router();

const main = require("./main.route");
const affiliation = require("./affiliation.route");
const faculty = require("./faculty.route");
const level = require("./level.route");
const institute = require("./institute.route");
const subject = require("./subject.route");
const note = require("./note.route");
const question = require("./question.route");
const file = require("./file.route");
const sitemap = require("./sitemap.route");
const search = require("./search.route");

router.use("/", main);
router.use("/affiliation", affiliation);
router.use("/faculty", faculty);
router.use("/level", level);
router.use("/institute", institute);
router.use("/subject", subject);
router.use("/note", note);
router.use("/question", question);
router.use("/file", file);
router.use("/sitemap.xml", sitemap);
router.use("/search", search);

module.exports = { router };
