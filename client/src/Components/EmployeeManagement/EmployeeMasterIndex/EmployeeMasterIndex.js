import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Edit from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Enumerable from "linq";
import "./employee_master_index.css";
import "../../../styles/site.css";
import { AlgaehLabel, AlgaehDataGrid } from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import EmployeeMaster from "./EmployeeMaster/EmployeeMaster";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import moment from "moment";
import Options from "../../../Options.json";
import AppBar from "@material-ui/core/AppBar";
import { getCookie } from "../../../utils/algaehApiCall";
import { setGlobal } from "../../../utils/GlobalFunctions";

class EmployeeMasterIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      servicePop: [],
      selectedLang: "en"
    };
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });
    debugger;

    if (
      this.props.providers === undefined ||
      this.props.providers.length === 0
    ) {
      debugger;
      this.props.getProviderDetails({
        uri: "/employee/get",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "providers"
        },
        afterSuccess: data => {
          debugger;
        }
      });
    }
    // if (
    //   this.props.hospitalservices === undefined ||
    //   this.props.hospitalservices.length === 0
    // ) {
    //   this.props.getServices({
    //     uri: "/serviceType/getService",
    //     method: "GET",
    //     redux: {
    //       type: "SERVICES_GET_DATA",
    //       mappingName: "hospitalservices"
    //     }
    //   });
    // }
    // if (
    //   this.props.servicetype === undefined ||
    //   this.props.servicetype.length === 0
    // ) {
    //   this.props.getServiceTypes({
    //     uri: "/serviceType",
    //     method: "GET",
    //     redux: {
    //       type: "SERVIES_TYPES_GET_DATA",
    //       mappingName: "servicetype"
    //     }
    //   });
    // }

    // if (
    //   this.props.subdepartments === undefined ||
    //   this.props.subdepartments.length === 0
    // ) {
    //   this.props.getSubDepatments({
    //     uri: "/department/get/subdepartment",
    //     method: "GET",
    //     redux: {
    //       type: "SERVIES_TYPES_GET_DATA",
    //       mappingName: "subdepartments"
    //     }
    //   });
    // }

    // if (
    //   this.props.hospitaldetails === undefined ||
    //   this.props.hospitaldetails.length === 0
    // ) {
    //   this.props.getHospitalDetails({
    //     uri: "/organization/getOrganization",
    //     method: "GET",
    //     redux: {
    //       type: "HOSPITAL_DETAILS_GET_DATA",
    //       mappingName: "hospitaldetails"
    //     }
    //   });
    // }
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  }

  CloseModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
    // this.props.getServices({
    //   uri: "/serviceType/getService",
    //   method: "GET",
    //   redux: {
    //     type: "SERVICES_GET_DATA",
    //     mappingName: "hospitalservices"
    //   },
    //   afterSuccess: data => {
    //     this.setState({
    //       ...this.state,
    //       isOpen: !this.state.isOpen
    //     });
    //   }
    // });
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
    row.addNew = false;
    this.setState({
      isOpen: !this.state.isOpen,
      servicePop: row,
      addNew: false
    });
  }

  render() {
    return (
      <div className="hims_hospitalservices">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "employee_master", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "employee_master_settings",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "employee_master", align: "ltr" }}
                />
              )
            }
          ]}
        />
        <div className="row">
          <div className="col-lg-12" style={{ marginTop: "75px" }}>
            {/* <hr /> */}
            <div className="row">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="employee_grid"
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
                              // onClick={this.EditItemMaster.bind(this, row)}
                              />
                            </IconButton>
                          </span>
                        );
                      }
                    },

                    {
                      fieldName: "employee_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "employee_code" }} />
                      )
                    },

                    {
                      fieldName: "full_name",
                      label: <AlgaehLabel label={{ fieldName: "full_name" }} />
                    },
                    {
                      fieldName: "employee_designation_id",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "employee_designation_id" }}
                        />
                      )
                      // displayTemplate: row => {
                      //   let display =
                      //     this.props.subdepartments === undefined
                      //       ? []
                      //       : this.props.subdepartments.filter(
                      //           f =>
                      //             f.hims_d_sub_department_id ===
                      //             row.employee_designation_id
                      //         );

                      //   return (
                      //     <span>
                      //       {display !== null && display.length !== 0
                      //         ? this.state.selectedLang === "en"
                      //           ? display[0].sub_department_name
                      //           : display[0].arabic_sub_department_name
                      //         : ""}
                      //     </span>
                      //   );
                      // }
                    },
                    {
                      fieldName: "license_number",
                      label: (
                        <AlgaehLabel label={{ fieldName: "license_number" }} />
                      )
                    },
                    {
                      fieldName: "category_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "category_id" }} />
                      )

                      // displayTemplate: row => {
                      //   let display =
                      //     this.props.hospitaldetails === undefined
                      //       ? []
                      //       : this.props.hospitaldetails.filter(
                      //           f => f.hims_d_hospital_id === row.category_id
                      //         );

                      //   return (
                      //     <span>
                      //       {display !== null && display.length !== 0
                      //         ? this.state.selectedLang === "en"
                      //           ? display[0].hospital_name
                      //           : display[0].arabic_hospital_name
                      //         : ""}
                      //     </span>
                      //   );
                      // }
                    }
                  ]}
                  keyId="service_code"
                  dataSource={{
                    data: this.props.providers
                  }}
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Footer Start */}

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

                <EmployeeMaster
                  HeaderCaption={
                    <AlgaehLabel
                      label={{
                        fieldName: "employee_master",
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
    providers: state.providers
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions,
      getServiceTypes: AlgaehActions,
      getSubDepatments: AlgaehActions,
      getProviderDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmployeeMasterIndex)
);
