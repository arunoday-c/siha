import React, { useContext } from "react";
import "./../../../styles/site.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  // AlgaehAutoComplete,
  MainContext,
} from "algaeh-react-components";
import { useQuery } from "react-query";

import { newAlgaehApi } from "../../../hooks";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";

function PortalToHimsList() {
  const { userToken } = useContext(MainContext);
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
      data: { from_date, to_date, corporate_id: "gamc" },
    });
    return result?.data?.records;
  }

  async function onSubmitHandler() {
    try {
      const patientList = patientData
        .filter((f) => f.checked !== false)
        .map((item) => {
          return item.portal_package_id;
        });
      const result = await newAlgaehApi({
        uri: "/laboratory/patientBillGeneration",
        module: "laboratory",
        method: "POST",
        data: { patientList },
      }).catch((error) => {
        throw error;
      });
      AlgaehMessagePop({
        display: result.data.message,
        type: "success",
      });
      refetch();
    } catch (e) {
      AlgaehMessagePop({
        display: e?.message,
        type: "error",
      });
    }
  }

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
          {/* <Controller
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
               },

                  dataSource: {
                    textField: "text",
                    valueField: "value",
                    data: [
                      { text: "Company 1", value: "" },
                      { text: "Company 2", value: "" },
                    ],
                  },
                }}
              />
            )}
          /> */}

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
                      displayTemplate: (row) => <input type="checkbox" />,
                    },

                    {
                      fieldName: "patient_name",
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
                      fieldName: "total_details_count",
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
                      fieldName: "identity_type",
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
                      fieldName: "patient_identity",
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
                      fieldName: "mobile_no",
                      label: (
                        <AlgaehLabel label={{ fieldName: "contact_number" }} />
                      ),
                      disabled: true,
                      others: {
                        width: 150,
                        resizable: false,
                        style: { textAlign: "left" },
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
            <button className="btn btn-primary" onClick={onSubmitHandler}>
              Bulk Process
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PortalToHimsList;
