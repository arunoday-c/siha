import React, { useState } from "react";
import "./BulkClaimGeneration.scss";
import {
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehDateHandler,
  Spin,
  AlgaehMessagePop,
} from "algaeh-react-components";
import moment from "moment";
import { useQuery } from "react-query";
import { getVisits, getInsuranceProviders, getSubInsurance } from "./apis";
// import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import { VisitTable } from "./VisitTable";
export default function BulkClaimGeneration() {
  const [dates, setDates] = useState([moment().subtract(7, "days"), moment()]);
  const [insurance_provider_id, setInsurance] = useState(null);
  const [sub_insurance_id, setSubInsurance] = useState(null);
  const { data, isLoading, refetch, isFetching } = useQuery(
    [
      "get-visits",
      {
        from_date: dates?.[0]?.format("YYYY-MM-DD"),
        to_date: dates?.[1]?.format("YYYY-MM-DD"),
        insurance_provider_id,
        sub_insurance_id,
      },
    ],
    getVisits,
    {
      initialData: [],
      retry: false,
      initialStale: true,
      enabled: false,
      onError: (e) => {
        console.log(e);
        AlgaehMessagePop({
          display: e?.message,
          type: "Error",
        });
      },
    }
  );

  const { data: insurances, isLoading: insLoading } = useQuery(
    "insurance",
    getInsuranceProviders
  );
  const { data: subInsurances, isLoading: subLoading } = useQuery(
    ["subinsurance", { insurance_provider_id }],
    getSubInsurance,
    { enabled: !!insurance_provider_id }
  );

  return (
    <Spin spinning={insLoading || subLoading || isLoading || isFetching}>
      <div className="row BulkClaimGenerationScreen">
        <div className="col-12">
          <div className="row inner-top-search">
            {" "}
            <AlgaehDateHandler
              div={{ className: "col-3 form-group mandatory" }}
              label={{ forceLabel: "From & TO Date", isImp: true }}
              type="range"
              textBox={{
                value: dates,
              }}
              maxDate={new Date()}
              events={{
                onChange: (selected) => {
                  setDates(selected);
                },
              }}
            />
            {/* <AlgaehDateHandler
            div={{ className: "" }}
            label={{ isImp: true, forceLabel: "From Date" }}
            textBox={{
              className: "txt-fld",
              name: "from_date",
            }}
            type="Range"
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
          /> */}
            <AlgaehAutoComplete
              div={{ className: "col-3 form-group " }}
              label={{ isImp: false, forceLabel: "Company Name" }}
              selector={{
                name: "insurance_provider_id",
                className: "select-fld",
                value: insurance_provider_id,
                onChange: (_, selected) => setInsurance(selected),
                onClear: () => setInsurance(null),
                dataSource: {
                  textField: "insurance_provider_name",
                  valueField: "hims_d_insurance_provider_id",
                  data: insurances || [],
                },
              }}
            />
            <AlgaehAutoComplete
              div={{ className: "col-3 form-group " }}
              label={{ isImp: false, forceLabel: "Sub Company Name" }}
              selector={{
                name: "insurance_provider_id",
                className: "select-fld",
                value: sub_insurance_id,
                onChange: (_, selected) => setSubInsurance(selected),
                dataSource: {
                  textField: "insurance_sub_name",
                  valueField: "hims_d_insurance_sub_id",
                  data: subInsurances || [],
                },
                others: {
                  disabled: !insurance_provider_id,
                },
              }}
            />
            <div className="col">
              <button
                className="btn btn-default"
                style={{ marginTop: 21 }}
                onClick={() => refetch()}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <VisitTable loading={isLoading} data={data} />
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
    </Spin>
  );
}
