import React, { useState } from "react";
import "./CostEstimator.css";       

// Data for services and materials
const services = {
  landscaping: { name: "Landscaping", basePrice: 500, img: "/images/bgg.jpg" },
  paving: { name: "Interlock Paving", basePrice: 800, img: "paving.jpg" },
  indoorLandscaping: { name: "Indoor Landscaping", basePrice: 600, img: "indoor_landscaping.jpg" },
  lawning: { name: "Lawning", basePrice: 450, img: "lawning.jpg" },
  planting: { name: "Planting", basePrice: 300, img: "planting.jpg" },
  pathways: { name: "Pathways", basePrice: 700, img: "pathways.jpg" },
  ponds: { name: "Ponds & Waterfalls", basePrice: 1200, img: "ponds.jpg" },
  courtyard: { name: "Courtyard Design", basePrice: 900, img: "courtyard.jpg" },
  rooftop: { name: "Rooftop Gardening", basePrice: 1000, img: "rooftop.jpg" },
  greenWalls: { name: "Green Walls", basePrice: 1100, img: "green_walls.jpg" },
  irrigation: { name: "Irrigation Systems", basePrice: 750, img: "irrigation.jpg" },
  stonePaving: { name: "Stone Paving", basePrice: 850, img: "stone_paving.jpg" },
  wallCladding: { name: "Wall Cladding", basePrice: 950, img: "wall_cladding.jpg" },
  pebbleDecor: { name: "Pebble Decorative", basePrice: 400, img: "pebble_decor.jpg" },
};

const materials = {
  landscaping: [
    { name: "Bermuda Grass", price: 50, img: "grass1.jpg" },
    { name: "Zoysia Grass", price: 60, img: "grass2.jpg" },
    { name: "Buffalo Grass", price: 70, img: "grass3.jpg" },
    { name: "Fescue Grass", price: 80, img: "grass4.jpg" },
  ],
  paving: [
    { name: "Concrete Blocks", price: 120, img: "concrete.jpg" },
    { name: "Natural Stone", price: 180, img: "stone.jpg" },
    { name: "Clay Bricks", price: 150, img: "bricks.jpg" },
  ],
  irrigation: [
    { name: "Drip System", price: 300, img: "drip.jpg" },
    { name: "Sprinkler System", price: 400, img: "sprinkler.jpg" },
    { name: "Manual Irrigation", price: 200, img: "manual.jpg" },
  ],
};

const serviceChargeRate = 0.1; // 10% service charge

const CostEstimator = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [areas, setAreas] = useState({});
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [totalCost, setTotalCost] = useState(null);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleAreaChange = (service, value) => {
    setAreas((prev) => ({ ...prev, [service]: value }));
  };

  const handleMaterialChange = (service, material) => {
    setSelectedMaterials((prev) => ({ ...prev, [service]: material }));
  };

  const calculateCost = () => {
    let subtotal = 0;
    let details = [];

    selectedServices.forEach((service) => {
      const area = parseFloat(areas[service] || 0);
      const basePrice = services[service].basePrice;
      const material = selectedMaterials[service] || { price: 0 };

      if (area > 0) {
        const cost = area * basePrice + area * material.price;
        subtotal += cost;
        details.push({ service: services[service].name, area, cost });
      }
    });

    const serviceCharge = subtotal * serviceChargeRate;
    const finalTotal = subtotal + serviceCharge;

    setTotalCost({ subtotal, serviceCharge, finalTotal, details });
  };

  return (
    <div className="cost-estimator">
      <h2>Landscaping & Gardening Cost Estimator</h2>

      <div className="services-section">
        <h4>Select Services:</h4>
        {Object.keys(services).map((key) => (
          <div key={key} className="service-item">
            <div
              onClick={() => toggleService(key)}
              className={`service-option ${selectedServices.includes(key) ? "selected" : ""}`}
            >
              <img src={services[key].img} alt={services[key].name} className="service-img" />
              <p>{services[key].name}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedServices.length > 0 &&
        selectedServices.map((service) => (
          <div key={service} className="service-details">
            <h4>{services[service].name}</h4>

            <label>Enter Area (sq. ft):</label>
            <input
              type="number"
              value={areas[service] || ""}
              onChange={(e) => handleAreaChange(service, e.target.value)}
              placeholder="Enter area size"
            />

            {materials[service] && (
              <>
                <label>Select Material:</label>
                <div className="material-selection">
                  {materials[service].map((material) => (
                    <div
                      key={material.name}
                      onClick={() => handleMaterialChange(service, material)}
                      className={`material-item ${selectedMaterials[service]?.name === material.name ? "selected" : ""}`}
                    >
                      <img src={material.img} alt={material.name} className="material-img" />
                      <p>{material.name} - LKR {material.price} per sq. ft</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

      <button onClick={calculateCost} className="estimate-button">Get Estimate</button>

      {totalCost && (
        <div className="cost-breakdown">
          <h3>Cost Breakdown</h3>
          {totalCost.details.map((detail, index) => (
            <p key={index}>
              <strong>{detail.service}</strong> ({detail.area} sq. ft) = LKR {detail.cost.toLocaleString()}
            </p>
          ))}
          <hr />
          <p>Subtotal: LKR {totalCost.subtotal.toLocaleString()}</p>
          <p>Service Charge (10%): LKR {totalCost.serviceCharge.toLocaleString()}</p>
          <h3>Total Cost: LKR {totalCost.finalTotal.toLocaleString()}</h3>
        </div>
      )}
    </div>
  );
};

export default CostEstimator;
