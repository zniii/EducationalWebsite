/** after subject
 * name
 * description
 * year
 * subject
 * resource (actual list of resourse) [object]
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
        year: {
            type: Number,
            required: true,
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
        },
        resource: [
            {
                _id: mongoose.Schema.Types.ObjectId,
                name: String,
                description: String,
                path: {
                    type: String,
                    required: true,
                },
                resourceType: String,
            },
        ],
        status: {
            type: String,
            required: true,
            validate: {
                validator: function (text) {
                    return text === "active" || "deactive";
                },
                message: "Invalid Status",
            },
        },
    },
    { versionKey: false },
    { strict: false }
);
schema.plugin(mongoosePaginate);
schema.index("slug");
const Note = mongoose.model("Note", schema);
module.exports = { Note };
