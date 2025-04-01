const mongoose = require('mongoose');
const Team = require('../models/teamModel');
const TeamMember = require('../models/teamMemberModel');

exports.createTeam = async (req, res) => {
    const { name } = req.body;
    
    try {
        const team = new Team({ name });
        await team.save();
        
        res.status(201).json({ message: 'Team created successfully', team });
    } catch (err) {
        res.status(400).json({ message: 'Error creating team', error: err.message });
    }
};

exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json(teams);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching teams', error: err.message });
    }
};

exports.getAllJuTeams = async (req, res) => {
    try {
        const teams = await Team.find({tag : "juverse"});
        res.status(200).json(teams);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching teams', error: err.message });
    }
};

exports.getTeamById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const team = await Team.findById(id);
        if (!team) return res.status(404).json({ message: 'Team not found' });
        
        res.status(200).json(team);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching team', error: err.message });
    }
};

exports.updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    try {
        const team = await Team.findByIdAndUpdate(id, { name }, { new: true });
        if (!team) return res.status(404).json({ message: 'Team not found' });
        
        res.status(200).json({ message: 'Team updated successfully', team });
    } catch (err) {
        res.status(400).json({ message: 'Error updating team', error: err.message });
    }
};

exports.deleteTeam = async (req, res) => {
    const { id } = req.params;
    
    try {
        const team = await Team.findByIdAndDelete(id);
        if (!team) return res.status(404).json({ message: 'Team not found' });
        
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting team', error: err.message });
    }
};