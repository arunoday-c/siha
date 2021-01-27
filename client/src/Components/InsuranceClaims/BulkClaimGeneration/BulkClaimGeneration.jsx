import React, { useState } from "react";
import "./BulkClaimGeneration.scss";
import {
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehDateHandler,
  Spin,
  AlgaehMessagePop,
  Checkbox,
} from "algaeh-react-components";
import moment from "moment";
import { useQuery, useMutation } from "react-query";
import {
  getVisits,
  getInsuranceProviders,
  getSubInsurance,
  sendForGeneration,
} from "./apis";
// import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import { VisitTable } from "./VisitTable";
export default function BulkClaimGeneration() {
  const [selectedList, setSelectedList] = useState([]);
  const [dates, setDates] = useState([moment().subtract(7, "days"), moment()]);
  const [insurance_provider_id, setInsurance] = useState(null);
  const [sub_insurance_id, setSubInsurance] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { data, isLoading, refetch, isFetching, clear } = useQuery(
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

  const [submit, { isLoading: mutLoading }] = useMutation(sendForGeneration, {
    onSuccess: () => {
      setSubmitted(true);
      AlgaehMessagePop({
        display: "Invoice Generated Successfully",
        type: "success",
      });
    },
  });

  const addToList = (row) => {
    setSelectedList((state) => {
      const current = state.findIndex(
        (item) => item?.hims_f_patient_visit_id === row?.hims_f_patient_visit_id
      );
      if (current !== -1) {
        state.splice(current, 1);
        return [...state];
      } else {
        return [...state, row];
      }
    });
  };

  const clearPage = () => {
    setSelectedList([]);
    setSubmitted(false);
    setDates([moment().subtract(7, "days"), moment()]);
    clear();
    setInsurance(null);
    setSubInsurance(null);
  };

  const selectAll = () => {
    debugger
    if (data?.length === selectedList?.length) {
      setSelectedList([]);
    } else {
      setSelectedList([...data]);
    }
  };

  const today = new Date();
  today.setDate(today.getDate() + 1);

  return (
    <Spin
      spinning={
        insLoading || subLoading || isLoading || isFetching || mutLoading
      }
    >
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
              maxDate={today}
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
            {!!data?.length && !submitted && (
              <div className="col">
                <Checkbox
                  checked={data?.length === selectedList?.length}
                  onChange={selectAll}
                >
                  Select All
                </Checkbox>
              </div>
            )}
            <div className="col-12">
              <VisitTable
                loading={isLoading}
                data={data}
                addToList={addToList}
                list={selectedList}
                submitted={submitted}
              />
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-12">
              {" "}
              <button
                type="button"
                className="btn btn-primary"
                disabled={!selectedList.length || submitted}
                onClick={() => {
                  submit(
                    selectedList.map((item) => item?.hims_f_patient_visit_id)
                  );
                }}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_final", returnText: true }}
                />
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={() => clearPage()}
              >
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
