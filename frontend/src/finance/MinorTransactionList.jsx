import { useState, useEffect } from "react";
import axios from "axios";

const MinorTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    type: "",
    subtype: "",
    amount: "",
    description: "",
    payer_payee: "",
    method: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await axios.get("http://localhost:5000/api/minor-transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setServerError("Failed to load transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`http://localhost:5000/api/minor-transactions/${id}`);
        setTransactions(transactions.filter((tx) => tx._id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete transaction: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEdit = (tx) => {
    console.log("Transaction to edit:", tx);
    setEditingId(tx._id);
    
    // Safe handling of amount
    let amountValue;
    if (typeof tx.amount === 'string') {
      amountValue = tx.amount.startsWith('Rs. ') ? tx.amount.substring(4) : tx.amount;
    } else if (typeof tx.amount === 'number') {
      amountValue = tx.amount.toString();
    } else {
      amountValue = "";
    }
    
    // Format date correctly
    const formattedDate = formatDate(tx.date);
    
    // Set form data with properly formatted values
    setEditFormData({ 
      ...tx,
      date: formattedDate,
      amount: amountValue
    });
    
    console.log("Edit form data initialized:", { 
      ...tx, 
      date: formattedDate,
      amount: amountValue 
    });
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "date":
        if (!value) newErrors.date = "Date is required";
        else delete newErrors.date;
        break;
      case "type":
        if (!value || !value.trim()) newErrors.type = "Type is required";
        else delete newErrors.type;
        break;
      case "subtype":
        if (!value || !value.trim()) newErrors.subtype = "Subtype is required";
        else delete newErrors.subtype;
        break;
      case "amount":
        if (!value) newErrors.amount = "Amount is required";
        else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) 
          newErrors.amount = "Must be positive number";
        else delete newErrors.amount;
        break;
      case "description":
        if (!value || !value.trim()) newErrors.description = "Description is required";
        else delete newErrors.description;
        break;
      case "payer_payee":
        if (!value || !value.trim()) newErrors.payer_payee = "Payer/Payee is required";
        else delete newErrors.payer_payee;
        break;
      case "method":
        if (!value || !value.trim()) newErrors.method = "Method is required";
        else delete newErrors.method;
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for amount field
    if (name === "amount") {
      // Allow only numbers and one decimal point
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      // Ensure only two decimal places
      const decimalParts = sanitizedValue.split('.');
      if (decimalParts.length <= 1 || decimalParts[1].length <= 2) {
        setEditFormData({ ...editFormData, [name]: sanitizedValue });
      }
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
    
    validateField(name, value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    setServerError("");
    
    // Validate all required fields
    let isValid = true;
    
    // List of fields to validate
    const fieldsToValidate = ["date", "type", "subtype", "amount", "description", "payer_payee", "method"];
    
    fieldsToValidate.forEach(field => {
      const value = editFormData[field];
      if (!validateField(field, value)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      console.log("Form validation failed", errors);
      return;
    }

    try {
      // Try different formats for the backend
      
      // 1. First try: Format as expected by most APIs
      const dataToSend = {
        date: new Date(editFormData.date).toISOString().split('T')[0], // YYYY-MM-DD format
        type: editFormData.type,
        subtype: editFormData.subtype,
        amount: parseFloat(editFormData.amount), // Send as number
        description: editFormData.description,
        payer_payee: editFormData.payer_payee,
        method: editFormData.method
      };

      console.log("Sending update data:", dataToSend);
      console.log("To URL:", `http://localhost:5000/api/minor-transactions/${editingId}`);

      const response = await axios.put(
        `http://localhost:5000/api/minor-transactions/${editingId}`,
        dataToSend
      );
      
      console.log("Update response:", response.data);
      
      // Update the local state with the updated transaction
      if (response.data) {
        // Transform the data to match display format if needed
        const updatedTransaction = {
          ...response.data,
          amount: typeof response.data.amount === 'number' 
            ? `Rs. ${response.data.amount.toFixed(2)}`
            : response.data.amount
        };
        
        setTransactions(transactions.map((tx) => 
          tx._id === editingId ? updatedTransaction : tx
        ));
        
        setEditingId(null);
        setServerError("");
      }
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Response data:", err.response?.data);
      
      // Try alternative format if the first one failed
      if (err.response?.status === 500) {
        try {
          console.log("First attempt failed. Trying with string amount format...");
          
          // 2. Second try: Format amount as string with currency prefix
          const dataToSend = {
            date: editFormData.date, // Keep as is
            type: editFormData.type,
            subtype: editFormData.subtype,
            amount: `Rs. ${parseFloat(editFormData.amount).toFixed(2)}`, // Send as formatted string
            description: editFormData.description,
            payer_payee: editFormData.payer_payee,
            method: editFormData.method
          };
          
          console.log("Trying alternative format:", dataToSend);
          
          const response = await axios.put(
            `http://localhost:5000/api/minor-transactions/${editingId}`,
            dataToSend
          );
          
          console.log("Second attempt response:", response.data);
          
          if (response.data) {
            setTransactions(transactions.map((tx) => 
              tx._id === editingId ? response.data : tx
            ));
            setEditingId(null);
            setServerError("");
          }
        } catch (retryErr) {
          console.error("Second attempt error:", retryErr);
          setServerError("Failed to update transaction: " + 
            (retryErr.response?.data?.message || retryErr.message));
        }
      } else {
        setServerError("Failed to update transaction: " + 
          (err.response?.data?.message || err.message));
      }
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to format date by removing time portion
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      // Handle both date string formats (ISO format and YYYY-MM-DD)
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return as is if not a valid date
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (err) {
      console.error("Date formatting error:", err);
      return dateString; // Return original value on error
    }
  };

  // Display function for table cells
  const displayDate = (dateString) => {
    if (!dateString) return '';
    try {
      // For display in the table, just return the date part
      return dateString.split('T')[0];
    } catch (err) {
      return dateString; // Return as is on error
    }
  };

  return (
    <div className="transaction-container">
      <h2 className="section-title">Minor Transactions</h2>
      
      {serverError && (
        <div className="error-alert">
          {serverError}
          <button onClick={() => setServerError("")} className="close-btn">×</button>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="no-transactions">No transactions found</div>
      ) : (
        <div className="table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Subtype</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Payer/Payee</th>
                <th>Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className={tx.type === "Income" ? "income-row" : "expense-row"}>
                  <td>{displayDate(tx.date)}</td>
                  <td>{tx.type}</td>
                  <td>{tx.subtype}</td>
                  <td className="amount-cell">{tx.amount}</td>
                  <td>{tx.description}</td>
                  <td>{tx.payer_payee}</td>
                  <td>{tx.method}</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(tx)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(tx._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <div className="edit-form-container">
          <h3>Edit Transaction</h3>
          <form onSubmit={handleUpdate} className="edit-form">
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={editFormData.date || ""}
                onChange={handleChange}
                max={getTodayDate()}
                className={errors.date ? "error" : ""}
                required
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label>Type:</label>
              <select
                name="type"
                value={editFormData.type || ""}
                onChange={handleChange}
                className={errors.type ? "error" : ""}
                required
              >
                <option value="">Select Type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              {errors.type && <span className="error-message">{errors.type}</span>}
            </div>

            <div className="form-group">
              <label>Subtype:</label>
              <input
                type="text"
                name="subtype"
                value={editFormData.subtype || ""}
                onChange={handleChange}
                className={errors.subtype ? "error" : ""}
                required
              />
              {errors.subtype && <span className="error-message">{errors.subtype}</span>}
            </div>

            <div className="form-group">
              <label>Amount (Rs.):</label>
              <input
                type="text"
                name="amount"
                value={editFormData.amount || ""}
                onChange={handleChange}
                className={errors.amount ? "error" : ""}
                required
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={editFormData.description || ""}
                onChange={handleChange}
                className={errors.description ? "error" : ""}
                required
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label>Payer/Payee:</label>
              <input
                type="text"
                name="payer_payee"
                value={editFormData.payer_payee || ""}
                onChange={handleChange}
                className={errors.payer_payee ? "error" : ""}
                required
              />
              {errors.payer_payee && <span className="error-message">{errors.payer_payee}</span>}
            </div>

            <div className="form-group">
              <label>Method:</label>
              <select
                name="method"
                value={editFormData.method || ""}
                onChange={handleChange}
                className={errors.method ? "error" : ""}
                required
              >
                <option value="">Select Method</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Digital Payment">Digital Payment</option>
              </select>
              {errors.method && <span className="error-message">{errors.method}</span>}
            </div>

            <div className="form-actions">
              <button type="submit" className="update-btn">Update</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setErrors({});
                  setServerError("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .transaction-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-title {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .error-alert {
          background-color: #f8d7da;
          color: #721c24;
          padding: 12px 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #721c24;
        }
        
        .loading, .no-transactions {
          text-align: center;
          padding: 20px;
          font-size: 1.1rem;
          color: #666;
        }
        
        .table-container {
          overflow-x: auto;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        
        .transaction-table th {
          background-color: #2c3e50;
          color: white;
          padding: 12px 15px;
          text-align: left;
        }
        
        .transaction-table td {
          padding: 10px 15px;
          border-bottom: 1px solid #ddd;
        }
        
        .income-row {
          background-color: rgba(46, 204, 113, 0.05);
        }
        
        .expense-row {
          background-color: rgba(231, 76, 60, 0.05);
        }
        
        .amount-cell {
          font-weight: bold;
          color: #27ae60;
        }
        
        .expense-row .amount-cell {
          color: #e74c3c;
        }
        
        .actions-cell {
          display: flex;
          gap: 8px;
        }
        
        button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        
        .edit-btn {
          background-color: #3498db;
          color: white;
        }
        
        .delete-btn {
          background-color: #e74c3c;
          color: white;
        }
        
        .edit-btn:hover {
          background-color: #2980b9;
        }
        
        .delete-btn:hover {
          background-color: #c0392b;
        }
        
        .edit-form-container {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .edit-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #2c3e50;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .error {
          border-color: #e74c3c !important;
        }
        
        .error-message {
          color: #e74c3c;
          font-size: 0.8rem;
          margin-top: 5px;
          display: block;
        }
        
        .form-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 10px;
        }
        
        .update-btn {
          background-color: #2ecc71;
          color: white;
          padding: 8px 20px;
        }
        
        .cancel-btn {
          background-color: #95a5a6;
          color: white;
          padding: 8px 20px;
        }
        
        .update-btn:hover {
          background-color: #27ae60;
        }
        
        .cancel-btn:hover {
          background-color: #7f8c8d;
        }
        
        @media (max-width: 768px) {
          .edit-form {
            grid-template-columns: 1fr;
          }
          
          .transaction-table {
            font-size: 0.8rem;
          }
          
          .transaction-table th,
          .transaction-table td {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default MinorTransactionList;