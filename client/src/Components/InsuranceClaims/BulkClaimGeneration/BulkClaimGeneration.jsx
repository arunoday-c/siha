import React from "react";
import "./BulkClaimGeneration.scss";
import {
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehDateHandler,
} from "algaeh-react-components";
// import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import { VisitTable } from "./VisitTable";
export default function BulkClaimGeneration() {
  return (
    <div className="row BulkClaimGenerationScreen">
      <div className="col-12">
        <div className="row inner-top-search">
          {" "}
          <AlgaehDateHandler
            div={{ className: "col-2 form-group mandatory" }}
            label={{ isImp: true, forceLabel: "From Date" }}
            textBox={{
              className: "txt-fld",
              name: "from_date",
            }}
            maxDate={new Date()}
            events={
              {
                // onChange: (selDate) => {
                //   this.setState({
                //     from_date: selDate,
                //     claims: [],
                //   });
                // },
              }
            }
            // value={this.state.from_date}
          />
          <AlgaehDateHandler
            div={{ className: "col-2 form-group mandatory" }}
            label={{ isImp: true, forceLabel: "To Date" }}
            textBox={{
              className: "txt-fld",
              name: "to_date",
            }}
            maxDate={new Date()}
            events={
              {
                // onChange: (selDate) => {
                //   this.setState({
                //     to_date: selDate,
                //     claims: [],
                //   });
                // },
              }
            }
            // value={this.state.to_date}
          />
          <AlgaehAutoComplete
            div={{ className: "col-3 form-group " }}
            label={{ isImp: false, forceLabel: "Company Name" }}
            selector={{
              name: "insurance_provider_id",
              className: "select-fld",
              value: "",
              dataSource: {
                textField: "",
                valueField: "",
                data: [],
              },
            }}
          />
          <AlgaehAutoComplete
            div={{ className: "col-3 form-group " }}
            label={{ isImp: false, forceLabel: "Sub Company Name" }}
            selector={{
              name: "insurance_provider_id",
              className: "select-fld",
              value: "",
              dataSource: {
                textField: "",
                valueField: "",
                data: [],
              },
            }}
          />
          <div className="col">
            <button className="btn btn-default" style={{ marginTop: 21 }}>
              Load
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <VisitTable />
          </div>
        </div>
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-12">
            {" "}
            <button type="button" className="btn btn-primary">
              <AlgaehLabel
                label={{ fieldName: "btn_final", returnText: true }}
              />
            </button>
            <button type="button" className="btn btn-default">
              <AlgaehLabel
                label={{ fieldName: "btn_clear", returnText: true }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
