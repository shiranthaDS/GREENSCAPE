const { response } = require("../app");
const Feedback = require('../models/Feedback');

// Get all feedbacks
const getFeedback = (req, res, next) => {
    Feedback.find()
        .then(feedbacks => {
            res.json({ feedbacks });
        })
        .catch(error => {
            res.json({ error });
        });
};

// Add feedback
const addFeedback = (req, res, next) => {
    const { employeeName, employeeEmail, department, rating, feedback } = req.body;

    if (!employeeName || !employeeEmail || !department || rating === undefined || !feedback) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const newFeedback = new Feedback({
        employeeName,
        employeeEmail,
        department,
        rating,
        feedback,
    });

    newFeedback.save()
        .then(savedFeedback => {
            res.status(201).json({ message: 'Feedback submitted successfully.', feedback: savedFeedback });
        })
        .catch(error => {
            console.error('Error saving feedback:', error);
            res.status(500).json({ error: 'There was an error submitting your feedback. Please try again.' });
        });
};


// Update feedback
const updateFeedback = (req, res, next) => {
    const { id, employeeName, employeeEmail, department, rating, feedback } = req.body;
    Feedback.findByIdAndUpdate(id, { 
        employeeName, 
        employeeEmail, 
        department, 
        rating, 
        feedback 
    }, { new: true })
        .then(updatedFeedback => {
            res.json({ updatedFeedback });
        })
        .catch(error => {
            res.json({ error });
        });
};

// Delete feedback
const deleteFeedback = (req, res, next) => {
    const { id } = req.body;
    Feedback.findByIdAndDelete(id)
        .then(deletedFeedback => {
            res.json({ deletedFeedback });
        })
        .catch(error => {
            res.json({ error });
        });
};

exports.getFeedback = getFeedback;
exports.addFeedback = addFeedback;
exports.updateFeedback = updateFeedback;
exports.deleteFeedback = deleteFeedback;
