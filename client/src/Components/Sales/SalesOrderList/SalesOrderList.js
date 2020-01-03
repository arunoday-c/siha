import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./SalesOrderList.scss";
import "./../../../styles/site.scss";

import {
  dateFormater,
  getSalesOrderList,
  datehandle,
  changeEventHandaler,
  dateFormaterTime
} from "./SalesOrderListEvent";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { AlgaehActions } from "../../../actions/algaehActions";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class SalesOrderList extends Component {
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
        customer_id,
        status
      } = this.props.prev;
      this.setState(
        {
          from_date,
          to_date,
          customer_id,
          status
        },
        () => getSalesOrderList(this)
      );
    } else {
      this.setState(
        {
          to_date: new Date(),
          from_date: moment("01" + month + year, "DDMMYYYY")._d,
          customer_id: null,
          order_list: [],
          status: "1"
        },
        () => getSalesOrderList(this)
      );
    }

    this.props.getCustomerMaster({
      uri: "/customer/getCustomerMaster",
      module: "masterSettings",
      data: { customer_status: "A" },
      method: "GET",
      redux: {
        type: "CUSTOMER_GET_DATA",
        mappingName: "customer_data"
      }
    });
  }

  ourOwnMiniNavigator = obj => {
    debugger
    const { order_list, radioYes, authorize1, ...rest } = this.state;
    let sendObj = Object.assign(rest, obj);
    this.props.new_routeComponents(sendObj);
  };

  render() {
    return (
      <React.Fragment>
        <div className="hptl-sales-quotation-list-form">
          <div
            className="row inner-top-search"
            style={{ paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ forceLabel: "From Date" }}
                  textBox={{ className: "txt-fld", name: "from_date" }}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.from_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ forceLabel: "To Date" }}
                  textBox={{ className: "txt-fld", name: "to_date" }}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.to_date}
                />
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{ forceLabel: "Customer", isImp: true }}
                  selector={{
                    name: "customer_id",
                    className: "select-fld",
                    value: this.state.customer_id,
                    dataSource: {
                      textField: "customer_name",
                      valueField: "hims_d_customer_id",
                      data: this.props.customer_data
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        customer_id: null
                      }, () => getSalesOrderList(this));
                    },
                    autoComplete: "off"
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
                      data: GlobalVariables.SALES_ORDER_STATUS
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        status: null
                      });
                    },
                    others: {
                      disabled: this.state.poSelected
                    }
                  }}
                />

              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body" id="SalesOrderListCntr">
                  <AlgaehDataGrid
                    id="SalesOrderList_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                style={{
                                  pointerEvents:
                                    row.cancel === "Y" ? "none" : "",
                                  opacity: row.cancel === "Y" ? "0.1" : ""
                                }}
                                className="fas fa-check"
                                onClick={() => {
                                  this.ourOwnMiniNavigator({
                                    RQ_Screen: "SalesOrder",
                                    sales_order_number: row.sales_order_number
                                  });
                                }}
                              />
                              {/* {row.trans_pending === true ? (
                                <i
                                  className="fa fa-exchange-alt"
                                  onClick={() => {
                                    this.ourOwnMiniNavigator({
                                      RQ_Screen: "TransferEntry",
                                      hims_f_pharamcy_material_header_id:
                                        row.hims_f_pharamcy_material_header_id,
                                      from_location: row.to_location_id
                                    });
                                  }}
                                />
                              ) : null} */}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 100,
                          resizable: false,
                          style: { textAlign: "center" },
                          filterable: false
                        }
                      },
                      {
                        fieldName: "sales_order_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Sales Order Number" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "sales_order_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Sales Order Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {dateFormaterTime(this, row.sales_order_date)}
                            </span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "left" },
                          filterable: false
                        }
                      },
                      {
                        fieldName: "customer_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Customer Name" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "customer_po_no",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Customer PO No." }}
                          />
                        ),
                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "delivery_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Delivery Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {dateFormater(this, row.delivery_date)}
                            </span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "left" },
                          filterable: false
                        }
                      }
                    ]}
                    keyId="sales_order_number"
                    filter={true}
                    dataSource={{
                      data: this.state.order_list
                    }}
                    noDataText="No data available"
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
    customer_data: state.customer_data
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCustomerMaster: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SalesOrderList)
);
