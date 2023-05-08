import { Breadcrumb, Col, Layout, Row, Table } from "antd";
import { OrganizationDto, OrganizationMemberDto } from "~/models/Dto";
import { useEffect, useState } from "react"
import axios from "axios";

interface Props {
  style: React.CSSProperties
  organizationId: string
}

interface BcItem {
  title: string
}

const memberTableColumns = [
  {
    title: 'Employee ID',
    dataIndex: 'employeeId'
  },
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Email Address',
    dataIndex: 'emailAddress'
  },
  {
    title: 'Title',
    dataIndex: 'titleName'
  },
  {
    title: 'Role',
    dataIndex: 'organizationRole'
  }
]

export default function ({style, organizationId}: Props) {
  const [breadCrumbItems, setBreadcrumbItems] = useState<BcItem[]>([])
  const [organizationDto, setOrganizationDto] = useState<OrganizationDto>({
    organization: {
      id: "",
      hierarchy: "",
      name: "",
      leadEhid: "",
      emailAddress: ""
    },
    status: ""
  })
  const [memberDto, setMemberDto] = useState<OrganizationMemberDto>({
    members: [],
    status: ""
  })

  useEffect(() => {
    fetchOrganization(),
    fetchMember()
  }, [])

  function fetchOrganization() {
    axios.defaults.withCredentials = true
    axios.get<OrganizationDto>(
      'http://localhost:8080/organizations/'+organizationId
    ).then(
      (response) => {
        generateBreadcumbItems(response.data.organization.hierarchy)
        setOrganizationDto(response.data)
      }
    )
  }

  function fetchMember() {
    axios.defaults.withCredentials = true
    axios.get<OrganizationMemberDto>(
      'http://localhost:8080/organizations/'+organizationId+'/members'
    ).then(
      (response) => {
        var data = response.data
        data.members.forEach((m, i) => {
          if(m.isLead) {
            data.members[i].organizationRole = "Lead"
          }
        })
        data.members.sort((a,b) => {
          if(a.isLead) {
            return -1
          } else {
            return 1
          }
        })
        setMemberDto(data)
      }
    )
  }

  function generateBreadcumbItems(hierarchy: string) {
    var bcItems = hierarchy.split('.').map<BcItem>((h) => {
      return {
        title: h
      }
    })
    setBreadcrumbItems(bcItems)
  }

  return (
    <Layout.Content style={style}>
      <Row>
        <Col span={24}>
          <h1>{organizationDto.organization.name}</h1>
          <Breadcrumb items={breadCrumbItems} />
          <Table
            pagination={false}
            columns={memberTableColumns}
            rowKey="ehid"
            dataSource={memberDto.members} />
        </Col>
      </Row>
    </Layout.Content>
  );
}
