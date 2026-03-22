const express = require('express');
const router = express.Router();
const { getPotholes, getBridges, getWaterLeakage, getStreetlights, updateIssueStatus } = require('../controllers/dataController');
const { protect } = require('../middleware/auth');

router.get('/potholes', getPotholes);
router.get('/bridges', getBridges);
router.get('/waterleakage', getWaterLeakage);
router.get('/streetlights', getStreetlights);
router.patch('/status/:type/:id', protect, updateIssueStatus);

module.exports = router;
