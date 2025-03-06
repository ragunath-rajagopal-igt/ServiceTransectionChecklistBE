const mongoose = require("mongoose");

const loggerSchema = new mongoose.Schema({
    recordId: {
        type: String,
        required: true,
    },
    changes: {
        type: mongoose.Schema.Types.Mixed, // Supports any type of data (object, array, etc.)
        required: true,
    },
    module: {
        type: String,
        required: [true, "Module name is required."],
        trim: true,
    },
    moduleFrom: {
        type: String,
        required: [false, "Module name from is required."],
    },
    action: {
        type: String,
        required: [true, "Action is required."],
        trim: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false // Disable automatic timestamps since createdAt is custom
});

// Add indexing for performance on frequent queries
loggerSchema.index({ module: 1, action: 1, createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("Logger", loggerSchema);
