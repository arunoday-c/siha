import React, { Component } from "react";
import "./Login.css";
import { Button } from "../Wrapper/algaehWrapper";
import LinearProgress from "@material-ui/core/LinearProgress";

import { algaehApiCall, setCookie } from "../../utils/algaehApiCall.js";
import swal from "sweetalert";
import { AlagehFormGroup } from "../Wrapper/algaehWrapper";

const styles = {
  root: {
    height: "100%"
  },
  textField: {
    margin: 10,
    width: 200,
    textAlign: "left"
  },
  login_btn: {
    margin: 40,
    width: 200,
    backgroundColor: "#3A95AA"
  }
};

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
    setCookie("ScreenName", "Login", 30);
  }

  handleLogin(e) {
    e.preventDefault();
    if (this.state.username.length === 0 && this.state.password.length === 0) {
      this.setState({
        userError: true,
        pwdError: true,
        userErrorText: "Please enter a Username",
        pwdErrorText: "Password cannot be empty"
      });
    } else if (this.state.username.length === 0) {
      this.setState({
        userError: true,
        userErrorText: "Please enter a Username",
        pwdError: false,
        pwdErrorText: ""
      });
    } else if (this.state.password.length === 0) {
      this.setState({
        pwdError: true,
        pwdErrorText: "Password cannot be empty",
        userError: false,
        userErrorText: ""
      });
    } else if (this.state.password.length < 6) {
      this.setState({
        pwdError: true,
        pwdErrorText: "Password too short.",
        userError: false,
        userErrorText: ""
      });
    } else {
      this.setState({
        userError: false,
        pwdError: false,
        userErrorText: "",
        pwdErrorText: ""
      });

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
            setCookie("UserID", response.data.records.algaeh_d_app_user_id, 30);

            window.location.hash = "/Home";
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
  }

  unsuccessfulSignIn(message, title) {
    swal({
      title: title,
      text: message,
      icon: "error",
      button: false,
      timer: 2500
    });

    this.setState({ password: "", username: "" });
    //document.getElementById("username").focus();
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
            <div
              id="emptyDiv"
              className="col-lg-5 offset-2"
              style={{ backgroundColor: "#007379CC" }}
            >
              {/* Add Client's Logo and other details here */}
            </div>

            <div
              id="loginForm"
              className="col-lg-4"
              style={{
                backgroundColor: "#EDEDED"
              }}
            >
              <LinearProgress id="myProg" style={{ display: "none" }} />

              <h3 style={{ marginTop: 40, textAlign: "center" }}>
                <span style={{ color: "#3A95AA" }}> ALGAEH</span> ERP
              </h3>

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

                <br />

                <Button
                  type="submit"
                  style={styles.login_btn}
                  variant="raised"
                  color="primary"
                >
                  Log In
                </Button>

                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
