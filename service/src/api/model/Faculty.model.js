/** 3
 * name
 * abbreviation
 * description
 */
// E.G. BCA, CSIT

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
        abbreviation: String,
        affiliation: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Affiliation",
        },
        status: {
            type: String,
            required: true,
            validate: {
                validator: function (text) {
                    return (text === "active") | "deactive";
                },
                message: "Invalid state",
            },
        },
    },
    { versionKey: false },
    { strict: false }
);
schema.plugin(mongoosePaginate);
schema.index("slug");
const Faculty = mongoose.model("Faculty", schema);
module.exports = { Faculty };
