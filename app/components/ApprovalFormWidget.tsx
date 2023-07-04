import { Button, Col, Form, Input, Layout, List, Modal, Row, DatePicker, TimePicker, Select, Divider } from "antd";
import { ReactNode, useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios";
import { FormOutlined, SearchOutlined } from "@ant-design/icons";
import { FieldEntity, TemplateEntity } from "~/models/Entity";
import { MultipleTemplateDto } from "~/models/Dto";
import "~/styles/antd-list.css"
import Search from "antd/es/transfer/search";

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
  const [templates, setTemplates] = useState<TemplateEntity[]>([])
  const [templateListVisible, setTemplateListVisible] = useState<boolean>(false)
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(-1)
  
  useEffect(() => {
    fetchTemplates()
  }, [])

  function fetchTemplates() {
    axios.defaults.withCredentials = true
    axios.get<MultipleTemplateDto>(
      'http://localhost:8081/templates'
    ).then(
      (response: AxiosResponse<MultipleTemplateDto>) => {
        for (var i=0; i<response.data.templates.length; i++) {
          response.data.templates[i].index=i
          response.data.templates[i].label=response.data.templates[i].code+" - "+response.data.templates[i].description
        }
        setTemplates(response.data.templates)
      }
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
        <DatePicker format={"YYYY-MM-DD"}/>
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
        footer={null}
        closable={false}
        onCancel={(_) => setTemplateListVisible(false)}
        closeIcon={null}
        width={"80vw"}
      >
        <Layout style={{backgroundColor: "white"}}>
          <Layout.Content>
            <Row>
              <Col span={24}>
                <Select
                  suffixIcon={<SearchOutlined />}
                  showSearch
                  allowClear
                  placeholder="Search templates"
                  optionFilterProp="label"
                  options={templates}
                  fieldNames={
                    {
                      label: "label",
                      value: "index"
                    }
                  }
                  filterSort={
                    (a: TemplateEntity, b: TemplateEntity) =>
                      a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                  }
                  style={{ width: "100%" }}
                  size={"large"}
                  onSelect={(v: number) => {setSelectedTemplateIndex(v)}}
                  onClear={() => setSelectedTemplateIndex(-1)}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                {selectedTemplateIndex == -1 ? <div /> :
                  <Divider type="horizontal">
                    {templates[selectedTemplateIndex].description}
                  </Divider>
                }
                {selectedTemplateIndex == -1 ? <div /> :
                  <Form
                    layout="vertical"
                  >
                    {
                      templates[selectedTemplateIndex].fields.map(
                        (obj) => renderFields(obj)
                      )
                    }
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                }
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      </Modal>
    </Layout.Content>
  );
}
