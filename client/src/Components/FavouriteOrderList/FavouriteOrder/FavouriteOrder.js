import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./FavouriteOrder.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import FavouriteOrderEvent from "./FavouriteOrderEvent";
import { AlgaehActions } from "../../../actions/algaehActions";
import GlobalVariables from "../../../utils/GlobalVariables";

class FavouriteOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hims_d_favourite_orders_header_id: null,
      favourite_description: null,
      favourite_status: "A",
      doctor_id: null,
      favourite_details: [],
      insert_favourite_details: [],
      delete_favourite_details: [],
      s_service_type: null,
      s_service: null
    };
  }

  componentDidMount() {
    if (
      this.props.servicetype === undefined ||
      this.props.servicetype.length === 0
    ) {
      this.props.getServiceTypes({
        uri: "/serviceType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "servicetype"
        }
      });
    }

    this.props.getServices({
      uri: "/serviceType/getService",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "serviceslist"
      }
    });
  }

  componentWillReceiveProps(newProps) {
    debugger;
    if (
      newProps.favouriteData !== undefined &&
      newProps.favouriteData.hims_d_favourite_orders_header_id !== undefined
    ) {
      let IOputs = newProps.favouriteData;
      this.setState({ ...this.state, ...IOputs });
    }
    if (newProps.doctor_id !== undefined && this.state.doctor_id === null) {
      this.setState({ doctor_id: newProps.doctor_id });
    }
  }

  onClose = e => {
    this.setState(
      {
        hims_d_favourite_orders_header_id: null,
        favourite_description: null,
        favourite_status: "A",
        doctor_id: null,
        favourite_details: [],
        insert_favourite_details: [],
        delete_favourite_details: []
      },
      () => {
        this.props.onClose && this.props.onClose(false);
      }
    );
  };

  itemchangeText(e) {
    FavouriteOrderEvent().itemchangeText(this, e);
  }
  eventHandaler(e) {
    FavouriteOrderEvent().texthandle(this, e);
  }
  serviceHandeler(e) {
    FavouriteOrderEvent().serviceHandeler(this, e);
  }

  AddToList() {
    FavouriteOrderEvent().AddToList(this);
  }

  DeleteService(row) {
    FavouriteOrderEvent().DeleteService(this, row);
  }

  AddFavouriteOrder(e) {
    FavouriteOrderEvent().AddFavouriteOrder(this, e);
  }
  serviceTypeHandeler(e) {
    FavouriteOrderEvent().serviceTypeHandeler(this, e);
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-investigation-form">
          <AlgaehModalPopUp
            class="addServerFav"
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.show}
          >
            <div className="popupInner">
              <div className="popRightDiv" style={{ maxHeight: "76vh" }}>
                <div className="row mandatory">
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Description",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "favourite_description",
                      value: this.state.favourite_description,
                      events: {
                        onChange: this.eventHandaler.bind(this)
                      }
                    }}
                  />
                  {this.props.from !== "ClinicalDesk" ? (
                    <AlagehAutoComplete
                      div={{ className: "col mandatory" }}
                      label={{
                        forceLabel: "Select Doctor",
                        isImp: true
                      }}
                      selector={{
                        name: "doctor_id",
                        className: "select-fld",
                        value: this.state.doctor_id,
                        dataSource: {
                          textField: "full_name",
                          valueField: "employee_id",
                          data: this.props.frontproviders
                        },

                        onChange: this.eventHandaler.bind(this),
                        onClear: () => {
                          this.setState({
                            doctor_id: null
                          });
                        }
                      }}
                    />
                  ) : null}
                </div>

                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Select Service Type"
                    }}
                    selector={{
                      name: "s_service_type",
                      className: "select-fld",
                      value: this.state.s_service_type,
                      dataSource: {
                        textField: "service_type",
                        valueField: "hims_d_service_type_id",
                        data: this.props.servicetype
                      },
                      onChange: this.serviceTypeHandeler.bind(this),
                      onClear: () => {
                        this.setState(
                          {
                            s_service_type: null
                          },
                          () => {
                            this.props.getServices({
                              redux: {
                                type: "SERVICES_GET_DATA",
                                mappingName: "opbilservices",
                                data: []
                              }
                            });
                          }
                        );
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Select Service"
                    }}
                    selector={{
                      name: "s_service",
                      className: "select-fld",
                      value: this.state.s_service,
                      dataSource: {
                        textField: "service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.opbilservices
                      },
                      onChange: this.eventHandaler.bind(this),
                      onClear: () => {
                        this.setState({
                          s_service: null
                        });
                      }
                    }}
                  />
                  <div className="col-2 form-group">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 19 }}
                      onClick={this.AddToList.bind(this)}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-lg-12" id="">
                      <AlgaehDataGrid
                        id="favourite_detail_grid"
                        columns={[
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  <i
                                    className="fas fa-trash-alt"
                                    onClick={this.DeleteService.bind(this, row)}
                                  />
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 65,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" }
                            }
                          },
                          {
                            fieldName: "service_type_id",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Service Type" }}
                              />
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
                                  {display !== undefined && display.length !== 0
                                    ? display[0].service_type
                                    : ""}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 180
                            }
                          },

                          {
                            fieldName: "services_id",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Service Name" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.serviceslist === undefined
                                  ? []
                                  : this.props.serviceslist.filter(
                                      f =>
                                        f.hims_d_services_id === row.services_id
                                    );

                              return (
                                <span>
                                  {display !== null && display.length !== 0
                                    ? display[0].service_name
                                    : ""}
                                </span>
                              );
                            }
                          }
                        ]}
                        keyId="favourite_detail_grid"
                        dataSource={{
                          data: this.state.favourite_details
                        }}
                        // isEditable={true}
                        filter={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>

                  <div className="col-lg-8">
                    <button
                      onClick={this.AddFavouriteOrder.bind(this)}
                      type="button"
                      className="btn btn-primary"
                    >
                      {this.state.hims_d_favourite_orders_header_id === null ? (
                        <AlgaehLabel label={{ forceLabel: "Save" }} />
                      ) : (
                        <AlgaehLabel label={{ forceLabel: "Update" }} />
                      )}
                    </button>
                    <button
                      onClick={e => {
                        this.onClose(e);
                      }}
                      type="button"
                      className="btn btn-default"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    serviceslist: state.serviceslist,
    opbilservices: state.opbilservices,
    frontproviders: state.frontproviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FavouriteOrder)
);
