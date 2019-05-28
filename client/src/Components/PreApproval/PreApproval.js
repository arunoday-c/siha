import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./PreApproval.css";
import "../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehModalPopUp
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

// import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import SubmitRequest from "./SubmitRequest/SubmitRequest";
import PreApprovalStatus from "./PreApprovalStatus/PreApprovalStatus";
import UpdateOrders from "./UpdateOrders/UpdateOrders";
import {
  texthandle,
  datehandle,
  PatientSearch,
  VerifyOrderModel,
  CloseOrderModel,
  getPreAprovalList,
  openUCAFReport,
  getMedicationAprovalList
} from "./PreApprovalHandaler";
import moment from "moment";
import Options from "../../Options.json";
import variableJson from "../../utils/GlobalVariables.json";

const UcafEditor = React.lazy(() => import("../ucafEditors/ucaf"));
const DcafEditor = React.lazy(() => import("../ucafEditors/dcaf"));
const OcafEditor = React.lazy(() => import("../ucafEditors/ocaf"));

class PreApproval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isEditOpen: false,
      isVerifyOpen: false,
      patient_code: null,
      patient_id: null,
      date: moment(new Date())._d,
      dis_status: null,
      doctor_id: null,
      insurance_id: null,
      pre_approval_Services: [],
      medca_approval_Services: [],
      selected_services: null,
      OCAFData: false,
      DCAFData: false,
      UCAFData: false
    };
  }

  componentDidMount() {
    if (
      this.props.deptanddoctors === undefined ||
      this.props.deptanddoctors.length === 0
    ) {
      this.props.getDepartmentsandDoctors({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "DEPT_DOCTOR_GET_DATA",
          mappingName: "deptanddoctors"
        }
      });
    }

    if (
      this.props.insurarProviders === undefined ||
      this.props.insurarProviders.length === 0
    ) {
      this.props.getInsuranceProviders({
        uri: "/insurance/getListOfInsuranceProvider",
        module: "insurance",
        method: "GET",
        redux: {
          type: "INSURANCE_PROVIDER_GET_DATA",
          mappingName: "insurarProviders"
        }
      });
    }

    getPreAprovalList(this, this);
    getMedicationAprovalList(this, this);
  }

  ShowSubmitModel(row, e) {
    this.setState({
      isOpen: !this.state.isOpen,
      selected_services: row
    });
  }
  CloseSubmitModel(e) {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  CloseEditModel(e) {
    this.setState(
      {
        isEditOpen: !this.state.isEditOpen
      },
      () => {
        getPreAprovalList(this, this);
      }
    );
  }

  ShowEditModel(row, oFrom, e) {
    this.setState({
      isEditOpen: !this.state.isEditOpen,
      selected_services: row,
      openFrom: oFrom
    });
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  renderDCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openDCAF}
        title="DCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openDCAF: false });
          }
        }}
      >
        <DcafEditor dataProps={this.state.DCAFData} />
      </AlgaehModalPopUp>
    );
  }

  renderOCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openOCAF}
        title="OCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openOCAF: false });
          }
        }}
      >
        <OcafEditor dataProps={this.state.OCAFData} />
      </AlgaehModalPopUp>
    );
  }
  renderUCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openUCAF}
        title="UCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openUCAF: false });
          }
        }}
      >
        <UcafEditor dataProps={this.state.UCAFData} />
      </AlgaehModalPopUp>
    );
  }

  render() {
    return (
      <div className="hptl-pre-approval-details">
        {/* <BreadCrumb
          title={
            <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "form_home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
              )
            }
          ]}
        /> */}

        <div className="row inner-top-search" style={{ paddingBottom: "10px" }}>
          <div className="col-lg-12">
            <div className="row">
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ fieldName: "date" }}
                textBox={{ className: "txt-fld", name: "date" }}
                events={{
                  onChange: datehandle.bind(this, this)
                }}
                value={this.state.date}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "insurance_id"
                }}
                selector={{
                  name: "insurance_id",
                  className: "select-fld",
                  value: this.state.insurance_id,
                  dataSource: {
                    textField: "insurance_provider_name",
                    valueField: "hims_d_insurance_provider_id",
                    data:
                      this.props.insurarProviders === undefined
                        ? []
                        : this.props.insurarProviders
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "dis_status"
                }}
                selector={{
                  name: "dis_status",
                  className: "select-fld",
                  value: this.state.dis_status,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: variableJson.FORMAT_APPSTATUS
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "doctor_id"
                }}
                selector={{
                  name: "doctor_id",
                  className: "select-fld",
                  value: this.state.doctor_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "employee_id",
                    data:
                      this.props.deptanddoctors === undefined
                        ? []
                        : this.props.deptanddoctors.doctors
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  fieldName: "patient_code"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patient_code",
                  value: this.state.patient_code,
                  events: {
                    onChange: texthandle.bind(this, this)
                  },
                  disabled: true
                }}
              />

              <div className="col-lg-1 form-group print_actions">
                <span
                  className="fas fa-search"
                  style={{
                    fontSize: " 1.2rem",
                    marginTop: "6px",
                    paddingBottom: "10px"
                  }}
                  onClick={PatientSearch.bind(this, this)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Pre Approval List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="preApprovalGird_Cntr">
                    <AlgaehDataGrid
                      id="preApprovalGird"
                      datavalidate="preApprovalGird"
                      columns={[
                        {
                          fieldName: "action",
                          label: (
                            <AlgaehLabel label={{ fieldName: "action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                <i
                                  className="fas fa-eye"
                                  onClick={this.ShowEditModel.bind(
                                    this,
                                    row,
                                    "S"
                                  )}
                                />

                                <i
                                  className="fas fa-check"
                                  onClick={VerifyOrderModel.bind(
                                    this,
                                    this,
                                    "S",
                                    row
                                  )}
                                />
                                <i
                                  className="fas fa-file-medical-alt"
                                  onClick={openUCAFReport.bind(this, this, row)}
                                />
                              </span>
                            );
                          },
                          others: {
                            minWidth: 175,
                            filterable: false,
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "patient_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "patient_code" }}
                            />
                          ),
                          others: {
                            minWidth: 150
                          }
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "patient_name" }}
                            />
                          ),
                          others: {
                            minWidth: 250
                          }
                        },
                        {
                          fieldName: "created_date",
                          label: <AlgaehLabel label={{ fieldName: "date" }} />,
                          displayTemplate: row => {
                            return (
                              <span>
                                {this.changeDateFormat(row.created_date)}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "doctor_id",
                          label: (
                            <AlgaehLabel label={{ fieldName: "doctor_id" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.deptanddoctors === undefined
                                ? []
                                : this.props.deptanddoctors.doctors.filter(
                                    f => f.employee_id === row.doctor_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].full_name
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "insurance_provider_id",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "insurance_id" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.insurarProviders === undefined
                                ? []
                                : this.props.insurarProviders.filter(
                                    f =>
                                      f.hims_d_insurance_provider_id ===
                                      row.insurance_provider_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].insurance_provider_name
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "icd_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "insurance_code" }}
                            />
                          )
                        },
                        {
                          fieldName: "number_of_Services",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "no_of_services" }}
                            />
                          )
                        },
                        {
                          fieldName: "apprv_status",
                          label: (
                            <AlgaehLabel label={{ fieldName: "dis_status" }} />
                          ),
                          displayTemplate: row => {
                            return row.apprv_status === "NR"
                              ? "Not Requested"
                              : row.apprv_status === "AW"
                              ? "Awaiting Approval"
                              : row.apprv_status === "AP"
                              ? "Approved"
                              : "Rejected";
                          }
                        }
                      ]}
                      keyId="pre_approval_code"
                      dataSource={{
                        data: this.state.pre_approval_Services
                      }}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 6 }}
                    />
                  </div>
                </div>
              </div>

              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Medication Approval List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="preApprovalGird_Cntr">
                    <AlgaehDataGrid
                      id="preApprovalGird"
                      datavalidate="preApprovalGird"
                      columns={[
                        {
                          fieldName: "action",
                          label: (
                            <AlgaehLabel label={{ fieldName: "action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                <i
                                  className="fas fa-eye"
                                  onClick={this.ShowEditModel.bind(
                                    this,
                                    row,
                                    "M"
                                  )}
                                />

                                <i
                                  className="fas fa-check"
                                  onClick={VerifyOrderModel.bind(
                                    this,
                                    this,
                                    "M",
                                    row
                                  )}
                                />
                                <i
                                  className="fas fa-file-medical-alt"
                                  onClick={openUCAFReport.bind(this, this, row)}
                                />
                              </span>
                            );
                          },
                          others: {
                            minWidth: 175,
                            filterable: false,
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "patient_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "patient_code" }}
                            />
                          ),
                          others: {
                            minWidth: 150
                          }
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "patient_name" }}
                            />
                          ),
                          others: {
                            minWidth: 250
                          }
                        },
                        {
                          fieldName: "created_date",
                          label: <AlgaehLabel label={{ fieldName: "date" }} />,
                          displayTemplate: row => {
                            return (
                              <span>
                                {this.changeDateFormat(row.created_date)}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "doctor_id",
                          label: (
                            <AlgaehLabel label={{ fieldName: "doctor_id" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.deptanddoctors === undefined
                                ? []
                                : this.props.deptanddoctors.doctors.filter(
                                    f => f.employee_id === row.doctor_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].full_name
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "insurance_provider_id",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "insurance_id" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.insurarProviders === undefined
                                ? []
                                : this.props.insurarProviders.filter(
                                    f =>
                                      f.hims_d_insurance_provider_id ===
                                      row.insurance_provider_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].insurance_provider_name
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "icd_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "insurance_code" }}
                            />
                          )
                        },
                        {
                          fieldName: "number_of_Services",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "no_of_services" }}
                            />
                          )
                        },
                        {
                          fieldName: "apprv_status",
                          label: (
                            <AlgaehLabel label={{ fieldName: "dis_status" }} />
                          ),
                          displayTemplate: row => {
                            return row.apprv_status === "NR"
                              ? "Not Requested"
                              : row.apprv_status === "AW"
                              ? "Awaiting Approval"
                              : row.apprv_status === "AP"
                              ? "Approved"
                              : "Rejected";
                          }
                        }
                      ]}
                      keyId="pre_approval_code"
                      dataSource={{
                        data: this.state.medca_approval_Services
                      }}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 6 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SubmitRequest
          HeaderCaption={
            <AlgaehLabel
              label={{
                fieldName: "preapprovalsubmit",
                align: "ltr"
              }}
            />
          }
          open={this.state.isOpen}
          onClose={this.CloseSubmitModel.bind(this)}
          selected_services={this.state.selected_services}
        />

        <PreApprovalStatus
          HeaderCaption={
            <AlgaehLabel
              label={{
                fieldName: "preapprovalstatus",
                align: "ltr"
              }}
            />
          }
          open={this.state.isEditOpen}
          openFrom={this.state.openFrom}
          onClose={this.CloseEditModel.bind(this)}
          selected_services={this.state.selected_services}
        />
        <UpdateOrders
          HeaderCaption={
            <AlgaehLabel
              label={{
                fieldName: "updateorders",
                align: "ltr"
              }}
            />
          }
          open={this.state.isVerifyOpen}
          openFrom={this.state.openFrom}
          onClose={CloseOrderModel.bind(this, this)}
          selected_services={this.state.selected_services}
        />
        {this.renderUCAFReport()}
        {this.renderDCAFReport()}
        {this.renderOCAFReport()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deptanddoctors: state.deptanddoctors,
    insurarProviders: state.insurarProviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions,
      getInsuranceProviders: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PreApproval)
);
