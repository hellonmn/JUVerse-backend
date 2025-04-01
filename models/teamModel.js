const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true, default: "event" }
});

module.exports = mongoose.model('Team', teamSchema);
