import { Button, Col, Form, Input, Layout, List, Modal, Row, DatePicker, TimePicker, Select, Divider, notification } from "antd";
import { ReactNode, useEffect, useState } from "react"
import axios, { AxiosError, AxiosResponse } from "axios";
import { FormOutlined, SearchOutlined } from "@ant-design/icons";
import { FieldEntity, TemplateEntity } from "~/models/Entity";
import { MultipleTemplateDto, SingleProposalDto } from "~/models/Dto";
import "~/styles/antd-list.css"

interface Props {
  style: React.CSSProperties
  ehid: string
}

const buttonColStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'right',
  alignItems: 'center',
  padding: '5px'
}

export default function ({
  style, ehid
}: Props) {
  const API_BASE_URL = "http://localhost:8082/apms"
  const [form] = Form.useForm()
  const [templates, setTemplates] = useState<TemplateEntity[]>([])
  const [templateListVisible, setTemplateListVisible] = useState<boolean>(false)
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(-1)
  
  useEffect(() => {
    fetchTemplates()
  }, [])

  function fetchTemplates() {
    axios.defaults.withCredentials = true
    axios.get<MultipleTemplateDto>(
      API_BASE_URL + '/templates'
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
        name={entity.key}
        label={entity.label}
        rules={[{required: entity.required, message: "'${label}' cannot be empty"}]}
      >
        {node}
      </Form.Item>
    )
  }

  function postProposal() {
    var fields = new Map<string, string>()
    templates[selectedTemplateIndex].fields.map(
      (obj: FieldEntity) => {
        if (obj.type == "date") {
          fields.set(obj.key, form.getFieldValue(obj.key).format("YYYY-MM-DD"))
        } else if (obj.type == "time") {
          fields.set(obj.key, form.getFieldValue(obj.key).format("HH:mm"))
        } else {
          fields.set(obj.key, form.getFieldValue(obj.key))
        }
      }
    )
    fields.forEach((value: string, key: string) => {
      console.log(key + " : " + value)
    })
    axios.defaults.withCredentials = true
    axios.post<SingleProposalDto>(
      API_BASE_URL + '/proposals',
      {
        templateCode: templates[selectedTemplateIndex].code,
        fields: Object.fromEntries(fields)
      }
    ).then(
      (response: AxiosResponse<SingleProposalDto>) => {
        if(response.data.status === "OK") {
          notification.success({
            message: "Proposal submitted successfully"
          })
          setTemplateListVisible(false)
        } else {
          notification.error({
            message: "Failed to submit proposal"
        })
      }
    }).catch(
      (e: AxiosError) => {
        console.log(e)
      }
    )

    console.log("ehid: "+ehid)
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
                  <Divider type="horizontal" />
                }
                {selectedTemplateIndex == -1 ? <div /> :
                  <Form
                    layout="vertical"
                    form={form}
                  >
                    {
                      templates[selectedTemplateIndex].fields.map(
                        (obj: FieldEntity) => renderFields(obj)
                      )
                    }
                    <Form.Item>
                      <Button
                        form="form"
                        key="submit"
                        htmlType="submit"
                        type="primary"
                        onClick={() => postProposal()}
                      >
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
