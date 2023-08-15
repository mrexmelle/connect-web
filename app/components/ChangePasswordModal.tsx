import { Button, Form, Input, Layout, Modal, notification } from "antd";
import { RuleObject } from "antd/es/form";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { PatchPasswordRequestDto, PatchPasswordResponseDto } from "~/models/Dto";

interface Props {
  isVisible: boolean,
  isVisibleDispatcher?: Dispatch<SetStateAction<boolean>>
}

export default function ({isVisible, isVisibleDispatcher}: Props) {
  const [form] = Form.useForm();
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState<string>("")
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)

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

    axios.patch<PatchPasswordResponseDto>(
      'http://localhost:8080/accounts/me/password',
      {
        currentPassword: currentPassword,
        newPassword: newPassword
      }
    ).then(
      (_: AxiosResponse<PatchPasswordResponseDto>) => {
        form.resetFields()
        isVisibleDispatcher?.call(null, false)
        notification.success({
          message: "Password has been changed successfully"
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
            onClick={(_) => patchPassword()}
            disabled={false}
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
