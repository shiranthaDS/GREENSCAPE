import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "./adminappt.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Table, Input, Select, Button, Modal, DatePicker, Card, Typography, Space, Tag } from "antd";
import { SearchOutlined, FilePdfOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
const { Option } = Select;
const { Title, Text } = Typography;

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    siteVisitDate: "",
    siteAnalysisStatus: "Pending",
    projectStatus: "Not Started",
    projectId: "",
  });

  const [scheduledDates, setScheduledDates] = useState([]);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // 🔹 Search Filters
  const [searchEmail, setSearchEmail] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments");
      const data = await response.json();
      setAppointments(data);

      // Extract and store scheduled site visit dates
      const dates = data
        .filter((appt) => appt.siteVisitDate)
        .map((appt) => new Date(appt.siteVisitDate));
      setScheduledDates(dates);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
      });

      // Remove the deleted appointment from the state
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt._id !== id)
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      siteVisitDate: appointment.siteVisitDate || "",
      siteAnalysisStatus: appointment.siteAnalysisStatus || "Pending",
      projectStatus: appointment.projectStatus || "Not Started",
      projectId: appointment.projectId || "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${selectedAppointment._id}/update-info`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // If a site visit is scheduled, also trigger the email
        if (formData.siteVisitDate) {
          await fetch(
            `http://localhost:5000/api/appointments/${selectedAppointment._id}/site-visit`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ siteVisitDate: formData.siteVisitDate }),
            }
          );
        }

        setIsModalOpen(false);
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error updating appointment info:", error);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (
      view === "month" &&
      scheduledDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      )
    ) {
      return "highlight-date";
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const filteredAppointments = appointments.filter(
      (appt) => new Date(appt.siteVisitDate).toDateString() === date.toDateString()
    );
    setSelectedDateAppointments(filteredAppointments);
    setIsCalendarModalOpen(true);
  };

  // 🔹 Filter appointments based on search criteria
  const filteredAppointments = appointments.filter((appt) => {
    const matchesEmail = searchEmail ? appt.email.includes(searchEmail) : true;
    const matchesPhone = searchPhone ? appt.phone.includes(searchPhone) : true;
    const matchesMonth = searchMonth
      ? new Date(appt.createdAt).getMonth() + 1 === parseInt(searchMonth)
      : true;

    return matchesEmail && matchesPhone && matchesMonth;
  });

  // 🔹 Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();

    // 🔹 Add Company Logo
    const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH3ZRVzP4ZJoyNCj9oianoennIa1Wen29Ypw&s"; // Replace with your logo URL
    doc.addImage(logoUrl, "PNG", 15, 20, 40, 20); // Adjust position and size as needed

    // 🔹 Add Header Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Greenscape (Pvt)Ltd", 60, 20); // Adjust position as needed
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("No 10 ,New plaza road, Mababe, Sri lanka", 60, 28);
    doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 34);

    // 🔹 Add Report Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Report", 14, 50);

    // 🔹 Add Current Date
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Date: ${currentDate}`, 14, 60);

    // 🔹 Define Table Columns
    const columns = [
      "App ID",
      "Customer Name",
      "Email",
      "Phone",
      "City",
      "Service",
      "Site Visit Date",
      "Project Status",
    ];

    // 🔹 Map Filtered Appointments to Table Rows
    const rows = filteredAppointments.map((appt) => [
      appt.appointmentId,
      appt.name,
      appt.email,
      appt.phone,
      appt.city,
      appt.serviceType,
      appt.siteVisitDate
        ? new Date(appt.siteVisitDate).toLocaleDateString()
        : "Not Set",
      appt.projectStatus || "Not Started",
    ]);

    // 🔹 Add the Table to the PDF
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 70, // Start table below the header section
      theme: "grid", // Add grid lines to the table
      styles: { fontSize: 10, cellPadding: 2 }, // Customize table styles
      headStyles: { fillColor: [22, 160, 133] }, // Customize header row color
    });

    // 🔹 Add Signature Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Authorized Signature", 14, doc.lastAutoTable.finalY + 20);
    doc.setFont("helvetica", "normal");
    doc.text(".................", 14, doc.lastAutoTable.finalY + 26);

    // 🔹 Save the PDF
    doc.save("appointments_report.pdf");
  };

  // 🔹 Table Columns
  const columns = [
    {
      title: "App ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
    },
    {
      title: "Customer Info",
      key: "customerInfo",
      render: (record) => (
        <Space direction="vertical">
          <Text strong>Name:{record.name}</Text>
          <Text>Email:{record.email}</Text>
          <Text>Phone:{record.phone}</Text>
          <Text>Address:{record.address}</Text>
          <Text>
            <CalendarOutlined />{" "}
            {record.createdAt
              ? new Date(record.createdAt).toLocaleDateString()
              : "Not Set"}
          </Text>
        </Space>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Service",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "Site Visit",
      key: "siteVisit",
      render: (record) => (
        <Space direction="vertical">
          <Text>
            <CalendarOutlined />{" "}
            {record.siteVisitDate
              ? new Date(record.siteVisitDate).toLocaleDateString()
              : "Not Set"}
          </Text>
          <Tag color={record.siteAnalysisStatus === "Completed" ? "green" : "orange"}>
            {record.siteAnalysisStatus || "Pending"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Project",
      key: "project",
      render: (record) => (
        <Space direction="vertical">
          <Tag color={record.projectStatus === "Ongoing" ? "blue" : "default"}>
            {record.projectStatus || "Not Started"}
          </Tag>
          <Text>{record.projectId || "Not Assigned"}</Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={2}>Appointment Details</Title>
      <br></br>
      <br></br>
      <br></br> 
      <br></br>
      {/* 🔹 Search Filters */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by email"
          prefix={<SearchOutlined />}
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <Input
          placeholder="Search by phone"
          prefix={<SearchOutlined />}
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <Select
          placeholder="Search by month"
          value={searchMonth}
          onChange={(value) => setSearchMonth(value)}
          style={{ width: 150 }}
        >
          <Option value="">All Months</Option>
          <Option value="1">January</Option>
          <Option value="2">February</Option>
          <Option value="3">March</Option>
          <Option value="4">April</Option>
          <Option value="5">May</Option>
          <Option value="6">June</Option>
          <Option value="7">July</Option>
          <Option value="8">August</Option>
          <Option value="9">September</Option>
          <Option value="10">October</Option>
          <Option value="11">November</Option>
          <Option value="12">December</Option>
        </Select>
        <Button type="primary" icon={<FilePdfOutlined />} onClick={generatePDF}>
          Generate PDF
        </Button>
      </Space>

      {/* 🔹 Appointments Table */}
      <Table
        columns={columns}
        dataSource={filteredAppointments}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 10 }}
        size="middle"
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                style={{
                  
                  backgroundColor: "#90EE90", // Blue color for header background
                  color: "fffff", // White text color
                  fontWeight: "bold", // Bold text
                  textAlign: "center", // Center-align text
                }}
              />
            ),
          },
        }}
        
      />

      {/* 🔹 Modal for Updating Appointment Info */}
      <Modal
        title={`Update Info - ${selectedAppointment?.appointmentId}`}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Submit
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Site Visit Date"
            value={formData.siteVisitDate ? moment(formData.siteVisitDate) : null}
            onChange={(date, dateString) =>
              setFormData({ ...formData, siteVisitDate: dateString })
              
            }
            disabledDate={(current) => current && current < moment().startOf("day")}
          />
          <Select
            style={{ width: "100%" }}
            placeholder="Site Analysis Status"
            value={formData.siteAnalysisStatus}
            onChange={(value) =>
              setFormData({ ...formData, siteAnalysisStatus: value })
            }
          >
            <Option value="Pending">Pending</Option>
            <Option value="Completed">Completed</Option>
          </Select>
          <Select
            style={{ width: "100%" }}
            placeholder="Project Status"
            value={formData.projectStatus}
            onChange={(value) =>
              setFormData({ ...formData, projectStatus: value })
            }
          >
            <Option value="Not Started">Not Started</Option>
            <Option value="Ongoing">Ongoing</Option>
            <Option value="Hold">Hold</Option>
          </Select>
          
          <Input
            placeholder="Project ID(e.g.PRJ123)"
            value={formData.projectId}
            onChange={(e) =>
              setFormData({ ...formData, projectId: e.target.value })
            }
          />
        </Space>
      </Modal>

      {/* 🔹 Modal for Showing Appointments on Clicked Date */}
      <Modal
        title={`Appointments on ${selectedDate?.toLocaleDateString()}`}
        visible={isCalendarModalOpen}
        onCancel={() => setIsCalendarModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsCalendarModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedDateAppointments.length > 0 ? (
          selectedDateAppointments.map((appt) => (
            <Card key={appt._id} style={{ marginBottom: 16 }}>
              <Title level={4}>Customer Information</Title>
              <Text>
                <strong>Name:</strong> {appt.name}
              </Text>
              <br />
              <Text>
                <strong>Email:</strong> {appt.email}
              </Text>
              <br />
              <Text>
                <strong>Phone:</strong> {appt.phone}
              </Text>
              <br />
              <Text>
                <strong>Address:</strong> {appt.address}, {appt.city}
              </Text>
              <br />
              <Title level={4}>Service Details</Title>
              <Text>
                <strong>Service Type:</strong> {appt.serviceType}
              </Text>
            </Card>
          ))
        ) : (
          <Text>No appointments scheduled.</Text>
        )}
      </Modal>
    </Card>
  );
};

export default AdminAppointments;