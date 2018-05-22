import React, { Component } from "react";
import { Paper, TextField } from "material-ui";
import "./visit_type.css";
import { MuiThemeProvider, createMuiTheme } from "material-ui";
import { Button } from "material-ui";
import moment from "moment";
import SelectField from "../commons/SelectField.js";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import { getVisittypes } from "../../../actions/CommonSetup/VisitTypeactions.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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

const VISIT_TYPE = [
  { name: "CONSULTATION", value: "CONSULTATION", key: "cn" },
  { name: "NON CONSULTATION", value: "NON CONSULTATION", key: "ncn" }
];

class VisitType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      visit_type_code: "",
      visit_type_code_error: false,
      visit_type_code_error_txt: "",
      visit_type: "",
      visit_type_error: false,
      visit_type_error_txt: "",
      hims_d_visit_type: "",
      hims_d_visit_type_error: false,
      hims_d_visit_type_error_txt: "",
      created_by: "1",
      buttonText: "ADD TO LIST",
      hims_d_visit_type_id: "",
      deleteId: ""
    };
  }

  handleConfirmDelete() {
    const data = { hims_d_visit_type_id: this.state.deleteId };

    algaehApiCall({
      uri: "/visitType/delete",
      data: data,
      method: "DELETE",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjUwNjk5NjcsImV4cCI6MTUyNzY2MTk2N30.7jVtM39kz3hPVAdX82v1JSQpgREJjQCFnVmDpvPN17g",
      onSuccess: response => {
        console.log("DELETED RESPONSE", response.data);
        this.setState({open : false})
        window.location.reload();
      },
      onFailure: error => {
        console.log(error);
        this.setState({open : false})
      }
    });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDelete(e) {
    const visit_id = JSON.parse(e.currentTarget.getAttribute("sltd_id"));
    this.setState({ open: true ,deleteId : visit_id});
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  selectedVisitType(visitType) {
    this.setState({ hims_d_visit_type: visitType });
  }

  componentDidMount() {
    this.props.getVisittypes();
  }

  addVisit(e) {
    e.preventDefault();
    if (this.state.visit_type_code.length == 0) {
      this.setState({
        visit_type_code_error: true,
        visit_type_code_error_txt: "Visit Code Cannot be Empty"
      });
    } else if (this.state.visit_type.length == 0) {
      this.setState({
        visit_type_error: true,
        visit_type_error_txt: "Visit Name Cannot be Empty"
      });
    } else {
      this.setState({
        visit_type_code_error: false,
        visit_type_code_error_txt: "",
        visit_type_error: false,
        visit_type_error_txt: ""
      });


      let uri = "";
      if (
        this.state.buttonText == "ADD TO LIST" &&
        this.state.hims_d_visit_type_id.length == 0
      ) {
        uri = "/visitType/add";
      } else if (
        this.state.buttonText == "UPDATE" &&
        this.state.hims_d_visit_type_id.length != 0
      ) {
        uri = "/visitType/update";
      }

      algaehApiCall({
        uri: uri,
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjUwNjk5NjcsImV4cCI6MTUyNzY2MTk2N30.7jVtM39kz3hPVAdX82v1JSQpgREJjQCFnVmDpvPN17g",
        data: this.state,
        onSuccess: response => {
          console.log("Res Visit", response.data.success);
          console.log("Res Visit Data", response.data);
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

  editVisitTypes(e) {
    const data = JSON.parse(e.currentTarget.getAttribute("current_edit"));
    console.log("VISIT TYPES :", data);
    this.setState({
      visit_type_code: data.visit_type_code,
      visit_type: data.visit_type,
      hims_d_visit_type: data.hims_d_visit_type,
      buttonText: "UPDATE",
      hims_d_visit_type_id: data.hims_d_visit_type_id
    });

    console.log("State after push :", this.state);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
{/* Dialog */}
        <div>
          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              Are you Sure you want to delete this Department?
            </DialogTitle>

            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                NO
              </Button>
              <Button
                onClick={this.handleConfirmDelete.bind(this)}
                color="primary"
              >
                YES
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {/* Dialog End */}

        <div className="visit_type">
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
                    VISIT CODE <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.visit_type_code_error}
                    helperText={this.state.visit_type_code_error_txt}
                    name="visit_type_code"
                    value={this.state.visit_type_code}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>

                <div className="col-lg-3">
                  <label>
                    VISIT NAME <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.visit_type_error}
                    helperText={this.state.visit_type_error_txt}
                    name="visit_type"
                    value={this.state.visit_type}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>

                <div className="col-lg-3">
                  <label>
                    VISIT TYPE <span className="imp">*</span>
                  </label>
                  <br />
                  <SelectField
                    displayValue={this.state.hims_d_visit_type}
                    selected={this.selectedVisitType.bind(this)}
                    children={VISIT_TYPE}
                  />
                </div>

                <div className="col-lg-3 align-middle">
                  <br />
                  <Button
                    onClick={this.addVisit.bind(this)}
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
                <label> VISIT TYPE LIST</label>
                <table className="table table-striped table-details table-hover">
                  <thead style={{ background: "#A9E5E0" }}>
                    <tr>
                      <td scope="col">ACTION</td>
                      <td scope="col">#</td>
                      <td scope="col">VISIT CODE</td>
                      <td scope="col">VISIT NAME</td>
                      <td scope="col">VISIT TYPE</td>
                      <td scope="col">ADDED DATE</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.visittypes.map((row, index) => (
                      <tr key={index} >
                        <td>
                          <span
                          sltd_id = {row.hims_d_visit_type_id}
                            onClick={this.handleDelete.bind(this)}
                            className="fas fa-trash-alt"
                            style={{ paddingRight: "24px" }}
                          />
                          <span
                            current_edit={JSON.stringify(row)}
                            onClick={this.editVisitTypes.bind(this)}
                            className="fas fa-pencil-alt"
                          />
                        </td>
                        <td> {index + 1}</td>
                        <td> {row.visit_type_code}</td>
                        <td> {row.visit_type}</td>
                        <td> {row.hims_d_visit_type}</td>
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
    visittypes: state.visittypes.visittypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: getVisittypes
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VisitType)
);
