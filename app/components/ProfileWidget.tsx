import { Button, Form, Input, Row, Col, Layout, Divider, Table, Modal } from "antd";
import { useState } from "react";
import { ProfileDto, TenureDto } from "~/models/Dto";

interface Props {
  style: React.CSSProperties,
  profileDto: ProfileDto,
  tenureDto: TenureDto
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
    dataIndex: 'employeeId'
  },
  {
    title: 'Email Address',
    dataIndex: 'emailAddress'
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dob'
  }
]

const tenureTableColumns = [
  {
    title: 'Start Date',
    dataIndex: 'startDate'
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  },
  {
    title: 'Employment Type',
    dataIndex: 'employmentType'
  },
  {
    title: 'Organization',
    dataIndex: 'organizationName'
  },
  {
    title: 'Title',
    dataIndex: 'titleName'
  },
  {
    title: 'Grade',
    dataIndex: 'titleGrade'
  }
]

export default function ({style, profileDto, tenureDto}: Props) {
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
            dataSource={[profileDto.profile]} />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24} style={{ padding: "5px" }}>
          <h1>Tenures</h1>
          <Table
            pagination={false}
            columns={tenureTableColumns}
            rowKey="id"
            dataSource={tenureDto.tenures} />
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
      <Modal
        open={changePasswordModalVisible}
        onCancel={(_) => setChangePasswordModalVisible(false)}
      >
        <Layout style={{backgroundColor: "white"}}>
          <Layout.Content>
            <Form
              layout="vertical"
            >
              <Form.Item
                key={"currentPassword"}
                name={"currentPassword"}
                label={"Current password"}
                rules={[{required: true}]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                key={"newPassword"}
                name={"newPassword"}
                label={"New password"}
                rules={[{required: true}]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                key={"confirmNewPassword"}
                name={"confirmNewPassword"}
                label={"Confirm new password"}
                rules={[{required: true}]}
              >
                <Input.Password />
              </Form.Item>
            </Form>
          </Layout.Content>
        </Layout>
      </Modal>
    </Layout.Content>
  );
}
