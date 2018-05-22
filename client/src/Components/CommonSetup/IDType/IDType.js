import React, { Component } from "react";
import { Paper, TextField } from "material-ui";
import "./id_type.css";
import { MuiThemeProvider, createMuiTheme } from "material-ui";
import { Button } from "material-ui";
import moment from "moment";
import { getIDTypes } from "../../../actions/CommonSetup/IDType.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {algaehApiCall} from '../../../utils/algaehApiCall'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#00BCB0",
      main: "#00BCB0",
      dark: "#00BFC2",
      contrastText: "#fff"
    }
  }
});

class IDType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id_type_status: "A",
      effective_end_date: "",
      identity_document_code: "",
      identity_document_name: "",
      created_by: "1",
      idtypes: []
    };
  }

  handleDel() {
    alert("CLicked");
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeStatus(e) {
    this.setState({ id_type_status: e.target.value });

    if (e.target.value == "A")
      this.setState({ effective_end_date: "9999-12-31" });
    else if (e.target.value == "I") {
      this.setState({
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
  }



  addIDType(e) {
    e.preventDefault();




    //console.log("myState", this.state);
    algaehApiCall({
      uri: "/identity/add",
      data: this.state,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjUwNjk5NjcsImV4cCI6MTUyNzY2MTk2N30.7jVtM39kz3hPVAdX82v1JSQpgREJjQCFnVmDpvPN17g",
      onSuccess: response => {
        console.log("Id Types", response.data);
        window.location.reload();
      },
      onFailure: error => {
        console.log(error);
      }
    });


  }

  componentDidMount() {
    this.props.getIDTypes();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="id_type">
          <Paper className="container-fluid">
            <form>
              <div
                className="row"
                style={{
                  padding: 20,
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <div className="col-lg-3">
                  <label>
                    Status <span className="imp">*</span>
                  </label>
                  <br />
                  <input
                    onChange={this.changeStatus.bind(this)}
                    style={{
                      padding: 8,
                      margin: 8
                    }}
                    type="radio"
                    name="status"
                    value="A"
                  />
                  <label className="center">Active </label>

                  <input
                    onChange={this.changeStatus.bind(this)}
                    style={{
                      padding: 8,
                      margin: 8
                    }}
                    type="radio"
                    name="status"
                    value="I"
                  />
                  <label className="center">Inactive </label>
                </div>

                <div className="col-lg-3">
                  <label>
                    ID TYPE CODE <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    name="identity_document_code"
                    value={this.state.identity_document_code}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>

                <div className="col-lg-3">
                  <label>
                    ID TYPE NAME <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    name="identity_document_name"
                    value={this.state.identity_document_name}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>

                <div className="col-lg-3 align-middle">
                  <br />
                  <Button
                    onClick={this.addIDType.bind(this)}
                    variant="raised"
                    color="primary"
                  >
                    ADD TO LIST
                  </Button>
                </div>
              </div>
            </form>

            <div className="row form-details">
              <div className="col">
                <label> ID TYPE LIST</label>
                <table className="table table-striped table-details table-hover">
                  <thead style={{ background: "#A9E5E0" }}>
                    <tr>
                      <td scope="col">ACTION</td>
                      <td scope="col">#</td>
                      <td scope="col">ID TYPE CODE</td>
                      <td scope="col">ID TYPE NAME</td>

                      <td scope="col">STATUS</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.idtypes.map((row, index) => (
                      <tr key={index} onClick={this.handleDel}>
                        <td>
                          <span
                            onClick={this.handleDel}
                            className="fas fa-trash-alt"
                            style={{ paddingRight: "24px" }}
                          />
                          <span className="fas fa-pencil-alt" />
                        </td>
                        <td> {index + 1}</td>
                        <td> {row.identity_document_code}</td>
                        <td> {row.identity_document_name}</td>

                        <td> ACTIVE</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  debugger;
  return {
    idtypes: state.idtypes.idtypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIDTypes: getIDTypes
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IDType));
