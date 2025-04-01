const path = require('path');
const fs = require('fs');
const EventAsset = require('../models/eventAssetModel');

const eventAssetController = {
  // Serve a file directly by asset ID
  getFileById: async (req, res) => {
    try {
      const asset = await EventAsset.findById(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: 'File not found' });
      }

      if (!fs.existsSync(asset.path)) {
        return res.status(404).json({ message: 'File not found on disk' });
      }

      const disposition = req.query.download === 'true' ? 'attachment' : 'inline';
      res.setHeader('Content-Disposition', `${disposition}; filename="${asset.filename}"`);
      res.setHeader('Content-Type', asset.type || 'application/octet-stream');

      const fileStream = fs.createReadStream(asset.path);
      fileStream.pipe(res);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving file', error: err.message });
    }
  },

  // Serve static files from upload directory
  getStaticFile: (req, res) => {
    const filePath = path.join(__dirname, '..', 'uploads', req.params.folder, req.params.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = getContentType(ext);
    
    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
  },

  // Get all files across all events
  getAllFiles: async (req, res) => {
    try {
      const files = await EventAsset.find()
        .populate('event_id', 'event_name event_date')
        .sort({ createdAt: -1 });
      
      res.status(200).json(files);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving files', error: err.message });
    }
  },

  // Get files by type
  getFilesByType: async (req, res) => {
    try {
      const typePattern = new RegExp(req.params.type, 'i');
      const files = await EventAsset.find({ type: { $regex: typePattern } })
        .populate('event_id', 'event_name event_date')
        .sort({ createdAt: -1 });
      
      res.status(200).json(files);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving files', error: err.message });
    }
  },

  // Get files by tag
  getFilesByTag: async (req, res) => {
    try {
      const files = await EventAsset.find({ tags: req.params.tag })
        .populate('event_id', 'event_name event_date')
        .sort({ createdAt: -1 });
      
      res.status(200).json(files);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving files', error: err.message });
    }
  }
};

// Helper function to determine content type
function getContentType(extension) {
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed'
  };
  
  return contentTypes[extension] || 'application/octet-stream';
}

module.exports = eventAssetController;