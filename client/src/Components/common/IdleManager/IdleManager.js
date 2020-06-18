import React, {
  createRef,
  useState,
  useContext,
  useEffect,
  Suspense,
} from "react";
import { useHistory } from "react-router-dom";
import "./IdleManager.scss";
import { newAlgaehApi } from "../../../hooks";
import { AlgaehModal, AlgaehFormGroup } from "algaeh-react-components";
import { setItem, getItem, clearItem } from "algaeh-react-components/storage";
import { MainContext } from "algaeh-react-components/context";
import { encrypter } from "../../../utils/GlobalFunctions";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import IdleTimer from "react-idle-timer";

export function IdleManager() {
  const history = useHistory();
  const context = useContext(MainContext);
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const idleRef = createRef();

  useEffect(() => {
    getItem("locked").then((result) => {
      if (result) {
        setVisible(true);
      }
    });
  }, []);

  function onIdle() {
    setItem("locked", true).then(() => {
      setVisible(true);
    });
  }

  function onLogout() {
    const { socket } = context;
    newAlgaehApi({
      uri: "/apiAuth/logout",
      method: "GET",
    })
      .then(() => {
        setVisible(false);
        setPassword("");
        clearItem();
        if (socket.connected) {
          socket.emit("user_logout");
        }
        window.location.reload();
        history.push("/");
      })
      .catch((e) => {
        setVisible(true);
        setPassword("");
        alert(e.message);
      });
  }

  function onOk() {
    const { username, hospital_id } = context.userToken;
    const identity = window.localStorage.getItem("identity");

    const dataSent = encrypter(
      JSON.stringify({
        username,
        password,
        item_id: hospital_id,
        identity,
      })
    );

    algaehApiCall({
      uri: "/apiAuth/relogin",
      data: { post: dataSent },
      notoken: true,
      onSuccess: (response) => {
        const { success, records, message } = response.data;
        if (success === true) {
          setItem("locked", false).then(() => {
            setVisible(false);
            setPassword("");
          });
        } else {
          alert(message);
          setPassword("");
        }
      },
      onCatch: (e) => {
        alert("Please enter correct password");
        setPassword("");
      },
    });
  }

  if (context.userToken) {
    return (
      <>
        <Suspense fallback="loading...">
          <div>
            <AlgaehModal
              className="SessionTimeoutModal"
              visible={visible}
              maskClosable={false}
              closable={false}
              footer=""
            >
              <div className="row">
                <div className="col-12" style={{ textAlign: "center" }}>
                  <i className="fas fa-hourglass-end"></i>
                  <h3>Your session is Locked.</h3>
                  <p>Please enter you password to unlock.</p>
                </div>
                <div className="col-lg-4 col-sm-12 " style={{ margin: "auto" }}>
                  <hr></hr>
                  <div className="row">
                    <AlgaehFormGroup
                      div={{
                        className: "col-lg-7 col-sm-12 form-group mandatory",
                      }}
                      label={{
                        forceLabel: "Password",
                        isImp: true,
                      }}
                      textBox={{
                        name: "password",
                        type: "password",
                        className: "txt-fld",
                        placeholder: "Enter Password to Unlock",
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                      }}
                    />
                    <div
                      className="col-lg-5 col-sm-12"
                      style={{
                        padding: 0,
                        paddingTop: 21,
                        textAlign: "center",
                      }}
                    >
                      <button className="btn btn-primary" onClick={onOk}>
                        Unlock
                      </button>
                      <span
                        style={{
                          marginTop: 15,
                          marginRight: 15,
                          marginBottom: 15,
                          marginLeft: 10,
                        }}
                      >
                        {" "}
                        or
                      </span>
                      <button className="btn btn-other" onClick={onLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AlgaehModal>
          </div>
        </Suspense>

        <IdleTimer
          ref={idleRef}
          element={document}
          onIdle={onIdle}
          debounce={250}
          timeout={1000 * 60 * 20} // mins to milliseco
        />
      </>
    );
  }
  return null;
}
