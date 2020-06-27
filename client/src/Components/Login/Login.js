import React, { useState, useEffect, useRef, useContext } from "react";
import { withRouter } from "react-router-dom";
import {
  Spin,
  getPreferences,
  AlgaehModal,
  AlgaehButton,
  Input,
} from "algaeh-react-components";
import { MainContext } from "algaeh-react-components/context";
import {
  setItem,
  clearItem,
  removeItem,
} from "algaeh-react-components/storage";
import Swal from "sweetalert2";
// import { AlagehAutoComplete } from "../Wrapper/algaehWrapper";
import { AlagehFormGroup } from "../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  setCookie,
  swalMessage,
  getCookie,
  // getLocalIP,
  collectIP,
} from "../../utils/algaehApiCall.js";
import {
  getTokenDetals,
  checkUser,
  OnSubmitUser,
} from "../../actions/Login/Loginactions.js";
import {
  // AlgaehCloseContainer,
  encrypter,
} from "../../utils/GlobalFunctions";
import connecting from "../../assets/svg/connecting.svg";
import "./Login.scss";
// import sockets from "../../sockets";
// import { from } from "linq";
import noUserImg from "../../assets/images/nobody_m.original.webp";
function Login(props) {
  const { history } = props;
  const remebermeUser = getCookie("userName");
  const [login, setLogin] = useState({
    username: remebermeUser,
    password: "",
    token: "",
    item_id: "",
    hospitalList: [],
    full_name: "",
    arabic_name: "",
    happyBirthDay: "",
    loading: true,
  });
  const [rspLoader, setRSPLoader] = useState(false);
  const [pinPopup, setPinPopup] = useState(false);
  const [pinNo, setPINNo] = useState({
    pinOne: "",
    pinTwo: "",
    pinThree: "",
    pinFour: "",
    pinFive: "",
  });
  const [vPinloading, setVPinLoading] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [remberMe, setRememberMe] = useState(
    remebermeUser !== null && remebermeUser !== "" ? true : false
  );
  const [loginLoad, setLoginLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState({
    newPassword: "",
    confirm: "",
  });
  const [showChangePassWord, setShowChangePassword] = useState(false);
  let userRef = useRef(undefined);
  let passwordRef = useRef(undefined);
  const pinOneRef = useRef(undefined);
  const {
    clearAll,
    setSelectedMenuItem,
    setUserPreferencesData,
    socket,
  } = useContext(MainContext);
  useEffect(() => {
    clearItem();
    clearAll();
    removeItem("locked");
    window.localStorage.clear();
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (String(name).trim() !== "userName")
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setCookie("ScreenName", "Login", 30);
    setCookie("Language", "en", 30);
    (() => {
      getTokenDetals({
        loading: (enabled) => {
          setLogin((data) => {
            return { ...data, loading: enabled };
          });
        },
        setHospitals: (list) => {
          setLogin({ ...login, loading: false, hospitalList: list });
        },
      });
      if (login.username !== null && login.username !== "") {
        checkUserActive();
      }
    })();
  }, []);

  function popUpMessage(message) {
    //const { value: password } =
    Swal.fire({
      title: "Already Logged In!",
      html: message,
      input: "password",
      confirmButtonText: "Login",
      showCancelButton: true,
      inputPlaceholder: "Re-enter password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
    }).then(({ value }) => {
      if (value !== undefined && value !== "") {
        const { username, item_id } = login;
        collectIP().then((identity) => {
          setLoginLoad(true);
          const dataSent = encrypter(
            JSON.stringify({
              username: username,
              password: value,
              item_id: item_id,
              identity: identity,
            })
          );

          algaehApiCall({
            uri: "/apiAuth/relogin",
            data: { post: dataSent },
            notoken: true,
            method: "POST",
            onSuccess: (response) => {
              const { success, records, message } = response.data;
              if (success === true) {
                const redirect = (redPage) => {
                  setLoginLoad(false);
                  setCookie("ScreenName", redPage);
                  history.push(`/${redPage}`);
                };
                setItem("token", records.token).then(() => {
                  getActiveModulesForUser()
                    .then((userMenu) => {
                      setSelectedMenu(userMenu, records.page_to_redirect).then(
                        () => {
                          getUserPrefrencesDetails({
                            user_id: records.keyData.user_id,
                          })
                            .then((userPreference) => {
                              setUserPreferencesData(userPreference);
                              setItem("userPreferences", userPreference);
                              getPreferences(
                                { userPreferences: userPreference },
                                "landing_page"
                              ).then((result) => {
                                let redPage =
                                  records.page_to_redirect === null
                                    ? "NoDashboard"
                                    : records.page_to_redirect.replace(
                                        /\s/g,
                                        ""
                                      );
                                if (result !== undefined) {
                                  const resource = result["preference"].find(
                                    (f) => f.controlName === "page"
                                  );
                                  if (resource !== undefined)
                                    redPage = resource.controlValue;
                                }
                                redirect(redPage);
                              });
                            })
                            .catch(() => {
                              const redPage =
                                records.page_to_redirect === null
                                  ? "NoDashboard"
                                  : records.page_to_redirect.replace(/\s/g, "");
                              redirect(redPage);
                            });
                          // const redPage =
                          //   records.page_to_redirect === null
                          //     ? "NoDashboard"
                          //     : records.page_to_redirect.replace(/\s/g, "");

                          // redirect(redPage);
                        }
                      );
                    })
                    .catch((error) => {
                      setLoginLoad(false);
                      swalMessage({
                        type: "error",
                        title: error,
                      });
                      logout();
                    });
                });
              } else {
                swalMessage({ type: "warning", title: message });
              }
            },
            onCatch: (e) => {
              setLoginLoad(false);
              swalMessage({ type: "error", title: e });
            },
          });
        });
      } else {
        setLoginLoad(false);
      }
    });
  }
  function setSelectedMenu(records, page_to_redirect) {
    records = records || [];
    return new Promise((resolve) => {
      if (page_to_redirect === null) {
        resolve();
      } else {
        let selectedMenu = {};
        for (let i = 0; i < records.length; i++) {
          const { ScreenList } = records[i];
          const selected = ScreenList.find(
            (f) =>
              String(f.page_to_redirect).toLowerCase() ===
              String(page_to_redirect).toLowerCase()
          );
          if (selected !== undefined) {
            selectedMenu = selected;
            break;
          }
        }
        setItem("userSelectedMenu", selectedMenu);
        setSelectedMenuItem(selectedMenu);
        resolve();
      }
    });
  }
  function getActiveModulesForUser() {
    return new Promise((resolve, reject) => {
      algaehApiCall({
        uri: "/algaehMasters/getRoleBaseActiveModules",
        method: "GET",
        onSuccess: (dataResponse) => {
          const { success, records, elements } = dataResponse.data;
          if (success) {
            setItem("menu", records);
            setItem("elements", elements);
            resolve(records);
          } else {
            reject(new Error(dataResponse.data.message));
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    });
  }
  function onErrorUserImage(e) {
    e.target.onerror = null;
    e.target.src = noUserImg;
  }
  function getUserPrefrencesDetails(input) {
    return new Promise((resolve, reject) => {
      try {
        algaehApiCall({
          uri: "/getPreferences/",
          method: "POST",
          timeout: 20000,
          data: input,
          module: "documentManagement",
          onSuccess: (response) => {
            const { data } = response;
            resolve(data.records);
          },
          onCatch: (error) => {
            reject(error);
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  function logout() {
    algaehApiCall({
      uri: "/apiAuth/logout",
      method: "GET",
      onSuccess: () => {
        socket.disconnect();
        clearItem();
        clearAll();
      },
    });
  }
  function checkUserActive() {
    setLoginLoad(true);
    checkUser({ userId: login.username })
      .then((result) => {
        setLogin((data) => {
          return {
            username: login.username,
            item_id: result.hospital_id,
            ...result,
          };
        });
        const hostName = window.location.hostname;
        const port = window.location.port;

        setUserImage(
          `http://${hostName}${
            port ? ":3006" : "/docserver"
          }/api/v1/Document/get?destinationName=${
            result.employee_code
          }&fileType=Employees`
        );
        setShowPassword(true);
        setLoginLoad(false);
        if (passwordRef.current !== undefined) passwordRef.current.focus();
      })
      .catch((error) => {
        setLoginLoad(false);
        setShowPassword(false);
        const { message } = error.response.data;
        swalMessage({ type: "error", title: message });
      });
  }
  function submitLogin() {
    setLoginLoad(true);
    OnSubmitUser(login)
      .then((records) => {
        setItem("token", records.token).then(() => {
          getActiveModulesForUser()
            .then((userMenu) => {
              setSelectedMenu(userMenu, records.page_to_redirect).then(() => {
                const redirect = (redPage) => {
                  setLoginLoad(false);
                  setCookie("ScreenName", redPage);
                  setCookie("HospitalId", records.hospital_id);
                  history.push(`/${redPage}`);
                };
                getUserPrefrencesDetails({ user_id: records.keyData.user_id })
                  .then((userPreference) => {
                    setItem("userPreferences", userPreference);
                    setUserPreferencesData(userPreference);
                    getPreferences(
                      { userPreferences: userPreference },
                      "landing_page"
                    ).then((result) => {
                      let redPage =
                        records.page_to_redirect === null
                          ? "NoDashboard"
                          : records.page_to_redirect.replace(/\s/g, "");

                      if (result !== undefined) {
                        const resource = result["preference"].find(
                          (f) => f.controlName === "page"
                        );
                        if (resource !== undefined)
                          redPage = resource.controlValue;
                      }
                      redirect(redPage);
                    });
                  })
                  .catch((error) => {
                    const redPage =
                      records.page_to_redirect === null
                        ? "NoDashboard"
                        : records.page_to_redirect.replace(/\s/g, "");
                    redirect(redPage);
                  });
              });
            })
            .catch((error) => {
              setLoginLoad(false);
              swalMessage({ type: "error", title: error });
              logout();
            });
        });
      })
      .catch((error) => {
        setLoginLoad(false);
        if (typeof error === "string" && error.includes("Machine")) {
          popUpMessage(error);
          return;
        }
        swalMessage({
          type: "error",
          title: error?.response?.data?.message || error.message,
        });
      });
  }
  function onHitEnter(e) {
    if (e.key === "Enter") {
      checkUserActive();
    }
  }
  function onHitEnterPassword(e) {
    if (e.key === "Enter") {
      submitLogin();
    }
  }
  function onChangeRememberMe(e) {
    const checked = e.target.checked;
    setRememberMe(checked);
    if (checked === true) {
      setCookie("userName", login.username, 100);
    } else {
      document.cookie = "userName=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
  function loginDifferenctUser() {
    document.cookie = "userName=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.reload(true);
  }
  function resetPassWord(e) {
    e.preventDefault();
    const { username } = login;
    setRSPLoader(true);
    setChangePassword({ newPassword: "", confirm: "" });
    setPINNo({
      pinOne: "",
      pinTwo: "",
      pinThree: "",
      pinFour: "",
      pinFive: "",
    });
    algaehApiCall({
      uri: "/apiAuth/resetPassword",
      data: { username },
      notoken: true,
      method: "POST",
      onSuccess: (response) => {
        setRSPLoader(false);
        setPinPopup(true);

        swalMessage({
          type: "success",
          title: "please check your email",
        });
        pinOneRef.current.focus();
      },
      onCatch: (error) => {
        setRSPLoader(false);
        setPinPopup(false);

        swalMessage({
          type: "error",
          title: error,
        });
      },
    });
  }
  function onClickOK() {
    const { username } = login;
    setVPinLoading(true);
    const { pinOne, pinTwo, pinThree, pinFour, pinFive } = pinNo;
    const pin = pinOne + pinTwo + pinThree + pinFour + pinFive;
    algaehApiCall({
      uri: "/apiAuth/verifyPin",
      data: { username, pinNo: pin },
      notoken: true,
      method: "POST",
      onSuccess: (response) => {
        setVPinLoading(false);
        setPinPopup(false);
        setShowChangePassword(true);
        swalMessage({
          type: "success",
          title: "Successfully Verified",
        });
      },
      onCatch: (error) => {
        setVPinLoading(false);
        setShowChangePassword(false);
        swalMessage({
          type: "error",
          title: error,
        });
      },
    });
  }
  function onChangePIN(e) {
    const { name, value } = e.target;
    const next = e.target.parentElement.getAttribute("next");
    setPINNo((result) => {
      return { ...result, [name]: value };
    });
    if (next !== null) document.getElementsByName(next)[0].focus();
    if (name === "pinFive") {
      document
        .getElementsByClassName("ant-modal-footer")[0]
        .querySelectorAll("button")[1]
        .focus();
    }
  }
  function onOnlyNumber(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }
  function onChangeCreatePassword(e) {
    const { name, value } = e.target;
    setChangePassword((result) => {
      return { ...result, [name]: value };
    });
  }
  function onOKPassword() {
    const { username } = login;
    const { newPassword, confirm } = changePassword;
    if (newPassword !== confirm) {
      swalMessage({
        type: "error",
        title: "Password not matching",
      });
      return;
    }
    algaehApiCall({
      uri: "/apiAuth/changePasswordRequest",
      data: { username, newPassword },
      notoken: true,
      method: "PUT",
      onSuccess: (response) => {
        setShowChangePassword(false);
        swalMessage({
          type: "success",
          title: "Please Login",
        });
      },
      onCatch: (error) => {
        swalMessage({
          type: "error",
          title: error,
        });
      },
    });
  }
  return (
    <div className="login bg">
      <Spin
        className="spinner"
        spinning={loginLoad}
        tip="Please wait verifying user"
      >
        <div className="container">
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
                {/* <div className="algaehLogo"></div>
                <div className="clientLogo"></div> */}
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      {showPassword === true ? (
                        <div className="col-12 passwordSec">
                          <AlgaehModal
                            width={350}
                            title="Verify PIN"
                            visible={pinPopup}
                            centered={true}
                            destroyOnClose={true}
                            cancelText="Re-Send PIN"
                            okText="Verify"
                            cancelButtonProps={{ type: "primary" }}
                            onCancel={resetPassWord}
                            closable={false}
                            onOk={onClickOK}
                            okButtonProps={{ loading: vPinloading }}
                          >
                            <div className="row">
                              <AlagehFormGroup
                                div={{ className: "col-2 form-group" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "pinOne",
                                  value: pinNo.pinOne,
                                  events: {
                                    onChange: onChangePIN,
                                  },
                                  others: {
                                    next: "pinTwo",
                                    ref: pinOneRef,
                                    maxLength: "1",
                                    onKeyDown: onOnlyNumber,
                                  },
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-2 form-group" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "pinTwo",
                                  value: pinNo.pinTwo,
                                  events: {
                                    onChange: onChangePIN,
                                  },
                                  others: {
                                    next: "pinThree",
                                    maxLength: "1",
                                    onKeyPress: onOnlyNumber,
                                  },
                                }}
                              />

                              <AlagehFormGroup
                                div={{ className: "col-2 form-group" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "pinThree",
                                  value: pinNo.pinThree,
                                  events: {
                                    onChange: onChangePIN,
                                  },
                                  others: {
                                    next: "pinFour",
                                    maxLength: "1",
                                    onKeyPress: onOnlyNumber,
                                  },
                                }}
                              />

                              <AlagehFormGroup
                                div={{ className: "col-2 form-group" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "pinFour",
                                  value: pinNo.pinFour,
                                  events: {
                                    onChange: onChangePIN,
                                  },
                                  others: {
                                    next: "pinFive",
                                    maxLength: "1",
                                    onKeyDown: onOnlyNumber,
                                  },
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-2 form-group" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "pinFive",
                                  value: pinNo.pinFive,
                                  events: {
                                    onChange: onChangePIN,
                                  },
                                  others: {
                                    maxLength: "1",
                                    onKeyPress: onOnlyNumber,
                                  },
                                }}
                              />
                            </div>
                          </AlgaehModal>
                          <AlgaehModal
                            title="Change Password"
                            visible={showChangePassWord}
                            destroyOnClose={true}
                            onOk={onOKPassword}
                            onCancel={() => {
                              setShowChangePassword(false);
                            }}
                          >
                            <div className="col-12 form-group">
                              <label className="style_Label ">
                                New Password
                              </label>
                              <Input.Password
                                placeholder="New Password"
                                defaultValue={changePassword.newPassword}
                                name="newPassword"
                                className="ant-input txt-fld"
                                onChange={onChangeCreatePassword}
                              ></Input.Password>
                            </div>
                            <div className="col-12 form-group">
                              <label className="style_Label ">
                                Confirm Password
                              </label>
                              <Input.Password
                                placeholder="New Password"
                                defaultValue={changePassword.confirm}
                                name="confirm"
                                className="ant-input txt-fld"
                                onChange={onChangeCreatePassword}
                              ></Input.Password>
                            </div>
                          </AlgaehModal>
                          {login.happyBirthDay !== "" ? (
                            <div class="wishMsg">
                              <div class="animated infinte bounceIn delay-1s messegeText">
                                <small>{login.happyBirthDay}</small> <br></br>{" "}
                                {login.full_name}
                              </div>
                              <div class="birthday">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>{" "}
                            </div>
                          ) : null}
                          <div className="row">
                            <div className="col userAfterLogin">
                              <img
                                className="userImg"
                                src={userImage}
                                onError={onErrorUserImage}
                              ></img>
                              <h1>Welcome</h1>
                              <h6>{login.full_name}</h6>
                            </div>
                            <AlagehFormGroup
                              div={{ className: "col-12 form-group" }}
                              textBox={{
                                className: "txt-fld",
                                name: "password",
                                value: login.password,
                                events: {
                                  onChange: (e) => {
                                    setLogin({
                                      ...login,
                                      password: e.target.value,
                                    });
                                  },
                                },
                                others: {
                                  type: "password",
                                  tabIndex: "3",
                                  placeholder: "Enter Password",
                                  ref: passwordRef,
                                  onKeyDown: onHitEnterPassword,
                                },
                              }}
                            />

                            <div className="col-12 form-group">
                              <div className="checkbox">
                                <label>
                                  <span>
                                    <input
                                      type="checkbox"
                                      value="remember-me"
                                      onChange={onChangeRememberMe}
                                      checked={remberMe}
                                    />
                                  </span>{" "}
                                  <b> Remember me</b>
                                </label>
                              </div>
                              <button
                                className="btn btn-lg btn-secondary btn-block sign-btn"
                                type="submit"
                                tabIndex="4"
                                disabled={rspLoader}
                                onClick={submitLogin}
                              >
                                Login
                              </button>{" "}
                              <p
                                className="diffUser"
                                onClick={loginDifferenctUser}
                              >
                                Another User? <b>Click Here</b>
                              </p>
                              <p className="frgtPass">
                                Forgot Password? |{" "}
                                {rspLoader === true ? (
                                  <label>Please wait generating request</label>
                                ) : (
                                  <a href="#" onClick={resetPassWord}>
                                    Request New Password
                                  </a>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {" "}
                          <div className="col-12">
                            <div className="companyLogo" />
                            <p className="appName">Management System</p>
                          </div>
                          <div className="col-12 usernameSec">
                            <div className="row">
                              <AlagehFormGroup
                                div={{ className: "col-12 form-group" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "username",
                                  value: login.username,
                                  events: {
                                    onChange: (e) => {
                                      setLogin({
                                        ...login,
                                        username: e.target.value,
                                      });
                                    },
                                  },
                                  others: {
                                    tabIndex: "1",
                                    placeholder: "Enter Username",
                                    ref: userRef,
                                    onKeyDown: onHitEnter,
                                  },
                                }}
                              />
                              <br />
                              <div
                                className="col-12 form-group"
                                style={{ textAlign: "right" }}
                              >
                                <button
                                  className="btn btn-lg btn-block btn-secondary sign-btn"
                                  disabled={
                                    login.username.replace(/ /g, "") !== ""
                                      ? false
                                      : true
                                  }
                                  type="submit"
                                  tabIndex="2"
                                  onClick={checkUserActive}
                                >
                                  Next
                                </button>
                              </div>{" "}
                            </div>
                          </div>
                        </>
                      )}
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
