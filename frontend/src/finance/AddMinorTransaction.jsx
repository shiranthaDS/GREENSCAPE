import { useState } from "react";
import axios from "axios";

const AddMinorTransaction = () => {
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    subtype: "",
    amount: "",
    description: "",
    payer_payee: "",
    method: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any API errors when user edits the form
    if (apiError) setApiError("");
    
    // Special handling for amount field
    if (name === "amount") {
      // Allow only numbers and one decimal point
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      // Ensure only two decimal places
      const decimalParts = sanitizedValue.split('.');
      if (decimalParts.length > 1 && decimalParts[1].length > 2) {
        return; // Don't update if more than 2 decimal places
      }
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Validate the field
    validateField(name, value);
  };

  // Field validation
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    delete newErrors[name]; // Clear previous error for this field

    if (!value || (typeof value === 'string' && !value.trim())) {
      newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === "amount" && (isNaN(value) || parseFloat(value) <= 0)) {
      newErrors.amount = "Amount must be greater than zero";
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError("");

    // Validate all fields
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
    });

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Format the transaction data
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount).toFixed(2) // Ensure 2 decimal places
      };

      console.log("Submitting transaction:", transactionData); // Debug log

      const response = await axios.post(
        "http://localhost:5000/api/minor-transactions/add",
        transactionData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("API Response:", response.data); // Debug log

      if (response.data.success) {
        alert("Transaction Added Successfully");
        setFormData({
          date: "",
          type: "",
          subtype: "",
          amount: "",
          description: "",
          payer_payee: "",
          method: ""
        });
      } else {
        throw new Error(response.data.message || "Failed to add transaction");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setApiError(error.response?.data?.message || "Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add Minor Transaction</h2>
      
      {apiError && (
        <div style={{ 
          color: "red", 
          backgroundColor: "#ffebee",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "20px",
          border: "1px solid #ef9a9a"
        }}>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={getTodayDate()}
            style={{ 
              width: "100%", 
              padding: "8px",
              border: errors.date ? "1px solid red" : "1px solid #ddd"
            }}
            required
          />
          {errors.date && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.date}</span>}
        </div>

        <div>
          <label>Type (Income/Expense):</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{ 
              width: "100%", 
              padding: "8px",
              border: errors.type ? "1px solid red" : "1px solid #ddd"
            }}
            required
          >
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          {errors.type && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.type}</span>}
        </div>

        <div>
          <label>Subtype:</label>
          <input
            type="text"
            name="subtype"
            value={formData.subtype}
            onChange={handleChange}
            placeholder="e.g., Salary, Rent, etc."
            style={{ 
              width: "100%", 
              padding: "8px",
              border: errors.subtype ? "1px solid red" : "1px solid #ddd"
            }}
            required
          />
          {errors.subtype && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.subtype}</span>}
        </div>

        <div>
          <label>Amount (Rs.):</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g., 5000.00"
            style={{ 
              width: "100%", 
              padding: "8px",
              border: errors.amount ? "1px solid red" : "1px solid #ddd"
            }}
            required
          />
          {errors.amount && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.amount}</span>}
        </div>

        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Transaction description"
            style={{ 
              width: "100%", 
              padding: "8px",
              border: errors.description ? "1px solid red" : "1px solid #ddd"
            }}
            required
          />
          {errors.description && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.description}</span>}
        </div>

        <div>
          <label>Payer/Payee:</label>
          <input
            type="text"
            name="payer_payee"
            value={formData.payer_payee}
            onChange={handleChange}
            placeholder="Person or organization"
            style={{ 
              width: "100%", 
              padding: "8px",
              border: errors.payer_payee ? "1px solid red" : "1px solid #ddd"
            }}
            required
          />
          {errors.payer_payee && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.payer_payee}</span>}
        </div>

        <div>
          <label>Payment Method:</label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            style={{ 
              width: "100%", 
              padding: "8px",
              border: errors.method ? "1px solid red" : "1px solid #ddd"
            }}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Digital Payment">Digital Payment</option>
          </select>
          {errors.method && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.method}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px",
            backgroundColor: isSubmitting ? "#cccccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "1rem"
          }}
        >
          {isSubmitting ? "Processing..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default AddMinorTransaction;