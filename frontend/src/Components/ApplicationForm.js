import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowRight, FaArrowLeft, FaEnvelope } from "react-icons/fa";
import "./ApplicationForm.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const ApplicationForm = () => {
  const { jobId } = useParams();
  const [jobTitle, setJobTitle] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    nic: "",
    tel: "+94",
    job: jobId || "",
  });
  const [errors, setErrors] = useState({});
  const [resume, setResume] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
        setJobTitle(response.data.title);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  // Validation functions
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!/^[A-Za-z. ]*$/.test(value)) {
          error = "Name can only contain letters, spaces, and periods";
        }
        break;
      case "nic":
        if (!/^[0-9]{0,12}$/.test(value) && !/^[0-9]{9}[Vv]?$/.test(value)) {
          error = "NIC must be 12 digits or 9 digits followed by V";
        }
        break;
      case "tel":
        if (!/^\+94[0-9]{9}$/.test(value)) {
          error = "Phone must start with +94 and have 9 digits";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value) {
          error = "Please enter a valid email address";
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number handling - only allow numbers after +94
    if (name === "tel") {
      // Remove any non-digit characters
      const cleanedValue = value.replace(/[^0-9+]/g, '');
      
      // Ensure it starts with +94
      if (!cleanedValue.startsWith("+94")) {
        setForm(prev => ({ ...prev, [name]: "+94" }));
        return;
      }
      
      // Limit to 12 characters (+94 + 9 digits)
      if (cleanedValue.length <= 12) {
        setForm(prev => ({ ...prev, [name]: cleanedValue }));
        validateField(name, cleanedValue);
      }
      return;
    }

    // NIC handling
    if (name === "nic") {
      // Convert to uppercase for V
      const upperValue = value.toUpperCase();
      
      // Old NIC format (9 digits + V)
      if (upperValue.length <= 9) {
        // Only allow digits
        if (/^[0-9]*$/.test(upperValue)) {
          setForm(prev => ({ ...prev, [name]: upperValue }));
          validateField(name, upperValue);
        }
      } 
      // When reaching 9 digits, allow V
      else if (upperValue.length === 10 && /^[0-9]{9}[V]?$/.test(upperValue)) {
        setForm(prev => ({ ...prev, [name]: upperValue }));
        validateField(name, upperValue);
      }
      // New NIC format (12 digits)
      else if (upperValue.length <= 12 && /^[0-9]*$/.test(upperValue)) {
        setForm(prev => ({ ...prev, [name]: upperValue }));
        validateField(name, upperValue);
      }
      return;
    }

    // Name handling - only allow letters, spaces and periods
    if (name === "name") {
      if (/^[A-Za-z. ]*$/.test(value)) {
        setForm(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
      }
      return;
    }

    // Default handling for other fields
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResume(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isValid = Object.keys(form).every(key => validateField(key, form[key]));
    
    if (!isValid) {
      Swal.fire({
        title: "Validation Error",
        text: "Please correct the errors in the form",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (resume) formData.append("resume", resume);
  
    try {
      await axios.post("http://localhost:5000/api/jobApplications/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      Swal.fire({
        title: "Application Submitted!",
        text: "Your application has been submitted successfully. We will contact you soon.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
        html: `
        <p>Your application has been submitted. You can generate a report if needed.</p>
        <button class="generate-report-btn">Download Application</button>
        `,
        didOpen: () => {
          const generateReportBtn = document.querySelector(".generate-report-btn");
          generateReportBtn.addEventListener("click", () => {
            generateReport();
          });
        },
      }).then(() => {
        navigate("/");
      });
  
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
  
      Swal.fire({
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
        confirmButtonColor: "#d33",
      });
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
  
    // Add Company Logo
    const logoUrl = "/image/logo.jpeg"; // Ensure the logo is in the public folder
    doc.addImage(logoUrl, "JPEG", 15, 10, 35, 20); // X, Y, Width, Height
    
    // === Company Header Section ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Greenscape (Pvt) Ltd", 60, 15); // Company Name
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("No 10, New Plaza Road, Mababe, Sri Lanka", 60, 22); // Address
    doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 28); // Contact
  
    // === Line Separator ===
    doc.setDrawColor(70, 130, 180); // Steel blue
    doc.setLineWidth(1);
    doc.line(20, 35, 190, 35); // Horizontal line below header
  
    // === Report Title and Date ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(33, 33, 33);
    doc.text("Job Application Report", 20, 45);
  
    const currentDate = new Date().toLocaleDateString();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Date: ${currentDate}`, 150, 45);
    doc.text(`Job Title: ${jobTitle || form.job}`, 20, 52);
  
    // === Applicant Info Header ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.text("Applicant Details", 20, 65);
  
    // === Draw Box for Details ===
    doc.setDrawColor(200, 200, 200);
    doc.rect(18, 70, 175, 80, "S");
  
    // === Applicant Details ===
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(33, 33, 33);
  
    const info = [
      { label: "Full Name", value: form.name },
      { label: "Email Address", value: form.email },
      { label: "Address", value: form.address },
      { label: "NIC", value: form.nic },
      { label: "Telephone", value: form.tel },
    ];
  
    let y = 80;
    info.forEach(({ label, value }) => {
      doc.text(`${label}:`, 25, y);
      doc.text(value, 75, y);
      y += 15;
    });
  
    // === Footer Message ===
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(
      "Thank you for applying. We will review your application and get back to you soon.",
      20,
      160
    );
  
    // === Footer Line + Signature/Brand Note ===
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(20, 270, 190, 270);
  
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Generated by Greenscape HR • Confidential", 20, 277);
  
    // === Save PDF ===
    doc.save(`Application_Report_${form.name}.pdf`);
  };
  

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1 && !validateField("email", form.email)) return;
    if (step === 2 && (!validateField("name", form.name) || 
                       !validateField("address", form.address) || 
                       !validateField("nic", form.nic) || 
                       !validateField("tel", form.tel))) return;
    
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const backgroundStyle = {
    backgroundImage: `url("/image/house.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={backgroundStyle}>
      <div className="application-form">
        <div className="header">
          <h1>Apply for {form.job || jobTitle}</h1>
          <p>Follow the steps to submit your application.</p>
        </div>

        <div className="steps">
          <span className={step === 1 ? "active" : ""}>1. Email</span>
          <span className={step === 2 ? "active" : ""}>2. Personal Info</span>
          <span className={step === 3 ? "active" : ""}>3. Resume</span>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <label>
                <FaEnvelope className="icon" /> Email:
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => validateField("email", form.email)}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </label>
              <div className="form-buttons">
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => validateField("name", form.name)}
                  placeholder="Enter your full name"
                  required
                  maxLength={50}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                />
              </label>
              <label>
                NIC:
                <input
                  type="text"
                  name="nic"
                  value={form.nic}
                  onChange={handleChange}
                  onBlur={() => validateField("nic", form.nic)}
                  placeholder="Enter your NIC (12 digits or 9 digits + V)"
                  required
                  maxLength={12}
                />
                {errors.nic && <span className="error">{errors.nic}</span>}
              </label>
              <label>
                Telephone:
                <input
                  type="tel"
                  name="tel"
                  value={form.tel}
                  onChange={handleChange}
                  onBlur={() => validateField("tel", form.tel)}
                  placeholder="Enter your phone number (+94XXXXXXXXX)"
                  required
                  maxLength={12}
                />
                {errors.tel && <span className="error">{errors.tel}</span>}
              </label>
              <div className="form-buttons">
                <button type="button" className="back-btn" onClick={prevStep}>
                  <FaArrowLeft /> Back
                </button>
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <div
                className={`drop-area ${resume ? "file-selected" : ""}`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {!resume && (
                  <>
                    <img
                      src="https://img.icons8.com/?size=100&id=L0C1lduQPpPX&format=png&color=000000"
                      alt="upload"
                    />
                    <p>Drag and drop your resume here or click to upload</p>
                    <label className="upload-btn">
                      <span className="icon">Upload</span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        required
                        style={{ display: "none" }}
                      />
                    </label>
                  </>
                )}
                {resume && (
                  <div className="file-preview">
                    <p>
                      <strong>Selected File:</strong> {resume.name}
                    </p>
                    <button onClick={() => setResume(null)} className="clear-btn">
                      Clear
                    </button>
                  </div>
                )}
              </div>
              <div className="form-buttons">
                <button type="button" className="back-btn" onClick={prevStep}>
                  <FaArrowLeft /> Back
                </button>
                <button type="submit" className="submit-btn">
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;