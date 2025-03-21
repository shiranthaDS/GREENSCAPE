import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Form, Input, Button, Table, Upload, Space, Card, Typography } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ServiceList from "./ServiceList";

const { TextArea } = Input;
const { Title } = Typography;

const AdminServiceForm = () => {
    const [service, setService] = useState({
        name: "",
        description: "",
        moreInfo: "",
        image: null,
    });

    const [services, setServices] = useState([]);
    const [editingServiceId, setEditingServiceId] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/services/");
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleChange = (e) => {
        setService({ ...service, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setService({ ...service, image: e.file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", service.name);
        formData.append("description", service.description);
        formData.append("moreInfo", service.moreInfo);
        if (service.image) formData.append("image", service.image);

        try {
            if (editingServiceId) {
                await axios.put(`http://localhost:5000/api/services/update/${editingServiceId}`, formData);
                toast.success("Service updated successfully");
                setEditingServiceId(null);
            } else {
                await axios.post("http://localhost:5000/api/services/add", formData);
                toast.success("Service added successfully");
            }
            setService({ name: "", description: "", moreInfo: "", image: null });
            fetchServices();
        } catch (error) {
            toast.error("Error saving service");
        }
    };

    const handleEdit = (srv) => {
        setService({
            name: srv.name,
            description: srv.description,
            moreInfo: srv.moreInfo,
            image: null,
        });
        setEditingServiceId(srv._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await axios.delete(`http://localhost:5000/api/services/delete/${id}`);
                toast.success("Service deleted successfully");
                fetchServices();
            } catch (error) {
                toast.error("Error deleting service");
            }
        }
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (imageUrl) => (
                <img
                    src={`http://localhost:5000${imageUrl}`}
                    alt="Service"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "More Info",
            dataIndex: "moreInfo",
            key: "moreInfo",
            render: (moreInfo) => (
                <a href={moreInfo} target="_blank" rel="noopener noreferrer">
                    More Info
                </a>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card style={{ padding: "24px" }}>
            <Title level={2}>{editingServiceId ? "Update Service" : "Add Service"}</Title>
            <Form layout="vertical" onSubmitCapture={handleSubmit}>
                <Form.Item label="Service Name">
                    <Input
                        name="name"
                        placeholder="Service Name"
                        value={service.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Item>
                <Form.Item label="Description">
                    <TextArea
                        name="description"
                        placeholder="Description"
                        value={service.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Item>
                <Form.Item label="More Info">
                    <TextArea
                        name="moreInfo"
                        placeholder="More Info"
                        value={service.moreInfo}
                        onChange={handleChange}
                    />
                </Form.Item>
                <Form.Item label="Upload Image">
                    <Upload
                        name="image"
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            {editingServiceId ? "Update Service" : "Add Service"}
                        </Button>
                        {editingServiceId && (
                            <Button onClick={() => { setEditingServiceId(null); setService({ name: "", description: "", moreInfo: "", image: null }); }}>
                                Cancel
                            </Button>
                        )}
                    </Space>
                </Form.Item>
            </Form>

            <Title level={2} style={{ marginTop: "24px" }}>Manage Services</Title>
            <Table
                dataSource={services}
                columns={columns}
                rowKey="_id"
                bordered
                pagination={{ pageSize: 5 }}
            />

            <ServiceList />
        </Card>
    );
};

export default AdminServiceForm;