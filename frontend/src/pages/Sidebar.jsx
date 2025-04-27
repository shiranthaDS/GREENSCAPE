import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ScheduleOutlined,
  CalendarOutlined,
  ProjectOutlined,
  AppstoreOutlined,
  LogoutOutlined ,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation(); // Get current route

  return (
    <Sider
      width={250}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        background: "#228C22", // Primary green color
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
      }}
    >
      <div
        className="logo"
        style={{
          color: "#ffffff", // White text for contrast
          textAlign: "center",
          padding: "24px 16px",
          fontSize: "20px",
          fontWeight: "bold",
          background: "#228C22",
        }}
      >
        Services Admin 
      </div>
      <Menu
        theme="dark"
        mode="vertical"
        selectedKeys={[location.pathname]}
        style={{ background: "#228C22", borderRight: "none" }}
      >
        <Menu.Item
          key="/admin/analysis"
          icon={<DashboardOutlined style={{ color: "#ffffff" }} />}
          style={{ margin: "8px 0", padding: "0 16px", color: "#ffffff" }}
        >
          <Link to="/admin/analysis" style={{ color: "#ffffff" }}>
            Dashboard
          </Link>
        </Menu.Item>
        <Menu.Item
          key="/admin/calendar"
          icon={<ScheduleOutlined style={{ color: "#ffffff" }} />}
          style={{ margin: "8px 0", padding: "0 16px", color: "#ffffff" }}
        >
          <Link to="/admin/calendar" style={{ color: "#ffffff" }}>
            Scheduled Appointments
          </Link>
        </Menu.Item>
        <Menu.Item
          key="/admin/table"
          icon={<CalendarOutlined style={{ color: "#ffffff" }} />}
          style={{ margin: "8px 0", padding: "0 16px", color: "#ffffff" }}
        >
          <Link to="/admin/table" style={{ color: "#ffffff" }}>
            Appointments
          </Link>
        </Menu.Item>
        <Menu.Item
          key="/admin/project"
          icon={<ProjectOutlined style={{ color: "#ffffff" }} />}
          style={{ margin: "8px 0", padding: "0 16px", color: "#ffffff" }}
        >
          <Link to="/admin/project" style={{ color: "#ffffff" }}>
            Ongoing Projects
          </Link>
        </Menu.Item>
        <Menu.Item
          key="/admin/manage-services"
          icon={<AppstoreOutlined style={{ color: "#ffffff" }} />}
          style={{ margin: "8px 0", padding: "0 16px", color: "#ffffff" }}
        >
          <Link to="/admin/manage-services" style={{ color: "#ffffff" }}>
            Manage Services
          </Link>
        </Menu.Item>
        <Menu.Item
          key="/admin/sign-out"
          icon={<LogoutOutlined  style={{ color: "#ffffff" }} />}
          style={{ margin: "8px 0", padding: "0 16px", color: "#ffffff" }}
        >
          <Link to="/admin-dashboard" style={{ color: "#ffffff" }}>
            Sign Out
          </Link>
        </Menu.Item>
      </Menu>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          padding: "16px",
          color: "#ffffff", // White text for contrast
          background: "#228C22",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)", // Light border
        }}
      >
        Greenscape ©2025 
      </div>
    </Sider>
  );
};

export default Sidebar;