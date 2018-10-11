import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Update from "@material-ui/icons/Update";
import Print from "@material-ui/icons/Print";
import MyContext from "../../../utils/MyContext.js";
import "./SampleCollections.css";
import "../../../styles/site.css";
import { CollectSample, printBarcode } from "./SampleCollectionEvent";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDateHandler,
  Modal
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";

class SampleCollectionPatient extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collected: true
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

    this.props.getLabSpecimen({
      uri: "/labmasters/selectSpecimen",
      method: "GET",
      redux: {
        type: "SPECIMEN_GET_DATA",
        mappingName: "labspecimen"
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_patient !== null) {
      debugger;
      let InputOutput = nextProps.selected_patient;
      this.setState({ ...this.state, ...InputOutput });
    }
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    debugger;
    return (
      <React.Fragment>
        <div>
          <Modal
            open={this.props.open}
          >
            <MyContext.Consumer>
              {context => (
            <div className="algaeh-modal">
                          <div className="popupHeader"><div className="row">
                  <div className="col-lg-8">
                    <h4>Sample Collections</h4>
                  </div>
                  <div className="col-lg-4">
                    <button
                      type="button"
                      className=""
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div></div>
              <div className="col-lg-12 popupInner">

                <div className="row form-details">
                      
                      
                      
                      <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "patient_code"
                      }}
                    />
                    <h6>
                      {this.state.patient_code
                        ? this.state.patient_code
                        : "Patient Code"}
                    </h6>
                  </div>
                       <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "patient_name"
                      }}
                    />
                    <h6>
                      {this.state.full_name
                        ? this.state.full_name
                        : "Patient Name"}
                    </h6>
                  </div>

                       <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "ordered_by"
                      }}
                    />
                    <h6>
                      {this.state.provider_id
                        ? this.state.provider_id
                        : "Ordered By"}




                    </h6>
                  </div>
                       <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "ordered_date"
                      }}
                    />
                    <h6>
                      {this.state.ordered_date
                        ? this.state.ordered_date
                        : "Ordered Date"}



                        
                    </h6>
                  </div>
                      
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
                                  <AlgaehLabel
                                    label={{ fieldName: "action" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {row.collected === "N" ? (

 <i className="fas fa-check"
                                           onClick={CollectSample.bind(
                                              this,
                                              this,
                                              context,
                                              row
                                            )}></i>


                                      ) : (
                                        <i className="fas fa-barcode"
                                            onClick={printBarcode.bind(
                                              this,
                                              this,
                                              row
                                            )}></i>
                                      )}
                                    </span>
                                  );
                                },
                       others:{maxWidth:70,resizable: false,style:{textAlign:"center"}}
                              },
                              {
                                fieldName: "service_code",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "investigation_code" }}
                                  />
                                ),
                       others:{resizable: false,style:{textAlign:"center"}}
                              },
                              {
                                fieldName: "service_name",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "investigation_name" }}
                                  />
                                ),
                       others:{resizable: false,style:{textAlign:"center"}}
                              },
                              {
                                fieldName: "sample_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "specimen_name" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  let display =
                                    this.props.labspecimen === undefined
                                      ? []
                                      : this.props.labspecimen.filter(
                                          f =>
                                            f.hims_d_lab_specimen_id ===
                                            row.sample_id
                                        );

                                  return (
                                    <span>
                                      {display !== null && display.length !== 0
                                        ? display[0].description
                                        : ""}
                                    </span>
                                  );
                                },
                       others:{resizable: false,style:{textAlign:"center"}}
                              },
                              {
                                fieldName: "collected",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "collected" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return row.collected === "N" ? "No" : "Yes";
                                },
                       others:{resizable: false,style:{textAlign:"center"}}
                              },
                              {
                                fieldName: "collected_by",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "collected_by" }}
                                  />
                                ),
                       others:{resizable: false,style:{textAlign:"center"}}
                              },
                              {
                                fieldName: "collected_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "collected_date" }}
                                  />
                                ),
                       others:{resizable: false,style:{textAlign:"center"}}
                              }
                            ]}
                            keyId="service_code"
                            dataSource={{
                              data: this.state.test_details
                            }}
                  noDataText="No sample for collection"
                            // isEditable={true}
                            paging={{ page: 0, rowsPerPage: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                </div>
                    
              <div className=" popupFooter">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-12">
                          <button
                            className="htpl1-phase1-btn-secondary"
                            onClick={e => {
                              this.onClose(e);
                            }}
                          >
                            <AlgaehLabel label={{ fieldName: "btnclose" }} />
                          </button>
                      </div>
                      </div>
                      </div>
                    </div>
                </div>
              )}
            </MyContext.Consumer>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    deptanddoctors: state.deptanddoctors,
    labspecimen: state.labspecimen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions,
      getLabSpecimen: AlgaehActions
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
