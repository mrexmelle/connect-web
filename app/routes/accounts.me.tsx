import { ApartmentOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios, { AxiosResponse } from "axios";
import OrganizationWidget, { TreeItem } from "~/components/OrganizationWidget";
import ProfileWidget from "~/components/ProfileWidget";
import { Key, useEffect, useState } from "react"
import { OrganizationDto, ProfileDto, TenureDto } from "~/models/Dto";
import { TenureEntity } from "~/models/Entity";

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
  }
]

export default function AccountsMe() {
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false)
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

  useEffect(() => {
    fetchProfile()
    fetchTenures()
  }, [])

  function fetchProfile() {
    axios.defaults.withCredentials = true
    axios.get<ProfileDto>(
      'http://localhost:8080/accounts/me/profile'
    ).then(
      (response: AxiosResponse<ProfileDto>) => {
        setProfileDto(response.data)
      }
    )
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

        Promise.all(orgRequests).then((r: AxiosResponse<OrganizationDto>[]) => {
          r.map((t, idx) => {
            response.data.tenures[idx].organizationName = t.data.organization.name
          })
          setTenureDto(response.data)
          if (lastSelectedOrganizationId == "") {
            console.log("org id is empty")
            setLastSelectedOrganizationId(getCurrentOrganization(response.data.tenures))
          }
        })
      }
    )
  }

  function getCurrentOrganization(tenures: TenureEntity[]): string {
    var orgId = ""
    tenures.map((t, _) => {
      var sdTokens = t.startDate.split("-")
      var sdDate = new Date(
        Number(sdTokens[0]),
        Number(sdTokens[1])-1,
        Number(sdTokens[2])
      )

      if (sdDate < new Date() && t.endDate == "") {
        orgId = t.organizationId
      }
    })
    return orgId
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
          defaultOrganizationId={getCurrentOrganization(tenureDto.tenures)}
          lastSelectedOrganizationId={lastSelectedOrganizationId}
          lastTreeContent={lastTreeContent}
          onSelectedOrganizationIdChange={handleLastSelectedOrganizationIdChange}
          onTreeItemChange={handleLastTreeContentChange}
        />
      default:
        return 
    }
  }

  function handleLastSelectedOrganizationIdChange(key: Key) {
    setLastSelectedOrganizationId(key)
  }

  function handleLastTreeContentChange(trees: TreeItem[]) {
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
        {selectWidget(selectedMenuItem)}
        <Layout.Footer style={{ textAlign: 'center' }}>
          Astro Technologies Indonesia ©2023
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
