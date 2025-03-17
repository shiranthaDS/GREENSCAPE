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

  const serviceOptions = ["Lawn Care", "Tree Trimming", "Garden Design", "Irrigation Installation"];

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
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
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

      {/* CSS for Spinner */}
      <style jsx>{`
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

        button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 100%;
          background-color: #28a745;
          color: white;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: 0.3s;
        }

        button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AppointmentForm;
