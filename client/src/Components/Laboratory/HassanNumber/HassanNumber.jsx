import React, { useContext, useState, useEffect } from "react";
import swal from "sweetalert2";
import "./HassanNumber.scss";
import "./../../../styles/site.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  MainContext,
  AlgaehFormGroup,
} from "algaeh-react-components";

import { algaehApiCall } from "../../../utils/algaehApiCall";
import { useQuery, useMutation } from "react-query";
import { newAlgaehApi } from "../../../hooks";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
function HassanNumber() {
  const { userToken } = useContext(MainContext);
  const [enabledHESN, setEnabledHESN] = useState(false);
  const [hassanShow, setHassanShow] = useState("all");
  const { control, errors, reset, getValues } = useForm({
    defaultValues: {
      hospital_id: userToken.hims_d_hospital_id,
      start_date: [moment(new Date()), moment(new Date())],
    },
  });
  useEffect(() => {
    setEnabledHESN(true);
  }, []);
  const { data: labOrdersPCR } = useQuery(
    ["getHESNServicesData", { hassanShow: hassanShow }],
    getHESNServicesData,
    {
      // initialStale: true,
      cacheTime: Infinity,
      enabled: enabledHESN,
      onSuccess: (data) => {
        setEnabledHESN(false);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getHESNServicesData(key, { hassanShow }) {
    const date = getValues().start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");

    const result = await newAlgaehApi({
      uri: "/laboratory/getHESNServices",
      module: "laboratory",
      method: "GET",
      data: {
        from_date,
        to_date,
        hassanShow,
      },
    });
    return result?.data?.records;
  }

  async function update(input = {}) {
    const res = await newAlgaehApi({
      uri: "/laboratory/updateHassanNo",
      module: "laboratory",
      method: "PUT",
      data: input,
    });
    return res?.data?.records;
  }
  const [updateHassanNo] = useMutation(update, {
    onSuccess: (data) => {
      setEnabledHESN(true);
      AlgaehMessagePop({
        type: "success",
        display: "HESN No Updated successfully",
      });
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });

  const generateHesnStatusReport = () => {
    const date = getValues().start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");
    algaehApiCall({
      // uri: "/report",
      uri: "/excelReport",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "hesnStatusReport",
          pageOrentation: "landscape",
          excelTabName: "HESN Status Report",
          excelHeader: false,
          reportParams: [
            {
              name: "from_date",
              value: from_date,
            },
            {
              name: "to_date",
              value: to_date,
            },
            {
              name: "hassanShow",
              value: hassanShow,
            },
          ],
          outputFileType: "EXCEL", //"EXCEL", //"PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = urlBlob;
        a.download = `Audit Log Report.${"xlsx"}`;
        a.click();

        // const urlBlob = URL.createObjectURL(res.data);
        // const origin = `${
        //   window.location.origin
        // }/reportviewer/web/viewer.html?file=${urlBlob}&filename=${
        //   $this.state.inputs.hospital_name
        // } Leave and Airfare Reconciliation - ${moment(
        //   $this.state.inputs.month,
        //   "MM"
        // ).format("MMM")}-${$this.state.inputs.year}`;
        // window.open(origin);
      },
    });
  };
  const generatePCRPOsitiveReport = () => {
    const date = getValues().start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");
    algaehApiCall({
      // uri: "/report",
      uri: "/excelReport",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "pcrPositiveReport",
          pageOrentation: "landscape",
          excelTabName: "PCR Positive Report",
          excelHeader: false,
          reportParams: [
            {
              name: "from_date",
              value: from_date,
            },
            {
              name: "to_date",
              value: to_date,
            },
          ],
          outputFileType: "EXCEL", //"EXCEL", //"PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = urlBlob;
        a.download = `PCR Positive Report.${"xlsx"}`;
        a.click();

        // const urlBlob = URL.createObjectURL(res.data);
        // const origin = `${
        //   window.location.origin
        // }/reportviewer/web/viewer.html?file=${urlBlob}&filename=${
        //   $this.state.inputs.hospital_name
        // } Leave and Airfare Reconciliation - ${moment(
        //   $this.state.inputs.month,
        //   "MM"
        // ).format("MMM")}-${$this.state.inputs.year}`;
        // window.open(origin);
      },
    });
  };

  return (
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
                forceLabel: "ORDERED DATE & TIME",
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

        <div className="col">
          <label>Filter By</label>
          <div className="customRadio">
            <label className="radio inline">
              <input
                type="radio"
                value="all"
                name="hassanShow"
                checked={hassanShow === "all" ? true : false}
                onChange={(e) => {
                  setHassanShow(e.target.value);
                }}
              />
              <span>All</span>
            </label>

            <label className="radio inline">
              <input
                type="radio"
                value="withhassan"
                checked={hassanShow === "withhassan" ? true : false}
                name="hassanShow"
                onChange={(e) => {
                  setHassanShow(e.target.value);
                }}
              />
              <span>with HESN No.</span>
            </label>
            <label className="radio inline">
              <input
                type="radio"
                value="withOuthassan"
                checked={hassanShow === "withOuthassan" ? true : false}
                name="hassanShow"
                onChange={(e) => {
                  setHassanShow(e.target.value);
                }}
              />
              <span>without HESN No.</span>
            </label>
          </div>
        </div>

        <div className="col" style={{ marginTop: "21px" }}>
          <button
            className="btn btn-default btn-sm"
            type="button"
            onClick={() => {
              reset({ start_date: [moment(new Date()), moment(new Date())] });
              setHassanShow("all");
            }}
          >
            Clear
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginLeft: "10px" }}
            type="button"
            onClick={() => {
              setEnabledHESN(true);
            }}
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
                <h3 className="caption-subject">HESN PCR List</h3>
              </div>
            </div>

            <div className="portlet-body" id="resultListEntryCntr">
              <AlgaehDataGrid
                id="samplecollection_grid"
                columns={[
                  {
                    fieldName: "ordered_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "ordered_date" }} />
                    ),
                    // displayTemplate: (row) => {
                    //   return (
                    //     <span>{this.changeDateFormat(row.ordered_date)}</span>
                    //   );
                    // },
                    disabled: true,
                    sortable: true,
                    filterable: true,
                    others: {
                      maxWidth: 150,
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.ordered_date;
                    },
                  },

                  {
                    fieldName: "lab_id_number",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Lab ID Number" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      maxWidth: 130,
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.lab_id_number;
                    },
                  },
                  {
                    fieldName: "primary_id_no",
                    label: (
                      <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: false,
                    others: {
                      maxWidth: 150,
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.primary_id_no;
                    },
                  },
                  {
                    fieldName: "patient_code",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_code" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: false,
                    others: {
                      maxWidth: 150,
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.patient_code;
                    },
                  },
                  {
                    fieldName: "full_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_name" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      minWidth: 250,
                      style: { textAlign: "left" },
                    },
                    editorTemplate: (row) => {
                      return row.full_name;
                    },
                  },

                  {
                    fieldName: "hassan_number",
                    label: <AlgaehLabel label={{ forceLabel: "HESN No." }} />,
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                      maxWidth: 150,
                    },
                    editorTemplate: (row) => {
                      return (
                        <AlgaehFormGroup
                          div={{ className: "" }}
                          label={
                            {
                              // forceLabel: "BED NO.",
                              // isImp: true,
                            }
                          }
                          textBox={{
                            type: "text",
                            value: row.hassan_number,
                            className: "form-control",
                            name: "hassan_number",
                            updateInternally: true,
                            onChange: (e) => {
                              if (e.target.value) row["isDirty"] = true;
                              row.hassan_number = e.target.value;
                            },
                          }}
                        />
                      );
                    },
                  },

                  {
                    fieldName: "haasan_updated_by_name",
                    label: <AlgaehLabel label={{ forceLabel: "Updated By" }} />,
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.haasan_updated_by_name;
                    },
                  },

                  {
                    fieldName: "hassan_number_updated_date",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Updated Date" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.hassan_number_updated_date;
                    },
                  },
                  {
                    fieldName: "hesn_upload",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "File Updated in HESN" }}
                      />
                    ),
                    displayTemplate: (row) => {
                      return (
                        <span>{row.hesn_upload === "Y" ? "YES" : "NO"}</span>
                      );
                    },
                    editorTemplate: (row) => {
                      return (
                        <input
                          type="checkbox"
                          defaultChecked={
                            row.hesn_upload === "Y" ? true : false
                          }
                          onChange={(e) => {
                            const status = e.target.checked;
                            row["hesn_upload"] = status === true ? "Y" : "N";
                            row["isDirtyUpdate"] = true;
                            // row.update();
                          }}
                        />
                      );
                    },
                    others: {
                      // minWidth: 130,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "hesn_upload_updated_by_name",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Uploaded By" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.hesn_upload_updated_by_name;
                    },
                  },
                  {
                    fieldName: "hesn_upload_updated_date",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Uploaded Date" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.hesn_upload_updated_date;
                    },
                  },
                  {
                    fieldName: "service_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "service_name" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      minWidth: 250,
                      style: { textAlign: "left" },
                    },
                    editorTemplate: (row) => {
                      return row.service_name;
                    },
                  },
                ]}
                keyId="patient_code"
                data={labOrdersPCR}
                isEditable={"editOnly"}
                events={{
                  onSave: (row) => {
                    if (row.isDirty || row.isDirtyUpdate) {
                      swal({
                        title: "Please Confirm!",
                        html:
                          "Name: " +
                          row.full_name +
                          "<br/><br/> ID No.:" +
                          row.primary_id_no +
                          "<br/><br/> HESN No.: " +
                          (row.hassan_number ? row.hassan_number : ""),
                        //  +
                        // "<br/> File Updated in HESN:" +
                        // row.hesn_upload,

                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        confirmButtonColor: "#44b8bd",
                        cancelButtonColor: "#d33",
                        cancelButtonText: "No",
                      }).then((willProceed) => {
                        if (willProceed.value) {
                          updateHassanNo(row);
                        } else {
                          setEnabledHESN(true);
                        }
                      });
                    } else {
                      AlgaehMessagePop({
                        type: "warning",
                        display: "Nothing to Update",
                      });
                      return;
                    }
                  },
                }}
                isFilterable={true}
                pagination={true}
                noDataText="No data available for selected period"
                // paging={{ page: 0, rowsPerPage: 20 }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              type="button"
              className="btn btn-default"
              onClick={generateHesnStatusReport}
            >
              <AlgaehLabel label={{ forceLabel: "Export as Excel" }} />
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={generatePCRPOsitiveReport}
            >
              <AlgaehLabel label={{ forceLabel: "PCR Positive Report" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HassanNumber;
