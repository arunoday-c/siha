import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./SalesOrderList.scss";
import "./../../../styles/site.scss";

import {
  dateFormater,
  getSalesOrderList,
  datehandle,
  changeEventHandaler,
  dateFormaterTime,
} from "./SalesOrderListEvent";

import {
  // AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  AlgaehTable,
  persistStorageOnRemove,
  persistStageOnGet,
  persistStateOnBack,
} from "algaeh-react-components";

class SalesOrderList extends Component {
  constructor(props) {
    super(props);
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    this.state = {
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      status: "1",
      persistence: null,
      order_list: [],
    };
  }

  componentDidMount() {
    //to load the same list when user come back from whatever screen they went.
    // if (this.props.backToAuth) {
    //   const { from_date, to_date, customer_id, status } = this.props.prev;
    //   this.setState(
    //     {
    //       from_date,
    //       to_date,
    //       customer_id,
    //       status
    //     },
    //     () => getSalesOrderList(this)
    //   );
    // } else {
    //   this.setState(
    //     {
    //       to_date: new Date(),
    //       from_date: moment("01" + month + year, "DDMMYYYY")._d,
    //       customer_id: null,
    //       order_list: [],
    //       status: "1"
    //     },
    //     () => getSalesOrderList(this)
    //   );
    // }

    (async () => {
      const records = await persistStageOnGet();

      if (records) {
        this.setState({ ...records }, () => {
          getSalesOrderList(this);
        });
        persistStorageOnRemove();
      } else {
        const params = new URLSearchParams(this.props.location?.search);
        if (params?.get("status")) {
          this.setState({
            status: params?.get("status"),
          });
        }
        if (params?.get("from_date")) {
          this.setState({
            // from_date: params?.get("from_date"),
            from_date: moment(params?.get("from_date"))._d,
          });
        }
        if (params?.get("to_date")) {
          this.setState(
            {
              to_date: moment(params?.get("to_date"))._d,
            },
            () => getSalesOrderList(this)
          );
        } else {
          getSalesOrderList(this);
        }
      }
    })();

    // this.props.getCustomerMaster({
    //   uri: "/customer/getCustomerMaster",
    //   module: "masterSettings",
    //   data: { customer_status: "A" },
    //   method: "GET",
    //   redux: {
    //     type: "CUSTOMER_GET_DATA",
    //     mappingName: "customer_data"
    //   }
    // });
  }

  // ourOwnMiniNavigator = obj => {
  //   const { order_list, radioYes, authorize1, ...rest } = this.state;
  //   let sendObj = Object.assign(rest, obj);
  //   this.props.new_routeComponents(sendObj);
  // };

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
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "From Date" }}
                  textBox={{ className: "txt-fld", name: "from_date" }}
                  events={{
                    onChange: datehandle.bind(this, this),
                  }}
                  value={this.state.from_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "To Date" }}
                  textBox={{ className: "txt-fld", name: "to_date" }}
                  events={{
                    onChange: datehandle.bind(this, this),
                  }}
                  value={this.state.to_date}
                />
                {/* <AlagehAutoComplete
                  div={{ className: "col-3 mandatory" }}
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
                      this.setState(
                        {
                          customer_id: null
                        },
                        () => getSalesOrderList(this)
                      );
                    },
                    autoComplete: "off"
                  }}
                /> */}

                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Status" }}
                  selector={{
                    name: "status",
                    className: "select-fld",
                    value: this.state.status,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.SALES_ORDER_STATUS,
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        status: null,
                      });
                    },
                    others: {
                      disabled: this.state.poSelected,
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body" id="SalesOrderListCntr">
                  <AlgaehTable
                    id="SalesOrderList_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: (row) => {
                          return (
                            <span>
                              <i
                                className="fas fa-eye"
                                onClick={() => {
                                  persistStateOnBack(this.state, true);
                                  this.props.history.push(
                                    `/SalesOrder?sales_order_number=${row.sales_order_number}`
                                  );

                                  // this.ourOwnMiniNavigator({
                                  //   RQ_Screen: "SalesOrder",
                                  //   sales_order_number: row.sales_order_number
                                  // });
                                }}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 60,
                          resizable: false,
                          style: { textAlign: "center" },
                          filterable: false,
                        },
                      },
                      {
                        fieldName: "is_posted",
                        label: <AlgaehLabel label={{ forceLabel: "Posted" }} />,
                        displayTemplate: (row) => {
                          return row.is_posted === "Y" ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                              <span className="badge badge-danger">No</span>
                            );
                        },
                        filterable: true,
                      },
                      {
                        fieldName: "created_by",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Order By." }} />
                        ),
                        disabled: true,
                        others: {
                          maxWidth: 250,
                          resizable: false,
                          style: { textAlign: "left" },
                        },
                        filterable: true,
                      },
                      {
                        fieldName: "sales_order_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Order No." }} />
                        ),
                        disabled: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                        filterable: true,
                      },
                      {
                        fieldName: "sales_order_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Order Date" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {dateFormaterTime(this, row.sales_order_date)}
                            </span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
                        },
                      },
                      {
                        fieldName: "sales_order_mode",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Sales Mode" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.sales_order_mode === "I" ? (
                            <span className="badge badge-success">
                              Item Order
                            </span>
                          ) : (
                              <span className="badge badge-success">
                                Service Order
                              </span>
                            );
                        },
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "customer_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Customer Name" }}
                          />
                        ),
                        disabled: true,
                        filterable: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "left" },
                        },
                      },
                      {
                        fieldName: "customer_po_no",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Customer PO No." }}
                          />
                        ),
                        disabled: true,
                        filterable: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "delivery_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Delivery Date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>{dateFormater(this, row.delivery_date)}</span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
                        },
                      },
                      {
                        fieldName: "is_revert",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Invoice Reverted" }}
                          />
                        ),
                        filterable: true,
                        displayTemplate: (row) => {
                          return row.is_revert === "Y" ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                              <span className="badge badge-danger">No</span>
                            );
                        },
                      },
                      {
                        fieldName: "cancelled",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Order Cancelled" }} />
                        ),
                        filterable: true,
                        displayTemplate: (row) => {
                          return row.cancelled === "Y" ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                              <span className="badge badge-danger">No</span>
                            );
                        },
                      },
                      {
                        fieldName: "is_reject",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Order Rejected" }} />
                        ),
                        filterable: true,
                        displayTemplate: (row) => {
                          return row.is_reject === "Y" ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                              <span className="badge badge-danger">No</span>
                            );
                        },
                      },
                      {
                        fieldName: "invoice_generated",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Invoice Generated" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return row.sales_order_mode === "I" ? (
                            row.invoice_generated === "Y" ? (
                              <span className="badge badge-success">Yes</span>
                            ) : (
                                <span className="badge badge-danger">No</span>
                              )
                          ) : row.closed === "Y" ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                                <span className="badge badge-danger">No</span>
                              );
                        },
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "invoice_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Invoice No." }} />
                        ),
                        disabled: true,
                        filterable: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                    ]}
                    data={this.state.order_list}
                    // height="80vh"
                    pagination={true}
                    isFilterable={true}
                    persistence={this.state.persistence}
                  // keyId="sales_order_number"
                  // filter={true}
                  // dataSource={{
                  //   data: this.state.order_list
                  // }}
                  // noDataText="No data available"
                  // paging={{ page: 0, rowsPerPage: 10 }}
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

export default withRouter(SalesOrderList);
