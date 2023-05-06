import { AlignCenterOutlined } from "@ant-design/icons";
import { Row, Col, Layout, Card, Descriptions, Divider, List, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react"

interface ProfileEntity {
  name: String,
  ehid: String,
  employeeId: String,
  emailAddress: String,
  dob: String
}

interface ProfileDto {
  profile: ProfileEntity,
  status: String
}

interface TenureEntity {
  id: Number,
  employeeId: String,
  startDate: String,
  endDate: String,
  employmentType: String,
  organizationId: String,
  organizationName: String
}

interface TenureDto {
  tenures: TenureEntity[],
  status: String
}

interface OrganizationEntity {
  id: String,
  hierarchy: String,
  name: String,
  leadEhid: String
}

interface OrganizationDto {
  organization: OrganizationEntity,
  status: String
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
    title: 'Employee ID',
    dataIndex: 'employeeId'
  },
  {
    title: 'Email Address',
    dataIndex: 'emailAddress'
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dob'
  }
]

const tenureTableColumns = [
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
  },
  {
    title: 'Organization',
    dataIndex: 'organizationName'
  }
]

export default function AccountsMe() {
  const [profileDto, setProfileDto] = useState<ProfileDto>({
    profile: {
      name: "",
      ehid: "",
      employeeId: "",
      emailAddress: "",
      dob: ""
    },
    status: ""
  })
  const [tenureDto, setTenureDto] = useState<TenureDto>({
    tenures: [],
    status: ""
  })

  useEffect(() => {
    fetchProfile()
    fetchTenures()
  }, [])

  function fetchProfile() {
    axios.defaults.withCredentials = true
    axios.get<ProfileDto>(
      'http://localhost:8080/accounts/me/profile'
    ).then(
      (response) => {
        setProfileDto(response.data)
      }
    )
  }

  function fetchTenures() {
    axios.defaults.withCredentials = true
    axios.get<TenureDto>(
      'http://localhost:8080/accounts/me/tenures'
    ).then(
      (response) => {
        const orgRequests = response.data.tenures.map((t) => {
          return axios.get<OrganizationDto>('http://localhost:8080/organizations/'+t.organizationId)
        })

        Promise.all(orgRequests).then((r) => {
          r.map((t, idx) => {
            response.data.tenures[idx].organizationName = t.data.organization.name
          })
          setTenureDto(response.data)
        })
        
      }
    )
  }

  return (
    <Layout>
      <Layout.Header style={headerStyle}> Connect Web </Layout.Header>
      <Layout.Content style={contentStyle}>
        <Row>
          <Col span={24}>
            <h1>Profile</h1>
            <Table
              pagination={false}
              columns={profileTableColumns}
              rowKey="ehid"
              dataSource={[profileDto.profile]} />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <h1>Tenures</h1>
            <Table
              pagination={false}
              columns={tenureTableColumns}
              rowKey="id"
              dataSource={tenureDto.tenures} />
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}
