const express = require('express');
const router = express.Router();
const { getPotholes, getBridges, getWaterLeakage, getStreetlights, updateIssueStatus } = require('../controllers/dataController');

router.get('/potholes', getPotholes);
router.get('/bridges', getBridges);
router.get('/waterleakage', getWaterLeakage);
router.get('/streetlights', getStreetlights);
router.patch('/status/:type/:id', updateIssueStatus);

module.exports = router;
