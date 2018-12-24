import React, { Component } from "react";
import "./LoanRequest.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import ReactTable from "react-table";

import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
const TreeTable = treeTableHOC(ReactTable);

class LoanRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="row loan_request">
          <div className="col-3">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Request loan</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-6" }}
                    label={{
                      forceLabel: "Loan Amount",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      //decimal: { allowNegative: false },
                      name: "limit_amount",
                      value: this.state.limit_amount,
                      events: {
                        //  onChange: this.changeTexts.bind(this)
                      },
                      others: {
                        // type: "number"
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6" }}
                    label={{
                      forceLabel: "No. of EMI",
                      isImp: true
                    }}
                    selector={{
                      name: "component_type",
                      className: "select-fld",
                      value: this.state.component_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: ""
                      }
                      //  onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-12" }}
                    label={{
                      forceLabel: "Reason for Loan",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      //decimal: { allowNegative: false },
                      name: "limit_amount",
                      value: this.state.limit_amount,
                      events: {
                        //  onChange: this.changeTexts.bind(this)
                      },
                      others: {
                        // type: "number"
                      }
                    }}
                  />
                  <div className="col-3 margin-bottom-15">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: 21 }}
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Loan Request List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12" id="LoanRequestList_cntr">
                    <AlgaehDataGrid
                      id="LoanRequestList_grid"
                      columns={[
                        {
                          fieldName: "",
                          label: "Loan Requested On"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "Loan Amount"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "No. of EMI"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: " Reason for Loan"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "No. of EMI Pending"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "Balance Due"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "Status"
                          //disabled: true
                        }
                      ]}
                      keyId="algaeh_d_module_id"
                      dataSource={{
                        data: []
                      }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: () => {},
                        onDone: () => {}
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      </React.Fragment>
    );
  }
}

export default LoanRequest;
