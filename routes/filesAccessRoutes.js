const express = require('express');
const router = express.Router();
const eventAssetController = require('../controllers/fileAccessController');


const validateObjectId = (req, res, next) => {
  const mongoose = require('mongoose');
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};


router.get('/asset/:id', validateObjectId, eventAssetController.getFileById);
router.get('/uploads/:folder/:filename', eventAssetController.getStaticFile);
router.get('/', eventAssetController.getAllFiles);
router.get('/type/:type', eventAssetController.getFilesByType);
router.get('/tag/:tag', eventAssetController.getFilesByTag);

module.exports = router;