/** after level
 * name
 * description
 * level
 * faculty
 */

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
        level: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Level",
        },
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
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
    },
    { versionKey: false },
    { strict: false }
);
schema.plugin(mongoosePaginate);
schema.index("slug");
const Subject = mongoose.model("Subject", schema);
module.exports = { Subject };
