import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Update from "@material-ui/icons/Update";
import Print from "@material-ui/icons/Print";

import "./SampleCollections.css";
import "../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDateHandler,
  Modal
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
// import { UpdateOrders } from "./UpdateOrdersEvents";
import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";

class SampleCollectionPatient extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collected: null
    };
  }
  componentDidMount() {
    if (
      this.props.deptanddoctors === undefined ||
      this.props.deptanddoctors.length === 0
    ) {
      this.props.getDepartmentsandDoctors({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        method: "GET",
        redux: {
          type: "DEPT_DOCTOR_GET_DATA",
          mappingName: "deptanddoctors"
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    debugger;
    if (nextProps.selected_patient !== null) {
      let InputOutput = nextProps.selected_patient;
      //   for (let i = 0; i < InputOutput.services_details.length; i++) {
      //     InputOutput.services_details[i].checkselect = 1;
      //   }
      this.setState({ ...this.state, ...InputOutput }, () => {
        debugger;
      });
    }
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <Modal
            style={{
              margin: "0 auto",
              width: "150vh"
            }}
            open={this.props.open}
          >
            <div className="hptl-sample-coll-details ">
              <div className="colorPrimary header">
                {/* <Typography variant="title">{this.props.HeaderCaption}</Typography> */}
                <Typography variant="title">Sample Collection</Typography>
              </div>

              <div className="container-fluid">
                <div className="row form-details">
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "patient_code"
                    }}
                    textBox={{
                      value: this.state.patient_code,
                      className: "txt-fld",
                      name: "patient_code",

                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "patient_name"
                    }}
                    textBox={{
                      value: this.state.full_name,
                      className: "txt-fld",
                      name: "full_name",

                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "ordered_by"
                    }}
                    selector={{
                      name: "provider_id",
                      className: "select-fld",
                      value: this.state.provider_id,
                      dataSource: {
                        textField: "full_name",
                        valueField: "employee_id",
                        data:
                          this.props.deptanddoctors === undefined
                            ? []
                            : this.props.deptanddoctors.doctors
                      },
                      others: {
                        disabled: true
                      },
                      onChange: null
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ fieldName: "ordered_date" }}
                    textBox={{ className: "txt-fld", name: "ordered_date" }}
                    events={{
                      onChange: null
                    }}
                    disabled={true}
                    value={this.state.ordered_date}
                  />
                </div>

                <div className="row grid-details">
                  <div className="col-lg-12">
                    <div className="">
                      <AlgaehDataGrid
                        id="update_order_grid"
                        columns={[
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ fieldName: "action" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  {this.state.collected === "N" ||
                                  this.state.collected === null ? (
                                    <IconButton color="primary" title="Collect">
                                      <Update
                                      //   onClick={CollectSample.bind(this, this, row)}
                                      />
                                    </IconButton>
                                  ) : (
                                    <IconButton color="primary" title="Barcode">
                                      <Print
                                      //   onClick={PringBarcode.bind(this, this, row)}
                                      />
                                    </IconButton>
                                  )}
                                </span>
                              );
                            }
                          },
                          {
                            fieldName: "service_code",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "investigation_code" }}
                              />
                            )
                          },
                          {
                            fieldName: "service_name",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "investigation_name" }}
                              />
                            )
                          },
                          {
                            fieldName: "specimen_name",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "specimen_name" }}
                              />
                            )
                          },
                          {
                            fieldName: "collected",
                            label: (
                              <AlgaehLabel label={{ fieldName: "collected" }} />
                            ),
                            disabled: false,
                            displayTemplate: row => {
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "collected",
                                    className: "select-fld",
                                    value: row.collected,
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: FORMAT_YESNO
                                    },
                                    onChange: null
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "collected_by",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "collected_by" }}
                              />
                            )
                          },
                          {
                            fieldName: "collected_date",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "collected_date" }}
                              />
                            )
                          }
                        ]}
                        keyId="service_code"
                        dataSource={{
                          data: this.state.test_details
                        }}
                        // isEditable={true}
                        paging={{ page: 0, rowsPerPage: 5 }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row" position="fixed">
                  <div className="col-lg-12">
                    <span className="float-left">
                      <button
                        className="htpl1-phase1-btn-secondary"
                        onClick={e => {
                          this.onClose(e);
                        }}
                      >
                        <AlgaehLabel label={{ fieldName: "btnclose" }} />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    deptanddoctors: state.deptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SampleCollectionPatient)
);
