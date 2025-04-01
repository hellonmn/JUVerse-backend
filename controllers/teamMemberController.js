const mongoose = require('mongoose');
const TeamMember = require('../models/teamMemberModel');


exports.createTeamMember = async (req, res) => {
    const { name, designation, team_id, user_id } = req.body;
    
    try {
        const member = new TeamMember({ name, designation, team_id, user_id });
        await member.save();
        
        res.status(201).json({ message: 'Team member created successfully', member });
    } catch (err) {
        res.status(400).json({ message: 'Error creating team member', error: err.message });
    }
};

exports.getAllTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find();
        res.status(200).json(members);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching team members', error: err.message });
    }
};

exports.getTeamMemberById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const member = await TeamMember.findById(id);
        if (!member) return res.status(404).json({ message: 'Team member not found' });
        
        res.status(200).json(member);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching team member', error: err.message });
    }
};

exports.updateTeamMember = async (req, res) => {
    const { id } = req.params;
    const { name, designation, team_id, user_id } = req.body;
    
    try {
        const member = await TeamMember.findByIdAndUpdate(id, { name, designation, team_id, user_id }, { new: true });
        if (!member) return res.status(404).json({ message: 'Team member not found' });
        
        res.status(200).json({ message: 'Team member updated successfully', member });
    } catch (err) {
        res.status(400).json({ message: 'Error updating team member', error: err.message });
    }
};

exports.deleteTeamMember = async (req, res) => {
    const { id } = req.params;
    
    try {
        const member = await TeamMember.findByIdAndDelete(id);
        if (!member) return res.status(404).json({ message: 'Team member not found' });
        
        res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting team member', error: err.message });
    }
};
