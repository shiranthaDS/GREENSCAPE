import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const FinanceInvoice = () => {
    // State for invoice table
    const [invoices, setInvoices] = useState([]);
    const [editInvoice, setEditInvoice] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for add invoice form
    const [buyer, setBuyer] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("pending");
    const [items, setItems] = useState([{ product: "", quantity: 0, price: 0 }]);

    // Fetch invoices
    const fetchInvoices = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/invoices");
            setInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Add invoice functions
    const addItem = () => {
        setItems([...items, { product: "", quantity: 0, price: 0 }]);
    };

    const handleItemChange = (index, event) => {
        const { name, value } = event.target;
        const newItems = [...items];
        newItems[index][name] = name === "product" ? value : parseFloat(value) || 0;
        setItems(newItems);
    };

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const invoiceData = { 
            buyer, 
            totalAmount, 
            invoiceDate, 
            dueDate, 
            status, 
            items 
        };

        try {
            await axios.post("http://localhost:5000/api/invoices", invoiceData);
            alert("Invoice Added Successfully");
            // Reset form
            setBuyer("");
            setInvoiceDate("");
            setDueDate("");
            setStatus("pending");
            setItems([{ product: "", quantity: 0, price: 0 }]);
            fetchInvoices();
        } catch (error) {
            console.error("Error adding invoice:", error);
            alert("Failed to add invoice. Please try again.");
        }
    };

    // Invoice table functions
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this invoice?")) {
            try {
                await axios.delete(`http://localhost:5000/api/invoices/${id}`);
                alert("Invoice Deleted Successfully");
                fetchInvoices();
            } catch (error) {
                console.error("Error deleting invoice:", error);
                alert("Failed to delete invoice. Please try again.");
            }
        }
    };

    const handleEdit = (invoice) => {
        setEditInvoice({
            ...invoice,
            invoiceDate: invoice.invoiceDate.split('T')[0],
            dueDate: invoice.dueDate.split('T')[0]
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!editInvoice.buyer || editInvoice.buyer.trim() === '') {
            newErrors.buyer = 'Buyer name is required';
        } else if (editInvoice.buyer.length > 100) {
            newErrors.buyer = 'Buyer name must be less than 100 characters';
        }

        if (!editInvoice.totalAmount || isNaN(editInvoice.totalAmount)) {
            newErrors.totalAmount = 'Valid amount is required';
        } else if (parseFloat(editInvoice.totalAmount) <= 0) {
            newErrors.totalAmount = 'Amount must be greater than 0';
        } else if (parseFloat(editInvoice.totalAmount) > 1000000) {
            newErrors.totalAmount = 'Amount must be less than 1,000,000';
        }

        if (!editInvoice.invoiceDate) {
            newErrors.invoiceDate = 'Invoice date is required';
        } else {
            const invDate = new Date(editInvoice.invoiceDate);
            if (invDate > today) {
                newErrors.invoiceDate = 'Invoice date cannot be in the future';
            }
        }

        if (!editInvoice.dueDate) {
            newErrors.dueDate = 'Due date is required';
        } else if (editInvoice.invoiceDate) {
            const invDate = new Date(editInvoice.invoiceDate);
            const dueDt = new Date(editInvoice.dueDate);
            if (dueDt < invDate) {
                newErrors.dueDate = 'Due date must be after invoice date';
            }
        }

        if (!editInvoice.status) {
            newErrors.status = 'Status is required';
        } else if (!['pending', 'paid', 'overdue'].includes(editInvoice.status)) {
            newErrors.status = 'Invalid status selected';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:5000/api/invoices/${editInvoice._id}`, editInvoice);
            alert("Invoice Updated Successfully");
            setEditInvoice(null);
            fetchInvoices();
        } catch (error) {
            console.error("Error updating invoice:", error);
            alert("Failed to update invoice. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditInvoice(prev => ({
            ...prev,
            [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value
        }));
        
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const generatePDFReport = async () => {
        const doc = new jsPDF();
        
        try {
            // Load the logo image (make sure it's in the public folder)
            const logoUrl = '/image/logo.jpeg'; // Path from public folder
            const img = new Image();
            img.src = logoUrl;
            
            // Create a promise to handle image loading
            const imgPromise = new Promise((resolve, reject) => {
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Could not load image'));
            });
            
            // Wait for image to load
            await imgPromise;
            
            // Add the logo to the PDF
            doc.addImage(img, 'JPEG', 10, 10, 50, 30);
            
            // Add Header Section
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 40, 40);
            doc.text("Greenscape (Pvt) Ltd", 60, 20);
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("No 10, New plaza road, Malabe, Sri Lanka", 60, 28);
            doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 34);
            
            // Add a line separator
            doc.setDrawColor(0, 128, 0);
            doc.setLineWidth(0.5);
            doc.line(20, 40, 190, 40);
            
            // Add Title
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text("Invoice Report", 80, 50);
            
            // Add the table
            autoTable(doc, {
                startY: 55,
                head: [['Buyer', 'Total Amount', 'Invoice Date', 'Due Date', 'Status']],
                body: invoices.map((invoice) => [
                    invoice.buyer,
                    `$${invoice.totalAmount.toFixed(2)}`,
                    new Date(invoice.invoiceDate).toLocaleDateString(),
                    new Date(invoice.dueDate).toLocaleDateString(),
                    invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
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
            
            // Add footer
            const tableHeight = invoices.length * 10;
            const dateY = 55 + tableHeight + 20;
            const signatureY = dateY + 10;
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, dateY);
            doc.text("Authorized Signature: ________", 20, signatureY);
            
            // Save the PDF
            doc.save('invoice_report.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error generating PDF. Please ensure the logo image is in the correct location.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Finance Invoice Management</h1>
            
            {/* Add Invoice Form */}
            <div style={{ 
                marginBottom: '40px', 
                padding: '20px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                backgroundColor: '#f9f9f9'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Add New Invoice</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Buyer:</label>
                            <input 
                                type="text" 
                                placeholder="Buyer" 
                                value={buyer} 
                                onChange={(e) => setBuyer(e.target.value)} 
                                style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                                required 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Invoice Date:</label>
                            <input 
                                type="date" 
                                value={invoiceDate} 
                                onChange={(e) => setInvoiceDate(e.target.value)} 
                                max={new Date().toISOString().split('T')[0]}
                                style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                                required 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Due Date:</label>
                            <input 
                                type="date" 
                                value={dueDate} 
                                onChange={(e) => setDueDate(e.target.value)} 
                                min={invoiceDate || new Date().toISOString().split('T')[0]}
                                style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                                required 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status:</label>
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '15px' }}>Items</h3>
                        {items.map((item, index) => (
                            <div key={index} style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                                gap: '15px',
                                marginBottom: '15px',
                                padding: '15px',
                                border: '1px solid #eee',
                                borderRadius: '4px'
                            }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Product:</label>
                                    <input 
                                        type="text" 
                                        name="product" 
                                        placeholder="Product" 
                                        value={item.product} 
                                        onChange={(e) => handleItemChange(index, e)} 
                                        style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Quantity:</label>
                                    <input 
                                        type="number" 
                                        name="quantity" 
                                        placeholder="Quantity" 
                                        value={item.quantity} 
                                        onChange={(e) => handleItemChange(index, e)} 
                                        min="1"
                                        style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Price:</label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        placeholder="Price" 
                                        value={item.price} 
                                        onChange={(e) => handleItemChange(index, e)} 
                                        min="0.01"
                                        step="0.01"
                                        style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                                        required 
                                    />
                                </div>
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={addItem}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginBottom: '15px'
                            }}
                        >
                            Add Item
                        </button>
                    </div>

                    <div style={{ 
                        padding: '15px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        <h3 style={{ margin: '0' }}>Total Amount: ${totalAmount.toFixed(2)}</h3>
                    </div>

                    <button 
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Submit Invoice
                    </button>
                </form>
            </div>

            {/* Invoice Table */}
            <div>
                <h2 style={{ marginBottom: '20px' }}>Invoice List</h2>
                <button 
                    onClick={generatePDFReport} 
                    disabled={invoices.length === 0}
                    style={{
                        marginBottom: '20px',
                        padding: '8px 16px',
                        backgroundColor: invoices.length === 0 ? '#cccccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: invoices.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Generate PDF Report
                </button>
                
                {invoices.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ddd', borderRadius: '5px' }}>
                        No invoices found. Add your first invoice above.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Buyer</th>
                                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Total Amount</th>
                                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Invoice Date</th>
                                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Due Date</th>
                                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
                                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice._id}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{invoice.buyer}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>${invoice.totalAmount.toFixed(2)}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                        <td style={{ 
                                            padding: '12px', 
                                            borderBottom: '1px solid #ddd',
                                            color: invoice.status === 'overdue' ? 'red' : 
                                                   invoice.status === 'paid' ? 'green' : 'inherit',
                                            fontWeight: invoice.status === 'overdue' ? 'bold' : 'normal'
                                        }}>
                                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                        </td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                                            <button 
                                                onClick={() => handleEdit(invoice)}
                                                style={{
                                                    padding: '6px 12px',
                                                    marginRight: '5px',
                                                    backgroundColor: '#2196F3',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(invoice._id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
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

                {editInvoice && (
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '20px', 
                        border: '1px solid #ddd', 
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>Edit Invoice</h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Buyer:</label>
                            <input 
                                type="text" 
                                name="buyer"
                                value={editInvoice.buyer} 
                                onChange={handleInputChange}
                                style={{ 
                                    padding: '8px', 
                                    width: '100%', 
                                    boxSizing: 'border-box',
                                    border: errors.buyer ? '1px solid red' : '1px solid #ddd'
                                }}
                                required 
                            />
                            {errors.buyer && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.buyer}</div>}
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Amount:</label>
                            <input 
                                type="number" 
                                name="totalAmount"
                                value={editInvoice.totalAmount} 
                                onChange={handleInputChange}
                                step="0.01"
                                min="0.01"
                                style={{ 
                                    padding: '8px', 
                                    width: '100%', 
                                    boxSizing: 'border-box',
                                    border: errors.totalAmount ? '1px solid red' : '1px solid #ddd'
                                }}
                                required 
                            />
                            {errors.totalAmount && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.totalAmount}</div>}
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Invoice Date:</label>
                            <input 
                                type="date" 
                                name="invoiceDate"
                                value={editInvoice.invoiceDate} 
                                onChange={handleInputChange}
                                max={new Date().toISOString().split('T')[0]}
                                style={{ 
                                    padding: '8px', 
                                    width: '100%', 
                                    boxSizing: 'border-box',
                                    border: errors.invoiceDate ? '1px solid red' : '1px solid #ddd'
                                }}
                                required 
                            />
                            {errors.invoiceDate && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.invoiceDate}</div>}
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Due Date:</label>
                            <input 
                                type="date" 
                                name="dueDate"
                                value={editInvoice.dueDate} 
                                onChange={handleInputChange}
                                min={editInvoice.invoiceDate || new Date().toISOString().split('T')[0]}
                                style={{ 
                                    padding: '8px', 
                                    width: '100%', 
                                    boxSizing: 'border-box',
                                    border: errors.dueDate ? '1px solid red' : '1px solid #ddd'
                                }}
                                required 
                            />
                            {errors.dueDate && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.dueDate}</div>}
                        </div>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status:</label>
                            <select 
                                name="status"
                                value={editInvoice.status} 
                                onChange={handleInputChange}
                                style={{ 
                                    padding: '8px', 
                                    width: '100%', 
                                    boxSizing: 'border-box',
                                    border: errors.status ? '1px solid red' : '1px solid #ddd'
                                }}
                            >
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="overdue">Overdue</option>
                            </select>
                            {errors.status && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.status}</div>}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Invoice'}
                            </button>
                            <button 
                                onClick={() => setEditInvoice(null)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceInvoice;