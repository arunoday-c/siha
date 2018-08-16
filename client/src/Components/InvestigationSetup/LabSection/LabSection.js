import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./LabSection.css";
import Button from "@material-ui/core/Button";
// import moment from "moment";
// import { algaehApiCall } from "../../../utils/algaehApiCall";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
// import swal from "sweetalert";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall.js";

class LabSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_lab_section_id: "",
      description: "",
      created_date: "A",
      created_by: getCookie("UserID"),

      description_error: false,
      description_error_txt: ""
    };
    this.baseState = this.state;
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="lab_section">
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
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "type_desc",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "description",
                  value: this.state.description,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  error: this.state.visa_type_error,
                  helperText: this.state.visa_type_error_txt
                }}
              />

              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  //   onClick={this.addVisaType.bind(this)}
                  variant="raised"
                  color="primary"
                >
                  {this.state.buttonText}
                </Button>
              </div>
            </div>
          </form>

          {/* <div className="row form-details">
            <div className="col">
              <AlgaehDataGrid
                id="visa_grd"
                columns={[
                  {
                    fieldName: "description",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.description,
                            className: "txt-fld",
                            name: "description",
                            events: {
                              onChange: this.onchangegridcol.bind(this, row)
                            }
                          }}
                        />
                      );
                    }
                  },

                  {
                    fieldName: "created_by",
                    label: <AlgaehLabel label={{ fieldName: "created_by" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "created_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "created_date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },
                    disabled: true
                  },
                  {
                    fieldName: "visa_status",
                    label: <AlgaehLabel label={{ fieldName: "status" }} />,
                    displayTemplate: row => {
                      return row.visa_status === "A" ? "Active" : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "visa_status",
                            className: "select-fld",
                            value: row.visa_status,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_STATUS
                            },
                            onChange: this.onchangegridcol.bind(this, row)
                          }}
                        />
                      );
                    }
                  }
                ]}
                keyId="hims_d_lab_section_id"
                dataSource={{
                  data:
                    this.props.visatypes === undefined
                      ? []
                      : this.props.visatypes
                }}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 5 }}
                events={{
                  onDelete: this.deleteVisaType.bind(this),
                  onEdit: row => {},
                  // onDone: row => {
                  //   alert(JSON.stringify(row));
                  // }
                  onDone: this.updateVisaTypes.bind(this)
                }}
              />
            </div>
          </div> */}
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    visatypes: state.visatypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisatypes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LabSection)
);
