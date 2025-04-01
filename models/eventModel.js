const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventModel = new Schema({
  event_name: {
    type: String,
    required: true,
  },
  event_date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'], 
    required: true,
  },
});

const Event = mongoose.model('Event', eventModel);

module.exports = Event;
