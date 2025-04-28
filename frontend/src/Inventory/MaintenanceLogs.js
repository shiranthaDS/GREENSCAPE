import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MaintenanceLogs.css';
import InventoryNav from "./InventoryNav";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);

const MaintenanceLogs = () => {
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({
        _id: '', // Added to track the ID of the record being updated
        itemId: '',
        itemName: '',
        maintenanceType: '',
        maintenanceDate: '',
        performedBy: '',
        cost: '',
        nextMaintenanceDate: '',
        status: ''
    });
    const [isUpdating, setIsUpdating] = useState(false); // Track if we're in update mode
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/maintenance');
            setLogs(response.data.maintenanceRecords);
        } catch (error) {
            console.error('Error fetching maintenance logs:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const minYear = 2020;
        const maxYear = currentYear + 5;

        if (!formData.itemId.trim()) newErrors.itemId = 'Item ID is required';
        if (!formData.itemName.trim()) newErrors.itemName = 'Item Name is required';
        if (!formData.maintenanceType) newErrors.maintenanceType = 'Maintenance Type is required';
        
        if (!formData.maintenanceDate) {
            newErrors.maintenanceDate = 'Maintenance Date is required';
        } else {
            const maintenanceDate = new Date(formData.maintenanceDate);
            const maintenanceYear = maintenanceDate.getFullYear();
            if (maintenanceYear < minYear || maintenanceYear > maxYear) {
                newErrors.maintenanceDate = `Date must be between ${minYear} and ${maxYear}`;
            }
        }

        if (!formData.performedBy.trim()) newErrors.performedBy = 'Performed By is required';
        if (formData.cost && isNaN(formData.cost)) newErrors.cost = 'Cost must be a number';
        if (formData.cost && parseFloat(formData.cost) < 0) newErrors.cost = 'Cost cannot be negative';
        if (!formData.status) newErrors.status = 'Status is required';

        if (formData.nextMaintenanceDate) {
            const nextMaintenanceDate = new Date(formData.nextMaintenanceDate);
            const nextYear = nextMaintenanceDate.getFullYear();
            
            if (nextYear < minYear || nextYear > maxYear) {
                newErrors.nextMaintenanceDate = `Date must be between ${minYear} and ${maxYear}`;
            }
            
            if (formData.maintenanceDate && !newErrors.maintenanceDate) {
                const maintenanceDate = new Date(formData.maintenanceDate);
                if (nextMaintenanceDate <= maintenanceDate) {
                    newErrors.nextMaintenanceDate = 'Next Maintenance Date must be after the current Maintenance Date';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isUpdating) {
                // If we're updating, make a PUT request
                await axios.put(`http://localhost:5000/maintenance/${formData._id}`, formData);
            } else {
                // Otherwise, make a POST request to create a new record
                await axios.post('http://localhost:5000/maintenance', formData);
            }
            
            fetchLogs();
            resetForm();
        } catch (error) {
            console.error('Error submitting maintenance log:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            _id: '',
            itemId: '',
            itemName: '',
            maintenanceType: '',
            maintenanceDate: '',
            performedBy: '',
            cost: '',
            nextMaintenanceDate: '',
            status: ''
        });
        setIsUpdating(false);
        setErrors({});
    };

    const populateFormForUpdate = (log) => {
        setFormData({
            _id: log._id, // Include the ID for updating
            itemId: log.itemId,
            itemName: log.itemName,
            maintenanceType: log.maintenanceType,
            maintenanceDate: log.maintenanceDate.split('T')[0], // Format date for input
            performedBy: log.performedBy,
            cost: log.cost,
            nextMaintenanceDate: log.nextMaintenanceDate ? log.nextMaintenanceDate.split('T')[0] : '',
            status: log.status
        });
        setIsUpdating(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/maintenance/${id}`);
            fetchLogs();
        } catch (error) {
            console.error('Error deleting maintenance log:', error);
        }
    };

    const generateReport = () => {
        const doc = new jsPDF();
        const logoUrl = "https://res.cloudinary.com/dwcsi1wfq/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742364968/greenscape_ykjyib.jpg";
        const img = new Image();
        img.src = logoUrl;

        doc.addImage(img, 'PNG', 10, 10, 50, 30);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text('Greenscape (Pvt)Ltd', 60, 20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('No 10 ,New plaza road, Malabe, Sri lanka', 60, 28);
        doc.text('Phone: +055 2246 761 | Email: infogreenscape@gmail.com', 60, 34);

        doc.setDrawColor(0, 128, 0);
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Maintenance Report', 80, 50);

        doc.autoTable({
            startY: 55,
            head: [['Item ID', 'Item Name', 'Maintenance Type', 'Date', 'Performed By', 'Cost', 'Next Date', 'Status']],
            body: logs.map((log) => [
                log.itemId,
                log.itemName,
                log.maintenanceType,
                new Date(log.maintenanceDate).toLocaleDateString(),
                log.performedBy,
                log.cost,
                log.nextMaintenanceDate ? new Date(log.nextMaintenanceDate).toLocaleDateString() : 'N/A',
                log.status,
            ]),
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
                halign: 'center',
                valign: 'middle',
            },
            headStyles: {
                fillColor: [40, 167, 69],
                textColor: [255, 255, 255],
            },
        });

        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${currentDate}`, 20, doc.lastAutoTable.finalY + 20);
        doc.text('Signature: ________________________', 20, doc.lastAutoTable.finalY + 30);

        doc.save('maintenance_logs_report.pdf');
    };

    return (
        <div className="maintenance-logs-container">
            <InventoryNav />    
            <h1 className="maintenance-title">Maintenance Logs</h1>
            <form className="maintenance-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="itemId"
                        placeholder="Item ID"
                        value={formData.itemId}
                        onChange={handleChange}
                        className={errors.itemId ? 'error-input' : ''}
                    />
                    {errors.itemId && <span className="error-message">{errors.itemId}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="itemName"
                        placeholder="Item Name"
                        value={formData.itemName}
                        onChange={handleChange}
                        className={errors.itemName ? 'error-input' : ''}
                    />
                    {errors.itemName && <span className="error-message">{errors.itemName}</span>}
                </div>

                <div className="form-group">
                    <select
                        name="maintenanceType"
                        value={formData.maintenanceType}
                        onChange={handleChange}
                        className={errors.maintenanceType ? 'error-input' : ''}
                    >
                        <option value="">Select Maintenance Type</option>
                        <option value="Repair">Repair</option>
                        <option value="Replacement">Replacement</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Cleaning">Cleaning</option>
                    </select>
                    {errors.maintenanceType && <span className="error-message">{errors.maintenanceType}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="date"
                        name="maintenanceDate"
                        value={formData.maintenanceDate}
                        onChange={handleChange}
                        className={errors.maintenanceDate ? 'error-input' : ''}
                    />
                    {errors.maintenanceDate && <span className="error-message">{errors.maintenanceDate}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="performedBy"
                        placeholder="Performed By"
                        value={formData.performedBy}
                        onChange={handleChange}
                        className={errors.performedBy ? 'error-input' : ''}
                    />
                    {errors.performedBy && <span className="error-message">{errors.performedBy}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="cost"
                        placeholder="Cost"
                        value={formData.cost}
                        onChange={handleChange}
                        min="0"
                        className={errors.cost ? 'error-input' : ''}
                    />
                    {errors.cost && <span className="error-message">{errors.cost}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="date"
                        name="nextMaintenanceDate"
                        value={formData.nextMaintenanceDate}
                        onChange={handleChange}
                        className={errors.nextMaintenanceDate ? 'error-input' : ''}
                    />
                    {errors.nextMaintenanceDate && <span className="error-message">{errors.nextMaintenanceDate}</span>}
                </div>

                <div className="form-group">
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={errors.status ? 'error-input' : ''}
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                    </select>
                    {errors.status && <span className="error-message">{errors.status}</span>}
                </div>

                <div className="form-actions">
                    <button type="submit" className="form-submit-btn">
                        {isUpdating ? 'Update Log' : 'Add Log'}
                    </button>
                    {isUpdating && (
                        <button type="button" className="cancel-btn" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <button className="generate-report-btn" onClick={generateReport}>
                Generate Report
            </button>

            <div className="table-wrapper">
                <table className="maintenance-table">
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Maintenance Type</th>
                            <th>Date</th>
                            <th>Performed By</th>
                            <th>Cost</th>
                            <th>Next Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>{log.itemId}</td>
                                <td>{log.itemName}</td>
                                <td>{log.maintenanceType}</td>
                                <td>{new Date(log.maintenanceDate).toLocaleDateString()}</td>
                                <td>{log.performedBy}</td>
                                <td>{log.cost}</td>
                                <td>{log.nextMaintenanceDate ? new Date(log.nextMaintenanceDate).toLocaleDateString() : 'N/A'}</td>
                                <td>{log.status}</td>
                                <td>
                                    <button 
                                        className="update-btn"
                                        onClick={() => populateFormForUpdate(log)}
                                    >
                                        Update
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(log._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                /* Main Container */
                .maintenance-logs-container {
                    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    padding: 2rem;
                    margin-left: 280px;
                    background-color: #f8f9fa;
                    min-height: 100vh;
                    transition: all 0.3s ease;
                }

                /* Title Styling */
                .maintenance-title {
                    text-align: center;
                    color: #1B5E20;
                    margin-bottom: 2rem;
                    font-size: 2.2rem;
                    font-weight: 600;
                    position: relative;
                    padding-bottom: 0.8rem;
                }

                .maintenance-title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 120px;
                    height: 4px;
                    background: linear-gradient(90deg, #28a745, #218838);
                    border-radius: 2px;
                }

                /* Form Styling */
                .maintenance-form {
                    margin-bottom: 2rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 1.2rem;
                    background: white;
                    padding: 1.8rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                }

                .maintenance-form input,
                .maintenance-form select {
                    padding: 0.8rem 1rem;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    transition: all 0.25s ease;
                    background-color: #f8f9fa;
                }

                .maintenance-form input:focus,
                .maintenance-form select:focus {
                    outline: none;
                    border-color: #28a745;
                    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
                    background-color: white;
                }

                .error-input {
                    border-color: #dc3545 !important;
                    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
                }

                .form-actions {
                    grid-column: 1 / -1;
                    display: flex;
                    gap: 1rem;
                }

                .form-submit-btn {
                    flex: 1;
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
                }

                .form-submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    background: linear-gradient(135deg, #218838, #1e7e34);
                }

                .cancel-btn {
                    flex: 1;
                    padding: 0.85rem;
                    background: linear-gradient(135deg, #6c757d, #5a6268);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                }

                .cancel-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    background: linear-gradient(135deg, #5a6268, #495056);
                }

                /* Generate Report Button */
                .generate-report-btn {
                    display: block;
                    margin: 0 auto 2rem;
                    padding: 0.85rem 1.8rem;
                    background: linear-gradient(135deg, #218838, #1e7e34);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    position: relative;
                    overflow: hidden;
                }

                .generate-report-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    background: linear-gradient(135deg, #218838, #1e7e34);
                }

                .generate-report-btn::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.15),
                        transparent
                    );
                    transition: 0.5s;
                }

                .generate-report-btn:hover::after {
                    left: 100%;
                }

                /* Table Styling */
                .table-wrapper {
                    overflow-x: auto;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    background: white;
                    padding: 0.5rem;
                }

                .maintenance-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin: 0;
                }

                .maintenance-table th {
                    background: linear-gradient(135deg, #343a40, #23272b);
                    color: white;
                    padding: 1rem;
                    text-align: left;
                    font-weight: 500;
                    position: sticky;
                    top: 0;
                }

                .maintenance-table td {
                    padding: 0.85rem 1rem;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background-color 0.2s ease;
                }

                .maintenance-table tr:last-child td {
                    border-bottom: none;
                }

                .maintenance-table tr:nth-child(even) {
                    background-color: #fafafa;
                }

                .maintenance-table tr:hover td {
                    background-color: #f5f5f5;
                }

                .update-btn {
                    padding: 0.6rem 1rem;
                    margin-right: 0.6rem;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    background: linear-gradient(135deg, #ffc107, #e0a800);
                    color: #212529;
                }

                .update-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    background: linear-gradient(135deg, #e0a800, #d39e00);
                }

                .delete-btn {
                    padding: 0.6rem 1rem;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    background: linear-gradient(135deg, #dc3545, #c82333);
                    color: white;
                }

                .delete-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    background: linear-gradient(135deg, #c82333, #bd2130);
                }

                /* Error Styling */
                .error-message {
                    color: #dc3545;
                    font-size: 0.85rem;
                    margin-top: 0.3rem;
                    display: block;
                }

                /* Animations */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .maintenance-table tr {
                    animation: fadeIn 0.35s ease forwards;
                }

                /* Responsive Design */
                @media (max-width: 1200px) {
                    .maintenance-logs-container {
                        margin-left: 0;
                        padding: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .maintenance-form {
                        grid-template-columns: 1fr;
                        padding: 1.5rem;
                    }
                    
                    .maintenance-title {
                        font-size: 1.8rem;
                    }
                    
                    .maintenance-table th,
                    .maintenance-table td {
                        padding: 0.75rem;
                        font-size: 0.9rem;
                    }

                    .form-actions {
                        flex-direction: column;
                    }
                }

                /* Custom Scrollbar */
                .table-wrapper::-webkit-scrollbar {
                    height: 8px;
                }

                .table-wrapper::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }

                .table-wrapper::-webkit-scrollbar-thumb {
                    background: #28a745;
                    border-radius: 4px;
                }

                .table-wrapper::-webkit-scrollbar-thumb:hover {
                    background: #218838;
                }
            `}</style>
        </div>
    );
};

export default MaintenanceLogs;