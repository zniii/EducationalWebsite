/** 4
 * name
 * description
 * type (semester, class) or (class, year, semester)
 */

//TODO ask ... about this

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true,
        },
        slug: String,
        description: {
            type: String,
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            validate: {
                validator: function (text) {
                    return text === "active" || "deactive";
                },
                message: "Invalid State",
            },
        },
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Faculty",
        },
    },
    { versionKey: false },
    { strict: false }
);
schema.plugin(mongoosePaginate);
schema.index("slug");
const Level = mongoose.model("Level", schema);
module.exports = { Level };
