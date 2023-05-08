import { Row, Col, Layout, Divider, Table } from "antd";
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
  }
]

export default function ({style, profileDto, tenureDto}: Props) {
  return (
    <Layout.Content style={style}>
      <Row>
        <Col span={24}>
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
        <Col span={24}>
          <h1>Tenures</h1>
          <Table
            pagination={false}
            columns={tenureTableColumns}
            rowKey="id"
            dataSource={tenureDto.tenures} />
        </Col>
      </Row>
    </Layout.Content>
  );
}
