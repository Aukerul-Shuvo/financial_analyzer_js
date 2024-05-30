const express = require('express');
const analysisController = require('../controllers/analysisController');

const router = express.Router();

router.get('/compare_last_three_analyses', analysisController.compareLastThreeAnalyses);

module.exports = router;
