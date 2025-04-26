const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedbacks } = require('../controllers/feedbackController');

router.post('/createfeedback', createFeedback);
router.get('/feedbacks', getAllFeedbacks);

module.exports = router;
