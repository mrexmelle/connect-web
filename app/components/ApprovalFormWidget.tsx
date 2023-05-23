import { Button, Col, Form, Input, Layout, List, Modal, Row, DatePicker, TimePicker } from "antd";
import { Key, ReactNode, useEffect, useState } from "react"
import axios, { AxiosError, AxiosResponse } from "axios";
import { FormOutlined } from "@ant-design/icons";
import { FieldEntity, TemplateEntity } from "~/models/Entity";
import { MultipleTemplateDto } from "~/models/Dto";
import "~/styles/antd-list.css"

interface Props {
  style: React.CSSProperties
}

const buttonColStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'right',
  alignItems: 'center',
  padding: '5px'
}

export default function ({
  style
}: Props) {
  const [templates, setTemplates] = useState<TemplateEntity[]>([
    {
      index: -1,
      code: "",
      description: "",
      reviewers: [],
      fields: [{
        type: "",
        label: "",
        key: "",
        required: false
      }]
    }
  ])
  const [templateListVisible, setTemplateListVisible] = useState<boolean>(false)
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0)
  
  useEffect(() => {
    fetchTemplates()
  }, [])

  function fetchTemplates() {
    console.log("Fetching ...")
    axios.defaults.withCredentials = true
    axios.get<MultipleTemplateDto>(
      'http://localhost:8081/templates'
    ).then(
      (response: AxiosResponse<MultipleTemplateDto>) => {
        for (var i=0; i<response.data.templates.length; i++) {
          response.data.templates[i].index=i
        }
        setTemplates(response.data.templates)
      }
    )
  }

  function renderItem(entity: TemplateEntity): ReactNode {
    return (
      <List.Item
        style={{ padding: "5px" }}
        onClick={(_) => {setSelectedTemplateIndex(entity.index)}}
      >
        <List.Item.Meta
          title={entity.code}
          description={entity.description}
          className={"ant-list-item"}
        />
      </List.Item>
    )
  }

  function renderFields(entity: FieldEntity): ReactNode {
    var node: ReactNode
    switch (entity.type) {
      case 'text': node = (
        <Input />
      ); break;
      case 'longtext': node = (
        <Input.TextArea rows={5} />
      ); break;
      case 'date': node = (
        <DatePicker />
      ); break;
      case 'time': node =(
        <TimePicker format={"HH:mm"} />
      ); break;
    }

    return (
      <Form.Item
        key={entity.key}
        name={entity.label}
        label={entity.label}
        rules={[{required: entity.required}]}
      >
        {node}
      </Form.Item>
    )
  }

  return (
    <Layout.Content>
      <Row>
        <Col span={12} style={{ padding: "5px" }}>
          <Row>
            <Col span={16}>
              <h1>Inbox</h1>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <List />
            </Col>
          </Row>
        </Col>
        <Col span={12} style={{ padding: "5px" }}>
          <Row>
            <Col span={16}>
            <h1>Outbox</h1>
            </Col>
            <Col span={8} style={buttonColStyle}>
              <Button
                icon={<FormOutlined />}
                size="middle"
                onClick={(_) => setTemplateListVisible(true)}
              >
                New
              </Button>
            </Col>
          </Row>  
          <Row>
            <Col span={24}>
              <List />
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        open={templateListVisible}
        title={"Templates"}
        onOk={(_) => setTemplateListVisible(false)}
        onCancel={(_) => setTemplateListVisible(false)}
        okText={"Submit"}
        width={"60vw"}
      >
        <Layout style={style}>
          <Layout.Content>
            <Row>
            <Col span={6} style={{ padding: "5px" }}>
              <List
                rowKey={"code"}
                pagination={{
                  align: "center",
                  pageSize: 7
                }}
                dataSource={templates}
                renderItem={renderItem}
              />
            </Col>
            <Col span={12} style={{ padding: "5px" }}>
              <h2>{templates[selectedTemplateIndex].code}</h2>
              <p>{templates[selectedTemplateIndex].description}</p>
            <Form
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
            >
              {
                templates[selectedTemplateIndex].fields.map(
                  (obj) => renderFields(obj)
                )
              }
            </Form>
            </Col>
            </Row>
          </Layout.Content>
        </Layout>
      </Modal>
    </Layout.Content>
  );
}
