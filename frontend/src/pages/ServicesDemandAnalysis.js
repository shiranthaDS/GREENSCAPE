import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, Row, Col, Typography, Spin } from "antd";
import "./ServicesDemandAnalysis.css";

const { Title, Text } = Typography;

const ServicesDemandAnalysis = () => {
  const [servicesData, setServicesData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [siteVisitStatusData, setSiteVisitStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await fetchServicesData();
      await fetchProjectStatusData();
      await fetchSiteVisitStatusData();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesData = async () => {
    const response = await fetch("http://localhost:5000/api/appointments");
    const data = await response.json();

    const serviceCounts = data.reduce((acc, appt) => {
      const serviceType = appt.serviceType || "Unknown";
      acc[serviceType] = (acc[serviceType] || 0) + 1;
      return acc;
    }, {});

    const servicesArray = Object.keys(serviceCounts).map((key) => ({
      name: key,
      value: serviceCounts[key],
    }));

    setServicesData(servicesArray);
  };

  const fetchProjectStatusData = async () => {
    const response = await fetch("http://localhost:5000/api/appointments");
    const data = await response.json();

    const statusCounts = data.reduce(
      (acc, appt) => {
        const status = appt.projectStatus || "Not Started";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { "Not Started": 0, "In Progress": 0, Completed: 0 }
    );

    const statusArray = Object.keys(statusCounts).map((key) => ({
      status: key,
      count: statusCounts[key],
    }));

    setProjectStatusData(statusArray);
  };

  const fetchSiteVisitStatusData = async () => {
    const response = await fetch("http://localhost:5000/api/appointments");
    const data = await response.json();

    const statusCounts = data.reduce(
      (acc, appt) => {
        const status = appt.siteAnalysisStatus || "Not Set";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { Pending: 0, Completed: 0, "Not Set": 0 }
    );

    const statusArray = Object.keys(statusCounts).map((key) => ({
      name: key,
      value: statusCounts[key],
    }));

    setSiteVisitStatusData(statusArray);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div className="services-demand-analysis" >
      <Title level={2}>Service Dashboard</Title>
      <Title level={4} type="secondary" >Overview of services, project status, and site visits.</Title>

      {loading ? (
        <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            {/* Services Demand Analysis Card */}
            <Col xs={24} sm={24} md={12}>
              <Card title="Services Demand Analysis" bordered>
                <PieChart width={470} height={300}>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(2)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Card>
            </Col>

            {/* Project Status Breakdown Card */}
            <Col xs={24} sm={24} md={12}>
              <Card title="Project Status Breakdown" bordered>
                <BarChart
                  width={350}
                  height={300}
                  data={projectStatusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            {/* Site Visit Status Overview Card */}
            <Col xs={24} sm={24} md={12} offset={6}>
              <Card title="Site Visit Status Overview" bordered>
                <PieChart width={500} height={300}>
                  <Pie
                    data={siteVisitStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(2)}%)`}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {siteVisitStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ServicesDemandAnalysis;
