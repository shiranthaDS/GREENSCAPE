import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import InventoryNav from "./InventoryNav"; 
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "./InventoryDetails.css";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaEdit, FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const URL = "http://localhost:5000/inventories";

const fetchHandler = async () => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        throw error;
    }
};

const updateReorderLevel = async (id, reorderLevel) => {
    try {
        await axios.put(`${URL}/${id}/reorder-level`, { reorderLevel });
    } catch (error) {
        console.error("Error updating reorder level:", error);
        throw error;
    }
};

function InventoryDetails() {
    const [inventories, setInventories] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [lowStockNotification, setLowStockNotification] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tempReorderLevel, setTempReorderLevel] = useState(0);
    const [notificationSeverity, setNotificationSeverity] = useState("warning");

    const tableRef = useRef();
    const notificationRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchHandler();
                if (data && data.inventories) {
                    setInventories(data.inventories);
                    checkLowStockItems(data.inventories);
                    prepareChartData(data.inventories);
                }
            } catch (error) {
                console.error("Error loading inventory data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                fetchHandler().then((data) => {
                    const filteredInventories = data.inventories.filter((inventory) =>
                        Object.values(inventory).some((field) =>
                            field.toString().toLowerCase().includes(searchQuery.toLowerCase())
                        )
                    );
                    setInventories(filteredInventories);
                    setNoResults(filteredInventories.length === 0);
                });
            } else {
                fetchHandler().then((data) => {
                    setInventories(data.inventories);
                });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // const checkLowStockItems = (items) => {
    //     const lowStockItems = items.filter((item) => 
    //         item.reorderLevel && item.quantity <= item.reorderLevel
    //     );
        
    //     if (lowStockItems.length > 0) {
    //         const criticalItems = lowStockItems.filter(item => item.quantity <= 1).length;
    //         const warningItems = lowStockItems.length - criticalItems;
            
    //         let notificationMsg = "Stock Alert: ";
    //         if (criticalItems > 0) {
    //             notificationMsg += `${criticalItems} critical item(s) (≤1 unit) `;
    //             setNotificationSeverity("critical");
    //         }
    //         if (warningItems > 0) {
    //             notificationMsg += `${warningItems} warning item(s) `;
    //             if (criticalItems === 0) setNotificationSeverity("warning");
    //         }
    //         notificationMsg += "need reordering!";
            
    //         setLowStockNotification(notificationMsg);
    //         setShowNotification(true);
    //     }
    // };
    const checkLowStockItems = (items) => {
        const lowStockItems = items.filter((item) => 
            item.reorderLevel && item.quantity <= item.reorderLevel
        );
        
        if (lowStockItems.length > 0) {
            // Categorize items by their stock level
            const criticalItems = lowStockItems.filter(item => item.quantity <= 1);
            const warningItems = lowStockItems.filter(item => item.quantity > 1 && item.quantity <= 3);
            const noticeItems = lowStockItems.filter(item => item.quantity > 3);
            
            let notificationMsg = "Stock Alerts: ";
            const parts = [];
            
            if (criticalItems.length > 0) {
                parts.push(`${criticalItems.length} critical (≤1 unit)`);
                setNotificationSeverity("critical");
            }
            if (warningItems.length > 0) {
                parts.push(`${warningItems.length} warning (2-3 units)`);
                if (criticalItems.length === 0) setNotificationSeverity("warning");
            }
            if (noticeItems.length > 0) {
                parts.push(`${noticeItems.length} notice (>3 units)`);
                if (criticalItems.length === 0 && warningItems.length === 0) {
                    setNotificationSeverity("notice");
                }
            }
            
            notificationMsg += parts.join(", ") + " need reordering!";
            
            setLowStockNotification(notificationMsg);
            setShowNotification(true);
        }
    };

    const prepareChartData = (items) => {
        const itemNames = items.map((inv) => inv.itemName);
        const quantities = items.map((inv) => inv.quantity);

        setChartData({
            labels: itemNames,
            datasets: [
                {
                    label: "Quantity",
                    data: quantities,
                    backgroundColor: "#4CAF50",
                    borderColor: "#388E3C",
                    borderWidth: 1,
                },
            ],
        });
        
        const categories = {};
        items.forEach((inv) => {
            categories[inv.category] = (categories[inv.category] || 0) + 1;
        });

        setCategoryData({
            labels: Object.keys(categories),
            datasets: [
                {
                    label: "Category Distribution",
                    data: Object.values(categories),
                    backgroundColor: ["#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#388E3C"],
                },
            ],
        });
    };

    const deleteHandler = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await axios.delete(`${URL}/${id}`);
            alert("Inventory deleted successfully!");
            setInventories(inventories.filter((inventory) => inventory._id !== id));
        } catch (error) {
            console.error("Error deleting inventory:", error);
            alert("Failed to delete inventory item.");
        }
    };

    const handlePrint = useReactToPrint({
        content: () => tableRef.current,
        documentTitle: "Inventory Report",
        onAfterPrint: () => alert("Inventory report has been successfully downloaded."),
    });

    const generatePDFReport = () => {
        const doc = new jsPDF();
        const logoUrl =  "https://res.cloudinary.com/dwcsi1wfq/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742364968/greenscape_ykjyib.jpg";

        const img = new Image();
        img.src = logoUrl;

        doc.addImage(img, 'JPEG', 10, 10, 50, 30);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text("Greenscape (Pvt)Ltd", 60, 20);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("No 10 ,New plaza road, Malabe, Sri lanka", 60, 28);
        doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 34);

        doc.setDrawColor(0, 128, 0);
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Inventory Report", 80, 50);

        autoTable(doc, {
            startY: 55,
            head: [['Item Name', 'Category', 'Quantity', 'Supplier', 'Price', 'Maintenance Schedule', 'Reorder Level']],
            body: inventories.map((inventory) => [
                inventory.itemName,
                inventory.category,
                inventory.quantity,
                inventory.supplier,
                `Rs.${inventory.price.toFixed(2)}`,
                inventory.maintenanceSchedule,
                inventory.reorderLevel || 'Not set'
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

        doc.save('inventory_report.pdf');
    };

    const handleSaveReorderLevel = async (item) => {
        if (tempReorderLevel < 0) {
            alert("Reorder level cannot be negative");
            return;
        }

        try {
            await updateReorderLevel(item._id, tempReorderLevel);
            const updatedItems = inventories.map(i => 
                i._id === item._id ? { ...i, reorderLevel: tempReorderLevel } : i
            );
            setInventories(updatedItems);
            setEditingId(null);
            
            // Recheck low stock items after update
            checkLowStockItems(updatedItems);
            
            alert(`Reorder level for ${item.itemName} updated to ${tempReorderLevel}`);
        } catch (error) {
            console.error("Failed to update reorder level:", error);
            alert("Failed to update reorder level. Please try again.");
        }
    };

    return (
        <div className="inventory-details-container">
            <InventoryNav />
            <h1 className="dashboard-title">Inventory Dashboard</h1>

            {showNotification && (
                <div ref={notificationRef} className={`notification ${notificationSeverity}`}>
                    <div className="notification-content">
                        <FaExclamationTriangle className="notification-icon" />
                        <span>{lowStockNotification}</span>
                        <Link to="/lowStockAlerts" className="view-link">View Details</Link>
                        <button 
                            className="close-notification" 
                            onClick={() => setShowNotification(false)}
                            aria-label="Close notification"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                {noResults && <div className="no-results">No matching items found</div>}
            </div>

            <div className="table-container">
                <table className="inventory-table" ref={tableRef}>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Supplier</th>
                            <th>Price</th>
                            <th>Maintenance</th>
                            <th>Actions</th>
                            <th>Reorder Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventories.length > 0 ? (
                            inventories.map((inventory) => (
                                <tr 
                                    key={inventory._id} 
                                    className={
                                        inventory.reorderLevel && inventory.quantity <= inventory.reorderLevel ? 
                                        (inventory.quantity <= 1 ? 'critical-row' : 'warning-row') : ''
                                    }
                                >
                                    <td>{inventory.itemName}</td>
                                    <td>{inventory.category}</td>
                                    <td className={
                                        inventory.reorderLevel && inventory.quantity <= inventory.reorderLevel ? 
                                        (inventory.quantity <= 1 ? 'critical-quantity' : 'warning-quantity') : ''
                                    }>
                                        {inventory.quantity}
                                    </td>
                                    <td>{inventory.supplier}</td>
                                    <td>Rs.{inventory.price.toFixed(2)}</td>
                                    <td>{inventory.maintenanceSchedule}</td>
                                    <td className="action-buttons">
                                        <Link to={`/AddInventory/${inventory._id}`} className="update-btn">
                                            Update
                                        </Link>
                                        <button onClick={() => deleteHandler(inventory._id)} className="delete-btn">
                                            Delete
                                        </button>
                                    </td>
                                    <td className="reorder-level-cell">
                                        {editingId === inventory._id ? (
                                            <div className="reorder-edit-container">
                                                <input
                                                    type="number"
                                                    value={tempReorderLevel}
                                                    onChange={(e) => setTempReorderLevel(Number(e.target.value))}
                                                    min="0"
                                                    className="reorder-input"
                                                />
                                                <button 
                                                    onClick={() => handleSaveReorderLevel(inventory)}
                                                    className="save-reorder-btn"
                                                    title="Save"
                                                >
                                                    <FaSave />
                                                </button>
                                                <button 
                                                    onClick={() => setEditingId(null)}
                                                    className="cancel-reorder-btn"
                                                    title="Cancel"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="reorder-display-container">
                                                <span>{inventory.reorderLevel || 'Not set'}</span>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(inventory._id);
                                                        setTempReorderLevel(inventory.reorderLevel || 0);
                                                    }}
                                                    className="edit-reorder-btn"
                                                    title="Edit reorder level"
                                                >
                                                    <FaEdit />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-items">No inventory items available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button onClick={generatePDFReport} className="report-btn">
                <span className="btn-icon">📊</span>
                <span className="btn-text">Download PDF Report</span>
            </button>

            <div className="charts-container">
                <div className="chart-wrapper">
                    <h2>Inventory Quantity</h2>
                    {chartData && <Bar data={chartData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            }
                        }
                    }} />}
                </div>
                <div className="chart-wrapper">
                    <h2>Category Distribution</h2>
                    {categoryData && <Pie data={categoryData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            }
                        }
                    }} />}
                </div>
            </div>
                <style jsx>{`
                /* InventoryDetails.css */

/* Base Styles */
.inventory-details-container {
    margin-left: 260px;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 100%;
    overflow-x: auto;
}

.dashboard-title {
  --dark-green: #1B5E20;
  color: var(--dark-green);
    margin-bottom: 25px;
    text-align: center;
    font-size: 2.2rem;
    position: relative;
}

.dashboard-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #28a745, #218838);
    border-radius: 2px;
}

/* Search Container */
.search-container {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.search-input {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    max-width: 400px;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.no-results {
    color: #d32f2f;
    margin-top: 5px;
    font-style: italic;
}

/* Table Styles */
.table-container {
    margin: 20px 0;
    overflow-x: auto;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    border-radius: 8px;
}

.inventory-table {
    width: 100%;
    border-collapse: collapse;
    background: rgb(29, 27, 27);
}

.inventory-table th {
    background-color: #2E7D32;
    color: white;
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
}

.inventory-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #e0e0e0;
}

.inventory-table tr:hover {
    background-color: #ecdede;
}

/* Row Highlighting */
.warning-row {
    background-color: #FFF3E0 !important;
}

.critical-row {
    background-color: #FFEBEE !important;
}

.warning-row:hover, .critical-row:hover {
    opacity: 0.9;
}

.warning-quantity {
    color: #FF8F00;
    font-weight: bold;
}

.critical-quantity {
    color: #D32F2F;
    font-weight: bold;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 8px;
}

.update-btn, .delete-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.update-btn {
    background-color: #1976D2;
    color: white;
}

.update-btn:hover {
    background-color: #1565C0;
}

.delete-btn {
    background-color: #D32F2F;
    color: white;
}

.delete-btn:hover {
    background-color: #B71C1C;
}

/* Reorder Level Styles */
.reorder-level-cell {
    min-width: 150px;
}

.reorder-edit-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.reorder-input {
    width: 70px;
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
    transition: all 0.2s ease;
}

.reorder-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.reorder-display-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.edit-reorder-btn, .save-reorder-btn, .cancel-reorder-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    font-size: 14px;
}

.edit-reorder-btn {
    color: #2E7D32;
}

.edit-reorder-btn:hover {
    background: rgba(25, 118, 210, 0.1);
    transform: scale(1.1);
}

.save-reorder-btn {
    color: #4CAF50;
}

.save-reorder-btn:hover {
    background: rgba(76, 175, 80, 0.1);
    transform: scale(1.1);
}

.cancel-reorder-btn {
    color: #2E7D32;
}

.cancel-reorder-btn:hover {
    background: rgba(244, 67, 54, 0.1);
    transform: scale(1.1);
}

/* Notification Styles */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    display: flex;
    align-items: center;
}

.notification.warning {
    background: #FFF3E0;
    border-left: 4px solid #2E7D32;
}

.notification.critical {
    background: #FFEBEE;
    border-left: 4px solid #2E7D32;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.notification-icon {
    color: inherit;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.view-link {
    margin-left: auto;
    color:#2E7D32;
    text-decoration: none;
    font-weight: 500;
    white-space: nowrap;
    padding: 0 8px;
}

.view-link:hover {
    text-decoration: underline;
}

.close-notification {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.3rem;
    color: #616161;
    padding: 0;
    margin-left: 8px;
    line-height: 1;
}

.close-notification:hover {
    color: #2E7D32;
}

/* Report Button */
.report-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 20px 0;
    transition: all 0.2s ease;
}

.report-btn:hover {
    background-color: #388E3C;
    transform: translateY(-2px);
}

/* Charts Container */
.charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
    margin-top: 30px;
}

.chart-wrapper {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

.chart-wrapper h2 {
    margin-top: 0;
    color: #2E7D32;
    font-size: 1.3rem;
}

/* No Items */
.no-items {
    text-align: center;
    padding: 20px;
    color: #757575;
    font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
    .dashboard-title {
        font-size: 1.8rem;
    }
    
    .action-buttons {
        flex-direction: column;
        gap: 5px;
    }
    
    .reorder-level-cell {
        min-width: 120px;
    }
    
    .reorder-edit-container {
        flex-direction: column;
        gap: 5px;
    }
    
    .reorder-input {
        width: 100%;
    }
    
    .notification {
        max-width: 90%;
        left: 5%;
        right: 5%;
        top: 10px;
    }
    
    .charts-container {
        grid-template-columns: 1fr;
    }
    
}
 `}</style>

        </div>
    );
}

export default InventoryDetails;
