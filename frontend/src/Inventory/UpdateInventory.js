import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateInventory.css';
import { ClipLoader } from 'react-spinners';

function UpdateInventory() {
  const [inputs, setInputs] = useState({
    itemName: '',
    category: '',
    quantity: 0,
    supplier: '',
    price: 0,
    maintenanceSchedule: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { itemId } = useParams(); // Changed from InventoryId to itemId to match route

  const categories = [
    "Vehicles & Machinery",
    "Construction & Maintenance Supplies",
    "Gardening Tools & Equipment",
    "Pesticides & Herbicides",
    "Other"
  ];

  const maintenanceSchedules = ["Every Day", "Every Week", "Every Month"];

  // Fetch inventory data by ID
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/inventories/${itemId}`);
        if (res.data && res.data.inventory) {
          setInputs(res.data.inventory);
        } else {
          setError('Inventory item not found');
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/inventories/${itemId}`, inputs);
      navigate('/InventoryDetails');
    } catch (error) {
      console.error("Error updating inventory:", error);
      setError('Failed to update inventory');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader size={50} color={"#4CAF50"} loading={loading} />
        <p>Loading inventory data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/InventoryDetails')} className="back-btn">
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>Update Inventory</h1>
      <form onSubmit={handleSubmit} className="inventory-form">
        <div className="form-group">
          <label>Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={inputs.itemName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            value={inputs.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={inputs.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Supplier:</label>
          <input
            type="text"
            name="supplier"
            value={inputs.supplier}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (Rs.):</label>
          <input
            type="number"
            step="0.01"
            name="price"
            min="0.01"
            value={inputs.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Maintenance Schedule:</label>
          <select
            name="maintenanceSchedule"
            value={inputs.maintenanceSchedule}
            onChange={handleChange}
            required
          >
            <option value="">Select a schedule</option>
            {maintenanceSchedules.map((schedule, idx) => (
              <option key={idx} value={schedule}>{schedule}</option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Inventory'}
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/InventoryDetails')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateInventory;