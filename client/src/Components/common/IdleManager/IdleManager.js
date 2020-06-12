import React, { createRef, useState, useContext } from "react";
import "./IdleManager.scss";
import { useHistory } from "react-router-dom";
import { newAlgaehApi } from "../../../hooks";
import { AlgaehModal, AlgaehButton } from "algaeh-react-components";
import { MainContext } from "algaeh-react-components/context";
import { clearItem } from "algaeh-react-components/storage";
import IdleTimer from "react-idle-timer";

export function IdleManager() {
  const history = useHistory();
  const context = useContext(MainContext);
  const [visible, setVisible] = useState(false);
  const idleRef = createRef();

  function onIdle() {
    newAlgaehApi({
      uri: "/apiAuth/logout",
      method: "GET",
    })
      .then(() => {
        setVisible(true);
        clearItem();
      })
      .catch((e) => {
        setVisible(true);
      });
  }

  function onOk() {
    history.push("/");
    window.location.reload();
  }

  if (context.userToken) {
    return (
      <div>
        {/* <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div id="title">
          <span>PURE CSS</span>
          <br />
          <span>PARALLAX PIXEL STARS</span>
        </div>
        <button className="btn btn-primary btn-lg" onClick={onOk}></button> */}

        <AlgaehModal
          className="SessionTimeoutModal"
          visible={visible}
          maskClosable={false}
          closable={false}
          footer=""
        >
          <div style={{ textAlign: "center" }}>
            <i className="fas fa-hourglass-end"></i>
            <h3>Your session has expired due to inactivity.</h3>
            <p>Page will redirect to login page.</p>
            <button className="btn btn-default btn-lg" onClick={onOk}>
              Go to login page
            </button>
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
