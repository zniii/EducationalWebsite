const { Affiliation } = require("../model/Affiliation.model");
const { Faculty } = require("../model/Faculty.model");
const { Level } = require("../model/Level.model");
const { Institute } = require("../model/Institute.model");
const { Note } = require("../model/Note.model");
const { Question } = require("../model/Question.model");
const { Subject } = require("../model/Subject.model");
const { Logger } = require("../lib/logger");

const slugMaker = (title) => {
    return title.toLowerCase().replace(/([ ?:(){}.=,_\[\]])/g, "-");
};

const randomNumber = () => {
    const random = Math.floor(Math.random() * (1000 - 0));
    return random;
};

const slugToId = async (slug, modelName) => {
    try {
        switch (modelName) {
            case "Affiliation":
                const affiliation = await Affiliation.findOne({ slug: slug });
                if (!affiliation) {
                    id = null;
                    break;
                } else {
                    id = affiliation.id;
                    break;
                }
            case "Faculty":
                const faculty = await Faculty.findOne({ slug: slug });
                if (!faculty) {
                    id = null;
                    break;
                } else {
                    id = faculty.id;
                    break;
                }
            case "Level":
                const level = await Level.findOne({ slug: slug });
                if (!level) {
                    id = null;
                    break;
                } else {
                    id = level.id;
                    break;
                }
            case "Subject":
                const subject = await Subject.findOne({ slug: slug });
                if (!subject) {
                    id = null;
                    break;
                } else {
                    id = subject.id;
                    break;
                }
            case "Institute":
                const institute = await Institute.findOne({ slug: slug });
                if (!institute) {
                    id = null;
                    break;
                } else {
                    id = institute.id;
                    break;
                }
            case "Note":
                const note = await Note.findOne({ slug: slug });
                if (!note) {
                    id = null;
                    break;
                } else {
                    id = note.id;
                    break;
                }
            case "Question":
                const question = await Question.findOne({ slug: slug });
                if (!question) {
                    id = null;
                    break;
                } else {
                    id = question.id;
                    break;
                }
            default:
                Logger.error(
                    `Possible inputs: [ Affiliation | Faculty | Level | Institute | Subject | Note | Question ]. Inserted input.-> ${modelName}`
                );
                break;
        }
        return id;
    } catch (error) {
        Logger.error(error);
    }
};

module.exports = { slugMaker, slugToId, randomNumber };
