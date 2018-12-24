import React, { Component } from "react";
import "./loan_master.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
class LoanMaster extends Component {
  render() {
    return (
      <div className="loan_master">
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Loan Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              //decimal: { allowNegative: false },
              name: "limit_amount",
              //value: this.state.limit_amount,
              events: {
                //  onChange: this.changeTexts.bind(this)
              },
              others: {
                // type: "number"
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Loan Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              //decimal: { allowNegative: false },
              name: "limit_amount",
              //value: this.state.limit_amount,
              events: {
                //  onChange: this.changeTexts.bind(this)
              },
              others: {
                // type: "number"
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col " }}
            label={{
              forceLabel: "Loan Limit Type",
              isImp: false
            }}
            selector={{
              name: "sub_department_id",
              className: "select-fld",
              //value : '',
              dataSource: {
                textField: "sub_department_name",
                Field: "sub_department_id"
                //data: this.state.departments
              }
              // onChange: this.dropDownHandle.bind(this)
            }}
          />

          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Loan Limit Value",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              //decimal: { allowNegative: false },
              name: "limit_amount",
              //value: this.state.limit_amount,
              events: {
                //  onChange: this.changeTexts.bind(this)
              },
              others: {
                // type: "number"
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "G/L Account",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              //decimal: { allowNegative: false },
              name: "limit_amount",
              //value: this.state.limit_amount,
              events: {
                //  onChange: this.changeTexts.bind(this)
              },
              others: {
                // type: "number"
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-10" }}
            label={{
              forceLabel: "Comments",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              //decimal: { allowNegative: false },
              name: "limit_amount",
              //value: this.state.limit_amount,
              events: {
                //  onChange: this.changeTexts.bind(this)
              },
              others: {
                // type: "number"
              }
            }}
          />

          <div className="col-2 form-group">
            <button
              // onClick={this.loadPatients.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              LOAD
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Loan Master List</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="loanMasterList_cntr">
                <AlgaehDataGrid
                  id="loanMasterList_grid"
                  columns={[
                    {
                      fieldName: "",
                      label: "Loan Code"
                      //disabled: true
                    },
                    {
                      fieldName: "",
                      label: "Loan Description"
                      //disabled: true
                    },
                    {
                      fieldName: "",
                      label: "Loan Limit Type"
                      //disabled: true
                    },
                    {
                      fieldName: "",
                      label: "Loan Limit Value"
                      //disabled: true
                    },
                    {
                      fieldName: "",
                      label: "G/L Account"
                      //disabled: true
                    },
                    {
                      fieldName: "",
                      label: "Leave Reason"
                      //disabled: true
                    },
                    {
                      fieldName: "",
                      label: "Loan Comments"
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
      </div>
    );
  }
}

export default LoanMaster;
