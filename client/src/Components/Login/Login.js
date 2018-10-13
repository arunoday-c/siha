import React, { Component } from "react";
import "./Login.css";
import { Button } from "../Wrapper/algaehWrapper";
import LinearProgress from "@material-ui/core/LinearProgress";
import { setSecure } from "../../utils/indexer";
import {
  algaehApiCall,
  setCookie,
  swalMessage
} from "../../utils/algaehApiCall.js";
import { AlagehFormGroup } from "../Wrapper/algaehWrapper";

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
      token: ""
    };
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
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  handleLogin(e) {
    e.preventDefault();
    let x = document.getElementById("myProg");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }

    algaehApiCall({
      uri: "/apiAuth/authUser",
      data: this.state,
      timeout: 10000,
      onSuccess: response => {
        if (response.data.success === true) {
          setCookie("userName", response.data.records.user_displayname);
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
        x.style.display = "none";
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
            <div className="loginTopbar"><div className="companyLogo"></div><div className="productLogo"></div></div>

            <div id="loginForm" className="loginFormContainer">
              <LinearProgress id="myProg" style={{ display: "none" }} />

              <h3
                style={{ marginTop: 20, marginBottom: 20, textAlign: "center" }}
              >
                <span style={{ color: "#3A95AA" }}>Login In</span>
              </h3>
              <div>
                <form onSubmit={this.handleLogin.bind(this)}>
                  <AlagehFormGroup
                    div={{ className: "col" }}
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
                    div={{ className: "col" }}
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
                  <div className="col">
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" value="remember-me" /> Remember
                        me
                      </label>
                    </div>
                    <Button
                      className="btn btn-lg btn-primary btn-block sign-btn"
                      type="submit"
                    >
                      Log In
                    </Button>
                    <p className="frgtPass">
                      <a>Forgot Password?</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            <div className="loginFooter"><p>COPYRIGHT © 2018. ALL RIGHTS RESERVED. <a href="http://algaeh.com/">ALGAEH TECHNOLOGIES PVT. LTD.</a></p></div>

           
          </div>
        </div>
      </div>
    );
  }
}
