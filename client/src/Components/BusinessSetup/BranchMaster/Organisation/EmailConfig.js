import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";
import {
  AlgaehMessagePop,
  AlgaehButton,
  AlgaehFormGroup,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../../hooks";
import TestEmailModal from "./TestEmailModal";
export default function EmailConfig(props) {
  const baseEmailConfig = {
    host: "",
    port: "",
    secure: false,
    user: "",
    pass: "",
    is_enabled: false,
  };
  const [emailConfig, setEmailConfig] = useState(baseEmailConfig);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    newAlgaehApi({
      uri: "/Document/getEmailConfig",
      method: "GET",
      module: "documentManagement",
    })
      .then((result) => {
        const {
          data: emailConf,
          success: emailSuccess,
          message: emailMsg,
        } = result.data;
        if (emailSuccess) {
          setEmailConfig(emailConf[0] || baseEmailConfig);
        } else {
          AlgaehMessagePop({
            display: emailMsg,
            type: "error",
          });
        }
      })
      .catch((error) => {
        AlgaehMessagePop({
          display: error.message,
          type: "error",
        });
      });
  }, []); // eslint-disable-line

  async function updateEmailConfig() {
    try {
      const res = await newAlgaehApi({
        uri: "/Document/setEmailConfig",
        method: "POST",
        data: emailConfig,
        module: "documentManagement",
      });
      if (res.data.success) {
        AlgaehMessagePop({
          display: res.data.message,
          type: "success",
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        display: e.response.data.message || e.message,
        type: "error",
      });
    }
  }

  const { host, port, is_enabled, pass, secure, user } = emailConfig;

  function handleEmailChange(e) {
    const { name, value, checked } = e.target;

    if (name === "is_enabled") {
      setEmailConfig((state) => {
        const res = !state.is_enabled ? state : baseEmailConfig;
        return {
          is_enabled: !state.is_enabled,
          ...res,
        };
      });
    }

    setEmailConfig((state) => ({
      ...state,
      [name]: value !== undefined ? value : checked,
    }));
  }
  const openOrCloseTestEmailModal = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <TestEmailModal
        visible={visible}
        setVisible={openOrCloseTestEmailModal}
      />
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Email Configuration</h3>
          </div>
          <div className="actions"></div>
        </div>
        <div className="portlet-body">
          <div className="row">
            <div className="col-6 form-group">
              <label> Notify via Email</label>
              <div>
                {" "}
                <Checkbox
                  onChange={handleEmailChange}
                  name="is_enabled"
                  checked={is_enabled}
                >
                  Yes
                </Checkbox>
              </div>
            </div>

            <AlgaehFormGroup
              div={{ className: "col-12 form-group" }}
              label={{
                forceLabel: "SMTP Host Name",
                isImp: false,
              }}
              textBox={{
                className: "txt-fld",
                name: "host",
                value: host,
                disabled: !is_enabled,
                onChange: handleEmailChange,
                type: "text",
              }}
            />

            <AlgaehFormGroup
              div={{ className: "col-6 form-group" }}
              label={{
                forceLabel: "SMTP Username",
                isImp: false,
              }}
              textBox={{
                className: "txt-fld",
                name: "user",
                value: user,
                disabled: !is_enabled,
                onChange: handleEmailChange,
                type: "text",
              }}
            />

            <AlgaehFormGroup
              div={{ className: "col-6 form-group" }}
              label={{
                forceLabel: "SMTP Password",
                isImp: false,
              }}
              textBox={{
                className: "txt-fld",
                name: "pass",
                value: pass,
                disabled: !is_enabled,
                onChange: handleEmailChange,
                type: "password",
              }}
            />
            <div className="col-6 form-group">
              <label>Is SSL enabled</label>
              <div>
                {" "}
                <Checkbox
                  onChange={handleEmailChange}
                  name="secure"
                  checked={secure}
                  disabled={!is_enabled}
                >
                  Yes
                </Checkbox>
              </div>
            </div>
            <AlgaehFormGroup
              div={{ className: "col-6 form-group" }}
              label={{
                forceLabel: "SMTP Port",
                isImp: false,
              }}
              textBox={{
                className: "txt-fld",
                name: "port",
                value: port,
                disabled: !is_enabled,
                onChange: handleEmailChange,
                type: "number",
              }}
            />

            <div className="col-12" style={{ textAlign: "right" }}>
              {" "}
              <hr></hr>
              {/* <div className="row"> */}
              <AlgaehButton
                className="btn btn-default"
                disabled={!is_enabled}
                onClick={openOrCloseTestEmailModal}
              >
                Send Test Email
              </AlgaehButton>
              <AlgaehButton
                className="btn btn-primary"
                style={{ marginLeft: 5 }}
                disabled={!is_enabled}
                onClick={updateEmailConfig}
              >
                Update Email
              </AlgaehButton>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
