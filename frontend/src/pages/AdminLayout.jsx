import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar"; // ✅ Import Sidebar
import { Outlet } from "react-router-dom"; // ✅ Used to render selected admin page
import ServicesDemandAnalysis from "./ServicesDemandAnalysis"; // ✅ Import ServicesDemandAnalysis

const { Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ✅ Sidebar Always Visible */}
      <Sidebar />

      {/* ✅ Main Content Area */}
      <Layout style={{ marginLeft: 250, padding: 20 }}>
        <Content>
          <Outlet /> {/* This dynamically loads selected admin pages */}
        </Content>
      
      </Layout>
      
    </Layout>
  );
};

export default AdminLayout;
