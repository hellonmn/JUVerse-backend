const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');


router.post('/', eventController.uploadMiddleware, eventController.createEvent);


router.put('/:id', eventController.uploadMiddleware, eventController.updateEvent);


router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.delete('/:id', eventController.deleteEvent);
router.get('/:event_id/assets', eventController.getAssetsByEventId);
router.delete('/assets/:assetId', eventController.deleteAsset);

module.exports = router;