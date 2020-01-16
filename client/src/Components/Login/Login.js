import React, { useState, useEffect, useRef, useContext } from "react";
import { withRouter } from "react-router-dom";
import { Spin } from "algaeh-react-components";
import { MainContext } from "algaeh-react-components/context";
import { setItem, clearItem } from "algaeh-react-components/storage";
import Swal from "sweetalert2";
import { AlagehAutoComplete } from "../Wrapper/algaehWrapper";
import { AlagehFormGroup } from "../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  setCookie,
  swalMessage,
  getLocalIP
} from "../../utils/algaehApiCall.js";
import { getTokenDetals } from "../../actions/Login/Loginactions.js";
import { AlgaehCloseContainer, encrypter } from "../../utils/GlobalFunctions";
import connecting from "../../assets/svg/connecting.svg";
import "./Login.scss";
import sockets from "../../sockets";
import { from } from "linq";

function Login(props) {
  const { history } = props;
  const [login, setLogin] = useState({
    username: "",
    password: "",
    token: "",
    item_id: "",
    hospitalList: [],
    loading: true
  });
  const [loginLoad, setLoginLoad] = useState(false);
  let userRef = useRef(undefined);
  let passwordRef = useRef(undefined);
  const { clearAll } = useContext(MainContext);
  useEffect(() => {
    clearItem();
    clearAll();
    window.localStorage.clear();
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (String(name).trim() !== "authToken")
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setCookie("ScreenName", "Login", 30);
    setCookie("Language", "en", 30);
    (() => {
      getTokenDetals({
        loading: enabled => {
          setLogin({ ...login, loading: enabled });
        },
        setHospitals: list => {
          setLogin({ ...login, loading: false, hospitalList: list });
        }
      });
    })();
  }, []);

  function popUpMessage(message) {
    //const { value: password } =
    Swal.fire({
      title: "Already Logged In!",
      text: message,
      input: "password",
      confirmButtonText: "Login",
      showCancelButton: true,
      inputPlaceholder: "Re-enter password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off"
      }
    }).then(({ value }) => {
      if (value !== undefined && value !== "") {
        const { username, item_id } = login;
        getLocalIP(identity => {
          setLoginLoad(true);
          const dataSent = encrypter(
            JSON.stringify({
              username: username,
              password: value,
              item_id: item_id,
              identity: identity
            })
          );

          algaehApiCall({
            uri: "/apiAuth/relogin",
            data: { post: dataSent },
            method: "POST",
            onSuccess: response => {
              const { success, records, message } = response.data;

              if (success === true) {
                setCookie("authToken", records.token);
                setItem("token", records.token);
                getActiveModulesForUser()
                  .then(() => {
                    setLoginLoad(false);

                    setItem("userName", records.user_display_name);

                    setCookie("userName", records.user_display_name);
                    // setCookie("authToken", records.token);
                    // userToken;
                    sessionStorage.setItem(
                      "keyData",
                      AlgaehCloseContainer(JSON.stringify(records.keyData))
                    );
                    sessionStorage.setItem(
                      "CurrencyDetail",
                      AlgaehCloseContainer(
                        JSON.stringify(records.hospitalDetails)
                      )
                    );

                    sessionStorage.setItem(
                      "appRole",
                      records.app_d_app_roles_id
                    );
                    history.push(`/${records.page_to_redirect}`);
                    // history.push("/Dashboard");
                  })
                  .catch(error => {
                    setLoginLoad(false);
                    swalMessage({
                      type: "error",
                      title: error
                    });
                  });
              } else {
                //  popUpMessage(message);
                swalMessage({ type: "warning", title: message });
              }
            },
            onCatch: e => {
              setLoginLoad(false);
              swalMessage({ type: "error", title: e });
            }
          });
        });
      } else {
        setLoginLoad(false);
      }
    });
  }
  function getActiveModulesForUser() {
    return new Promise((resolve, reject) => {
      algaehApiCall({
        uri: "/algaehMasters/getRoleBaseActiveModules",
        method: "GET",
        onSuccess: dataResponse => {
          if (dataResponse.data.success) {
            setItem("menu", dataResponse.data.records);

            resolve();
          } else {
            reject(new Error(dataResponse.data.message));
          }
        },
        onCatch: error => {
          reject(error);
        }
      });
    });
  }

  function logout() {
    algaehApiCall({
      uri: "/apiAuth/logout",
      method: "GET",
      onSuccess: () => {
        clearItem();
        clearAll();
      }
    });
  }

  return (
    <div className="login bg">
      <Spin
        className="spinner"
        spinning={loginLoad}
        tip="Please wait verifying user"
      >
        <div className="container margintop15">
          <div className="row-eq-height">
            {login.loading ? (
              <div className="connectingServerDiv">
                {" "}
                <img src={connecting} />
                <p className="saving">
                  Please wait, Connecting to server<span>.</span>
                  <span>.</span>
                  <span>.</span>
                </p>
              </div>
            ) : (
              <div id="loginForm" className="loginFormContainer">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <div className="companyLogo" />
                    </div>
                    <div
                      className="col-12"
                      style={{
                        paddingTop: 15,
                        paddingBottom: 15
                      }}
                    >
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          setLoginLoad(true);
                          const { username, password, item_id } = login;
                          if (username === "") {
                            userRef.focus();
                            setLoginLoad(false);
                            return;
                          } else if (password === "") {
                            passwordRef.focus();
                            setLoginLoad(false);
                            return;
                          } else if (item_id === "") {
                            document.getElementsByName("item_id")[0].focus();
                            setLoginLoad(false);
                            return;
                          }

                          getLocalIP(identity => {
                            const dataSent = encrypter(
                              JSON.stringify({
                                username: username,
                                password: password,
                                item_id: item_id,
                                identity: identity
                              })
                            );

                            algaehApiCall({
                              uri: "/apiAuth/authUser",
                              data: { post: dataSent },
                              onSuccess: response => {
                                const {
                                  success,
                                  records,
                                  message
                                } = response.data;
                                if (success === true) {
                                  setCookie("authToken", records.token);
                                  setItem("token", records.token);
                                  getActiveModulesForUser()
                                    .then(() => {
                                      setLoginLoad(false);

                                      setCookie(
                                        "userName",
                                        records.user_display_name
                                      );

                                      setItem(
                                        "userName",
                                        records.user_display_name
                                      );
                                      sessionStorage.setItem(
                                        "keyData",
                                        AlgaehCloseContainer(
                                          JSON.stringify(records.keyData)
                                        )
                                      );
                                      sessionStorage.setItem(
                                        "CurrencyDetail",
                                        AlgaehCloseContainer(
                                          JSON.stringify(
                                            records.hospitalDetails
                                          )
                                        )
                                      );

                                      sessionStorage.setItem(
                                        "appRole",
                                        records.app_d_app_roles_id
                                      );
                                      history.push(
                                        `/${records.page_to_redirect}`
                                      ); //("/Dashboard");
                                    })
                                    .catch(error => {
                                      setLoginLoad(false);
                                      swalMessage({
                                        type: "error",
                                        title: error
                                      });
                                    });
                                } else {
                                  popUpMessage(message);
                                }
                              },
                              onCatch: e => {
                                setLoginLoad(false);
                                logout();
                                swalMessage({ type: "error", title: e });
                              }
                            });
                          });
                        }}
                        className="row"
                        autoComplete="none"
                      >
                        <div className="col-12 usernameSec">
                          <div className="row">
                            <AlagehFormGroup
                              div={{ className: "col-12 form-group" }}
                              textBox={{
                                className: "txt-fld",
                                name: "username",
                                value: login.username,
                                events: {
                                  onChange: e => {
                                    setLogin({
                                      ...login,
                                      username: e.target.value
                                    });
                                  }
                                },
                                others: {
                                  tabIndex: "1",
                                  placeholder: "Enter Username",
                                  ref: c => {
                                    userRef = c;
                                  }
                                }
                              }}
                            />
                            <br />
                            {/* <div
                              className="col-12 form-group"
                              style={{ textAlign: "right" }}
                            >
                              <button
                                className="btn btn-lg btn-block btn-secondary sign-btn"
                                type="submit"
                                tabIndex="2"
                              >
                                Next
                              </button>
                            </div>{" "} */}
                          </div>
                        </div>

                        <div className="col-12 passwordSec">
                          <div className="row">
                            {/* <div className="col userAfterLogin">
                              {" "}
                              <h1>Welcome,</h1>
                              <h6>Aboobacker Sidhiqe</h6>
                            </div> */}
                            <AlagehFormGroup
                              div={{ className: "col-12 form-group" }}
                              textBox={{
                                className: "txt-fld",
                                name: "password",
                                value: login.password,
                                events: {
                                  onChange: e => {
                                    setLogin({
                                      ...login,
                                      password: e.target.value
                                    });
                                  }
                                },
                                others: {
                                  type: "password",
                                  tabIndex: "2",
                                  placeholder: "Enter Password",
                                  ref: c => {
                                    passwordRef = c;
                                  }
                                }
                              }}
                            />
                            <br />
                            <AlagehAutoComplete
                              div={{ className: "col-12 form-group" }}
                              selector={{
                                name: "item_id",
                                className: "select-fld",
                                value: login.item_id,
                                autoComplete: "off",
                                dataSource: {
                                  textField: "hospital_name",
                                  valueField: "hims_d_hospital_id",
                                  data: login.hospitalList
                                },
                                placeholder: "Select a Branch",
                                others: {
                                  tabIndex: "3"
                                },
                                onChange: selector => {
                                  setCookie(
                                    "HospitalName",
                                    selector.selected.hospital_name
                                  );
                                  setCookie("HospitalId", selector.value);
                                  setCookie(
                                    "algaeh_api_auth_id",
                                    selector.selected.algaeh_api_auth_id
                                  );

                                  setLogin({
                                    ...login,
                                    item_id: selector.value
                                  });
                                },
                                onClear: () => {
                                  setLogin({ ...login, item_id: "" });
                                }
                              }}
                            />
                            <div className="col-12 form-group">
                              <div className="checkbox">
                                <label>
                                  <span>
                                    {" "}
                                    <input
                                      type="checkbox"
                                      value="remember-me"
                                    />
                                  </span>
                                  <b> Remember me</b>
                                </label>
                              </div>
                              <button
                                className="btn btn-lg btn-secondary btn-block sign-btn"
                                type="submit"
                                tabIndex="4"
                              >
                                Login
                              </button>
                              <p className="frgtPass">
                                FORGOT PASSWORD? |{" "}
                                <a href="mailto:we@algaeh.com?Subject=Hello%20New%20Password%20Requesting">
                                  CONTACT ADMINISTRATOR
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="loginFooter">
              <p>
                COPYRIGHT © 2019-2020. ALL RIGHTS RESERVED.{" "}
                <a href="http://algaeh.com/" target="_blank">
                  ALGAEH TECHNOLOGIES PVT. LTD.
                </a>
              </p>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}
export default withRouter(Login);
