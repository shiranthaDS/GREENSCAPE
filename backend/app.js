const express = require('express');
const app = express();
const cors = require('cors');
const controller = require('./controllers/feedbackController');

app.use(cors()); //cors origin unblocking(cross origine resoures sharing)

app.use(
    express.urlencoded({
        extended:true,
    })
);

app.use(express.json());


app.get('/feedbacks', (req,res) => {
    //get all Emps from controller
    controller.getFeedback((req,res,next) => {
        res.send(); // send to response and return
    });
});

app.post('/createfeedback', (req,res) => {
    controller.addFeedback(req.body,(callback) => {
        res.send();
    });
});

app.post('/updatefeedback', (req,res) => {
    controller.updateFeedback(req.body,(callback) => {
        res.send(callback);//pass the callback for know to data passed
    });
});

app.post('/deletefeedback', (req,res) => {
    controller.deleteFeedback(req.body,(callback) => {
        res.send(callback);//pass the callback for know to data passed
    });
});

module.exports = app;