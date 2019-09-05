import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./FavouriteOrderList.css";
import "../../styles/site.css";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

import FavouriteOrderListEvent from "./FavouriteOrderListEvent";
import FavouriteOrder from "./FavouriteOrder/FavouriteOrder";

class FavouriteOrderList extends Component {
  constructor(props) {
    debugger;
    super(props);
    this.state = {
      isOpen: false,
      favouriteData: {},
      all_favourites: []
    };
    FavouriteOrderListEvent().getFavouriteOrderList(this);
  }

  componentDidMount() {
    debugger;
    this.props.getProviderDetails({
      uri: "/visit/getProviders",
      module: "frontDesk",
      method: "GET",
      redux: {
        type: "DOCTOR_GET_DATA",
        mappingName: "frontproviders"
      }
    });
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      favouriteData: {}
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen,
        favouriteData: {}
      },
      () => {
        FavouriteOrderListEvent().getFavouriteOrderList(this);
        // if (e === true) {
        //   FavouriteOrderListEvent().getFavouriteOrderList(this);
        // }
      }
    );
  }

  EditProcedureMaster(row) {
    FavouriteOrderListEvent().OpenFavouriteOrder(this, row);
  }

  render() {
    return (
      <div className="hims_favourite_order_list">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Favourite Lists</h3>
            </div>
            <div className="actions">
              <a
                // href="javascript"
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
              </a>
              <FavouriteOrder
                HeaderCaption="Favourite Order"
                show={this.state.isOpen}
                onClose={this.CloseModel.bind(this)}
                favouriteData={this.state.favouriteData}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="proceduresGridCntr">
                <AlgaehDataGrid
                  id="favouritesGrid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-pen"
                              onClick={this.EditProcedureMaster.bind(this, row)}
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
                      fieldName: "favourite_description",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Favourite Desc" }} />
                      )
                    },

                    {
                      fieldName: "doctor_id",
                      label: <AlgaehLabel label={{ forceLabel: "Doctor" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.frontproviders === undefined
                            ? []
                            : this.props.frontproviders.filter(
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
                    }
                  ]}
                  keyId="favourite_code"
                  dataSource={{
                    data: this.state.all_favourites
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
    frontproviders: state.frontproviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProviderDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FavouriteOrderList)
);
