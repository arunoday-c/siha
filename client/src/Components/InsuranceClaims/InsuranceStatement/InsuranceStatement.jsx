import React, { useState, useEffect } from "react";
import "./InsuranceStatement.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import { getYears } from "../../../utils/GlobalFunctions";
import { Controller, useForm } from "react-hook-form";
// import moment from "moment";
import {
  AlgaehLabel,
  AlgaehMessagePop,
  // AlgaehDateHandler,
  AlgaehAutoComplete,
  // MainContext,
  AlgaehDataGrid,
  // AlgaehModal,
  Spin,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";

export default function InsuranceStatement(props) {
  // const { userToken } = useContext(MainContext);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [subInsurance, setSubInsurance] = useState([]);

  const { control, getValues, setValue, handleSubmit } = useForm({
    shouldFocusError: true,
  });
  useEffect(() => {
    async function initData() {
      try {
        const results = await Promise.all([
          newAlgaehApi({
            uri: "/insurance/getInsuranceProviders",
            method: "GET",
            module: "insurance",
          }),

          newAlgaehApi({
            uri: "/branchMaster/getBranchMaster",
            method: "GET",
            module: "masterSettings",
          }),
        ]);
        const [providers, branches] = results;
        setBranches(branches.data.records);
        setInsurance(providers.data.records);
      } catch (e) {
        AlgaehMessagePop({
          display: e.message,
          type: "error",
        });
      }
    }
    initData().finally(() => {
      setLoading(false);
    });
  }, []);

  const loadSubInsurance = async (id) => {
    setLoading(true);
    try {
      const res = await newAlgaehApi({
        uri: "/insurance/getSubInsurance",
        module: "insurance",
        method: "GET",
        data: {
          insurance_provider_id: id,
        },
      });

      setSubInsurance(res.data.records);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      AlgaehMessagePop({
        display: e.message,
        type: "error",
      });
    }
  };

  const onSubmit = (e) => {
    console.log(e, "inputs");
  };

  return (
    <Spin spinning={loading}>
      <div className="InsuranceStatementScreen">
        <div className="" style={{ marginBottom: "50px" }}>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{
                  forceLabel: "Insurance Statement",
                  align: "ltr",
                }}
              />
            }
            // breadStyle={this.props.breadStyle}
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      fieldName: "form_home",
                      align: "ltr",
                    }}
                  />
                ),
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Insurance Statement ",
                      align: "ltr",
                    }}
                  />
                ),
              },
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Statement No.",
                    returnText: true,
                  }}
                />
              ),
              value: "",
              selectValue: "",

              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "frontDesk.patients",
              },
              searchName: "patients",
            }}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row inner-top-search" style={{ marginTop: 77 }}>
            <Controller
              name="hospital_id"
              control={control}
              render={({ onBlur, onChange, value }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "Branch",
                    isImp: true,
                  }}
                  selector={{
                    value: value,
                    onChange: (_, value) => onChange(value),
                    onBlur: (_, value) => onBlur(value),
                    onClear: () => setValue("hospital_id", ""),
                    name: "hospital_id",
                    className: "select-fld",
                    dataSource: {
                      textField: "hospital_name",
                      valueField: "hims_d_hospital_id",
                      data: branches,
                    },
                  }}
                  showLoading={true}
                />
              )}
            />
            <Controller
              name="hims_d_insurance_provider_id"
              control={control}
              render={({ onBlur, onChange, value }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "Insurance",
                    isImp: true,
                  }}
                  selector={{
                    value: value,
                    onChange: (_, value) => {
                      loadSubInsurance(value);
                      onChange(value);
                    },
                    onBlur: (_, value) => onBlur(value),
                    onClear: () => {
                      setValue("hims_d_insurance_provider_id", "");
                      setValue("sub_insurance_id", "");
                      setSubInsurance([]);
                    },
                    name: "hims_d_insurance_provider_id",
                    className: "select-fld",
                    dataSource: {
                      textField: "insurance_provider_name",
                      valueField: "hims_d_insurance_provider_id",
                      data: insurance,
                    },
                  }}
                  showLoading={true}
                />
              )}
            />
            <Controller
              name="sub_insurance_id"
              control={control}
              render={({ onBlur, onChange, value }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "Sub Insurance",
                    isImp: true,
                  }}
                  selector={{
                    value: value,
                    onChange: (_, value) => onChange(value),
                    onBlur: (_, value) => onBlur(value),
                    onClear: () => setValue("sub_insurance_id", ""),
                    name: "sub_insurance_id",
                    className: "select-fld",
                    disabled: !subInsurance.length,
                    dataSource: {
                      textField: "insurance_sub_name",
                      valueField: "hims_d_insurance_sub_id",
                      data: subInsurance,
                    },
                  }}
                  showLoading={true}
                />
              )}
            />
            <Controller
              name="year"
              control={control}
              render={({ onBlur, onChange, value }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-1 form-group mandatory" }}
                  label={{
                    forceLabel: "Select Year",
                    isImp: false,
                  }}
                  selector={{
                    name: "year",
                    className: "select-fld",
                    value,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: getYears(),
                    },
                    onChange: (_, value) => {
                      onChange(value);
                    },
                    onBlur: (_, value) => {
                      onBlur(value);
                    },
                    onClear: () => {
                      setValue("year", null);
                    },
                  }}
                />
              )}
            />
            <Controller
              name="month"
              control={control}
              render={({ onBlur, onChange, value }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "Select Month",
                  }}
                  selector={{
                    name: "month",
                    className: "select-fld",
                    value,
                    dataSource: {
                      textField: "text",
                      valueField: "name",
                      data: [
                        { name: "01", text: "January" },
                        { name: "02", text: "February" },
                        { name: "03", text: "March" },
                        { name: "04", text: "April" },
                        { name: "05", text: "May" },
                        { name: "06", text: "June" },
                        { name: "07", text: "July" },
                        { name: "08", text: "August" },
                        { name: "09", text: "September" },
                        { name: "10", text: "October" },
                        { name: "11", text: "November" },
                        { name: "12", text: "December" },
                      ],
                    },
                    onChange: (_, value) => {
                      onChange(value);
                    },
                    onBlur: (_, value) => {
                      onBlur(value);
                    },
                    onClear: () => {
                      setValue("month", null);
                    },
                  }}
                  showLoading={true}
                />
              )}
            />

            <div className="col form-group">
              <button
                style={{ marginTop: 19 }}
                type="submit"
                className="btn btn-primary"
              >
                Load
              </button>
            </div>
          </div>
        </form>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Insurance Statement List</h3>
            </div>
          </div>
          <div className="portlet-body" id="InsuranceStatementGrid_Cntr">
            <AlgaehDataGrid
              id="InsuranceStatementGrid"
              columns={[
                {
                  fieldName: "patient_code",
                  label: <AlgaehLabel label={{ forceLabel: "Patient Code" }} />,
                },
                {
                  fieldName: "patient_name",
                  label: <AlgaehLabel label={{ forceLabel: "Patient Name" }} />,
                  disabled: true,
                  others: {
                    resizable: false,
                    style: { textAlign: "left" },
                  },
                },
                {
                  fieldName: "doctor_name",
                  label: <AlgaehLabel label={{ forceLabel: "Doctor Name" }} />,
                  disabled: true,
                  others: {
                    resizable: false,
                    style: { textAlign: "left" },
                  },
                },
                {
                  fieldName: "invoice_no",
                  label: <AlgaehLabel label={{ forceLabel: "Invoice No." }} />,
                  disabled: true,
                  others: {
                    resizable: false,
                    style: { textAlign: "left" },
                  },
                },
                {
                  fieldName: "invoice_date",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Invoice date." }} />
                  ),
                  disabled: true,
                  others: {
                    resizable: false,
                    style: { textAlign: "left" },
                  },
                },
                {
                  fieldName: "invoice_amount",
                  label: <AlgaehLabel label={{ forceLabel: "Invoice Amt." }} />,
                  disabled: true,
                  others: {
                    resizable: false,
                    style: { textAlign: "left" },
                  },
                },
                {
                  fieldName: "co_resp_amount",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Co. Respo. Amt." }} />
                  ),
                },
                {
                  fieldName: "co_resp_tax",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Co. Respo. Tax" }} />
                  ),
                  disabled: true,
                  others: {
                    resizable: false,
                    style: { textAlign: "left" },
                  },
                },
                {
                  fieldName: "co_net_payable",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Co. Net Payble" }} />
                  ),
                },
                {
                  fieldName: "denial_amount_1",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Denial Amt. 1" }} />
                  ),
                },
                {
                  fieldName: "denial_amount_2",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Denial Amt. 2" }} />
                  ),
                },
                {
                  fieldName: "remittance_1",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Remittance Amt. 1" }} />
                  ),
                },
                {
                  fieldName: "remittance_2",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Remittance Amt. 2" }} />
                  ),
                },
              ]}
              data={{}}
              // filter={true}
              paging={{ page: 0, rowsPerPage: 20 }}
            />
          </div>{" "}
        </div>{" "}
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div className="col-5"></div>
              <div className="col-7">
                <div className="row">
                  <div className="col">
                    <label className="style_Label ">Total Claim Amount</label>
                    <h6>0.00</h6>
                  </div>{" "}
                  <div className="col">
                    <label className="style_Label ">Total Denial Amount</label>
                    <h6>0.00</h6>
                  </div>{" "}
                  <div className="col">
                    <label className="style_Label ">
                      Total Remittance Amount
                    </label>
                    <h6>0.00</h6>
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-12">
              <button className="btn bttn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
