import { ApartmentOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios from "axios";
import { useState } from "react"
import ProfileWidget from "~/components/ProfileWidget";

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
    key: 'MYP',
    icon: <UserOutlined />,
    label: 'My Profile'
  },
  {
    key: 'ORG',
    icon: <ApartmentOutlined />,
    label: 'Organizations'
  }
]

function selectWidget(key: string) {
  switch(key) {
    case 'MYP':
      return <ProfileWidget style={contentStyle}/>
    default:
      return <p>Unrecognised key</p>
  }
}

export default function AccountsMe() {
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false)
  const [selectedMenuItem, selectMenuItem] = useState<string>('MYP')

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider collapsible theme="light" style={siderStyle}
        collapsed={siderCollapsed}
        onCollapse={(value) => setSiderCollapsed(value)} >
        <Menu items={siderItems} mode="inline"
          defaultSelectedKeys={['MYP']}
          selectedKeys={[selectedMenuItem]}
          onSelect={(e) => selectMenuItem(e.key)}/>
      </Layout.Sider>
      <Layout>
        {selectWidget(selectedMenuItem)}
        <Layout.Footer style={{ textAlign: 'center' }}>
          Astro Technologies Indonesia ©2023
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
