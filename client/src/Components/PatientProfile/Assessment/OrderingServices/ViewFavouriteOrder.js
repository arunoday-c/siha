import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ViewFavouriteOrder.scss";

// viewfavServiceOrderPopup

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../../actions/algaehActions";
import Enumerable from "linq";

class ViewFavouriteOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      all_favourites: [],
      favourite_details: []
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

  AddFavouriteOrder() {
    let listOfinclude = Enumerable.from(this.state.all_favourites)
      .where(w => w.select_to_process === "Y")
      .toArray();
    let selected_services = [];
    for (let d = 0; d < listOfinclude.length; d++) {
      let services_data = listOfinclude[d].favourite_details;
      for (let e = 0; e < services_data.length; e++) {
        selected_services.push({
          service_type_id: services_data[e].service_type_id,
          services_id: services_data[e].services_id
        });
      }
    }
    this.props.onClose && this.props.onClose(selected_services);
  }
  selectToProcess(row, e) {
    let all_favourites = this.state.all_favourites;
    let _index = all_favourites.indexOf(row);
    let add_to_list = true;
    if (e.target.checked === true) {
      row["select_to_process"] = "Y";
    } else if (e.target.checked === false) {
      row["select_to_process"] = "N";
    }

    all_favourites[_index] = row;

    let listOfinclude = Enumerable.from(all_favourites)
      .where(w => w.select_to_process === "Y")
      .toArray();
    if (listOfinclude.length > 0) {
      add_to_list = false;
    }
    this.setState({
      add_to_list: add_to_list,
      all_favourites: all_favourites
    });
  }

  getServicesDetails(row) {
    this.setState({
      favourite_details: row.favourite_details
    });
  }
  componentWillReceiveProps(newProps) {
    if (newProps.all_favourites !== undefined) {
      this.setState({ all_favourites: newProps.all_favourites });
    }
  }
  onClose = e => {
    this.setState(
      {
        all_favourites: [],
        favourite_details: []
      },
      () => {
        this.props.onClose && this.props.onClose([]);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-investigation-form">
          <AlgaehModalPopUp
            class="viewfavServiceOrderPopup"
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.show}
          >
            <div className="popupInner">
              <div className="popRightDiv" style={{ maxHeight: "76vh" }}>
                <div className="row">
                  <div className="col-4">
                    <AlgaehDataGrid
                      id="favouritesGrid"
                      columns={[
                        {
                          fieldName: "favourite_order_select",

                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Select"
                              }}
                            />
                          ),

                          displayTemplate: row => {
                            return (
                              <span>
                                <input
                                  type="checkbox"
                                  value="Front Desk"
                                  onChange={this.selectToProcess.bind(
                                    this,
                                    row
                                  )}
                                  checked={
                                    row.select_to_process === "Y" ? true : false
                                  }
                                />
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 50,
                            filterable: false
                          }
                        },
                        {
                          fieldName: "favourite_description",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Favourite Desc" }}
                            />
                          )
                        }
                      ]}
                      keyId="favourite_code"
                      dataSource={{
                        data: this.state.all_favourites
                      }}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      onRowSelect={row => {
                        this.getServicesDetails(row);
                      }}
                    />
                  </div>
                  <div className="col-8">
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="">
                          <AlgaehDataGrid
                            id="favourite_detail_grid"
                            columns={[
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
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].service_type
                                        : ""}
                                    </span>
                                  );
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
                                            f.hims_d_services_id ===
                                            row.services_id
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
                      Add To list
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
  )(ViewFavouriteOrder)
);
