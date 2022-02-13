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
        image: String,
        status: {
            type: String,
            required: true,
            validate: {
                validator: function (text) {
                    return text === "active" || "inactive";
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
const Affiliation = mongoose.model("Affiliation", schema);
module.exports = { Affiliation };
