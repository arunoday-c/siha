import React, { useContext } from "react";
import "./../../../styles/site.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  AlgaehAutoComplete,
  MainContext,
} from "algaeh-react-components";
import { useQuery } from "react-query";

import { newAlgaehApi } from "../../../hooks";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";

function HassanNumber() {
  const { userToken } = useContext(MainContext);
  console.log("userToken", userToken);

  const {
    control,
    errors,
    // register,
    reset,
    // handleSubmit,
    // // setValue,
    getValues,
    // watch,
  } = useForm({
    defaultValues: {
      hospital_id: userToken.hims_d_hospital_id,
      start_date: [moment(new Date()), moment(new Date())],
    },
  });

  const { data: patientData, refetch } = useQuery(
    ["patientPortalData"],
    patientPortalData,
    {
      onSuccess: (data) => {
        debugger;
        // debugger;
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function patientPortalData(key) {
    const date = getValues().start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");

    const result = await newAlgaehApi({
      uri: "/laboratory/patientPortalData",
      module: "laboratory",
      method: "GET",
      data: { from_date, to_date, status: "V" },
    });
    return result?.data?.records;
  }

  // useEffect(() => {
  //   if (accountsForDash?.length >= 4) {
  //     const expenseAccount = accountsForDash.filter((f) => f.root_id === 5);
  //     if (expenseAccount.length > 0) {
  //       const expense =
  //         parseFloat(
  //           expenseAccount[0].amount ? expenseAccount[0].amount : 0.0
  //         ) / parseInt(days);
  //       setAvgMtdExpense(expense);
  //     }
  //     const incomeAccount = accountsForDash.filter((f) => f.root_id === 4);
  //     if (incomeAccount.length) {
  //       const income =
  //         parseFloat(incomeAccount[0].amount ? incomeAccount[0].amount : 0.0) /
  //         parseInt(days);
  //       setAvgMtdIncome(income);
  //     }
  //   }
  // }, [days, accountsForDash]);
  // async function getOrganization(key) {
  //   const result = await newAlgaehApi({
  //     uri: "/organization/getOrganizationByUser",
  //     method: "GET",
  //   });
  //   return result?.data?.records;
  // }

  return (
    <>
      <div className="hptl-phase1-result-entry-form">
        <div className="row inner-top-search" style={{ paddingBottom: "10px" }}>
          <Controller
            control={control}
            name="start_date"
            rules={{
              required: {
                message: "Field is Required",
              },
            }}
            render={({ onChange, value }) => (
              <AlgaehDateHandler
                div={{ className: "col-3" }}
                label={{
                  forceLabel: "From And To Date",
                  isImp: true,
                }}
                error={errors}
                textBox={{
                  className: "txt-fld",
                  name: "start_date",
                  value,
                }}
                type="range"
                // others={{ disabled }}
                events={{
                  onChange: (mdate) => {
                    if (mdate) {
                      onChange(mdate);

                      refetch();
                    } else {
                      onChange(undefined);
                    }
                  },
                  onClear: () => {
                    onChange(undefined);
                  },
                }}
              />
            )}
          />
          <Controller
            name="nphies_status"
            control={control}
            rules={{ required: "Select Company" }}
            render={({ value, onChange }) => (
              <AlgaehAutoComplete
                div={{ className: "col-4 form-group mandatory" }}
                label={{
                  forceLabel: "Filter by Company",
                  isImp: true,
                }}
                error={errors}
                selector={{
                  className: "form-control",
                  name: "nphies_status",
                  value,
                  onChange: (_, selected) => {
                    onChange(selected);

                    // setValue("service_amount", _.standard_fee);
                  },

                  dataSource: {
                    textField: "text",
                    valueField: "value",
                    data: [
                      { text: "Company 1", value: "" },
                      { text: "Company 2", value: "" },
                    ],
                  },
                  // others: {
                  //   disabled:
                  //     current.request_status === "APR" &&
                  //     current.work_status === "COM",
                  //   tabIndex: "4",
                  // },
                }}
              />
            )}
          />

          <div className="col" style={{ marginTop: "21px" }}>
            <button
              className="btn btn-default btn-sm"
              type="button"
              onClick={() => {
                reset({ start_date: [moment(new Date()), moment(new Date())] });
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{ marginLeft: "10px" }}
              type="button"
            >
              Load
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Portal Lab List</h3>
                </div>
              </div>
              <div className="portlet-body" id="resultListEntryCntr">
                <AlgaehDataGrid
                  id="samplecollection_grid"
                  columns={[
                    {
                      label: <input type="checkbox" />,
                      fieldName: "select",

                      others: {
                        width: 30,
                        filterable: false,
                        sortable: false,
                      },
                    },
                    {
                      fieldName: "run_types",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Company Name" }} />
                      ),

                      disabled: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_name" }} />
                      ),
                      disabled: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "left" },
                      },
                    },
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "No. of Tests" }} />
                      ),

                      disabled: true,
                      others: {
                        width: 110,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "primary_id_no",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Primary ID Type" }}
                        />
                      ),
                      disabled: false,
                      others: {
                        width: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "primary_id_no",
                      label: (
                        <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                      ),
                      disabled: false,
                      others: {
                        width: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "nationality" }} />
                      ),
                      disabled: true,
                      others: {
                        width: 150,
                        resizable: false,
                        style: { textAlign: "left" },
                      },
                    },
                    {
                      fieldName: "contact_number",
                      label: (
                        <AlgaehLabel label={{ fieldName: "contact_number" }} />
                      ),
                      disabled: true,
                      others: {
                        width: 150,
                        resizable: false,
                        style: { textAlign: "left" },
                      },
                      displayTemplate: (row) => {
                        return `${row.tel_code}-${row.contact_number}`;
                      },
                    },
                  ]}
                  keyId="patient_code"
                  data={patientData ?? []}
                  isEditable={"editOnly"}
                  events={{
                    onSave: (row) => {},
                  }}
                  isFilterable={true}
                  pagination={true}
                  noDataText="No data available for selected period"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              className="btn btn-primary"

              // onClick={}
            >
              Bulk Process
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HassanNumber;
