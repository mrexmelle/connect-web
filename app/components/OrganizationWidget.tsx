import { Breadcrumb, Button, Col, Layout, Row, Table, Tree } from "antd";
import { Key, ReactNode, useEffect, useState } from "react"
import axios, { AxiosError, AxiosResponse } from "axios";
import { HomeOutlined, TeamOutlined } from "@ant-design/icons";
import {
  OrganizationMemberDto,
  OrganizationTreeDto,
  OrganizationMemberViewModel,
  ProfileDto,
  OrganizationOfficerDto,
  OrganizationChildrenDto
} from "~/models/Dto";

import {
  DesignationEntity,
  MembershipViewEntity,
  OrganizationEntity,
  TreeNodeEntity
} from "~/models/Entity";

interface Props {
  style: React.CSSProperties
  defaultOrganizationEntity: OrganizationEntity,
  lastSelectedOrganizationId: Key,
  lastTreeContent: TreeItem[],
  onSelectedOrganizationIdChange: (id: Key) => void,
  onTreeItemChange: (treeItem: TreeItem[]) => void
}

const buttonColStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'right',
  alignItems: 'center',
  padding: '5px'
}

interface BcItem {
  title: string
}

export interface TreeItem {
  icon: ReactNode
  title: string
  key: Key
  isLeaf: boolean
  children: TreeItem[]
}

const memberTableColumns = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Email Address',
    dataIndex: 'email_address'
  },
  {
    title: 'Role',
    dataIndex: 'role'
  }
]

export default function ({
  style,
  defaultOrganizationEntity,
  lastSelectedOrganizationId,
  lastTreeContent,
  onSelectedOrganizationIdChange,
  onTreeItemChange
}: Props) {
  const API_BASE_URL = "http://localhost:8079"
  const [currentOrganizationId, setCurrentOrganizationId] = useState<Key>(lastSelectedOrganizationId)
  const [treeContent, setTreeContent] = useState<TreeItem[]>(lastTreeContent)

  const [breadCrumbItems, setBreadcrumbItems] = useState<BcItem[]>([])
  const [organizationEntity, setOrganizationEntity] = useState<OrganizationEntity>({
    id: "",
    hierarchy: "",
    name: "",
    email_address: ""
  })
  const [memberViewModels, setMemberViewModels] = useState<OrganizationMemberViewModel[]>([])
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([])
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])

  useEffect(() => {
    fetchOrganization()
    fetchMember()
  }, [currentOrganizationId])

  useEffect(() => {
    fetchTree()
  }, [])

  function fetchOrganization() {
    axios.defaults.withCredentials = true
    axios.get<OrganizationTreeDto>(
      API_BASE_URL + '/organization-nodes/'+currentOrganizationId+'/lineage'
    ).then(
      (response: AxiosResponse<OrganizationTreeDto>) => {
        setOrganizationInformation(response.data.data)
      }
    )
  }

  function fetchMember() {
    axios.defaults.withCredentials = true
    axios.get<OrganizationMemberDto>(API_BASE_URL + '/organization-nodes/'+currentOrganizationId+'/members')
      .then((memberResponse: AxiosResponse<OrganizationMemberDto>) => {
        axios.get<OrganizationOfficerDto>(
          API_BASE_URL +'/organization-nodes/'+currentOrganizationId+'/officers'
        ).then(
          (officerResponse: AxiosResponse<OrganizationOfficerDto>) => {
            const profileRequests = memberResponse.data.data.map((m) => {
              return axios.get<ProfileDto>(API_BASE_URL + '/employee-accounts/' + m.ehid + '/profile')
            })
            var memberVm: OrganizationMemberViewModel[] = memberResponse.data.data.map((m: MembershipViewEntity) => {
              var d = officerResponse.data.data.find((d: DesignationEntity) => {
                return m.ehid === d.ehid
              })
              var role = ""
              if (typeof d !== "undefined" && d != null) {
                role = d.role_id
              }
              
              return {
                ehid: m.ehid,
                name: "",
                email_address: "",
                role: role
              }
            })
    
            Promise.all(profileRequests).then((memberResponses: AxiosResponse<ProfileDto>[]) => {
              memberResponses.map((m, idx) => {
                memberVm[idx].email_address = m.data.data.email_address
                memberVm[idx].name = m.data.data.name
              })
              memberVm.sort((a,b) => {
                if (a.role != "") {
                    return -1
                } else if (b.role != "") {
                    return 1
                  } else {
                  return a.name < b.name ? -1 : 1
                  }
                })
              setMemberViewModels(memberVm)
            })
          }
        )
      }
    )
  }

  function fillTree(entity: TreeNodeEntity): TreeItem {
    var uiNode: TreeItem = {
      icon: <TeamOutlined />,
      title: entity.data.name,
      key: entity.data.id,
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
    axios.get<OrganizationTreeDto>(
      API_BASE_URL + '/organization-nodes/'+currentOrganizationId+'/lineage-siblings'
    ).then(
      (response: AxiosResponse<OrganizationTreeDto>) => {
        var tc = new Array<TreeItem>(1)
        tc[0]=fillTree(response.data.data)
        setTreeContent(tc)        
      }
    ).catch(
      (error: AxiosError<OrganizationTreeDto>) => {
        if (axios.isAxiosError(error) && error.response && error.response.status == 401) {
        }
      }
    )
  }

  function setOrganizationInformation(tree: TreeNodeEntity) {
    var bcItems = []
    var keys = []
    var lastOrganization = organizationEntity
    var node : TreeNodeEntity|null = tree
    while(node) {
      bcItems.push({
        title: node.data.name
      })
      keys.push(node.data.id)
      lastOrganization = node.data

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
        axios.defaults.withCredentials = true
        var response = axios.get<OrganizationChildrenDto>(
          API_BASE_URL + '/organization-nodes/'+lastKey+'/children'
        )
        Promise.all([response]).then((r: AxiosResponse<OrganizationChildrenDto>[]) => {
          var children = r[0].data.data
          console.log(children)
          if (node) { /* Just to remove node null warning */
            if (children.length == 0) {
              node.isLeaf = true
            } else {
              node.children = children.map((item: OrganizationEntity) => {
                return {
                  icon: <TeamOutlined />,
                  title: item.name,
                  key: item.id,
                  isLeaf: false,
                  children: []
                }
              })
            }
          }
          setTreeContent([treeClone])
          onTreeItemChange([treeClone])
        })
      }
    }
    setExpandedKeys(keys)
  }

  function onTreeItemSelected(keys: Key[]) {
    if (keys.length != 0 && keys[0] != currentOrganizationId) {
      setCurrentOrganizationId(keys[0])
      
      onSelectedOrganizationIdChange(keys[0])
      onTreeItemChange(treeContent)
    }
    setSelectedKeys(keys)
  }

  function onHomeClick(e: React.MouseEvent<HTMLAnchorElement>|React.MouseEvent<HTMLButtonElement>) {
    setCurrentOrganizationId(defaultOrganizationEntity.id)
    setSelectedKeys([defaultOrganizationEntity.id])
    setExpandedKeys(defaultOrganizationEntity.hierarchy.split('.').slice(0,-1))

    onSelectedOrganizationIdChange(defaultOrganizationEntity.id)
    onTreeItemChange(treeContent)
  }

  return (
    <Layout.Content>
      <Row>
        <Col span={8} style={{ padding: "5px" }}>
          <Row>
            <Col span={16}>
              <h1>Organization Tree</h1>
            </Col>
            <Col span={8} style={buttonColStyle}>
            <Button
              icon={<HomeOutlined />}
              size="middle"
              onClick={onHomeClick}
              disabled={organizationEntity.id == "" || organizationEntity.id==defaultOrganizationEntity.id}
            >
              Home
            </Button>
            </Col>
          </Row>
          <Row>
          <Tree
            showLine
            showIcon
            treeData={treeContent}
            defaultExpandedKeys={expandedKeys}
            defaultSelectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            onExpand={onTreeItemExpanded}
            onSelect={onTreeItemSelected}
          />
          </Row>
        </Col>
        <Col span={16} style={{ padding: "5px" }}>
          <h1>{organizationEntity.name}</h1>
          <p>Email address: {organizationEntity.email_address}</p>
          <Breadcrumb
            items={breadCrumbItems}
            style={{ paddingTop: "10px" }}
            separator=">"
          />
          <Table
            style={{paddingTop: "10px" }}
            pagination={false}
            columns={memberTableColumns}
            rowKey="ehid"
            dataSource={memberViewModels} />
        </Col>
      </Row>
    </Layout.Content>
  );
}
