import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import moment from "moment";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  requisitionEvent,
  getCtrlCode,
  ClearData,
  SaveRequisitionEntry,
  AuthorizeRequisitionEntry,
  LocationchangeTexts,
  generateMaterialReqPhar,
} from "./RequisitionEntryEvents";
import "./RequisitionEntry.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import RequisitionItems from "./RequisitionItems/RequisitionItems";
import MyContext from "../../../utils/MyContext";
import RequisitionIOputs from "../../../Models/Requisition";
import Options from "../../../Options.json";
// import _ from "lodash";
import { MainContext } from "algaeh-react-components";
import { RawSecurityComponent } from "algaeh-react-components";

class RequisitionEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      req_warehouse: "N",
      ware_house_data: []
    };
  }

  UNSAFE_componentWillMount() {
    let IOputs = RequisitionIOputs.inputParam();
    IOputs.requisition_auth = this.props.requisition_auth;
    this.setState(IOputs);
  }

  getPharmacyOptions() {
    algaehApiCall({
      uri: "/pharmacy/getPharmacyOptions",
      method: "GET",
      module: "pharmacy",
      onSuccess: (res) => {
        if (res.data.success) {
          debugger
          const reqlocations = res.data.records[0].req_warehouse === "Y" ? this.props.reqlocations.filter(
            (f) => f.location_type === "WH") : [];
          this.setState({
            ware_house_data: reqlocations,
            req_warehouse: res.data.records[0].req_warehouse,
            requisition_auth_level: res.data.records[0].requisition_auth_level
          });
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      data: { git_location: "N", location_status: "A" },
      redux: {
        type: "LOCATIOS_GET_DATA",
        mappingName: "reqlocations",
      },
    });
    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      data: { item_status: "A" },
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "itemlist",
      },
    });



    this.props.getUserLocationPermission({
      uri: "/pharmacyGlobal/getUserLocationPermission",
      module: "pharmacy",
      method: "GET",
      data: {
        git_location: "N",
        location_status: "A",
        hospital_id: userToken.hims_d_hospital_id,
      },
      redux: {
        type: "LOCATIOS_GET_DATA",
        mappingName: "userwiselocations",
      },
    });

    // if (
    //   this.props.material_requisition_number !== undefined &&
    //   this.props.material_requisition_number.length !== 0
    // ) {
    //   getCtrlCode(this, this.props.material_requisition_number);
    // }
    if (
      this.props.material_requisition_number !== undefined &&
      this.props.material_requisition_number.length !== 0
    ) {
      getCtrlCode(this, this.props.material_requisition_number);
    } else {
      let bothExisits = true,
        requistion_type = "";
      RawSecurityComponent({ componentCode: "MET_REQ_PHARMACY" }).then(
        (result) => {
          if (result === "show") {
            bothExisits = false;
            requistion_type = "MR";
          }
        }
      );

      RawSecurityComponent({ componentCode: "PUR_REQ_PHARMACY" }).then(
        (result) => {
          if (result === "show") {
            requistion_type = "PR";
            bothExisits = bothExisits === false ? false : true;
          } else {
            bothExisits = true;
          }
          this.setState({
            requistion_type: requistion_type,
            bothExisits: bothExisits,
          });
        }
      );
    }
    this.getPharmacyOptions();
  }

  componentWillUnmount() {
    ClearData(this, this);
  }
  render() {
    // const userwiselocations = _.filter(this.props.userwiselocations, (f) => {
    //   return f.location_type !== "WH";
    // });

    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Material Requisition", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            // pageNavPath={[
            //   {
            //     pageName: (
            //       <AlgaehLabel
            //         label={{
            //           forceLabel: "Home",
            //           align: "ltr",
            //         }}
            //       />
            //     ),
            //   },
            //   {
            //     pageName: (
            //       <AlgaehLabel
            //         label={{ forceLabel: "Material Requisition", align: "ltr" }}
            //       />
            //     ),
            //   },
            // ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "Requisition Number", returnText: true }}
                />
              ),
              value: this.state.material_requisition_number,
              selectValue: "material_requisition_number",
              events: {
                onChange: getCtrlCode.bind(this, this),
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "RequisitionEntry.ReqEntry",
              },
              searchName: "REQEntry",
            }}
            userArea={
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Requisition Date",
                    }}
                  />
                  <h6>
                    {this.state.requistion_date
                      ? moment(this.state.requistion_date).format(
                        Options.dateFormat
                      )
                      : Options.dateFormat}
                  </h6>
                </div>
                {this.state.hims_f_pharamcy_material_header_id !== null ? (
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Requisition Status",
                      }}
                    />
                    <h6>
                      {this.state.authorize1 === "Y" &&
                        this.state.authorie2 === "Y" ? (
                          <span className="badge badge-success">Authorized</span>
                        ) : this.state.authorize1 === "Y" &&
                          this.state.authorie2 === "N" ? (
                            <span className="badge badge-danger">Pending</span>
                          ) : this.state.authorize1 === "N" &&
                            this.state.authorize2 === "N" ? (
                              <span className="badge badge-danger">Pending</span>
                            ) : (
                              "-------"
                            )}
                    </h6>
                  </div>
                ) : null}
              </div>
            }
            printArea={
              this.state.material_requisition_number !== null
                ? {
                  menuitems: [
                    {
                      label: "Print Receipt",
                      events: {
                        onClick: () => {
                          generateMaterialReqPhar(this.state);
                        },
                      },
                    },
                  ],
                }
                : ""
            }
            selectedLang={this.state.selectedLang}
          />

          <div
            className="row  inner-top-search"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            <div className="col-lg-8">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{ forceLabel: "Requisition Type" }}
                  selector={{
                    name: "requistion_type",
                    className: "select-fld",
                    value: this.state.requistion_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.FORMAT_POS_REQUISITION_TYPE
                    },
                    others: {
                      disabled: this.state.bothExisits
                    },

                    onChange: requisitionEvent.bind(this, this),
                    onClear: () => {
                      this.setState({
                        requistion_type: null,
                        from_location_id: null,
                        from_location_type: null,
                        to_location_id: null,
                        to_location_type: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{ forceLabel: "Requesting From" }}
                  selector={{
                    name: "from_location_id",
                    className: "select-fld",
                    value: this.state.from_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.userwiselocations,
                    },
                    others: {
                      disabled: this.state.addedItem,
                    },
                    onChange: LocationchangeTexts.bind(this, this, "From"),
                    onClear: () => {
                      this.setState({
                        from_location_id: null,
                        from_location_type: null,
                      });
                    },
                  }}
                />

                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Location Type",
                    }}
                  />
                  <h6>
                    {this.state.from_location_type
                      ? this.state.from_location_type === "WH"
                        ? "Warehouse"
                        : this.state.from_location_type === "MS"
                          ? "Main Store"
                          : "Sub Store"
                      : "----------"}
                  </h6>
                </div>


              </div>
            </div>


            {this.state.requistion_type === "MR" ? (
              <div className="col-lg-4">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-6" }}
                    label={{ forceLabel: "Requesting To" }}
                    selector={{
                      name: "to_location_id",
                      className: "select-fld",
                      value: this.state.to_location_id,
                      dataSource: {
                        textField: "location_description",
                        valueField: "hims_d_pharmacy_location_id",
                        data: this.state.req_warehouse === "Y" ? this.state.ware_house_data : this.props.reqlocations,
                      },
                      others: {
                        disabled:
                          this.state.requistion_type === "PR"
                            ? true
                            : this.state.addedItem,
                      },
                      onChange: LocationchangeTexts.bind(this, this, "To"),
                      onClear: () => {
                        this.setState({
                          to_location_id: null,
                          to_location_type: null,
                        });
                      },
                    }}
                  />

                  <div className="col-lg-6">
                    <AlgaehLabel
                      label={{
                        forceLabel: "To Location Type",
                      }}
                    />
                    <h6>
                      {this.state.to_location_type
                        ? this.state.to_location_type === "WH"
                          ? "Warehouse"
                          : this.state.to_location_type === "MS"
                            ? "Main Store"
                            : "Sub Store"
                        : "----------"}
                    </h6>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="hptl-phase1-requisition-form">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: (obj) => {
                  this.setState({ ...obj });
                },
              }}
            >
              <RequisitionItems
                RequisitionIOputs={this.state}
                requisition_auth={this.props.requisition_auth}
              />
            </MyContext.Provider>

            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={SaveRequisitionEntry.bind(this, this)}
                    disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Save", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={ClearData.bind(this, this)}
                    disabled={this.state.ClearDisable}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>

                  {this.props.requisition_auth === true ? (
                    <button
                      type="button"
                      className="btn btn-other"
                      disabled={
                        this.state.authBtnEnable === true
                          ? true
                          : this.state.authorize1 === "Y" &&
                            this.state.authorie2 === "Y"
                            ? true
                            : false
                      }
                      onClick={AuthorizeRequisitionEntry.bind(
                        this,
                        this,
                        this.state.authorize1 === "N"
                          ? "authorize1"
                          : "authorize2"
                      )}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel:
                            this.state.authorize1 === "N"
                              ? "Authorize 1"
                              : this.state.requisition_auth_level === "2"
                                ? "Authorize 2"
                                : "Authorize 1",
                          returnText: true,
                        }}
                      />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemlist: state.itemlist,
    reqlocations: state.reqlocations,
    requisitionentry: state.requisitionentry,
    userwiselocations: state.userwiselocations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getRequisitionEntry: AlgaehActions,
      getUserLocationPermission: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RequisitionEntry)
);
