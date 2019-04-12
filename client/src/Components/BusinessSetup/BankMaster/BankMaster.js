import React, { Component } from "react";
import "./BankMaster.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
export default class BankMaster extends Component {
  render() {
    return (
      <div className="BankMasterScreen">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Bank Full Name",
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
                forceLabel: "Bank Short Name",
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
                forceLabel: "BIC (SWIFT) Code",
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
          <div className="" id="BankMasterGrid_Cntr">
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
                  fieldName: "BIC_SWIFT",
                  label: <AlgaehLabel label={{ forceLabel: "BIC ( SWIFT)" }} />
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
