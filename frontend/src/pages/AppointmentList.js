import { useEffect, useState } from "react";
import { Table, Select, Card, Typography } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "antd/dist/reset.css"; // Import Ant Design styles

const { Title, Text } = Typography;

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments");
      const data = await response.json();
      setAppointments(data);

      // Group by service type
      const grouped = data.reduce((acc, appt) => {
        if (!acc[appt.serviceType]) {
          acc[appt.serviceType] = [];
        }
        acc[appt.serviceType].push(appt);
        return acc;
      }, {});
      setGroupedAppointments(grouped);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Handle project selection to show customer info
  const handleProjectSelection = (projectId) => {
    setSelectedProjectId(projectId);
    const customer = appointments.find((appt) => appt.projectId === projectId);
    setSelectedCustomer(customer || null);
  };

  // Table columns for grouped appointments
  const columns = [
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Project IDs",
      dataIndex: "projectIds",
      key: "projectIds",
      render: (projectIds) => (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {projectIds.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      ),
    },
  ];

  // Data for the table
  const tableData = Object.entries(groupedAppointments).map(([service, appts]) => ({
    key: service,
    service,
    projectIds: appts.filter((appt) => appt.projectId).map((appt) => appt.projectId),
  }));

  return (
    <div className="33container" style={{ padding: "24px" }}>
      <Title level={2}>Project List of Task Assessment</Title>

      {/* 🔹 Table grouped by Service Type */}
      <Table
        columns={columns}
        dataSource={tableData}
        bordered
        pagination={false}
        style={{ marginBottom: "24px" }}
      />

      {/* 🔹 Select Project ID to view Customer Info */}
      <Card title="Select Project ID" style={{ marginBottom: "24px" }}>
        <Select
          style={{ width: "100%" }}
          placeholder="-- Select Project ID --"
          onChange={handleProjectSelection}
          value={selectedProjectId}
        >
          {appointments
            .filter((appt) => appt.projectId)
            .map((appt) => (
              <Select.Option key={appt.projectId} value={appt.projectId}>
                {appt.projectId}
              </Select.Option>
            ))}
        </Select>
      </Card>

      {/* 🔹 Display Customer Info */}
      {selectedCustomer && (
        <Card title="Customer Information">
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <UserOutlined style={{ marginRight: "8px" }} />
            <Text strong>Name:</Text> {selectedCustomer.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <MailOutlined style={{ marginRight: "8px" }} />
            <Text strong>Email:</Text> {selectedCustomer.email}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <PhoneOutlined style={{ marginRight: "8px" }} />
            <Text strong>Phone:</Text> {selectedCustomer.phone}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <EnvironmentOutlined style={{ marginRight: "8px" }} />
            <Text strong>Address:</Text> {selectedCustomer.address}, {selectedCustomer.city}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AppointmentList;