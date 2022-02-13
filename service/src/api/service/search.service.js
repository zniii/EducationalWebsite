const { Affiliation } = require("../model/Affiliation.model");
const { Institute } = require("../model/Institute.model");
const { Faculty } = require("../model/Faculty.model");
const { Subject } = require("../model/Subject.model");
const { Logger } = require("../lib/logger");
const mongoose = require("mongoose");

async function get(text) {
    const affiliation = await Affiliation.find({
        name: {
            $regex: "^" + text,
            $options: "i",
        },
    });
    const institute = await Institute.find({
        name: {
            $regex: "^" + text,
            $options: "i",
        },
    }).populate({path: "affiliation"});
    const faculty = await Faculty.find({
        name: {
            $regex: "^" + text,
            $options: "i",
        },
    });
    const subject = await Subject.find({
        name: {
            $regex: "^" + text,
            $options: "i",
        },
    });

    const data = {
        affiliation: affiliation,
        institute: institute,
        faculty: faculty,
        subject: subject,
    };
    return data;
}

module.exports = { get };
