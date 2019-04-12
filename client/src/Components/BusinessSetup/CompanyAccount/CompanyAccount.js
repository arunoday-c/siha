import React, { Component } from "react";
import "./CompanyAccount.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
export default class CompanyAccount extends Component {
  render() {
    return (
      <div className="CompanyAccountScreen">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{ forceLabel: "Select a Bank", isImp: false }}
              selector={{
                name: "",
                className: "select-fld",
                dataSource: {},
                others: {}
              }}
            />
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Account No",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                events: {},
                option: {
                  type: "text"
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Employer CR-No.",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                events: {},
                option: {
                  type: "text"
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Payer CR-No.",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                events: {},
                option: {
                  type: "text"
                }
              }}
            />
            <div className="col">
              <button style={{ marginTop: 21 }} className="btn btn-primary">
                Add to List
              </button>
            </div>
          </div>
          <div className="" id="CompanyAccountGrid_Cntr">
            <AlgaehDataGrid
              id="BankMasterGrid"
              datavalidate="BankMasterGrid"
              columns={[
                {
                  fieldName: "bankName",
                  label: <AlgaehLabel label={{ forceLabel: "Bank Name" }} />
                },
                {
                  fieldName: "shortName",
                  label: <AlgaehLabel label={{ forceLabel: "Short Name" }} />
                },
                {
                  fieldName: "accountNo",
                  label: <AlgaehLabel label={{ forceLabel: "Account No." }} />
                },
                {
                  fieldName: "EmployerCR_No",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Employer CR-No." }} />
                  )
                },
                {
                  fieldName: "EmployerCR_No",
                  label: <AlgaehLabel label={{ forceLabel: "Payer CR-No." }} />
                }
              ]}
              keyId=""
              dataSource={{ data: [] }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{}}
              others={{}}
            />
          </div>
        </div>
      </div>
    );
  }
}
