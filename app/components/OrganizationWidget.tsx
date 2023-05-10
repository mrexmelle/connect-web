import { Breadcrumb, Col, Layout, Row, Table, Tree } from "antd";
import { OrganizationDto, OrganizationMemberDto, TreeDto } from "~/models/Dto";
import { Key, ReactNode, useEffect, useState } from "react"
import axios from "axios";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { OrganizationTreeEntity } from "~/models/Entity";

interface Props {
  style: React.CSSProperties
  organizationId: string
}

interface BcItem {
  title: string
}

interface TreeItem {
  icon: ReactNode
  title: string
  key: Key
  isLeaf: boolean
  children: TreeItem[]
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
  const [treeContent, setTreeContent] = useState<TreeItem[]>([])
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([])

  useEffect(() => {
    fetchOrganization()
    fetchMember()
    fetchTree()
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

  function fillTreeWithDto(entity: OrganizationTreeEntity): TreeItem {
    var uiNode: TreeItem = {
      icon: <TeamOutlined />,
      title: entity.organization.name,
      key: entity.organization.id,
      isLeaf: false,
      children: new Array<TreeItem>(entity.children.length)
    }
    for (let [i, _] of entity.children.entries()) {
      uiNode.children[i] = fillTreeWithDto(entity.children[i])
    }
    return uiNode
  }

  function fetchTree() {
    axios.defaults.withCredentials = true
    axios.get<TreeDto>(
      'http://localhost:8080/organizations/'+organizationId+'/siblings-and-ancestral-siblings'
    ).then(
      (response) => {
        var tc = new Array<TreeItem>(1)
        tc[0]=fillTreeWithDto(response.data.tree)
        setTreeContent(tc)
        var lineage = organizationDto.organization.hierarchy
        
      }
    )
  }

  function generateBreadcumbItems(hierarchy: string) {
    var lineage = hierarchy.split('.')
    var bcItems = lineage.map<BcItem>((h) => {
      return {
        title: h
      }
    })
    console.log('lineage: ' + lineage)
    setExpandedKeys(lineage)
    setBreadcrumbItems(bcItems)
  }

  return (
    <Layout.Content style={style}>
      <Row>
        <Col span={8} style={{ padding: "5px" }}>
          <h1>Organization Tree</h1>
          <Tree
            showIcon={true}
            treeData={treeContent}
            defaultExpandedKeys={expandedKeys}
            expandedKeys={expandedKeys}
            onExpand={(keys) => {
              setExpandedKeys(keys)
            }}
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
