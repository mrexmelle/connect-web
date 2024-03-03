import { Button, Form, Input, Layout, Modal, notification } from "antd";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { PatchPasswordResponseDto } from "~/models/Dto";

interface Props {
  isVisible: boolean,
  isVisibleDispatcher?: Dispatch<SetStateAction<boolean>>,
  employeeId: string
}

export default function ({isVisible, isVisibleDispatcher, employeeId}: Props) {
  const API_BASE_URL = "http://localhost:8083"
  const [form] = Form.useForm();
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState<string>("")

  function onCurrentPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setCurrentPassword(e.target.value)
  }

  function onNewPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setNewPassword(e.target.value)
  }

  function onNewPasswordConfirmationChange(e: ChangeEvent<HTMLInputElement>) {
    setNewPasswordConfirmation(e.target.value)
  }

  function patchPassword() {
    if (currentPassword === "") {
      notification.warning({
        message: "'Current password' must be filled"
      })
      return
    }

    if (newPassword === "") {
      notification.warning({
        message: "'New password' must be filled"
      })
      return
    }

    if (newPasswordConfirmation === "") {
      notification.warning({
        message: "'New password confirmation' must be filled"
      })
      return
    }

    if (newPassword === currentPassword) {
      notification.warning({
        message: "'New password' should be different with 'Current password'"
      })
      return
    }

    if (newPasswordConfirmation !== newPassword) {
      notification.warning({
        message: "'New password confirmation' does not match 'New password'"
      })
      return
    }

    axios.defaults.withCredentials = true
    axios.patch<PatchPasswordResponseDto>(
      API_BASE_URL + '/authx-credentials/' + employeeId + '/password',
      {
        current_password: currentPassword,
        new_password: newPassword
      }
    ).then(
      (_: AxiosResponse<PatchPasswordResponseDto>) => {
        form.resetFields()
        isVisibleDispatcher?.call(null, false)
        notification.success({
          message: "Password changed successfully"
        })
      }
    ).catch(
      (e: AxiosError) => {
        notification.error({
          message: e.message
        })
      }
    )
  }

  return (
      <Modal
        open={isVisible}
        closable={false}
        onCancel={(_) => {
          form.resetFields()
          isVisibleDispatcher?.call(null, false)        
        }}
        footer={[
          <Button
            form="form"
            key="submit"
            htmlType="submit"
            type="primary"
            onClick={() => patchPassword()}
          >
              Submit
          </Button>
          ]}
      >
        <Layout style={{backgroundColor: "white"}}>
          <Layout.Content>
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                key={"currentPassword"}
                name={"currentPassword"}
                label={"Current password"}
              >
                <Input.Password
                  value={currentPassword}
                  onChange={onCurrentPasswordChange}/>
              </Form.Item>
              <Form.Item
                key={"newPassword"}
                name={"newPassword"}
                label={"New password"}
              >
                <Input.Password
                  value={newPassword}
                  onChange={onNewPasswordChange}
                 />
              </Form.Item>
              <Form.Item
                key={"newPasswordConfirmation"}
                name={"newPasswordConfirmation"}
                label={"New password confirmation"}
              >
                <Input.Password
                  value={newPasswordConfirmation}
                  onChange={onNewPasswordConfirmationChange}
                />
              </Form.Item>
            </Form>
          </Layout.Content>
        </Layout>
      </Modal>
  );
}
