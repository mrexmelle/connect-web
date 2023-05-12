import { ApartmentOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios, { Axios, AxiosResponse } from "axios";
import OrganizationWidget, { OrganizationBundle } from "~/components/OrganizationWidget";
import ProfileWidget from "~/components/ProfileWidget";
import { useEffect, useState } from "react"
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
  const [organizationBundle, setOrganizationBundle] = useState<OrganizationBundle>({
    currentOrganizationId: "",
    treeContent: []
  })
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
          setOrganizationBundle({
             currentOrganizationId: getCurrentOrganization(response.data.tenures),
             treeContent: organizationBundle.treeContent
          })
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
          organizationBundle={organizationBundle}
          onDataChange={handleOrganizationDataChange}
        />
      default:
        return 
    }
  }

  function handleOrganizationDataChange(bundle: OrganizationBundle) {
    setOrganizationBundle(organizationBundle)
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
