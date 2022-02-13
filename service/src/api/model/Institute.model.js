/** 2
 * name
 * description
 * address
 * affiliation
 * faculty[]
 * type (college || school)
 *
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
        address: String,
        affiliation: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Affiliation",
        },
        faculty: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Faculty",
            },
        ],
        type: {
            type: String,
            required: true,
        },
        image: String,
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
const Institute = mongoose.model("Institute", schema);
module.exports = { Institute };
