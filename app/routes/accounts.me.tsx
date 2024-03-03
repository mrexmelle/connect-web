import { ApartmentOutlined, FileDoneOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Modal } from "antd";
import axios, { AxiosError, AxiosResponse } from "axios";
import OrganizationWidget, { TreeItem } from "~/components/OrganizationWidget";
import ProfileWidget from "~/components/ProfileWidget";
import { Key, useEffect, useState } from "react"
import { OrganizationDto, CareerViewModel, ProfileDto, CareerDto, CareerAggregate } from "~/models/Dto";
import ApprovalWidget from "~/components/ApprovalWidget";
import { useNavigate } from "@remix-run/react";
import { OrganizationEntity } from "~/models/Entity";

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
  const API_BASE_URL = "http://localhost:8083"
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false)
  const [defaultOrganization, setDefaultOrganization] = useState<OrganizationEntity>(
    {
      id: "",
      hierarchy: "",
      name: "",
      email_address: ""
    }
  )
  const [lastSelectedOrganizationId, setLastSelectedOrganizationId] = useState<Key>("")
  const [lastTreeContent, setLastTreeContent] = useState<TreeItem[]>([])
  const [selectedMenuItem, selectMenuItem] = useState<string>('MYP')
  const [profileDto, setProfileDto] = useState<ProfileDto>({
    data: {
      ehid:              "",
      employee_id:       "",
      name:              "",
      email_address:     "",
      dob:               "",
      grade:             "",
      title:             "",
      organization_node: ""
    },
    error: {
      code: "",
      message: ""
    }
  })

  const [careerViewModel, setCareerViewModel] = useState<CareerViewModel[]>([])
  const [modal, modalContextHolder] = Modal.useModal()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
  }, [])

  function fetchProfile() {
    axios.defaults.withCredentials = true
    axios.get<ProfileDto>(
      API_BASE_URL + '/employee-accounts/me/profile'
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
    axios.get<CareerDto>(
      API_BASE_URL + '/employee-accounts/me/career'
    ).then(
      (response: AxiosResponse<CareerDto>) => {
        const orgRequests = response.data.data.map((c) => {
          return axios.get<OrganizationDto>(API_BASE_URL + '/organization-nodes/' + c.organization_node)
        })

        var i = 0
        var careerVm: CareerViewModel[] = response.data.data.map((c: CareerAggregate) => {
          return {
            row_id:              i++,
            start_date:          c.start_date,
            end_date:            c.end_date,
            grade:               c.grade,
            organization_node:   c.organization_node,
            title:               c.title,
            organization_name:   ""
          }
        })

        Promise.all(orgRequests).then((orgResponses: AxiosResponse<OrganizationDto>[]) => {
          orgResponses.map((t, idx) => {
            careerVm[idx].organization_name = t.data.data.name
          })
          setCareerViewModel(careerVm)
          if (lastSelectedOrganizationId == "") {
            var idx = getCurrentOrganizationIndex(response.data.data)
            setDefaultOrganization(orgResponses[idx].data.data)
            setLastSelectedOrganizationId(orgResponses[idx].data.data.id)
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

  function getCurrentOrganizationIndex(careers: CareerAggregate[]): number {
    var currentOrgIndex = -1
    var now = new Date()
    careers.map((c, i) => {
      var sdDate = getDateFromString(c.start_date)
      var edDate = getDateFromString(c.end_date)
      
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
          careerVm={careerViewModel}
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
