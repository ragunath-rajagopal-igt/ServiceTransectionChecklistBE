const mongoose = require("mongoose");

const BlacklistSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            ref: "auth",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("blacklist", BlacklistSchema);