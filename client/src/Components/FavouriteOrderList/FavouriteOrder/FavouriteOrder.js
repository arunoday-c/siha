import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./FavouriteOrder.scss";
import "./../../../styles/site.scss";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import FavouriteOrderEvent from "./FavouriteOrderEvent";
import { AlgaehActions } from "../../../actions/algaehActions";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import _ from "lodash";

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
      s_service: null,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
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

  onClose = (e) => {
    this.setState(
      {
        hims_d_favourite_orders_header_id: null,
        favourite_description: null,
        favourite_status: "A",
        doctor_id: null,
        favourite_details: [],
        insert_favourite_details: [],
        delete_favourite_details: [],
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
              onClose: this.onClose.bind(this),
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
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "favourite_description",
                      value: this.state.favourite_description,
                      events: {
                        onChange: this.eventHandaler.bind(this),
                      },
                    }}
                  />
                  {this.props.from !== "ClinicalDesk" ? (
                    <AlagehAutoComplete
                      div={{ className: "col mandatory" }}
                      label={{
                        forceLabel: "Select Doctor",
                        isImp: true,
                      }}
                      selector={{
                        name: "doctor_id",
                        className: "select-fld",
                        value: this.state.doctor_id,
                        dataSource: {
                          textField: "full_name",
                          valueField: "employee_id",
                          data: this.props.frontproviders,
                        },

                        onChange: this.eventHandaler.bind(this),
                        onClear: () => {
                          this.setState({
                            doctor_id: null,
                          });
                        },
                      }}
                    />
                  ) : null}
                </div>

                <div className="row">
                  <AlgaehAutoSearch
                    div={{
                      className: "col customServiceSearch AlgaehAutoSearch",
                    }}
                    label={{ forceLabel: "Search Investigation" }}
                    title="Search Investigation"
                    id="service_id_search"
                    template={({ service_name, service_type }) => {
                      return (
                        <div className={`row resultSecStyles`}>
                          <div className="col-12 padd-10">
                            <h4 className="title">
                              {_.startCase(_.toLower(service_name))}
                            </h4>
                            <p className="searchMoreDetails">
                              <span>
                                Service Type:
                                <b>{_.startCase(_.toLower(service_type))}</b>
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    }}
                    name="s_service"
                    columns={spotlightSearch.Services.servicemaster}
                    displayField="service_name"
                    value={this.state.service_name}
                    searchName="servicemaster"
                    onClick={this.serviceHandeler.bind(this)}
                    ref={(attReg) => {
                      this.attReg = attReg;
                    }}
                  />
                  <div className="col-2 form-group">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 20 }}
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
                            displayTemplate: (row) => {
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
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "service_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Service Type" }}
                              />
                            ),
                            others: {
                              maxWidth: 180,
                            },
                          },

                          {
                            fieldName: "service_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Service Name" }}
                              />
                            ),
                          },
                        ]}
                        keyId="favourite_detail_grid"
                        dataSource={{
                          data: this.state.favourite_details,
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
                      onClick={(e) => {
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
    frontproviders: state.frontproviders,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FavouriteOrder)
);
