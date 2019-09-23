import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Enumerable from "linq";
import "./HospitalServiceSetup.scss";
import "../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import HospitalServices from "./HospitalServices/HospitalServices";

import moment from "moment";
import Options from "../../Options.json";

import {
  getCookie,
  algaehApiCall,
  swalMessage
} from "../../utils/algaehApiCall";
import { setGlobal } from "../../utils/GlobalFunctions";
import { texthandle, getHospotalServices } from "./HospitalServiceSetupEvents";

//TODO
//Algaeh Validations

class HospitalServiceSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      servicePop: [],
      selectedLang: "en",
      sub_department_id: null,
      hospital_id: null,
      service_type_id: null,

      service_name: null
      // ServiceNames: []
    };
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });

    this.props.getServices({
      uri: "/serviceType/getService",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "hospitalservices"
      }
    });

    this.props.getServiceTypes({
      uri: "/serviceType",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVIES_TYPES_GET_DATA",
        mappingName: "servicetype"
      }
    });

    this.props.getSubDepatments({
      uri: "/department/get/subdepartment",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVIES_TYPES_GET_DATA",
        mappingName: "subdepartments"
      }
    });

    this.props.getHospitalDetails({
      uri: "/organization/getOrganization",
      method: "GET",
      redux: {
        type: "HOSPITAL_DETAILS_GET_DATA",
        mappingName: "hospitaldetails"
      }
    });
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      servicePop: {}
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen
      },
      () => {
        if (e === true) {
          this.props.getServices({
            uri: "/serviceType/getService",
            module: "masterSettings",
            method: "GET",
            redux: {
              type: "SERVICES_GET_DATA",
              mappingName: "hospitalservices"
            }
          });
        }
      }
    );
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  setUpdateComponent(row, e) {
    this.setState({
      isOpen: true
    });
  }

  EditItemMaster(row) {
    if (row.cpt_code !== null) {
      algaehApiCall({
        uri: "/icdcptcodes/selectCptCodes",
        method: "GET",
        data: { hims_d_cpt_code_id: row.cpt_code },
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;
            if (data.length !== undefined && data.length !== 0) {
              row.addNew = false;
              row.cpt_code_data = data[0].cpt_code;

              this.setState({
                isOpen: !this.state.isOpen,
                servicePop: row,
                addNew: false
              });
            } else {
              row.addNew = false;
              this.setState({
                isOpen: !this.state.isOpen,
                servicePop: row,
                addNew: false
              });
            }
          }
        },
        onFailure: error => {
          if (error.response.data.message === "No records found") {
            this.setState({
              isOpen: !this.state.isOpen,
              servicePop: row,
              addNew: false
            });
          } else {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        }
      });
    } else {
      row.addNew = false;
      this.setState({
        isOpen: !this.state.isOpen,
        servicePop: row,
        addNew: false
      });
    }
  }

  clearData(e) {
    this.setState(
      {
        service_name: null,
        sub_department_id: null,
        hospital_id: null,
        service_type_id: null
      },
      () => {
        getHospotalServices(this, this);
      }
    );
  }

  render() {
    let _ServiceNames = Enumerable.from(this.props.hospitalservices)
      .groupBy("$.hims_d_services_id", null, (k, g) => {
        let firstRecordSet = Enumerable.from(g).firstOrDefault();
        return {
          service_name: firstRecordSet.service_name,
          hims_d_services_id: firstRecordSet.hims_d_services_id
        };
      })
      .toArray();
    return (
      <div className="hims_hospitalservices">
        <div
          className="row inner-top-search d-none"
          style={{ paddingBottom: 10 }}
        >
          <div className="col-lg-12">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "service_name"
                }}
                selector={{
                  name: "service_name",
                  className: "select-fld",
                  value: this.state.service_name,
                  dataSource: {
                    textField: "service_name",
                    valueField: "hims_d_services_id",
                    data: _ServiceNames
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "sub_department_id"
                }}
                selector={{
                  name: "sub_department_id",
                  className: "select-fld",
                  value: this.state.sub_department_id,
                  dataSource: {
                    textField:
                      this.state.selectedLang === "en"
                        ? "sub_department_name"
                        : "arabic_sub_department_name",
                    valueField: "hims_d_sub_department_id",
                    data: this.props.subdepartments
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "hospital_id"
                }}
                selector={{
                  name: "hospital_id",
                  className: "select-fld",
                  value: this.state.hospital_id,
                  dataSource: {
                    textField:
                      this.state.selectedLang === "en"
                        ? "hospital_name"
                        : "arabic_hospital_name",
                    valueField: "hims_d_hospital_id",
                    data: this.props.hospitaldetails
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "service_type_id"
                }}
                selector={{
                  name: "service_type_id",
                  className: "select-fld",
                  value: this.state.service_type_id,
                  dataSource: {
                    textField:
                      this.state.selectedLang === "en"
                        ? "service_type"
                        : "arabic_service_type",
                    valueField: "hims_d_service_type_id",
                    data: this.props.servicetype
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />
              <div className="col">
                <button
                  className="btn btn-default"
                  onClick={this.clearData.bind(this)}
                  style={{ marginTop: 21 }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Hospital Services List</h3>
            </div>
            <div className="actions">
              <a
                // href="javascript"
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
              </a>
              <HospitalServices
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      fieldName: "hospital_services",
                      align: "ltr"
                    }}
                  />
                }
                open={this.state.isOpen}
                onClose={this.CloseModel.bind(this)}
                servicePop={this.state.servicePop}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="hospitalservices_grid_cntr">
                <AlgaehDataGrid
                  id="hospitalservices_grid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-pen"
                              onClick={this.EditItemMaster.bind(this, row)}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 55,
                        filterable: false
                      }
                    },
                    {
                      fieldName: "service_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "service_code" }} />
                      )
                    },
                    {
                      fieldName: "cpt_p_code",
                      label: <AlgaehLabel label={{ fieldName: "cpt_code" }} />
                    },
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "service_name" }} />
                      )
                    },
                    {
                      fieldName: "sub_department_id",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "sub_department_id" }}
                        />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.subdepartments === undefined
                            ? []
                            : this.props.subdepartments.filter(
                                f =>
                                  f.hims_d_sub_department_id ===
                                  row.sub_department_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? this.state.selectedLang === "en"
                                ? display[0].sub_department_name
                                : display[0].arabic_sub_department_name
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "hospital_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "hospital_id" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.hospitaldetails === undefined
                            ? []
                            : this.props.hospitaldetails.filter(
                                f => f.hims_d_hospital_id === row.hospital_id
                              );
                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? this.state.selectedLang === "en"
                                ? display[0].hospital_name
                                : display[0].arabic_hospital_name
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "service_type_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "service_type_id" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.servicetype === undefined
                            ? []
                            : this.props.servicetype.filter(
                                f =>
                                  f.hims_d_service_type_id ===
                                  row.service_type_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? this.state.selectedLang === "en"
                                ? display[0].service_type
                                : display[0].arabic_service_type
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "standard_fee",
                      label: (
                        <AlgaehLabel label={{ fieldName: "standard_fee" }} />
                      )
                    },
                    {
                      fieldName: "vat_applicable",
                      label: (
                        <AlgaehLabel label={{ fieldName: "vat_applicable" }} />
                      ),
                      displayTemplate: row => {
                        return row.vat_applicable === "Y" ? "Yes" : "No";
                      }
                    },
                    {
                      fieldName: "vat_percent",
                      label: (
                        <AlgaehLabel label={{ fieldName: "vat_percent" }} />
                      )
                    }
                  ]}
                  keyId="service_code"
                  dataSource={{
                    data:
                      this.props.hospitalservices === undefined
                        ? []
                        : this.props.hospitalservices
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 20 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    hospitalservices: state.hospitalservices,
    servicetype: state.servicetype,
    subdepartments: state.subdepartments,
    hospitaldetails: state.hospitaldetails,
    cptcodes: state.cptcodes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions,
      getServiceTypes: AlgaehActions,
      getSubDepatments: AlgaehActions,
      getHospitalDetails: AlgaehActions,
      getCptCodes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HospitalServiceSetup)
);
