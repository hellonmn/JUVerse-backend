const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamMemberSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
