const JobApplication = require("../models/jobApplication");

// Create a new job application
const addJobApplication = async (req, res) => {
  const { name, email, address, nic, tel, job } = req.body;
  const resume = req.file ? req.file.filename : null;

  const newJobApplication = new JobApplication({
    name,
    email,
    address,
    nic,
    tel,
    job,
    resume,
  });

  try {
    await newJobApplication.save();
    res.json("Job application added!");

    // Send email
    const subject = "Application Received - Thank You!";
    const text = `
      Dear ${name},

      Thank you for applying for the job: ${job}. We have received your application successfully.

      Here are your application details:
      - Name: ${name}
      - Email: ${email}
      - Address: ${address}
      - NIC: ${nic}
      - Telephone: ${tel}
      - Job Applied: ${job}

      We will get back to you soon.

      Best regards,
      The Team
    `;

    req.app.locals.sendEmail(email, subject, text);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
};

// Get all job applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await JobApplication.findByIdAndUpdate(id, { status }, { new: true });

    const subject = `Your application status has been updated`;
    const text = `Dear ${application.name},\n\nYour application status has been updated to: ${status}.`;
    req.app.locals.sendEmail(application.email, subject, text);

    res.json(application);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  const { id } = req.params;
  try {
    await JobApplication.findByIdAndDelete(id);
    res.json("Job application deleted.");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addJobApplication,
  getAllApplications,
  updateStatus,
  deleteApplication,
};
