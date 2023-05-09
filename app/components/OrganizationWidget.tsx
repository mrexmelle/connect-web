import { Breadcrumb, Col, Layout, Row, Table, Tree } from "antd";
import { OrganizationDto, OrganizationMemberDto } from "~/models/Dto";
import { useEffect, useState } from "react"
import axios from "axios";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";

interface Props {
  style: React.CSSProperties
  organizationId: string
}

interface BcItem {
  title: string
}
const treeContents = [
  {
    icon: <TeamOutlined />,
    title: 'Expand to load',
    key: '0',
    children: [
      {
        icon: <UserOutlined />,
        title: 'Expanded',
        key: '121',
        isLeaf: true
      },
      {
        icon: <UserOutlined />,
        title: 'Expanded 2',
        key: '12121',
        isLeaf: true
      }
    ]
  },
  {
    icon: <TeamOutlined />,
    title: 'Expand to load',
    key: '1',
  },
  {
    icon: <UserOutlined />,
    title: 'Tree Node',
    key: '2',
    isLeaf: true
  },
];

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
        <Col span={8} style={{ padding: "5px" }}>
          <h1>Organization Tree</h1>
          <Tree
            showIcon={true}
            treeData={treeContents}
            defaultExpandedKeys={['0']}
          />
        </Col>
        <Col span={16} style={{ padding: "5px" }}>
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
