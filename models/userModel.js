const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    designation: { type: String, required: true, default: 'user' },
    role: { type: String, enum: ['admin', 'user', 'moderator'], default: 'user' },
    
    // Additional fields
    name: { type: String, required: true },  // Typically required for identification
    dob: { type: Date, required: false },    // Date of Birth, optional
    idCardPaymentStatus: { 
        type: String, 
        enum: ['paid', 'pending', 'not_applicable'], 
        default: 'pending', 
        required: false 
    },
    domain: { type: String, required: false },
    tshirtSize: { 
        type: String, 
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], 
        required: false 
    },
    year: { 
        type: Number, 
        min: 1, 
        required: false 
    },
    branchOrCourse: { type: String, required: false },
    shift: { 
        type: String, 
        enum: ['morning', 'evening', 'night', 'flexible'], 
        required: false 
    },
    linktree: { type: String, required: false },
    email: { 
        type: String, 
        required: true, 
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    hostelersOrDayScholar: { 
        type: String, 
        enum: ['hosteler', 'day_scholar', 'not_applicable'], 
        default: 'not_applicable', 
        required: false 
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);