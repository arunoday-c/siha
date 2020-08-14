import React, { PureComponent } from "react";

import "./ViewFavouriteOrder.scss";

// viewfavServiceOrderPopup

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";

import Enumerable from "linq";

export default class ViewFavouriteOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      all_favourites: [],
      favourite_details: []
    };
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

    this.setState(
      {
        all_favourites: [],
        favourite_details: []
      },
      () => {
        this.props.onClose && this.props.onClose(selected_services);
      }
    );
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
  UNSAFE_componentWillReceiveProps(newProps) {
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
                                fieldName: "service_type",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Service Type" }}
                                  />
                                )
                              },

                              {
                                fieldName: "service_name",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Service Name" }}
                                  />
                                )
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

