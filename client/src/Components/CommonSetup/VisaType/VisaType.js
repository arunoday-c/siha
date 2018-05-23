import React, { Component } from "react";
import { Paper, TextField, LinearProgress } from "material-ui";
import "./visatype.css";
import { MuiThemeProvider, createMuiTheme } from "material-ui";
import { Button } from "material-ui";
import SelectField from "../../common/Inputs/SelectField.js";
import moment from "moment";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import { getVisatypes } from "../../../actions/CommonSetup/Visatype.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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

class VisaType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visa_type_code: "",
      visa_type_code_error: false,
      visa_type_code_error_txt: "",
      visa_type: "",
      visa_type_error: false,
      visa_type_error_txt: "",
      visa_type_desc: "",
      hims_d_visa_type_id: "",
      buttonText: "ADD TO LIST"
    };
  }

  componentDidMount() {
    this.props.getVisatypes();
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  editVisaTypes(e) {
    const data = JSON.parse(e.currentTarget.getAttribute("current_edit"));

    this.setState({
      visa_type: data.visa_type,
      visa_type_code: data.visa_type_code,
      visa_type_desc: data.visa_type,
      hims_d_visa_type_id: data.hims_d_visa_type_id,
      buttonText: "UPDATE"
    });
  }
  addVisaType(e) {
    e.preventDefault();
    if (this.state.visa_type_code.length == 0) {
      this.setState({
        visa_type_code_error: true,
        visa_type_code_error_txt: "Visa Type cannot be empty"
      });
    } else if (this.state.visa_type.length == 0) {
      this.setState({
        visa_type_error: true,
        visa_type_error_txt: "Visa Type Code cannot be empty"
      });
    } else {
      let uri = "";
      if (this.state.buttonText == "ADD TO LIST") {
        uri = "/masters/set/add/visa";
      } else if (this.state.buttonText == "UPDATE") {
        uri = "/masters/set/update/visa";
      }

      algaehApiCall({
        uri: uri,        
        data: this.state,
        onSuccess: response => {
          console.log("Res Visa", response.data.success);
          console.log("Res Visa Data", response.data);
          window.location.reload();
          if (response.data.success == true) {
            //Handle Successful Add here
          } else {
            //Handle unsuccessful Add here.
          }
        },
        onFailure: error => {
          console.log(error);

          // Handle network error here.
        }
      });
    }
  }

  getFormatedDate(date) {
    return String(moment(date).format("DD-MM-YYYY"));
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="visa_type">
          <LinearProgress id="myProg" style={{ display: "none" }} />
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
                    VISA TYPE CODE <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.visa_type_code_error}
                    helperText={this.state.visa_type_code_error_txt}
                    name="visa_type_code"
                    value={this.state.visa_type_code}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>

                <div className="col-lg-3">
                  <label>
                    VISA TYPE NAME <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.visa_type_error}
                    helperText={this.state.visa_type_error_txt}
                    name="visa_type"
                    value={this.state.visa_type}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>

                <div className="col-lg-3 align-middle">
                  <br />
                  <Button
                    onClick={this.addVisaType.bind(this)}
                    variant="raised"
                    color="primary"
                  >
                    {this.state.buttonText}
                  </Button>
                </div>
              </div>
            </form>

            <div className="row form-details">
              <div className="col">
                <label> PATIENT TYPE LIST</label>
                <table className="table table-striped table-details table-hover">
                  <thead style={{ background: "#A9E5E0" }}>
                    <tr>
                      <td scope="col">ACTION</td>
                      <td scope="col">#</td>
                      <td scope="col">VISA TYPE CODE</td>
                      <td scope="col">VISA TYPE NAME</td>
                      <td scope="col">ADDED DATE</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.visatypes.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <span
                            onClick={this.handleDel}
                            className="fas fa-trash-alt"
                            style={{ paddingRight: "24px" }}
                          />
                          <span
                            current_edit={JSON.stringify(row)}
                            onClick={this.editVisaTypes.bind(this)}
                            className="fas fa-pencil-alt"
                          />
                        </td>
                        <td> {index + 1}</td>
                        <td> {row.visa_type_code}</td>
                        <td> {row.visa_type}</td>
                        <td> {this.getFormatedDate(row.created_date)}</td>
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
  return {
    visatypes: state.visatypes.visatypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisatypes: getVisatypes
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VisaType)
);
