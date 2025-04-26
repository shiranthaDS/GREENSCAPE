const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  employeeId:{
    type: String,
    required: true,
  },
  ename:{
    type:String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  role:{
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  projectLocation: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  progress: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
