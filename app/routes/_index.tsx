import { type V2_MetaFunction } from "@remix-run/node";
import { Button, Input, Row, Col, Layout, Modal } from "antd";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import axios, { AxiosError } from "axios";
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
  color: 'black',
  backgroundColor: 'white',
};

const rowStyle: React.CSSProperties = {
  margin: '10px'
}

export default function Index() {
  const [employeeId, setEmployeeId] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [modal, modalContextHolder] = Modal.useModal()
  const navigate = useNavigate()

  function onEmployeeIdChange(e: ChangeEvent<HTMLInputElement>) {
    setEmployeeId(e.target.value)
  }
  
  function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  function Login() {
    if (employeeId == "" || password == "") {
      modal.warning({
        title: "Empty credential",
        content: "Both username and password must be filled before proceeding."
      })
      return
    }
    axios.defaults.withCredentials = true
    axios.post(
      'http://localhost:8080/sessions',
      {
        employeeId: employeeId,
        password: password
      }
    ).then(
      (_) => {
        navigate('/accounts/me')
      }
    ).catch(
      (error: AxiosError) => {
        modal.error({
          title: "Authentication failure",
          content: "Either account is not registered or a wrong password is entered. Please contact your adminstrator.",
        })
      }
    )
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={headerStyle}> Connect Web </Layout.Header>
      <Layout.Content style={contentStyle}>
        <Row>
          <Col span={8} />
          <Col span={8}>
            <Row style={rowStyle}>
            <Input size="large" placeholder="Employee ID" prefix={<UserOutlined />}
              onChange={onEmployeeIdChange} onPressEnter={Login}
              value={employeeId}/>
            <Input.Password size="large" placeholder="Password" prefix={<KeyOutlined />}
              onChange={onPasswordChange} onPressEnter={Login}
              value={password}/>
            </Row>
            <Row style={rowStyle}>
            <Button size="large" type="primary" onClick={Login} block>Login</Button>
            </Row>
          </Col>
          <Col span={8} />
        </Row>
        {modalContextHolder}
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>
          Astro Technologies Indonesia ©2023
        </Layout.Footer>
    </Layout>
  );
}
