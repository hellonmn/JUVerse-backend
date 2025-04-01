const bcrypt = require('bcryptjs');
const User = require('../models/userModel');


exports.createUser = async (req, res) => {
    const { username, password, role, name, dob, email, ...otherFields } = req.body;

    if (!username || !password || !name || !dob || !email) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            role,
            name,
            dob,
            email,
            ...otherFields
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(400).json({ message: 'Error creating user', error: err.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(400).json({ message: 'Error fetching users', error: err.message });
    }
};



exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to view this user' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching user', error: err.message });
    }
};


exports.updateUser = async (req, res) => {
    const userId = req.params.id;

    if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to update this user' });
    }

    const { username, password, role, name, dob, email, ...otherFields } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        user.username = username || user.username;
        user.role = role || user.role;
        user.name = name || user.name;
        user.dob = dob || user.dob;
        user.email = email || user.email;
        Object.assign(user, otherFields);

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(400).json({ message: 'Error updating user', error: err.message });
    }
};


exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this user' });
        }

        await user.remove();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting user', error: err.message });
    }
};
