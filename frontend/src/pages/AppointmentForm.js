import { useState } from "react";


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
    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Appointment booked successfully!");
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
        alert("Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border rounded" required />
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" required />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" required />
        <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select a Service</option>
          {serviceOptions.map((service, index) => (
            <option key={index} value={service}>
              {service}
            </option>
          ))}
        </select>
        <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} placeholder="Additional Information" className="w-full p-2 border rounded"></textarea>
        <div className="flex items-center">
          <input type="checkbox" name="receiveUpdates" checked={formData.receiveUpdates} onChange={handleChange} className="mr-2" />
          <label>Click here & Submit to receive updates & offers</label>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
