const express = require('express');
const router = express.Router();
const streetlightController = require('../controllers/streetlightController');
const { protect } = require('../middleware/auth');

router.post('/streetlight-data', streetlightController.receiveData);
router.post('/toggle-relay', protect, streetlightController.toggleRelay);
router.get('/latest', streetlightController.getLatestStatus);
router.get('/history/:id', streetlightController.getHistory);

module.exports = router;
