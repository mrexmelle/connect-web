import { AlignCenterOutlined } from "@ant-design/icons";
import { Row, Col, Layout, Card, Descriptions, Divider, List, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react"

interface Profile {
  name: String,
  ehid: String,
  dob: String
}

interface Tenure {
  id: Number,
  employeeId: String,
  startDate: String,
  endDate: String,
  employmentType: String
}

interface TenureData {
  ehid: String,
  tenures: Tenure[]
}

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

const profileTableColumns = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'EHID',
    dataIndex: 'ehid'
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dob'
  }
]

const tenureTableColumns = [
  {
    title: 'Employee ID',
    dataIndex: 'employeeId'
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate'
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  },
  {
    title: 'Employment Type',
    dataIndex: 'employmentType'
  }
]

export default function AccountsMe() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    ehid: "",
    dob: ""
  })
  const [tenureData, setTenureData] = useState<TenureData>({
    ehid: "",
    tenures: []
  })

  useEffect(() => {
    fetchProfile()
    fetchTenures()
  }, [])

  function fetchProfile() {
    axios.defaults.withCredentials = true
    axios.get(
      'http://localhost:8080/accounts/me/profile'
    ).then(
      (response) => {
        setProfile(response.data)
      }
    )
  }

  function fetchTenures() {
    axios.defaults.withCredentials = true
    axios.get(
      'http://localhost:8080/accounts/me/tenures'
    ).then(
      (response) => {
        setTenureData(response.data)
      }
    )
  }

  return (
    <Layout>
      <Layout.Header style={headerStyle}> Connect Web </Layout.Header>
      <Layout.Content style={contentStyle}>
        <Row>
          <Col span={12}>
            <h1>Profile</h1>
            <Table
              pagination={false}
              columns={profileTableColumns}
              dataSource={[profile]} />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <h1>Tenures</h1>
            <Table
              pagination={false}
              columns={tenureTableColumns}
              dataSource={tenureData.tenures} />
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}
