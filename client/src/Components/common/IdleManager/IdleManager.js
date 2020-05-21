import React, { createRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { newAlgaehApi } from "../../../hooks";
import { AlgaehModal, AlgaehButton } from "algaeh-react-components";
import { MainContext } from "algaeh-react-components/context";
import IdleTimer from "react-idle-timer";

export function IdleManager() {
  const history = useHistory();
  const context = useContext(MainContext);
  const [visible, setVisible] = useState(false);
  const idleRef = createRef();

  function onIdle() {
    setVisible(true);
  }

  function onOk() {
    newAlgaehApi({
      uri: "/apiAuth/logout",
      method: "GET",
    })
      .then(() => {
        setVisible(false);
        history.push("/");
        window.location.reload();
      })
      .catch((e) => {
        setVisible(false);
      });
  }

  if (context.userToken) {
    return (
      <div>
        <AlgaehModal
          class="SessionTimeoutModal"
          title="Session "
          visible={visible}
          maskClosable={false}
          closable={false}
          footer={
            <AlgaehButton key="submit" type="primary" onClick={onOk}>
              Ok
            </AlgaehButton>
          }
        >
          <div style={{ textAlign: "center" }}>
            {" "}
            <i
              className="fas fa-hourglass-end"
              style={{ fontSize: "2rem" }}
            ></i>
            <h3>Your session has expired!</h3>
            <p>Click Ok to redirect to login page.</p>
          </div>
        </AlgaehModal>

        <IdleTimer
          ref={idleRef}
          element={document}
          onIdle={onIdle}
          debounce={250}
          timeout={1000 * 60 * 15} // mins to milliseco
        />
      </div>
    );
  }
  return null;
}
