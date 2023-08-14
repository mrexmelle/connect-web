import { ApartmentOutlined, FileDoneOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Modal } from "antd";
import axios, { AxiosError, AxiosResponse } from "axios";
import OrganizationWidget, { TreeItem } from "~/components/OrganizationWidget";
import ProfileWidget from "~/components/ProfileWidget";
import { Key, useEffect, useState } from "react"
import { OrganizationDto, ProfileDto, TenureDto } from "~/models/Dto";
import { OrganizationEntity, TenureEntity } from "~/models/Entity";
import ApprovalWidget from "~/components/ApprovalWidget";
import { useNavigate } from "@remix-run/react";

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
  },
  {
    key: 'DIV1',
    type: 'divider'
  },
  {
    key: 'APP',
    icon: <FileDoneOutlined />,
    label: `Approval`
  }
]

export default function AccountsMe() {
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false)
  const [defaultOrganization, setDefaultOrganization] = useState<OrganizationEntity>(
    {
      id: "",
      hierarchy: "",
      name: "",
      leadEhid: "",
      emailAddress: ""
    }
  )
  const [lastSelectedOrganizationId, setLastSelectedOrganizationId] = useState<Key>("")
  const [lastTreeContent, setLastTreeContent] = useState<TreeItem[]>([])
  const [selectedMenuItem, selectMenuItem] = useState<string>('MYP')
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
  const [modal, modalContextHolder] = Modal.useModal()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
  }, [])

  function fetchProfile() {
    axios.defaults.withCredentials = true
    axios.get<ProfileDto>(
      'http://localhost:8080/accounts/me/profile'
    ).then(
      (response: AxiosResponse<ProfileDto>) => {
        setProfileDto(response.data)
        fetchTenures()
      }
    ).catch(
      (err: AxiosError) => {
        if (err.code == axios.AxiosError.ERR_BAD_REQUEST) {
          modal.error({
            title: "Unauthenticated session",
            content: "This page can only be viewed by an authenticated user.",
            okText: "Login",
            onOk: (_) => {
              navigate("/")
            },
            onCancel: (_) => {
              navigate("/")
            }
          })
        }
    })
  }

  function fetchTenures() {
    axios.defaults.withCredentials = true
    axios.get<TenureDto>(
      'http://localhost:8080/accounts/me/tenures'
    ).then(
      (response: AxiosResponse<TenureDto>) => {
        const orgRequests = response.data.tenures.map((t) => {
          return axios.get<OrganizationDto>('http://localhost:8080/organizations/'+t.organizationId)
        })

        Promise.all(orgRequests).then((orgResponses: AxiosResponse<OrganizationDto>[]) => {
          orgResponses.map((t, idx) => {
            response.data.tenures[idx].organizationName = t.data.organization.name
          })
          setTenureDto(response.data)
          if (lastSelectedOrganizationId == "") {
            var idx = getCurrentOrganizationIndex(response.data.tenures)
            setDefaultOrganization(orgResponses[idx].data.organization)
            setLastSelectedOrganizationId(orgResponses[idx].data.organization.id)
          }
        })
      }
    )
  }

  function getDateFromString(ds: string): Date|null {
    if (ds == '') {
      return null
    }

    var tokens = ds.split("-")
    if (tokens.length != 3) {
      return null
    }

    return new Date(
      Number(tokens[0]),
      Number(tokens[1])-1,
      Number(tokens[2])
    )
  }

  function getCurrentOrganizationIndex(tenures: TenureEntity[]): number {
    var currentOrgIndex = -1
    var now = new Date()
    tenures.map((t, i) => {
      var sdDate = getDateFromString(t.startDate)
      var edDate = getDateFromString(t.endDate)
      
      if ((sdDate != null && sdDate < now) && (edDate == null || edDate > now)) {
        currentOrgIndex = i
      }
    })
    return currentOrgIndex
  }

  function selectWidget(key: string) {
    switch(key) {
      case 'MYP':
        return <ProfileWidget
          style={contentStyle}
          profileDto={profileDto}
          tenureDto={tenureDto}
        />
      case 'ORG':
        return <OrganizationWidget
          style={contentStyle}
          defaultOrganizationEntity={defaultOrganization}
          lastSelectedOrganizationId={lastSelectedOrganizationId}
          lastTreeContent={lastTreeContent}
          onSelectedOrganizationIdChange={handleSelectedOrganizationIdChange}
          onTreeItemChange={handleTreeContentChange}
        />
      case 'APP':
        return <ApprovalWidget
          style={contentStyle}
        />
      default:
        return 
    }
  }

  function handleSelectedOrganizationIdChange(key: Key) {
    setLastSelectedOrganizationId(key)
  }

  function handleTreeContentChange(trees: TreeItem[]) {
    setLastTreeContent(trees)
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider collapsible theme="light" style={siderStyle}
        collapsed={siderCollapsed}
        onCollapse={(value) => setSiderCollapsed(value)} >
        <Menu items={siderItems} mode="inline"
          defaultSelectedKeys={['MYP']}
          selectedKeys={[selectedMenuItem]}
          onSelect={(e) => selectMenuItem(e.key)}>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Content style={contentStyle}>
          {selectWidget(selectedMenuItem)}
          {modalContextHolder}
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          Astro Technologies Indonesia ©2023
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
