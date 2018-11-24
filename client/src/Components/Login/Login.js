import React, { Component } from "react";
import "./Login.css";
import { AlgaehLabel, AlagehAutoComplete } from "../Wrapper/algaehWrapper";
import { setSecure } from "../../utils/indexer";
import {
  algaehApiCall,
  setCookie,
  swalMessage
} from "../../utils/algaehApiCall.js";
import { AlagehFormGroup } from "../Wrapper/algaehWrapper";
import { getTokenDetals } from "../../actions/Login/Loginactions.js";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userErrorText: "",
      pwdErrorText: "",
      userError: false,
      pwdError: false,
      username: "",
      password: "",
      token: "",
      item_id: ""
    };
  }

  componentDidMount() {
    getTokenDetals();
  }

  componentWillUnmount() {
    window.sessionStorage.removeItem("hospitalList");
  }
  componentWillMount() {
    this.deleteAllPreviousCookies();
    this.deleteAllPreviousLocalStorage();
    setCookie("ScreenName", "Login", 30);
    setCookie("Language", "en", 30);
  }

  deleteAllPreviousLocalStorage() {
    window.localStorage.clear();
  }
  deleteAllPreviousCookies() {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (String(name).trim() !== "authToken")
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  handleLogin(e) {
    e.preventDefault();

    algaehApiCall({
      uri: "/apiAuth/authUser",
      data: this.state,
      timeout: 10000,
      onSuccess: response => {
        if (response.data.success === true) {
          setCookie("userName", response.data.records.username);
          setCookie("keyResources", response.data.records.keyResources, 30);
          setSecure(response.data.records.secureModels);

          window.location.hash = "/Home";
          window.history.pushState(null, null, window.location.href);
          window.onpopstate = function(event) {
            window.history.go(1);
          };
        } else {
        }
      },
      onFailure: error => {
        if (error) {
          if (error.response) {
            if (
              error.response.status !== null &&
              error.response.status === 404
            ) {
              this.unsuccessfulSignIn(
                "User Name or Password doesn't match.\n Please check and login again",
                "Invalid User Details."
              );
            } else if (
              error.response.status !== null &&
              error.response.status > 400
            ) {
              this.unsuccessfulSignIn(
                "Server is not responding, Please contact administator.",
                "Failure"
              );
            }
          } else {
            this.unsuccessfulSignIn(
              "Server is not responding, Please contact administator.",
              "Failure"
            );
          }
        } else {
          this.unsuccessfulSignIn(
            "Server is not responding, Please contact administator.",
            "Failure"
          );
        }
      }
    });
  }

  unsuccessfulSignIn(message, title) {
    swalMessage({
      title: message,
      type: "error"
    });

    this.setState({ password: "", username: "" });
    document.querySelector("[name='username']").focus();
  }

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  onHospitalChange(selector) {
    this.setState({ item_id: selector.value });

    setCookie("HospitalName", selector.selected.hospital_name);
  }
  onHospitalClear(name) {
    this.setState({ item_id: null });
  }
  render() {
    const _hospitalList =
      window.sessionStorage.getItem("hospitalList") === null ||
      window.sessionStorage.getItem("hospitalList") === "undefined"
        ? []
        : JSON.parse(window.sessionStorage.getItem("hospitalList"));
    return (
      <div className="login bg">
        <div className="container margintop15">
          <div className="row-eq-height">
            {/*<div
              id="emptyDiv"
              className="col-lg-5 offset-2"
              style={{ backgroundColor: "#007379CC" }}
            >
               Add Client's Logo and other details here
            </div> */}
            <div className="loginTopbar">
              <div className="companyLogo" />
              <div className="productLogo" />
            </div>

            <div id="loginForm" className="loginFormContainer">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    {" "}
                    <h3
                      style={{
                        marginTop: 20,
                        marginBottom: 20,
                        textAlign: "center"
                      }}
                    >
                      <span style={{ color: "#3A95AA" }}>Login In</span>
                    </h3>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      paddingTop: 15,
                      paddingBottom: 15
                    }}
                  >
                    <form
                      onSubmit={this.handleLogin.bind(this)}
                      className="row"
                    >
                      <AlagehFormGroup
                        div={{ className: "col-12" }}
                        label={{
                          fieldName: "username",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "username",
                          value: this.state.username,
                          events: {
                            onChange: this.texthandle.bind(this)
                          },
                          error: this.state.userError,
                          helperText: this.state.userErrorText
                        }}
                      />
                      <br />
                      <AlagehFormGroup
                        div={{ className: "col-12" }}
                        label={{
                          fieldName: "password",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "password",
                          value: this.state.password,
                          events: {
                            onChange: this.texthandle.bind(this)
                          },
                          others: {
                            type: "password"
                          },
                          error: this.state.pwdError,
                          helperText: this.state.pwdErrorText
                        }}
                      />
                      <br />
                      <AlagehAutoComplete
                        div={{ className: "col-12" }}
                        label={{
                          forceLabel: "Select Hospital Location",
                          isImp: true
                        }}
                        selector={{
                          name: "item_id",
                          className: "select-fld",
                          value: this.state.item_id,
                          dataSource: {
                            textField: "hospital_name",
                            valueField: "hims_d_hospital_id",
                            data: _hospitalList
                          },
                          onChange: this.onHospitalChange.bind(this),
                          onClear: this.onHospitalClear.bind(this)
                        }}
                      />
                      <div className="col-12">
                        <div className="checkbox">
                          <label>
                            <input type="checkbox" value="remember-me" />{" "}
                            Remember me
                          </label>
                        </div>
                        <button
                          className="btn btn-lg btn-primary btn-block sign-btn"
                          type="submit"
                        >
                          Log In
                        </button>
                        <p className="frgtPass">
                          <a>Forgot Password?</a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="loginFooter">
              <p>
                COPYRIGHT © 2018. ALL RIGHTS RESERVED.{" "}
                <a href="http://algaeh.com/">ALGAEH TECHNOLOGIES PVT. LTD.</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
