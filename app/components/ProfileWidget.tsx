import { Button, Row, Col, Layout, Divider, Table } from "antd";
import { useState } from "react";
import { ProfileDto, CareerViewModel } from "~/models/Dto";
import ChangePasswordModal from "./ChangePasswordModal";

interface Props {
  style: React.CSSProperties,
  profileDto: ProfileDto,
  careerVm: CareerViewModel[]
}

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
    dataIndex: 'employee_id'
  },
  {
    title: 'Email Address',
    dataIndex: 'email_address'
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dob'
  }
]

const careerTableColumns = [
  {
    title: 'Start Date',
    dataIndex: 'start_date'
  },
  {
    title: 'End Date',
    dataIndex: 'end_date'
  },
  {
    title: 'Organization',
    dataIndex: 'organization_name'
  },
  {
    title: 'Title',
    dataIndex: 'title'
  },
  {
    title: 'Grade',
    dataIndex: 'grade'
  }
]

export default function ({style, profileDto, careerVm}: Props) {
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState<boolean>(false)

  return (
    <Layout.Content>
      <Row>
        <Col span={24} style={{ padding: "5px" }}>
          <h1>Profile</h1>
          <Table
            pagination={false}
            columns={profileTableColumns}
            rowKey="ehid"
            dataSource={[profileDto.data]} />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24} style={{ padding: "5px" }}>
          <h1>Career</h1>
          <Table
            pagination={false}
            columns={careerTableColumns}
            rowKey="row_id"
            dataSource={careerVm} />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24} style={{ padding: "5px" }}>
          <h1>Credentials</h1>
            <Button type="primary" htmlType="submit"
                  onClick={() => setChangePasswordModalVisible(true)}>
              Change Password
            </Button>
        </Col>
      </Row>
      <ChangePasswordModal
        employeeId={profileDto.data.employee_id}
        isVisible={changePasswordModalVisible}
        isVisibleDispatcher={setChangePasswordModalVisible}  />
    </Layout.Content>
  );
}
