import { type V2_MetaFunction } from "@remix-run/node";
import { Button, Input, Row, Col, Layout } from "antd";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "@remix-run/react";


export const meta: V2_MetaFunction = () => {
  return [{ title: "Connect Web" }];
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: 'navy',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '10px',
  padding: '10px',
  color: '#fff',
  backgroundColor: 'white',
};

const rowStyle: React.CSSProperties = {
  margin: '10px'
}

export default function Index() {
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  function onEmployeeIdChange(e: ChangeEvent<HTMLInputElement>) {
    setEmployeeId(e.target.value)
  }
  
  function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  function Login() {
    axios.post(
      'http://localhost:8080/sessions',
      {
        employeeId: employeeId,
        password: password
      }
    ).then(
      function (response) {
        navigate("/accounts/me")
      }
    )
  }

  return (
    <Layout>
      <Layout.Header style={headerStyle}> Connect Web </Layout.Header>
      <Layout.Content style={contentStyle}>
        <Row>
          <Col span={8} />
          <Col span={8}>
            <Row style={rowStyle}>
            <Input size="large" placeholder="Employee ID" prefix={<UserOutlined />}
              onChange={onEmployeeIdChange} value={employeeId}/>
            <Input.Password size="large" placeholder="Password" prefix={<KeyOutlined />}
              onChange={onPasswordChange} value={password}/>
            </Row>
            <Row style={rowStyle}>
            <Button size="large" type="primary" onClick={Login} block>Login</Button>
            </Row>
          </Col>
          <Col span={8} />
        </Row>
      </Layout.Content>
    </Layout>
  );
}
