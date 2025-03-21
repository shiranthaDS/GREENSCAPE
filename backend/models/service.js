const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    moreInfo: { type: String },
    imageUrl: { type: String, required: true }
});

module.exports = mongoose.model("Service", ServiceSchema);
