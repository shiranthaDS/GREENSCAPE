import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Typography, Button, Avatar, message, Row, Col, Tag, Layout, Space } from "antd";
import { FaSignOutAlt, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "antd/dist/reset.css";
import "./CustomerProfile.css";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const CustomerProfile = () => {
  const [email, setEmail] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      handleFetchAppointments(storedEmail);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleFetchAppointments = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/customer?email=${email}`);
      const data = await response.json();
      if (data.length > 0) {
        setAppointments(data);
        setError("");
      } else {
        setAppointments([]);
        setError("No appointments found for this email.");
      }
    } catch (error) {
      console.error("Error fetching customer appointments:", error);
      setError("Error fetching appointments.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    message.success("Logged out successfully!");
    navigate("/");
  };

  const customerInfo = appointments.length > 0 ? appointments[0] : null;

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
    },
    {
      title: "Service",
      dataIndex: "serviceType",
      key: "serviceType",
      render: (service) => <Tag color="blue">{service}</Tag>,
    },
    {
      title: "Site Visit",
      dataIndex: "siteVisitDate",
      key: "siteVisitDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "Not Set"),
    },
    {
      title: "Site Visit Status",
      dataIndex: "siteAnalysisStatus",
      key: "siteAnalysisStatus",
      render: (status) => <Tag color={status === "Completed" ? "green" : "orange"}>{status || "Pending"}</Tag>,
    },
    {
      title: "Project Status",
      dataIndex: "projectStatus",
      key: "projectStatus",
      render: (status) => <Tag color={status === "Completed" ? "green" : "red"}>{status || "Not Started"}</Tag>,
    },
  ];

  return (
    <Layout className="layout-background">

      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#001529", padding: "0 20px" }}>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>My Profile</Title>
        <Button type="primary" danger size="large" icon={<FaSignOutAlt />} onClick={handleLogout}>
          Log Out
        </Button>
      </Header>
      <Content style={{ padding: "40px 80px" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={8} lg={6}>
            <Card className="profile-card" bordered={false} style={{ textAlign: "center",padding: "20px",backgroundColor: "rgba(255, 255, 255, 0.33)", backdropFilter: "blur(10px)", borderRadius: "10px",}}>
              <Avatar size={100} icon={<FaUserCircle />} style={{ backgroundColor: "#1890ff", marginBottom: "15px" }} />
              {customerInfo && (
                <div className="customer-info" style={{ textAlign: "left" }}>
                  <Title level={4}>{customerInfo.name || "Not Available"}</Title>
                  <Space>
                    <FaEnvelope /> {customerInfo.email || "Not Available"}
                  </Space>
                  <br />
                  <Space>
                    <FaPhone />  {customerInfo.phone || "Not Available"}
                  </Space>
                  <br />
                  <Space>
                    <FaMapMarkerAlt />  {customerInfo.address || "Not Available"}
                  </Space>
                  <br />
                  <Text strong>First Appointment:</Text> {customerInfo.createdAt ? new Date(customerInfo.createdAt).toLocaleDateString() : "Not Set"}
                </div>
              )}
              {error && <Text type="danger" style={{ display: "block", marginTop: "10px" }}>{error}</Text>}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={16} lg={18}>
            {appointments.length > 0 && (
              <Card className="appointments-container" bordered={false}style={{
                backgroundColor: "rgba(255, 255, 255, 0.33)", // Transparent effect
                backdropFilter: "blur(10px)",
                borderRadius: "10px",
              }}>
                <Title level={3} style={{ textAlign: "center" }}>Your Appointments</Title> 
                <Card className="transparent-table-container" bordered={false}style={{
                backgroundColor: "rgba(255, 255, 255, 0.69)", // Transparent effect
                backdropFilter: "blur(10px)",
                borderRadius: "10px",
              }}>
  <Table
    dataSource={appointments}
    columns={columns}
    rowKey="_id"
    pagination={{ pageSize: 5 }}
    bordered
  />
</Card>

              </Card>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CustomerProfile;
