import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./SalesQuotationList.scss";
import "./../../../styles/site.scss";

import {
  dateFormater,
  getSalesQuotationList,
  datehandle,
  // changeEventHandaler,
  dateFormaterTime,
  employeeSearch,
  selectCheckBox,
  closeTransferPerson,
  ShowTransferPopup
} from "./SalesQuotationListEvent";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  // AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { AlgaehActions } from "../../../actions/algaehActions";
import { MainContext } from "algaeh-react-components/context";
import { AlgaehSecurityComponent } from "algaeh-react-components";
import SalesQuotationTransfer from "./SalesQuotationTransfer"


class SalesQuotationList extends Component {
  constructor(props) {
    super(props);
    this.HRMNGMT_Active = false;
    this.state = {
      checkSelf: true,
      checkAll: false,
      checkUserWise: false,
      transferPopup: false
    };
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.HRMNGMT_Active =
      userToken.product_type === "HIMS_ERP" ||
        userToken.product_type === "HRMS" ||
        userToken.product_type === "HRMS_ERP" ||
        userToken.product_type === "FINANCE_ERP"
        ? true
        : false;

    let month = moment().format("MM");
    let year = moment().format("YYYY");
    //to load the same list when user come back from whatever screen they went.
    if (this.props.backToAuth) {
      const { from_date, to_date, customer_id } = this.props.prev;
      this.setState(
        {
          from_date,
          to_date,
          customer_id,
          sales_person_id: userToken.employee_id,
          hospital_id: userToken.hims_d_hospital_id,
        },
        () => getSalesQuotationList(this)
      );
    } else {
      this.setState(
        {
          to_date: new Date(),
          from_date: moment("01" + month + year, "DDMMYYYY")._d,
          customer_id: null,
          quotation_list: [],
          sales_person_id: userToken.employee_id,
          loged_in_employee: userToken.employee_id,
          hospital_id: userToken.hims_d_hospital_id,
        },
        () => getSalesQuotationList(this)
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
    const { quotation_list, radioYes, authorize1, ...rest } = this.state;
    let sendObj = Object.assign(rest, obj);
    this.props.new_routeComponents(sendObj);
  };

  render() {
    return (
      <React.Fragment>
        <SalesQuotationTransfer
          open={this.state.transferPopup}
          onClose={closeTransferPerson.bind(this, this)}
          quot_detail={this.state.quot_detail}
          hospital_id={this.state.hospital_id}
          HRMNGMT_Active={this.HRMNGMT_Active}
        />
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
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.from_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "To Date" }}
                  textBox={{ className: "txt-fld", name: "to_date" }}
                  events={{
                    onChange: datehandle.bind(this, this)
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
                        () => getSalesQuotationList(this)
                      );
                    },
                    autoComplete: "off"
                  }}
                /> */}

                <AlgaehSecurityComponent componentCode="SALE_QUO_LST_CHEK_LVL">
                  {this.HRMNGMT_Active ? (
                    <div className="row">
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="checkSelf"
                            checked={this.state.checkSelf}
                            onChange={selectCheckBox.bind(this, this)}
                          />
                          <span>Self</span>
                        </label>
                        <label
                          className="checkbox inline"
                          style={{ marginRight: 20 }}
                        >
                          <input
                            type="checkbox"
                            name="checkAll"
                            checked={this.state.checkAll}
                            onChange={selectCheckBox.bind(this, this)}
                          />
                          <span>Select All</span>
                        </label>

                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="checkUserWise"
                            checked={this.state.checkUserWise}
                            onChange={selectCheckBox.bind(this, this)}
                          />
                          <span>User Wise</span>
                        </label>
                      </div>
                      {this.state.checkUserWise === true ?
                        <div className={"col globalSearchCntr"}>
                          <AlgaehLabel
                            label={{ forceLabel: "Sales Person Wise" }}
                          />
                          <h6
                            className="mandatory"
                            onClick={employeeSearch.bind(this, this)}
                          >
                            {this.state.employee_name
                              ? this.state.employee_name
                              : "Search Employee"}
                            <i className="fas fa-search fa-lg" />
                          </h6>
                        </div> : null}
                    </div>) : null}
                </AlgaehSecurityComponent>


              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body" id="SalesQuotationListCntr">
                  <AlgaehDataGrid
                    id="SalesQuotationList_grid"
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
                                className="fas fa-eye"
                                onClick={() => {
                                  this.ourOwnMiniNavigator({
                                    RQ_Screen: "SalesQuotation",
                                    sales_quotation_number:
                                      row.sales_quotation_number
                                  });
                                }}
                              />
                              <i
                                className="fa fa-exchange-alt"
                                onClick={ShowTransferPopup.bind(this, this, row)}
                              />
                            </span>
                          );
                        },
                        others: {
                          resizable: false,
                          maxWidth: 100,

                          style: { textAlign: "center" },
                          filterable: false
                        }
                      },
                      {
                        fieldName: "qotation_status",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: row => {
                          return row.qotation_status === "G" ? (
                            <span className="badge badge-warning">
                              Generated
                            </span>
                          ) : row.qotation_status === "O" ? (
                            <span className="badge badge-info">
                              Order Created
                            </span>
                          ) : (
                                <span className="badge badge-success">Closed</span>
                              );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 100,
                          resizable: false
                        }
                      },
                      {
                        fieldName: "sales_quotation_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Quotation No." }}
                          />
                        ),
                        disabled: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "sales_quotation_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Sales Quotation Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {dateFormaterTime(this, row.sales_quotation_date)}
                            </span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
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
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      // {
                      //   fieldName: "employee_name",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ forceLabel: "Sales Person" }}
                      //     />
                      //   ),
                      //   disabled: true,
                      //   others: {
                      //     maxWidth: 150,
                      //     resizable: false,
                      //     style: { textAlign: "center" }
                      //   }
                      // },
                      {
                        fieldName: "quote_validity",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Validity Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {dateFormater(this, row.quote_validity)}
                            </span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 100,
                          resizable: false,
                          filterable: false
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
                            <span>{dateFormater(this, row.delivery_date)}</span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 100,
                          resizable: false,
                          filterable: false
                        }
                      },
                      {
                        fieldName: "comments",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Comments" }} />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "left" },
                          filterable: false
                        }
                      }
                    ]}
                    keyId="sales_quotation_number"
                    filter={true}
                    dataSource={{
                      data: this.state.quotation_list
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
  connect(mapStateToProps, mapDispatchToProps)(SalesQuotationList)
);
