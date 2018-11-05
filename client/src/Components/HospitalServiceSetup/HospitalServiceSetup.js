import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Edit from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Enumerable from "linq";
import "./HospitalServiceSetup.css";
import "../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import HospitalServices from "./HospitalServices/HospitalServices";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import moment from "moment";
import Options from "../../Options.json";
import AppBar from "@material-ui/core/AppBar";
import { getCookie } from "../../utils/algaehApiCall";
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

      service_name: null,
      ServiceNames: []
    };
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.hospitalservices === undefined ||
      this.props.hospitalservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "hospitalservices"
        },
        afterSuccess: data => {
          let ServiceNames = Enumerable.from(data)
            .groupBy("$.hims_d_services_id", null, (k, g) => {
              let firstRecordSet = Enumerable.from(g).firstOrDefault();
              return {
                service_name: firstRecordSet.service_name,
                hims_d_services_id: firstRecordSet.hims_d_services_id
              };
            })
            .toArray();

          this.setState({ ServiceNames: ServiceNames });
        }
      });
    }
    if (
      this.props.servicetype === undefined ||
      this.props.servicetype.length === 0
    ) {
      this.props.getServiceTypes({
        uri: "/serviceType",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "servicetype"
        }
      });
    }

    if (
      this.props.subdepartments === undefined ||
      this.props.subdepartments.length === 0
    ) {
      this.props.getSubDepatments({
        uri: "/department/get/subdepartment",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "subdepartments"
        }
      });
    }

    if (
      this.props.hospitaldetails === undefined ||
      this.props.hospitaldetails.length === 0
    ) {
      this.props.getHospitalDetails({
        uri: "/organization/getOrganization",
        method: "GET",
        redux: {
          type: "HOSPITAL_DETAILS_GET_DATA",
          mappingName: "hospitaldetails"
        }
      });
    }
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      servicePop: {}
    });
  }

  CloseModel(e) {
    this.props.getServices({
      uri: "/serviceType/getService",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "hospitalservices"
      },
      afterSuccess: data => {
        this.setState({
          ...this.state,
          isOpen: !this.state.isOpen
        });
      }
    });
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
    debugger;
    if (row.cpt_code !== null) {
      this.props.getCptCodes({
        uri: "/icdcptcodes/selectCptCodes",
        method: "GET",
        data: { hims_d_cpt_code_id: row.cpt_code },
        redux: {
          type: "HOSPITAL_DETAILS_GET_DATA",
          mappingName: "cptcodes"
        },
        afterSuccess: data => {
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
    return (
      <div className="hims_hospitalservices">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "hospital_services", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "hospital_services_settings",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "hospital_services", align: "ltr" }}
                />
              )
            }
          ]}
        />

        <div className="row">
          <div className="col-lg-12" style={{ marginTop: "75px" }}>
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
                    data: this.state.ServiceNames
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
                      this.state.selectedLang == "en"
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
                      this.state.selectedLang == "en"
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
                      this.state.selectedLang == "en"
                        ? "service_type"
                        : "arabic_service_type",
                    valueField: "hims_d_service_type_id",
                    data: this.props.servicetype
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />
            </div>
            <hr />
            <div className="row">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="hospitalservices_grid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <IconButton
                              color="primary"
                              title="Add Template"
                              style={{ maxHeight: "4vh" }}
                            >
                              <Edit
                                onClick={this.EditItemMaster.bind(this, row)}
                              />
                            </IconButton>
                          </span>
                        );
                      }
                    },

                    {
                      fieldName: "service_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "service_code" }} />
                      )
                    },

                    {
                      fieldName: "cpt_code",
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
                        return row.vat_applicable == "Y" ? "Yes" : "No";
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
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Footer Start */}

        {/* {display !== null && display.length !== 0
                              ? this.state.selectedLang === "en"
                                ? display[0].service_type
                                : display[0].arabic_service_type
                              : // display[0].service_type
                                ""} */}

        <div className="hptl-phase1-footer">
          <AppBar position="static" className="main">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.ShowModel.bind(this)}
                >
                  {/* <AlgaehLabel
                    label={{ fieldName: "btn_addnew", returnText: true }}
                  /> */}
                  Add New
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.clearData.bind(this)}
                >
                  {/* <AlgaehLabel
                    label={{ fieldName: "btn_save", returnText: true }}
                  /> */}
                  Clear
                </button>
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
          </AppBar>
        </div>
        {/* Footer End */}
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
