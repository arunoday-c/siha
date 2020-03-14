import React, { Component } from "react";
import "./FinanceMapping.scss";

import {
  // AlgaehDataGrid,
  // AlgaehLabel,
  // AlagehFormGroup,
  AlagehAutoComplete
  // AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

class FinanceMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "FinanceMapping"
    };
  }

  render() {
    return (
      <div className="FinanceMappingScreen">
        <div className="row margin-top-15 margin-bottom-15">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">OP Billing</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "OP Control A/c", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "OP Patient Deposit", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP Patient Receivable A/c",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP Sheet Level Discount A/c",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP Package Discount A/c",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP Credit Settlement Clearing A/c",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP Discount write off A/c",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "Donor Control A/c", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      style={{ float: "right", marginTop: 19 }}
                    >
                      Map/Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Pharmacy</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "POS Cleaning A/c", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Default Sales Tax Group",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Patient Receivable Amount",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      style={{ float: "right", marginTop: 19 }}
                    >
                      Map/Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Payroll</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Salary wages and payable A/c",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "Gratuity payable A/c", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Leave Salary payable A/c",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "Airfare payable A/c", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Final Settlement payable A/c",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Loan write off account",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      style={{ float: "right", marginTop: 19 }}
                    >
                      Map/Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default FinanceMapping;
