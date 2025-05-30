import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
// import { setGlobal } from "../../../utils/GlobalFunctions";
import GlobalVariables from "../../../utils/GlobalVariables.json";

import "./RequisitionList.scss";
import "./../../../styles/site.scss";

import {
  // LocationchangeTexts,
  dateFormater,
  // radioChange,
  getRequisitionList,
  datehandle,
  changeEventHandaler,
} from "./RequisitionListEvent";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { AlgaehActions } from "../../../actions/algaehActions";

class RequisitionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    //to load the same list when user come back from whatever screen they went.
    if (this.props.backToAuth) {
      const {
        from_date,
        to_date,
        from_location_id,
        to_location_id,
        status,
      } = this.props.prev;
      this.setState(
        {
          from_date,
          to_date,
          from_location_id,
          to_location_id,
          status,
        },
        () => getRequisitionList(this)
      );
    } else {
      this.setState(
        {
          to_date: new Date(),
          from_date: moment("01" + month + year, "DDMMYYYY")._d,
          // from_date: new Date(),
          from_location_id: null,
          to_location_id: null,
          requisition_list: [],
          radioYes: true,
          authorize1: "Y",
          status: "1",
        },
        () => getRequisitionList(this)
      );
    }

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "LOCATIOS_GET_DATA",
        mappingName: "locations",
      },
    });
  }

  ourOwnMiniNavigator = (obj) => {
    const { requisition_list, radioYes, authorize1, ...rest } = this.state;
    let sendObj = Object.assign(rest, obj);
    this.props.new_routeComponents(sendObj);
  };

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-requisition-list-form">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Requisition Auth List", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            // pageNavPath={[
            //   {
            //     pageName: (
            //       <AlgaehLabel
            //         label={{
            //           forceLabel: "Home",
            //           align: "ltr"
            //         }}
            //       />
            //     )
            //   },
            //   {
            //     pageName: (
            //       <AlgaehLabel
            //         label={{
            //           forceLabel: "Requisition Auth List",
            //           align: "ltr"
            //         }}
            //       />
            //     )
            //   }
            // ]}
          />
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ fieldName: "from_date" }}
                  textBox={{ className: "txt-fld", name: "from_date" }}
                  events={{
                    onChange: datehandle.bind(this, this),
                  }}
                  value={this.state.from_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ fieldName: "to_date" }}
                  textBox={{ className: "txt-fld", name: "to_date" }}
                  events={{
                    onChange: datehandle.bind(this, this),
                  }}
                  value={this.state.to_date}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "From Location" }}
                  selector={{
                    name: "from_location_id",
                    className: "select-fld",
                    value: this.state.from_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations,
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        from_location_id: null,
                      });
                    },
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "To Location" }}
                  selector={{
                    name: "to_location_id",
                    className: "select-fld",
                    value: this.state.to_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations,
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        to_location_id: null,
                      });
                    },
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Status" }}
                  selector={{
                    name: "status",
                    className: "select-fld",
                    value: this.state.status,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.REQUSITION_STATUS,
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        status: null,
                      });
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body" id="RequisitionListCntr">
                  <AlgaehDataGrid
                    id="RequisitionList_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: (row) => {
                          return (
                            <span>
                              <i
                                style={{
                                  pointerEvents:
                                    row.cancel === "Y" ? "none" : "",
                                  opacity: row.cancel === "Y" ? "0.1" : "",
                                }}
                                className="fas fa-check"
                                onClick={() => {
                                  this.ourOwnMiniNavigator({
                                    RQ_Screen: "RequisitionEntry",
                                    material_requisition_number:
                                      row.material_requisition_number,
                                  });
                                }}
                              />
                              {row.trans_pending === true ? (
                                <i
                                  className="fa fa-exchange-alt"
                                  onClick={() => {
                                    this.ourOwnMiniNavigator({
                                      RQ_Screen: "TransferEntry",
                                      hims_f_pharamcy_material_header_id:
                                        row.hims_f_pharamcy_material_header_id,
                                      from_location: row.to_location_id,
                                    });
                                  }}
                                />
                              ) : null}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 100,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "material_requisition_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requisition Number" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "requistion_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requistion Date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {dateFormater(this, row.requistion_date)}
                            </span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "left" },
                        },
                      },
                      {
                        fieldName: "from_location_id",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "From Location" }}
                          />
                        ),
                        //created by Adnan
                        displayTemplate: (row) => {
                          let x;
                          if (
                            this.props.locations !== undefined &&
                            this.props.locations.length !== 0
                          ) {
                            x = Enumerable.from(this.props.locations)
                              .where(
                                (w) =>
                                  w.hims_d_pharmacy_location_id ===
                                  row.from_location_id
                              )
                              .firstOrDefault();
                          }
                          return (
                            <span>
                              {x !== undefined ? x.location_description : ""}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                        //created by Adnan
                      },
                      {
                        fieldName: "to_location_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "To Location" }} />
                        ),
                        //created by Adnan
                        displayTemplate: (row) => {
                          let x;
                          if (
                            this.props.locations !== undefined &&
                            this.props.locations.length !== 0
                          ) {
                            x = Enumerable.from(this.props.locations)
                              .where(
                                (w) =>
                                  w.hims_d_pharmacy_location_id ===
                                  row.to_location_id
                              )
                              .firstOrDefault();
                          }
                          return (
                            <span>
                              {x !== undefined ? x.location_description : ""}
                            </span>
                          );
                          //created by Adnan
                        },
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                    ]}
                    keyId="material_requisition_number"
                    dataSource={{
                      data: this.state.requisition_list,
                    }}
                    noDataText="No data available for location"
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
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
    locations: state.locations,
    requisitionlist: state.requisitionlist,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getRequisitionList: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RequisitionList)
);
