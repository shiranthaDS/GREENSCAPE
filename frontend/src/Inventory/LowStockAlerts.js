import React, { useEffect, useState } from 'react';
import axios from "axios";
import InventoryNav from "./InventoryNav"; 
import "./LowStockAlerts.css";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf, FaSearch, FaTruck, FaTag, FaSort, FaEdit, FaSave, FaTimes, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

//api endpoint
const URL = "http://localhost:5000/inventories";

//fetch inventory data
const fetchHandler = async () => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        throw error;
    }
};

// Update reorder level
const updateReorderLevel = async (id, reorderLevel) => {
    try {
        await axios.put(`${URL}/${id}/reorder-level`, { reorderLevel });
    } catch (error) {
        console.error("Error updating reorder level:", error);
        throw error;
    }
};

// update reorder amount API call
const updateReorderAmount = async (id, reorderAmount) => {
    try {
        await axios.put(`${URL}/${id}/reorder-amount`, { reorderAmount });
    } catch (error) {
        console.error("Error updating reorder amount:", error);
        throw error;
    }
};

function LowStockAlerts() {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("urgency");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tempReorderLevel, setTempReorderLevel] = useState(0);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [emailStatus, setEmailStatus] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [tempReorderAmount, setTempReorderAmount] = useState(0);

    const handleSaveReorderAmount = async (item) => {
        try {
            await updateReorderAmount(item._id, tempReorderAmount);
            const updatedItems = lowStockItems.map(i => 
                i._id === item._id 
                    ? { ...i, reorderAmount: tempReorderAmount }
                    : i
            );
            setLowStockItems(updatedItems);
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update reorder amount:", error);
        }
    };

    //fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchHandler();
                if (data && data.inventories) {
                    const lowStock = data.inventories.map(item => ({ 
                        ...item, 
                        reorderLevel: item.reorderLevel || 0,
                        urgency: item.reorderLevel ? item.quantity / item.reorderLevel : 0
                    })).filter(item => item.reorderLevel && item.quantity <= item.reorderLevel);
                    setLowStockItems(lowStock);
                    setFilteredItems(lowStock);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    //Filters and sorting
    useEffect(() => {
        let result = [...lowStockItems];
        
        //search filter
        if (searchTerm) {
            result = result.filter(item => 
                item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        //supplier filter
        if (supplierFilter !== "all") {
            result = result.filter(item => item.supplier === supplierFilter);
        }
        //category filter
        if (categoryFilter !== "all") {
            result = result.filter(item => item.category === categoryFilter);
        }
        //sort by
        if (sortBy === "urgency") {
            result.sort((a, b) => a.urgency - b.urgency);
        } else if (sortBy === "name") {
            result.sort((a, b) => a.itemName.localeCompare(b.itemName));
        } else if (sortBy === "quantity") {
            result.sort((a, b) => a.quantity - b.quantity);
        }
        
        setFilteredItems(result);
    }, [searchTerm, supplierFilter, categoryFilter, sortBy, lowStockItems]);

    //Generate PDF report
    const generatePDFReport = () => {
        const doc = new jsPDF();
        const logoUrl =  "https://res.cloudinary.com/dwcsi1wfq/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742364968/greenscape_ykjyib.jpg";

        const img = new Image();
        img.src = logoUrl;

        doc.addImage(img, 'JPEG', 10, 10, 50, 40);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Greenscape (Pvt)Ltd", 60, 30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("No 10 ,New plaza road, Mababe, Sri lanka", 60, 40);
        doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 50);

        doc.setDrawColor(0, 128, 0);
        doc.setLineWidth(0.5);
        doc.line(20, 60, 190, 60);

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Low Stock Alerts Report", 80, 70);

        autoTable(doc, {
            startY: 80,
            head: [['Item Name', 'Category', 'Supplier', 'Current Qty', 'Reorder Level','Reorder Amount']],
            body: filteredItems.map((item) => [
                item.itemName,
                item.category,
                item.supplier,
                item.quantity,
                item.reorderLevel,
                item.reorderAmount || 0
            ]),
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

        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${currentDate}`, 20, doc.lastAutoTable.finalY + 20);
        doc.text("Signature: ________________________", 20, doc.lastAutoTable.finalY + 30);

        return doc;
    };

    const handleSendEmail = async () => {
        if (!recipientEmail) {
            setEmailStatus("Please enter a valid email address");
            return;
        }

        try {
            setEmailStatus("Sending email...");
            const doc = generatePDFReport();
            // Convert PDF to base64 string
            const pdfData = doc.output('datauristring').split(',')[1];

            const response = await axios.post('http://localhost:5000/inventories/send-email', {
                pdfData,
                recipientEmail
            });

            if (response.data.message === "Email sent successfully") {
                setEmailStatus("");
                setShowEmailInput(false);
                setRecipientEmail("");
                setShowSuccessMessage(true);
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
            } else {
                setEmailStatus(`Error: ${response.data.details || 'Unknown error occurred'}`);
            }
        } catch (error) {
            console.error("Error sending email:", error);
            const errorMessage = error.response?.data?.details || error.message || 'Failed to send email. Please try again.';
            setEmailStatus(`Error: ${errorMessage}`);
        }
    };

    //Get unique suppliers and categories dropdowns
    const suppliers = [...new Set(lowStockItems.map(item => item.supplier))];
    const categories = [...new Set(lowStockItems.map(item => item.category))];
    
    /*const handleSendReport = () => {
        // Create the WhatsApp Chat URL
        const phoneNumber = "+94789654158";
        const message = "Selected User Reports";
        const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        
        // Open the WhatsApp chat in new window
        window.open(whatsappUrl, "_blank");
    };*/

    //Handle edit save
    const handleSaveReorderLevel = async (item) => {
        try {
            await updateReorderLevel(item._id, tempReorderLevel);
            const updatedItems = lowStockItems.map(i => 
                i._id === item._id 
                    ? { ...i, reorderLevel: tempReorderLevel, urgency: i.quantity / tempReorderLevel } 
                    : i
            );
            setLowStockItems(updatedItems);
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update reorder level:", error);
        }
    };

    return (
        <div className="low-stock-page">
            <InventoryNav />
            <main className="alerts-content">
                {showSuccessMessage && (
                    <div className="success-message">
                        <FaCheckCircle /> Email sent successfully!
                    </div>
                )}
                <div className="header-section">
                    <h1>Low Stock Alerts</h1>
                    <div className="action-buttons">
                        <button className="download-btn" onClick={() => generatePDFReport().save('low_stock_alerts_report.pdf')}>
                            <FaFilePdf /> Download PDF
                        </button>
                        <button className="email-btn" onClick={() => setShowEmailInput(true)}>
                            <FaEnvelope /> Send Email
                        </button>
                    </div>
                </div>

                {showEmailInput && (
                    <div className="email-input-container">
                        <input
                            type="email"
                            placeholder="Enter recipient email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="email-input"
                        />
                        <button onClick={handleSendEmail} className="send-email-btn">
                            Send
                        </button>
                        <button onClick={() => setShowEmailInput(false)} className="cancel-email-btn">
                            Cancel
                        </button>
                        {emailStatus && <p className="email-status">{emailStatus}</p>}
                    </div>
                )}

                <div className="control-panel">
                    <div className="search-filter">
                        <div className="search-box">
                            <FaSearch />
                            <input 
                                type="text" 
                                placeholder="Search items..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="filter-group">
                            <label>
                                <FaTruck /> Supplier:
                                <select 
                                    value={supplierFilter} 
                                    onChange={(e) => setSupplierFilter(e.target.value)}
                                >
                                    <option value="all">All Suppliers</option>
                                    {suppliers.map(supplier => (
                                        <option key={supplier} value={supplier}>{supplier}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        
                        <div className="filter-group">
                            <label>
                                <FaTag /> Category:
                                <select 
                                    value={categoryFilter} 
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        
                        <div className="filter-group">
                            <label>
                                <FaSort /> Sort By:
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="urgency">Urgency (Most Critical First)</option>
                                    <option value="name">Name (A-Z)</option>
                                    <option value="quantity">Quantity (Lowest First)</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    {loading ? (
                        <div className="loading-spinner">
                            <p>Loading low stock items...</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Current Qty</th>
                                    <th>Reorder Level</th>
                                    <th>Reorder Amount</th>
                                    <th>Supplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <tr key={item._id} className={`alert-row ${item.quantity <= 1 ? 'critical' : ''}`}>
                                            <td>{item.itemName}</td>
                                            <td>{item.category}</td>
                                            <td>
                                                <span className={`quantity-badge ${item.quantity <= 1 ? 'critical' : 'warning'}`}>
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td>
                                                {editingId === item._id ? (
                                                    <div className="reorder-edit">
                                                        <input 
                                                            type="number" 
                                                            value={tempReorderLevel}
                                                            onChange={(e) => setTempReorderLevel(Number(e.target.value))}
                                                            min="0"
                                                        />
                                                        <button onClick={() => handleSaveReorderLevel(item)}>
                                                            <FaSave />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)}>
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="reorder-display">
                                                        {item.reorderLevel}
                                                        <button 
                                                            onClick={() => {
                                                                setEditingId(item._id);
                                                                setTempReorderLevel(item.reorderLevel);
                                                            }}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {editingId === item._id ? (
                                                    <div className="reorder-edit">
                                                        <input
                                                            type="number"
                                                            value={tempReorderAmount}
                                                            onChange={(e) => setTempReorderAmount(Number(e.target.value))}
                                                            min="0"
                                                        />
                                                        <button onClick={() => handleSaveReorderAmount(item)}>
                                                            <FaSave />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)}>
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="reorder-display">
                                                        {item.reorderAmount || 0}
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(item._id);
                                                                setTempReorderAmount(item.reorderAmount || 0);
                                                            }}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                            <td>{item.supplier}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-alerts">
                                            {lowStockItems.length === 0 ? 
                                                "No low stock items" : 
                                                "No items match your filters"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>









           <style jsx>{` 
           /* Enhanced Low Stock Alerts CSS */
:root {
  --primary-green: #2E7D32;
  --secondary-green: #4CAF50;
  --light-green: #E8F5E9;
  --dark-green: #1B5E20;
  --white: #FFFFFF;
  --light-gray: #F5F5F5;
  --medium-gray: #E0E0E0;
  --dark-gray: #424242;
  --warning: #FFA000;
  --critical: #D32F2F;
  --info-blue: #1976D2;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
  --border-radius: 8px;
}

/* Layout */
.low-stock-page {
  display: flex;
  min-height: 100vh;
  background-color: var(--light-gray);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--dark-gray);
}

.alerts-content {
  flex-grow: 1;
  padding: 2rem;
  margin-left: 250px;
  transition: var(--transition);
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.low-stock-page h1 {
  color: var(--dark-green);
  margin-bottom: 1.5rem;
  font-size: 2.2rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
  display: inline-block;
}

.low-stock-page h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green), var(--secondary-green));
  border-radius: 2px;
}

/* Control Panel */
.control-panel {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
}

.search-filter {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--light-gray);
  border-radius: var(--border-radius);
  padding-left: 1rem;
  transition: var(--transition);
}

.search-box:hover {
  box-shadow: var(--shadow-sm);
}

.search-box i {
  color: var(--medium-gray);
  margin-right: 0.5rem;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  transition: var(--transition);
}

.search-box input:focus {
  outline: none;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--dark-gray);
  margin-bottom: 0.5rem;
}

.filter-group select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--medium-gray);
  border-radius: var(--border-radius);
  background-color: var(--white);
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.filter-group select:focus {
  outline: none;
  border-color: var(--secondary-green);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

/* Table Container */
.table-container {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  position: relative;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th {
  background: var(--primary-green) !important;
  color: var(--white);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--light-gray);
  vertical-align: middle;
}

/* Alert Rows */
.alert-row {
  transition: var(--transition);
}

.alert-row:hover {
  background: var(--light-green);
}

.alert-row.critical {
  background: #FFEBEE;
}

.alert-row.critical:hover {
  background: #FFCDD2;
}

/* Quantity Badge */
.quantity-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--white);
  min-width: 40px;
  text-align: center;
}

.quantity-badge.warning {
  background: var(--warning);
}

.quantity-badge.critical {
  background: var(--critical);
}

/* Reorder Edit Section */
.reorder-edit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--light-green);
  padding: 0.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.reorder-edit input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  font-size: 0.95rem;
  text-align: center;
  transition: var(--transition);
}

.reorder-edit input:focus {
  outline: none;
  border-color: var(--secondary-green);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.reorder-edit button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.reorder-edit button:first-of-type {
  color: var(--primary-green);
}

.reorder-edit button:last-of-type {
  color: var(--critical);
}

.reorder-edit button:hover {
  background: var(--white);
  transform: scale(1.1);
}

.reorder-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.reorder-display button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--info-blue);
  border-radius: 4px;
  transition: var(--transition);
  opacity: 0.7;
}

.reorder-display:hover button {
  opacity: 1;
  background: var(--light-green);
  transform: scale(1.1);
}

.reorder-display button:hover {
  color: var(--primary-green);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-green);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.download-btn:hover {
  background: var(--dark-green);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Edit/Save/Cancel Buttons */
.edit-btn, .save-btn, .cancel-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);
  width: 32px;
  height: 32px;
}

.edit-btn {
  color: var(--info-blue);
}

.edit-btn:hover {
  background: rgba(25, 118, 210, 0.1);
}

.save-btn {
  color: var(--secondary-green);
}

.save-btn:hover {
  background: rgba(76, 175, 80, 0.1);
}

.cancel-btn {
  color: var(--critical);
}

.cancel-btn:hover {
  background: rgba(211, 47, 47, 0.1);
}

/* WhatsApp Button */
.whatsapp-btn {
  background-color: #25D366;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: var(--transition);
}

.whatsapp-btn:hover {
  background-color: #128C7E;
  transform: translateY(-1px);
}

/* No Alerts */
.no-alerts {
  text-align: center;
  padding: 2rem;
  color: var(--medium-gray);
  font-style: italic;
}

/* Loading Spinner */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: var(--medium-gray);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .alerts-content {
      margin-left: 0;
  }
}

@media (max-width: 768px) {
  .header-section {
      flex-direction: column;
      align-items: flex-start;
  }
  
  .search-filter {
      grid-template-columns: 1fr;
  }
  
  .action-buttons {
      width: 100%;
      justify-content: flex-start;
  }
  
  table {
      display: block;
      overflow-x: auto;
  }
  
  th, td {
      padding: 0.75rem 0.5rem;
      font-size: 0.9rem;
  }
  
  .reorder-edit {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
  }
  
  .reorder-edit input {
      width: 100%;
  }
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.table-container {
  animation: fadeIn 0.3s ease-out;
}

/* Email Button */
.email-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--info-blue);
    color: var(--white);
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
}

.email-btn:hover {
    background: #1565C0;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

/* Email Input Container */
.email-input-container {
    background: var(--white);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
    margin-bottom: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}

.email-input {
    flex: 1;
    min-width: 250px;
    padding: 0.75rem 1rem;
    border: 1px solid var(--medium-gray);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: var(--transition);
}

.email-input:focus {
    outline: none;
    border-color: var(--info-blue);
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}

.send-email-btn {
    padding: 0.75rem 1.5rem;
    background: var(--info-blue);
    color: var(--white);
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.send-email-btn:hover {
    background: #1565C0;
    transform: translateY(-2px);
}

.cancel-email-btn {
    padding: 0.75rem 1.5rem;
    background: var(--medium-gray);
    color: var(--dark-gray);
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.cancel-email-btn:hover {
    background: var(--dark-gray);
    color: var(--white);
}

.email-status {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    text-align: center;
}

.email-status:not(:empty) {
    background: var(--light-gray);
    color: var(--dark-gray);
}

/* Success Message */
.success-message {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--secondary-green);
    color: var(--white);
    padding: 1rem 2rem;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-md);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
}

.success-message svg {
    font-size: 1.2rem;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Button Base Styles */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
}

/* Update Button */
.update-btn {
    background-color: var(--info-blue);
    color: var(--white);
}

.update-btn:hover {
    background-color: #1565C0;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

/* Delete Button */
.delete-btn {
    background-color: var(--critical);
    color: var(--white);
}

.delete-btn:hover {
    background-color: #B71C1C;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

/* Edit Button */
.edit-btn {
    background-color: var(--info-blue);
    color: var(--white);
    padding: 0.5rem;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.edit-btn:hover {
    background-color: #1565C0;
    transform: scale(1.1);
    box-shadow: var(--shadow-sm);
}

/* Save Button */
.save-btn {
    background-color: var(--primary-green);
    color: var(--white);
    padding: 0.5rem;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.save-btn:hover {
    background-color: var(--dark-green);
    transform: scale(1.1);
    box-shadow: var(--shadow-sm);
}

/* Cancel Button */
.cancel-btn {
    background-color: var(--critical);
    color: var(--white);
    padding: 0.5rem;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.cancel-btn:hover {
    background-color: #B71C1C;
    transform: scale(1.1);
    box-shadow: var(--shadow-sm);
}

/* Action Button Group */
.action-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

/* Button with Icon */
.btn-icon {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
}

.btn-icon svg {
    font-size: 1.1rem;
}

/* Button States */
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}

.btn:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
}

/* Button Loading State */
.btn-loading {
    position: relative;
    pointer-events: none;
}

.btn-loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid var(--white);
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

           
           
           
           
           
           `}</style>








        </div>
    );
}

export default LowStockAlerts;