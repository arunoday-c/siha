import React, { Component } from "react";
import "./Login.css";
import {
  TextField,
  Button,
  CircularProgress,
  LinearProgress
} from "material-ui";
import {
  algaehApiCall,
  getCookie,
  setCookie
} from "../../utils/algaehApiCall.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getTokenDetals } from "../../actions/Login/Loginactions.js";
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

class Login extends Component {
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
        token: this.props.tokensDtl,
        data: this.state,
        timeout: 10000,
        onSuccess: response => {
          if (response.data.success === true) {
            window.location.hash = "/Home";
          } else {
          }
        },
        onFailure: error => {
          x.style.display = "none";
          if (error.response.status !== null && error.response.status === 404) {
            this.unsuccessfulSignIn();
          }
        }
      });
    }
  }

  unsuccessfulSignIn() {
    swal({
      title: "Failed",
      text:
        "User Name or Password doesn't match.\n Please check and login again",
      icon: "error",
      button: false,
      timer: 2500
    });

    this.setState({ password: "", username: "" });
    //document.getElementById("username").focus();
    document.querySelector("[name='username']").focus();
  }

  componentDidMount() {
    this.props.getTokenDetals();
  }
  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  render() {
    if (this.props.tokensDtl === 0 || this.props.tokensDtl.length === 0) {
      return (
        <div className="container">
          <div className="row" style={{ marginTop: "30%" }}>
            <div className="col-lg-1 offset-5">
              <CircularProgress size={100} />
            </div>
          </div>
        </div>
      );
    }

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

              <h3 style={{ marginTop: 40 }}>
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
                    }
                  }}
                />

                {/* <TextField
                  onChange={this.changeUserName.bind(this)}
                  value={this.state.username}
                  style={styles.textField}
                  error={this.state.userError}
                  helperText={this.state.userErrorText}
                  label="User Name"
                  id="username"
                /> */}

                <br />
                {/* <TextField
                  onChange={this.changePwd.bind(this)}
                  value={this.state.password}
                  error={this.state.pwdError}
                  helperText={this.state.pwdErrorText}
                  style={styles.textField}
                  label="Password"
                  type="password"
                /> */}

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
                    }
                  }}
                />

                <br />

                {/* <Link to="#"> */}
                <Button
                  type="submit"
                  style={styles.login_btn}
                  variant="raised"
                  color="primary"
                >
                  Log In
                </Button>
                {/* </Link> */}

                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tokensDtl: state.tokensDtl.tokensDtl
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getTokenDetals: getTokenDetals }, dispatch);
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
