import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import Papa from "papaparse";
import InventoryNav from "./InventoryNav";
import "./UsageReports.css";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const UsageReports = () => {
    const [usageReports, setUsageReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        projectName: "",
        itemId: "",
        itemName: "",
        quantityUsed: "",
        dateOfUsage: "",
        usedBy: "",
        purpose: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchUsageReports();
    }, []);

    useEffect(() => {
        if (usageReports?.length) {
            const filtered = usageReports.filter(report =>
                report.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.usedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.itemId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredReports(filtered);
        } else {
            setFilteredReports([]);
        }
    }, [searchTerm, usageReports]);

    const fetchUsageReports = async () => {
        try {
            const response = await fetch("http://localhost:5000/usage");
            const data = await response.json();
            if (data && data.usageReports) {
                setUsageReports(data.usageReports);
                setFilteredReports(data.usageReports);
            } else {
                setUsageReports([]);
                setFilteredReports([]);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            setUsageReports([]);
            setFilteredReports([]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectName.trim()) newErrors.projectName = "Project Name is required";
        if (!formData.itemId.trim()) newErrors.itemId = "Item ID is required";
        if (!formData.itemName.trim()) newErrors.itemName = "Item Name is required";
        if (!formData.quantityUsed || formData.quantityUsed <= 0) newErrors.quantityUsed = "Quantity Used must be a positive number";
        if (!formData.dateOfUsage) newErrors.dateOfUsage = "Date of Usage is required";
        if (!formData.usedBy.trim()) newErrors.usedBy = "Used By is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `http://localhost:5000/usage/${editingId}` : "http://localhost:5000/usage";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchUsageReports();
                setFormData({
                    projectName: "",
                    itemId: "",
                    itemName: "",
                    quantityUsed: "",
                    dateOfUsage: "",
                    usedBy: "",
                    purpose: ""
                });
                setEditingId(null);
                setErrors({});
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleEdit = (report) => {
        setEditingId(report._id);
        setFormData({
            ...report,
            dateOfUsage: report.dateOfUsage?.split("T")[0] || ""
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/usage/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchUsageReports();
            }
        } catch (error) {
            console.error("Error deleting report:", error);
        }
    };

    const chartData = (filteredReports || []).map((report) => ({
        name: report.itemName,
        quantity: report.quantityUsed,
    }));

    const handleDownloadReport = () => {
        const csvData = (filteredReports || []).map((report) => ({
            "Project Name": report.projectName,
            "Item ID": report.itemId,
            "Item Name": report.itemName,
            "Quantity Used": report.quantityUsed,
            "Date of Usage": new Date(report.dateOfUsage).toLocaleDateString(),
            "Used By": report.usedBy,
            "Purpose": report.purpose || "N/A",
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "UsageReport.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generatePDFReport = () => {
        const doc = new jsPDF();
        const logoUrl = 'image/logo.jpeg';
        const img = new Image();
        img.src = logoUrl;

        img.onload = () => {
            doc.addImage(img, 'JPEG', 10, 10, 50, 40);
            let y = 20;
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 40, 40);
            doc.text("Greenscape (Pvt)Ltd", 60, y);
            y += 10;

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("No 10, New plaza road, Mababe, Sri Lanka", 60, y);
            y += 10;
            doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, y);
            y += 20;

            doc.setDrawColor(0, 128, 0);
            doc.setLineWidth(0.5);
            doc.line(20, y, 190, y);
            y += 10;

            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text("Usage Report", 80, y);
            y += 20;

            autoTable(doc, {
                startY: y,
                head: [['Project Name', 'Item ID', 'Item Name', 'Quantity Used', 'Date of Usage', 'Used By', 'Purpose']],
                body: (filteredReports || []).map((report) => [
                    report.projectName,
                    report.itemId,
                    report.itemName,
                    report.quantityUsed,
                    new Date(report.dateOfUsage).toLocaleDateString(),
                    report.usedBy,
                    report.purpose || "N/A",
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
            doc.text(`Date: ${currentDate}`, 20, doc.lastAutoTable.finalY + 10);
            doc.text("Signature: ________________________", 20, doc.lastAutoTable.finalY + 20);

            doc.save('usage_report.pdf');
        };
    };

    return (
        <div className="usage-container">
            <InventoryNav />
            <h1 className="usage-title">Usage Reports</h1>

            <div className="button-container">
                <button className="download-btn" onClick={handleDownloadReport}>
                    Download CSV Report
                </button>
                <button className="download-btn" onClick={generatePDFReport}>
                    Download PDF Report
                </button>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">Search</button>
            </div>

            {/* usage report form */}
            <form className="usage-form" onSubmit={handleSubmit}>
                <input type="text" name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleChange} required />
                {errors.projectName && <span className="error">{errors.projectName}</span>}

                <input type="text" name="itemId" placeholder="Item ID" value={formData.itemId} onChange={handleChange} required />
                {errors.itemId && <span className="error">{errors.itemId}</span>}

                <input type="text" name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleChange} required />
                {errors.itemName && <span className="error">{errors.itemName}</span>}

                <input type="number" name="quantityUsed" placeholder="Quantity Used" value={formData.quantityUsed} onChange={handleChange} required min="1" />
                {errors.quantityUsed && <span className="error">{errors.quantityUsed}</span>}

                <input type="date" name="dateOfUsage" value={formData.dateOfUsage} onChange={handleChange} required />
                {errors.dateOfUsage && <span className="error">{errors.dateOfUsage}</span>}

                <input type="text" name="usedBy" placeholder="Used By" value={formData.usedBy} onChange={handleChange} required />
                {errors.usedBy && <span className="error">{errors.usedBy}</span>}

                <input type="text" name="purpose" placeholder="Purpose (Optional)" value={formData.purpose} onChange={handleChange} />

                <button type="submit">{editingId ? "Update Report" : "Add Report"}</button>
            </form>

            <table className="usage-table">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Quantity Used</th>
                        <th>Date of Usage</th>
                        <th>Used By</th>
                        <th>Purpose</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(filteredReports || []).length > 0 ? (
                        filteredReports.map((report) => (
                            <tr key={report._id}>
                                <td>{report.projectName}</td>
                                <td>{report.itemId}</td>
                                <td>{report.itemName}</td>
                                <td>{report.quantityUsed}</td>
                                <td>{new Date(report.dateOfUsage).toLocaleDateString()}</td>
                                <td>{report.usedBy}</td>
                                <td>{report.purpose || "N/A"}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(report)}>Update</button>
                                    <button className="delete-btn" onClick={() => handleDelete(report._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No usage reports found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="chart-container">
                <h3>Usage Statistics</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantity" fill="#2E7D32" />
                    </BarChart>
                </ResponsiveContainer>

                <h3>Usage Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="quantity" stroke="#2E7D32" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <style jsx>{`
            
            .usage-container {
    width: 80%;
    margin: auto;
    text-align: center;
    margin-left: 280px;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.usage-title {
    color: var(--dark-green);
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    position: relative;
    padding-bottom: 0.5rem;
}

.usage-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: var(--secondary-green);
    border-radius: 2px;
}


.search-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.search-input {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    width: 300px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s;
}

.search-input:focus {
    border-color: #2E7D32;
}

.search-btn {
    padding: 10px 15px;
    background-color: #2E7D32;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    transition: background-color 0.3s;
}

.search-btn:hover {
    background-color: #1e5a23;
}

.button-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.download-btn {
    background-color: #2E7D32;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    color: white;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s;
    margin: 0 5px;
}

.download-btn:hover {
    background-color: #1e5a23;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.download-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.usage-form {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.8rem;
    margin-bottom: 2rem;
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.usage-form input,
.usage-form select {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.25s ease;
    background-color: #f8f9fa;
    margin: 0;
}

.usage-form input:focus,
.usage-form select:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
    background-color: white;
}

.usage-form button {
    grid-column: 1 / -1;
    width: 100%;
    padding: 0.85rem;
    background: linear-gradient(135deg, #28a745, #218838);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
}

.usage-form button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #218838, #1e7e34);
}

.error {
    color: #dc3545;
    font-size: 0.8rem;
    display: block;
    text-align: left;
    margin-top: 2px;
    grid-column: span 1;
}

.usage-form input.error-input {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
}

.usage-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.usage-table th, .usage-table td {
    padding: 12px 15px;
    border: 1px solid #ddd;
    text-align: left;
    vertical-align: middle;
}

.usage-table th {
    background-color: #2E7D32;
    color: white;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 14px;
}

.usage-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.usage-table tr:hover {
    background-color: #f1f1f1;
}

.usage-table td:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
}

.edit-btn, .delete-btn {
    padding: 6px 12px;
    border: none;
    cursor: pointer;
    color: white;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s;
    white-space: nowrap;
    min-width: 70px;
    flex-shrink: 0;
}

.edit-btn {
    background-color: #2E7D32;
}

.delete-btn {
    background-color: #dc3545;
}

.edit-btn:hover {
    background-color: #1e5a23;
    transform: translateY(-1px);
}

.delete-btn:hover {
    background-color: #c82333;
    transform: translateY(-1px);
}

.chart-container {
    margin-top: 40px;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
    color: #2E7D32;
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 500;
}

@media (max-width: 992px) {
    .usage-form {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .usage-container {
        margin-left: 0;
        width: 95%;
        padding: 1rem;
    }
    
    .usage-form {
        grid-template-columns: 1fr;
        gap: 0.8rem;
        padding: 1rem;
    }

    .usage-form input,
    .usage-form select {
        width: 100%;
    }
    
    .button-container {
        flex-direction: column;
    }
    
    .download-btn {
        margin-bottom: 10px;
        width: 100%;
    }
    
    .search-container {
        justify-content: center;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .search-input {
        width: 100%;
        border-radius: 4px;
    }
    
    .search-btn {
        width: 100%;
        border-radius: 4px;
    }
}

            
            
            `}</style>




        </div>
    );
};

export default UsageReports;
