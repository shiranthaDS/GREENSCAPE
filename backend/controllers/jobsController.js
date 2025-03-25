const Job = require("../models/job");

// Add a new job
exports.addJob = async (req, res) => {
  const { title, location, type, skills } = req.body;

  // Validate input
  if (!title || !location || !type || !skills) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newJob = new Job({ title, location, type, skills });

  try {
    await newJob.save();
    res.status(201).json({ message: "Job added successfully!", job: newJob });
  } catch (err) {
    console.error("Error adding job:", err);
    res.status(500).json({ error: "Failed to add job. Please try again." });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs. Please try again." });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, location, type, skills } = req.body;

  // Validate input
  if (!title || !location || !type || !skills) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { title, location, type, skills },
      { new: true, runValidators: true } // Return the updated document and validate data
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found." });
    }

    res.status(200).json({ message: "Job updated successfully!", job: updatedJob });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ error: "Failed to update job. Please try again." });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found." });
    }

    res.status(200).json({ message: "Job deleted successfully." });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ error: "Failed to delete job. Please try again." });
  }
};
