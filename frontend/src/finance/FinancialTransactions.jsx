import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./FinancialTransactions.css";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
const API_URL = "http://localhost:5000/api/transactions";

const FinancialTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    type: "Income",
    subtype: "",
    amount: "",
    description: "",
    payer_payee: "",
    method: "Cash",
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchDate, setSearchDate] = useState("");

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL);
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions by date
  useEffect(() => {
    if (searchDate) {
      const filtered = transactions.filter(transaction => 
        transaction.date.includes(searchDate)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [searchDate, transactions]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "amount") {
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      const decimalParts = sanitizedValue.split('.');
      if (decimalParts.length > 1 && decimalParts[1].length > 2) {
        return;
      }
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    validateField(name, value);
  };

  // Handle search date change
  const handleSearchDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchDate("");
  };

  // Validation function
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "date":
        if (!value) {
          newErrors.date = "Date is required";
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const inputDate = new Date(value);
          
          if (inputDate > today) {
            newErrors.date = "Future dates are not allowed";
          } else {
            delete newErrors.date;
          }
        }
        break;
      
      case "subtype":
        if (!value.trim()) {
          newErrors.subtype = "Subtype is required";
        } else if (value.trim().length > 50) {
          newErrors.subtype = "Subtype must be less than 50 characters";
        } else if (!/^[a-zA-Z\s\-]+$/.test(value.trim())) {
          newErrors.subtype = "Subtype contains invalid characters";
        } else {
          delete newErrors.subtype;
        }
        break;
      
      case "amount":
        if (!value) {
          newErrors.amount = "Amount is required";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          newErrors.amount = "Amount must be a number greater than zero";
        } else if (value.length > 15) {
          newErrors.amount = "Amount is too large";
        } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          newErrors.amount = "Maximum 2 decimal places allowed";
        } else if (parseFloat(value) > 10000000) {
          newErrors.amount = "Amount exceeds maximum limit";
        } else {
          delete newErrors.amount;
        }
        break;
      
      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.trim().length > 200) {
          newErrors.description = "Description must be less than 200 characters";
        } else {
          delete newErrors.description;
        }
        break;
      
      case "payer_payee":
        if (!value.trim()) {
          newErrors.payer_payee = "Payer/Payee is required";
        } else if (value.trim().length > 100) {
          newErrors.payer_payee = "Payer/Payee must be less than 100 characters";
        } else if (!/^[a-zA-Z\s\-,.]+$/.test(value.trim())) {
          newErrors.payer_payee = "Contains invalid characters";
        } else {
          delete newErrors.payer_payee;
        }
        break;
      
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const fieldsToValidate = ["date", "subtype", "amount", "description", "payer_payee"];
    fieldsToValidate.forEach(field => {
      validateField(field, formData[field]);
    });
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchTransactions();
      setFormData({
        date: "",
        type: "Income",
        subtype: "",
        amount: "",
        description: "",
        payer_payee: "",
        method: "Cash",
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setFormData(transaction);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();

    const logoUrl = '/image/logo.jpeg';
    const img = new Image();
    img.src = logoUrl;

    doc.addImage(img, 'JPEG', 10, 10, 50, 30);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Greenscape (Pvt) Ltd", 60, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("No 10, New plaza road, Malabe, Sri Lanka", 60, 28);
    doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 34);

    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Financial Transactions Report", 60, 50);

    const tableData = filteredTransactions.map(transaction => [
      transaction.date.split('T')[0],
      transaction.type,
      transaction.subtype,
      `$${parseFloat(transaction.amount).toFixed(2)}`,
      transaction.description,
      transaction.payer_payee,
      transaction.method
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Date', 'Type', 'Subtype', 'Amount', 'Description', 'Payer/Payee', 'Method']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [40, 167, 69],
        textColor: [255, 255, 255]
      }
    });

    const tableHeight = filteredTransactions.length * 10;
    const dateY = 55 + tableHeight + 20;
    const signatureY = dateY + 10;

    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Date: ${currentDate}`, 20, dateY);

    doc.text("Authorized Signature: ________", 20, signatureY);

    doc.save('financial_transactions_report.pdf');
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="financial-transactions-container">
      <h2 className="page-title">Financial Transactions</h2>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row">
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
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
              value={formData.type} 
              onChange={handleChange}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label>Subtype:</label>
            <input 
              type="text" 
              name="subtype" 
              placeholder="Subtype" 
              value={formData.subtype} 
              onChange={handleChange} 
              className={errors.subtype ? "error" : ""}
              required 
            />
            {errors.subtype && <span className="error-message">{errors.subtype}</span>}
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input 
              type="text" 
              name="amount" 
              placeholder="0.00" 
              value={formData.amount} 
              onChange={handleChange} 
              className={errors.amount ? "error" : ""}
              required 
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Description:</label>
            <input 
              type="text" 
              name="description" 
              placeholder="Description" 
              value={formData.description} 
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
              placeholder="Payer/Payee" 
              value={formData.payer_payee} 
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
              value={formData.method} 
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="Digital Payment">Digital Payment</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`submit-btn ${editingId ? "update" : "add"}`}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : editingId ? (
            "Update Transaction"
          ) : (
            "Add Transaction"
          )}
        </button>
      </form>

      <div className="transactions-section">
        <div className="section-header">
          <h3>Transaction Records</h3>
          <div className="search-container">
            <input
              type="date"
              value={searchDate}
              onChange={handleSearchDateChange}
              placeholder="Search by date..."
              className="search-input"
            />
            {searchDate && (
              <button onClick={clearSearch} className="clear-search-btn">
                <i className="fas fa-times"></i> Clear
              </button>
            )}
            <button 
              onClick={generatePDFReport}
              disabled={filteredTransactions.length === 0}
              className="pdf-btn"
            >
              <i className="fas fa-file-pdf"></i> Generate PDF
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-file-invoice-dollar"></i>
            <p>
              {searchDate 
                ? "No transactions found for the selected date." 
                : "No transactions available. Add your first transaction above."}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="transactions-table">
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.date.split('T')[0]}</td>
                    <td className={`type-${transaction.type.toLowerCase()}`}>
                      {transaction.type}
                    </td>
                    <td>{transaction.subtype}</td>
                    <td>${parseFloat(transaction.amount).toFixed(2)}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.payer_payee}</td>
                    <td>{transaction.method}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(transaction)}
                        className="edit-btn"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(transaction._id)}
                        className="delete-btn"
                      >
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialTransactions;