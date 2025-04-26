import { useState } from "react";
import Swal from "sweetalert2";

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    serviceType: "",
    additionalInfo: "",
    receiveUpdates: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const serviceOptions = ["Landscaping", "Garden Design", "Interlock Paving", "Irrigation Systems", "Green Walls", "Lawn Care", "Waterfalls and Ponds", "Trimming and sizing plants", "Flower and Plant services"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Appointment Booked!",
          text: "Your appointment has been successfully booked.",
          confirmButtonColor: "#28a745",
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          serviceType: "",
          additionalInfo: "",
          receiveUpdates: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: "There was an issue booking your appointment. Please try again.",
          confirmButtonColor: "#dc3545",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please check your connection and try again.",
        confirmButtonColor: "#dc3545",
      });
    }

    setIsLoading(false); // Stop loading
  };

  return (
    <div className="container">
      <div className="grid-container">
        {/* Promotional Box */}
        <div className="promotional-box">
          <h1>Garden Maintenance Services</h1>
          <p className="offer">Get <strong>Free!</strong></p>
          <p className="subtext">This offer valid only for your first order.</p>
          <button className="cta-button">GET IT NOW</button>
        </div>

        {/* Appointment Form */}
        <div className="form-container">
          
          <h3>Make an Appointment</h3>
         <h2>Request for Project Consultation</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" pattern="^[a-zA-Z\s]+$"
          title="Name should only contain letters." required />

            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />

            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number (e.g., +94712345678)"  pattern="^\+94[0-9]{9}$"
               title="Phone number must be in the format +94XXXXXXXXX (e.g., +94712345678)." required />

            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address"  required />

            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" pattern="^[a-zA-Z\s]+$"
               title="City should only contain letters." required />
            
            <select name="serviceType" value={formData.serviceType} onChange={handleChange} required>
              <option value="">Select a Service</option>
              {serviceOptions.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} placeholder="Additional Information"></textarea>
            <div className="checkbox-container">
              <input type="checkbox" name="receiveUpdates" checked={formData.receiveUpdates} onChange={handleChange} />
              <label>Click here & Submit to receive updates & offers</label>
            </div>

            {/* Button with Loading Spinner */}
            <button type="submit" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {/* CSS for Layout and Styling */}
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color:rgba(10, 0, 0, 0.27);
          padding: 20px;
          transform: scale(0.9);
        }

        .grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          max-width: 1200px;
          min-height: 600px;
          width: 100%;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;
         trasform: scale(0.9);
        }

        .promotional-box {
          background-image: url('/imges/pr.jpg'); /* Add your image path here */
          background-size: cover;
          background-position: center;
          color: white;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .promotional-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5); /* Dark overlay */
          z-index: 1;
        }

        .promotional-box h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }

        .promotional-box .offer {
          font-size: 2rem;
          margin-bottom: 10px;
          position: relative;
          z-index: 2;
        }

        .promotional-box .subtext {
          font-size: 1rem;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }

        .promotional-box .cta-button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 5px;
          transition: 0.3s;
          position: relative;
          z-index: 2;
        }

        .promotional-box .cta-button:hover {
          background-color: #218838;
        }
        .promotional-box h1 {
          color:rgb(254, 255, 254);
        }
        .form-container {
          padding: 40px;
          background-color: white;
        }

        .form-container h2 {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .form-container input,
        .form-container select,
        .form-container textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
        }

        .form-container textarea {
          resize: vertical;
          height: 100px;
        }

        .checkbox-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Aligns checkbox and text to the left */
  font-size: 0.9rem; /* Slightly smaller text */
  margin-bottom: 15px;
}

.checkbox-container input {
  margin-right: 10px;
  width: 16px;
  height: 16px; /* Adjust checkbox size */
}
        .form-container button {
          width: 100%;
          padding: 10px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.3s;
        }

        .form-container button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s infinite linear;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr;
          }

          .promotional-box {
            padding: 20px;
          }

          .form-container {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AppointmentForm;