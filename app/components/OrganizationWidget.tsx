import { Breadcrumb, Col, Layout, Row, Table, Tree } from "antd";
import { OrganizationMemberDto, TreeDto } from "~/models/Dto";
import { Key, ReactNode, useEffect, useState } from "react"
import axios from "axios";
import { TeamOutlined } from "@ant-design/icons";
import { OrganizationEntity, OrganizationMemberEntity, OrganizationTreeEntity } from "~/models/Entity";

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
  const [newOrganizationId, setNewOrganizationId] = useState<Key>(organizationId)
  const [breadCrumbItems, setBreadcrumbItems] = useState<BcItem[]>([])
  const [organizationEntity, setOrganizationEntity] = useState<OrganizationEntity>({
    id: "",
    hierarchy: "",
    name: "",
    leadEhid: "",
    emailAddress: ""
  })
  const [teamMembers, setTeamMembers] = useState<OrganizationMemberEntity[]>([])
  const [treeContent, setTreeContent] = useState<TreeItem[]>([])
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([])
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])

  useEffect(() => {
    fetchOrganization()
    fetchMember()
  }, [newOrganizationId])

  useEffect(() => {
    fetchTree()
  }, [])

  function fetchOrganization() {
    axios.defaults.withCredentials = true
    axios.get<TreeDto>(
      'http://localhost:8080/organizations/'+newOrganizationId+'/lineage'
    ).then(
      (response) => {
        setOrganizationInformation(response.data)
      }
    )
  }

  function fetchMember() {
    axios.defaults.withCredentials = true
    axios.get<OrganizationMemberDto>(
      'http://localhost:8080/organizations/'+newOrganizationId+'/members'
    ).then(
      (response) => {
        var data = response.data
        data.members.forEach((m, i) => {
          if(m.isLead) {
            data.members[i].organizationRole = "Lead"
          }
        })
        data.members.sort((a,b) => {
          if (a.isLead) {
            return -1
          } else if (b.isLead) {
            return 1
          } else {
          return a.name < b.name ? -1 : 1
          }
        })
        setTeamMembers(data.members)
      }
    )
  }

  function fillTree(entity: OrganizationTreeEntity): TreeItem {
    console.log("fillTree is called")
    var uiNode: TreeItem = {
      icon: <TeamOutlined />,
      title: entity.organization.name,
      key: entity.organization.id,
      isLeaf: false,
      children: new Array<TreeItem>(entity.children.length)
    }
    for (let [i, _] of entity.children.entries()) {
      uiNode.children[i] = fillTree(entity.children[i])
    }
    return uiNode
  }

  function findNodeByKey(key: Key, tree: TreeItem): TreeItem|null {
    if (key == tree.key) {
      return tree
    }
    for (let [i, _] of tree.children.entries()) {
      var node = findNodeByKey(key, tree.children[i])
      if (node) {
        return node
      }
    }
    return null
  }

  function cloneTreeItem(item: TreeItem): TreeItem {
    var clone = {
      icon: item.icon,
      title: item.title,
      key: item.key,
      isLeaf: item.isLeaf,
      children: Array<TreeItem>(item.children.length)
    }
    for (let [i, _] of item.children.entries()) {
      clone.children[i] = cloneTreeItem(item.children[i])
    }
    return clone
  }

  function fetchTree() {
    if (treeContent.length > 0) {
      return
    }
    axios.defaults.withCredentials = true
    axios.get<TreeDto>(
      'http://localhost:8080/organizations/'+newOrganizationId+'/siblings-and-ancestral-siblings'
    ).then(
      (response) => {
        var tc = new Array<TreeItem>(1)
        tc[0]=fillTree(response.data.tree)
        setTreeContent(tc)        
      }
    )
  }

  function setOrganizationInformation(dto: TreeDto) {
    var bcItems = []
    var keys = []
    var lastOrganization = organizationEntity
    var node : OrganizationTreeEntity|null = dto.tree
    while(node) {
      bcItems.push({
        title: node.organization.name
      })
      keys.push(node.organization.id)
      lastOrganization = node.organization

      if (node.children.length > 0) {
        node = node.children[0]
      } else {
        node = null
      }
    }

    setOrganizationEntity(lastOrganization)
    setBreadcrumbItems(bcItems)
    setSelectedKeys([keys[keys.length-1]])

    if (expandedKeys.length == 0) {
      setExpandedKeys(keys.slice(0,-1))
    }
  }

  function onTreeItemExpanded(keys: Key[], info: any) {
    if (info.expanded) {
      var lastKey = keys[keys.length-1]
      var treeClone = cloneTreeItem(treeContent[0])
      var node = findNodeByKey(lastKey, treeClone)
      if (node && node.children.length == 0) {
        console.log("requesting")
        axios.defaults.withCredentials = true
        var response = axios.get<TreeDto>(
          'http://localhost:8080/organizations/'+lastKey+'/children'
        )
        Promise.all([response]).then((r) => {
          var tree = r[0].data.tree
          if (node) { /* Just to remove node null warning */
            if (tree.children.length == 0) {
              node.isLeaf = true
            } else {
              node.children = tree.children.map((item: OrganizationTreeEntity) => {
                return {
                  icon: <TeamOutlined />,
                  title: item.organization.name,
                  key: item.organization.id,
                  isLeaf: false,
                  children: []
                }
              })
            }
          }
          setTreeContent([treeClone])
        })
      }
    }
    setExpandedKeys(keys)
  }

  function onTreeItemSelected(keys: Key[]) {
    if (keys.length != 0 && keys[0] != newOrganizationId) {
      setNewOrganizationId(keys[0])
    }
    setSelectedKeys(keys)
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
            defaultSelectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            onExpand={onTreeItemExpanded}
            onSelect={onTreeItemSelected}
          />
        </Col>
        <Col span={16} style={{ padding: "5px" }}>
          <h1>{organizationEntity.name}</h1>
          <Breadcrumb items={breadCrumbItems} />
          <Table
            pagination={false}
            columns={memberTableColumns}
            rowKey="ehid"
            dataSource={teamMembers} />
        </Col>
      </Row>
    </Layout.Content>
  );
}
