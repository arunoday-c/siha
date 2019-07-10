import React, { Component } from "react";

import "./Login.css";
import { AlagehAutoComplete } from "../Wrapper/algaehWrapper";
// import { setSecure } from "../../utils/indexer";
import {
  algaehApiCall,
  setCookie,
  swalMessage
} from "../../utils/algaehApiCall.js";
import { AlagehFormGroup } from "../Wrapper/algaehWrapper";
import { getTokenDetals } from "../../actions/Login/Loginactions.js";
import { AlgaehCloseContainer } from "../../utils/GlobalFunctions";

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
      item_id: "",
      hospitalList: []
    };
    sessionStorage.clear();
  }

  componentDidMount() {
    getTokenDetals(this);
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

    if (this.state.item_id === "") {
      document.getElementsByName("item_id")[0].focus();
      return;
    }
    algaehApiCall({
      uri: "/apiAuth/authUser",
      data: this.state,
      timeout: 10000,
      onSuccess: response => {
        if (response.data.success === true) {
          setCookie("userName", response.data.records.user_display_name);
          setCookie("keyResources", response.data.records.keyResources, 30);

          sessionStorage.setItem(
            "CurrencyDetail",
            AlgaehCloseContainer(
              JSON.stringify(response.data.records.hospitalDetails)
            )
          );

          sessionStorage.setItem(
            "appRole",
            response.data.records.app_d_app_roles_id
          );
          window.history.pushState(null, null, window.location.href);
          window.onpopstate = function(event) {
            window.history.go(1);
          };
          window.location.hash = "/Home";
          // setSecure(response.data.records.secureModels);

          // this.getHospitalDetails();
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
                "Username or Password or Branch Incorrect",
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
    setCookie("HospitalId", selector.value);
  }
  onHospitalClear(name) {
    this.setState({ item_id: null });
  }

  render() {
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
            {/* <div className="loginTopbar">
              <div className="companyLogo" />
              <div className="productLogo" />
            </div> */}

            <div id="loginForm" className="loginFormContainer">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="companyLogo" />
                    <h3 className="LoginCntrHdg">Login</h3>
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
                      autoComplete="none"
                    >
                      <AlagehFormGroup
                        div={{ className: "col-12 form-group" }}
                        // label={{
                        //   fieldName: "username",
                        //   isImp: true
                        // }}
                        textBox={{
                          className: "txt-fld",
                          name: "username",
                          value: this.state.username,
                          events: {
                            onChange: this.texthandle.bind(this)
                          },
                          others: {
                            tabIndex: "1",
                            placeholder: "Enter Username"
                          },
                          error: this.state.userError,
                          helperText: this.state.userErrorText
                        }}
                      />
                      <br />
                      <AlagehFormGroup
                        div={{ className: "col-12 form-group" }}
                        // label={{
                        //   fieldName: "password",
                        //   isImp: true
                        // }}
                        textBox={{
                          className: "txt-fld",
                          name: "password",
                          value: this.state.password,
                          events: {
                            onChange: this.texthandle.bind(this)
                          },
                          others: {
                            type: "password",
                            tabIndex: "2",
                            placeholder: "Enter Password"
                          },
                          error: this.state.pwdError,
                          helperText: this.state.pwdErrorText
                        }}
                      />
                      <br />
                      <AlagehAutoComplete
                        div={{ className: "col-12 form-group" }}
                        // label={{
                        //   forceLabel: "Select Division/Branch",
                        //   isImp: true
                        // }}
                        selector={{
                          name: "item_id",
                          className: "select-fld",
                          value: this.state.item_id,
                          autoComplete: "off",
                          dataSource: {
                            textField: "hospital_name",
                            valueField: "hims_d_hospital_id",
                            data: this.state.hospitalList
                          },
                          placeholder: "Select a Branch",
                          others: { tabIndex: "3" },
                          onChange: this.onHospitalChange.bind(this),
                          onClear: this.onHospitalClear.bind(this)
                        }}
                      />
                      <div className="col-12 form-group">
                        <div className="checkbox">
                          <label>
                            <input type="checkbox" value="remember-me" />{" "}
                            Remember me
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
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="loginFooter">
              <p>
                COPYRIGHT © 2018. ALL RIGHTS RESERVED.{" "}
                <a href="http://algaeh.com/" targe="_blank">
                  ALGAEH TECHNOLOGIES PVT. LTD.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
