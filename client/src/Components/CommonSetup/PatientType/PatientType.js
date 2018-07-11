import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import "./patient_type.css";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import { AlagehFormGroup, AlgaehOptions } from "../../Wrapper/algaehWrapper";
import DeleteDialog from "../../../utils/DeleteDialog";

import { getVisatypes } from "../../../actions/CommonSetup/Visatype.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

let sel_id = "";
let openDialog = false;
let startDate = "";

class PatientType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_visa_type_id: "",
      visa_type: "",
      visa_type_code: "",
      visa_desc: "",
      record_Status: "",
      row: [],
      id: "",
      openDialog: false
    };
  }

  componentDidMount() {
    this.props.getVisatypes();
  }

  componentWillReceiveProps() {}

  btnClick() {}

  changeStatus(e) {
    this.setState({ patient_type_status: e.target.value });

    if (e.target.value == "A")
      this.setState({ effective_end_date: "9999-12-31" });
    else if (e.target.value == "I") {
      this.setState({
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
  }

  dateFormater({ value }) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  handleConfirmDelete() {
    // const data = { hims_d_visa_type_id: sel_id, updated_by: 1 };
    // this.setState({ openDialog: false });
    // algaehApiCall({
    //   uri: "/masters/set/delete/visa",
    //   data: data,
    //   method: "DELETE",
    //   onSuccess: response => {
    //     this.setState({ open: false });
    //     window.location.reload();
    //   },
    //   onFailure: error => {
    //     this.setState({ open: false });
    //   }
    // });
  }

  handleDialogClose() {
    this.setState({ openDialog: false });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <DeleteDialog
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
          handleDialogClose={this.handleDialogClose.bind(this)}
          openDialog={this.state.openDialog}
        />
        <div className="patient_type">
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
                <AlgaehOptions
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "status",
                    isImp: true
                  }}
                  optionsType="radio"
                  group={{
                    name: "Status",

                    controls: [
                      { label: "Active", value: "A" },
                      { label: "Inactive", value: "I" }
                    ]
                  }}
                />

                {/* <div className="col-lg-3">
                  <label>
                    PATIENT TYPE CODE <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField className="txt-fld" />
                </div> */}
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "patient_type_code",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "patient_type_code",
                    value: this.state.module_desc,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                {/* <div className="col-lg-3">
                  <label>
                    PATIENT TYPE NAME <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField className="txt-fld" />
                </div> */}

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "patient_type_name",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "patient_type_name",
                    value: this.state.patien_type_name,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                <div className="col-lg-3 align-middle">
                  <br />
                  <Button
                    onClick={this.btnClick.bind(this)}
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
                <Paper />
              </div>
            </div>
          </Paper>
        </div>
      </div>
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientType)
);
