import { ApartmentOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios from "axios";
import { useState } from "react"
import ProfileWidget from "~/components/ProfileWidget";

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: 'navy',
};

const contentStyle: React.CSSProperties = {
  margin: '10px',
  padding: '10px',
  color: 'black',
  backgroundColor: 'white',
};

const siderStyle: React.CSSProperties = {
  height: '32 px',
  margin: '16 px'
}

const siderItems= [
  {
    key: '1',
    icon: <UserOutlined />,
    label: 'My Profile'
  },
  {
    key: '2',
    icon: <ApartmentOutlined />,
    label: 'Organizations'
  }
]

export default function AccountsMe() {
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider collapsible theme="light" style={siderStyle}
        collapsed={siderCollapsed}
        onCollapse={(value) => setSiderCollapsed(value)} >
        <Menu items={siderItems} mode="inline" defaultSelectedKeys={['1']}/>
      </Layout.Sider>
      <Layout>
        <ProfileWidget style={contentStyle}/>
        <Layout.Footer style={{ textAlign: 'center' }}>
          Astro Technologies Indonesia ©2023
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
