const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Event = require('../models/eventModel');
const EventAsset = require('../models/eventAssetModel');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/events');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});


const upload = multer({ storage });

exports.uploadMiddleware = upload.array('files', 10); 

exports.createEvent = async (req, res) => {
  const { event_name, event_date, description, status, tags } = req.body;
  
  try {
    
    const event = new Event({
      event_name,
      event_date,
      description,
      status
    });
    await event.save();
    
    
    if (req.files && req.files.length > 0) {
      const assetDocs = req.files.map(file => ({
        event_id: event._id,
        path: file.path,
        filename: file.filename,
        type: file.mimetype,
        tags: tags ? JSON.parse(tags) : []
      }));
      
      await EventAsset.insertMany(assetDocs);
    }
    
    
    if (req.body.assets && req.body.assets.length > 0) {
      let additionalAssets;
      
      
      if (typeof req.body.assets === 'string') {
        additionalAssets = JSON.parse(req.body.assets);
      } else {
        additionalAssets = req.body.assets;
      }
      
      const assetDocs = additionalAssets.map(asset => ({
        ...asset,
        event_id: event._id
      }));
      
      await EventAsset.insertMany(assetDocs);
    }
    
    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (err) {
    
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    res.status(400).json({
      message: 'Error creating event',
      error: err.message
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().lean();
    
    for (let event of events) {
      event.assets = await EventAsset.find({ event_id: event._id });
    }
    
    res.status(200).json(events);
  } catch (err) {
    res.status(400).json({
      message: 'Error fetching events',
      error: err.message
    });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const event = await Event.findById(id);
    
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    const assets = await EventAsset.find({ event_id: id });
    
    res.status(200).json({
      ...event.toObject(),
      assets
    });
  } catch (err) {
    res.status(400).json({
      message: 'Error fetching event',
      error: err.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { event_name, event_date, description, status, tags } = req.body;
  
  try {
    const event = await Event.findByIdAndUpdate(
      id,
      { event_name, event_date, description, status },
      { new: true }
    );
    
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    
    if (req.files && req.files.length > 0) {
      const assetDocs = req.files.map(file => ({
        event_id: id,
        path: file.path,
        filename: file.filename,
        type: file.mimetype,
        tags: tags ? JSON.parse(tags) : []
      }));
      
      await EventAsset.insertMany(assetDocs);
    }
    
    
    if (req.body.assets) {
      let assets;
      
      
      if (typeof req.body.assets === 'string') {
        assets = JSON.parse(req.body.assets);
      } else {
        assets = req.body.assets;
      }
      
      if (req.body.replaceAllAssets === 'true' || req.body.replaceAllAssets === true) {
        
        const existingAssets = await EventAsset.find({ event_id: id });
        
        // Delete physical files
        for (const asset of existingAssets) {
          fs.unlink(asset.path, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        }
        
        
        await EventAsset.deleteMany({ event_id: id });
      }
      
      if (assets && assets.length > 0) {
        const assetDocs = assets.map(asset => ({
          ...asset,
          event_id: id
        }));
        
        await EventAsset.insertMany(assetDocs);
      }
    }
    
    res.status(200).json({
      message: 'Event updated successfully',
      event
    });
  } catch (err) {
    
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    res.status(400).json({
      message: 'Error updating event',
      error: err.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  
  try {
    const event = await Event.findByIdAndDelete(id);
    
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    
    const assets = await EventAsset.find({ event_id: id });
    
    
    for (const asset of assets) {
      fs.unlink(asset.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    
    await EventAsset.deleteMany({ event_id: id });
    
    res.status(200).json({ message: 'Event and associated assets deleted successfully' });
  } catch (err) {
    res.status(400).json({
      message: 'Error deleting event',
      error: err.message
    });
  }
};

exports.getAssetsByEventId = async (req, res) => {
  const { event_id } = req.params;
  
  try {
    const assets = await EventAsset.find({ event_id });
    res.status(200).json(assets);
  } catch (err) {
    res.status(400).json({
      message: 'Error fetching assets',
      error: err.message
    });
  }
};


exports.deleteAsset = async (req, res) => {
  const { assetId } = req.params;
  
  try {
    const asset = await EventAsset.findByIdAndDelete(assetId);
    
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    
    
    fs.unlink(asset.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
    
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(400).json({
      message: 'Error deleting asset',
      error: err.message
    });
  }
};