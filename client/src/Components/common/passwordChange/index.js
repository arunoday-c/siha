import React from "react";
import { withRouter } from "react-router-dom";
import "./passwordChange.scss";
import {
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehMessagePop,
  // Icon
} from "algaeh-react-components";
import { algaehApiCall } from "../../../utils/algaehApiCall";
function ChangePassword(props) {
  const { showPasswordChange, onVisibityChange, history } = props;
  let currentPassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let notMatching = false;
  return (
    <AlgaehModal
      // width={350}
      title="Change Password"
      visible={showPasswordChange}
      destroyOnClose={true}
      onOk={() => {
        if (
          currentPassword === "" ||
          newPassword === "" ||
          confirmPassword === ""
        ) {
          AlgaehMessagePop({
            display: "Password is mandatory",
            type: "info",
          });
          return;
        }

        if (notMatching === true) {
          AlgaehMessagePop({
            display: "Password is not matching",
            type: "info",
          });
          return;
        }
        algaehApiCall({
          uri: "/algaehappuser/changePassword",
          method: "PUT",
          data: {
            password: newPassword,
            oldPassword: currentPassword,
          },
          onSuccess: (res) => {
            if (res.data.success === true) {
              algaehApiCall({
                uri: "/apiAuth/logout",
                method: "GET",
                onSuccess: () => {
                  history.push("/");
                },
              });
            } else {
              AlgaehMessagePop({
                display: res.data.records.message,
                type: "error",
              });
            }
          },
          onCatch: (error) => {
            AlgaehMessagePop({
              display: error,
              type: "error",
            });
          },
        });
      }}
      onCancel={() => {
        onVisibityChange();
      }}
      className={`passwordChangeModal`}
    >
      <div className="row">
        {" "}
        <div className="col-12 passChgMsg">
          {" "}
          <p>
            <i className="fas fa-info-circle"></i>
            <span>
              You will be redirect to login page after successful change of
              password.
            </span>
          </p>
        </div>
        <AlgaehFormGroup
          div={{ className: "col-12 form-group" }}
          label={{
            forceLabel: "Current Password",
            isImp: false,
          }}
          textBox={{
            type: "password",
            className: "txt-fld",
            name: "current_pwd",
            defaultValue: currentPassword,
            onChange: (e) => {
              currentPassword = e.target.value;
            },
          }}
        />
        <AlgaehFormGroup
          div={{ className: "col-12 form-group" }}
          label={{
            forceLabel: "New Password",
            isImp: false,
          }}
          textBox={{
            className: "txt-fld",
            type: "password",
            name: "pwd",
            defaultValue: newPassword,
            onChange: (e) => {
              newPassword = e.target.value;
            },
          }}
        />
        <AlgaehFormGroup
          div={{ className: "col-12" }}
          label={{
            forceLabel: "Confirm New Password",
            isImp: false,
          }}
          textBox={{
            className: "txt-fld",
            type: "password",
            name: "cf_pwd",
            defaultValue: confirmPassword,
            onChange: (e) => {
              confirmPassword = e.target.value;
            },
            onBlur: (e) => {
              if (newPassword !== confirmPassword) {
                notMatching = true;
                e.target.classList.add("faltRed");
              } else {
                notMatching = false;
                e.target.classList.remove("faltRed");
              }
            },
          }}
        />{" "}
        <div className="col-12 passTipsMsg">
          <p>
            <span>Passwords should contain below suggested combinations:</span>
            <ul>
              <li>(A-Z,a-z,0-9,~`!@#$%^)</li>
            </ul>
          </p>
        </div>
      </div>
    </AlgaehModal>
  );
}

export default withRouter(ChangePassword);
