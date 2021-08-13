import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "react-query";

import Options from "../../../Options.json";
import "./AccessionAcknowledgement.scss";
import "./../../../styles/site.scss";
import { newAlgaehApi } from "../../../hooks";
import { AcceptandRejectSample } from "./AccessionAcknowledgementHandaler";
import { Checkbox } from "algaeh-react-components";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  MainContext,
  Tooltip,
  Modal,
} from "algaeh-react-components";
import swal from "sweetalert2";
// import Enumerable from "linq";
import moment from "moment";
import sockets from "../../../sockets";
import { Controller, useForm } from "react-hook-form";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};
const { confirm } = Modal;

export default function AccessionAcknowledgement() {
  const { userToken } = useContext(MainContext);

  const { control, errors, reset, getValues } = useForm({
    defaultValues: {
      hospital_id: userToken.hims_d_hospital_id,
      start_date: [moment(new Date()), moment(new Date())],
    },
  });
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  const [isOpen, setIsOpen] = useState(false);
  const [sample_collection, setSample_collection] = useState([]);
  const [selected_row, setSelectedRow] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    sockets.on("reload_specimen_collection", (billData) => {
      const { bill_date } = billData;
      const date = new Date(moment(bill_date).format("YYYY-MM-DD"));
      const start = new Date(
        moment(getValues().from_date).format("YYYY-MM-DD")
      );
      const end = new Date(moment(getValues().to_date).format("YYYY-MM-DD"));

      if (date >= start && date <= end) {
        refetch();
      } else {
        return;
      }
    });
  }, []);
  const { refetch } = useQuery(
    ["getLabOrderedServices", {}],
    getLabOrderedServices,
    {
      onSuccess: (data) => {
        setSample_collection(data.filter((f) => f.status !== "O"));
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getLabOrderedServices(key) {
    const date = getValues().start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");

    const result = await newAlgaehApi({
      uri: "/laboratory/getLabOrderedServices",
      module: "laboratory",
      method: "GET",
      data: {
        hospital_id: getValues().hospital_id,
        from_date,
        to_date,
      },
    });
    return result?.data?.records;
  }
  const selectAll = (e) => {
    const stats = e.target.checked === true ? "Y" : "N";
    let myState = [];
    debugger;
    myState = sample_collection.map((f) => {
      return { ...f, checked: stats };
    });
    setCheckAll(stats === "Y" ? STATUS.CHECK : STATUS.UNCHECK);
    setSample_collection([...myState]);
    // const myState = portalState.gridData.map((f) => {
    //   return { ...f, checked: stats, isDirty: stats === "Y" ? true : false };
    // });

    // const hasUncheck = myState.filter((f) => {
    //   return f.checked === undefined || f.checked === "N";
    // });

    // const totalRecords = myState.length;
    // setCheckAll(
    //   totalRecords === hasUncheck.length
    //     ? "UNCHECK"
    //     : hasUncheck.length === 0
    //     ? "CHECK"
    //     : "INDETERMINATE"
    // );
    // setPortalState({ ...portalState, gridData: [...myState] });
  };

  // let _Ordered = [];

  // let _Collected = [];

  // let _Confirmed = [];
  // let _Validated = [];
  // let _Cancelled = [];
  // if (sample_collection?.length > 0 && sample_collection !== undefined) {
  //   _Ordered = sample_collection.filter((f) => {
  //     return f.status === "O";
  //   });

  //   _Collected = sample_collection.filter((f) => {
  //     return f.status === "CL";
  //   });

  //   _Validated = sample_collection.filter((f) => {
  //     return f.status === "V";
  //   });
  //   _Confirmed = sample_collection.filter((f) => {
  //     return f.status === "CF";
  //   });

  //   _Cancelled = sample_collection.filter((f) => {
  //     return f.status === "CN";
  //   });
  // }
  const changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };
  const AckBatchDetail = async (data) => {
    const result = await newAlgaehApi({
      uri: "/laboratory/bulkSampleAcknowledge",
      module: "laboratory",
      method: "PUT",
      data: data,
    });
    return result?.data?.records;
  };
  const onSubmit = (selected_row, strAccRej, e) => {
    // debugger;
    e.persist();
    if (strAccRej === "R") {
      if (remarks === "") {
        AlgaehMessagePop({
          display: "Remarks is mandatory",
          type: "error",
        });
        return;
      }
    }

    const strMessage = strAccRej === "R" ? "Reject" : "Acknowledge";

    confirm({
      okText: "OK",
      okType: "primary",
      icon: "",
      title: "",
      content: "Are you sure you want to " + strMessage,

      maskClosable: true,
      onOk: async () => {
        try {
          let inputobj = {
            test_id: selected_row.test_id,
            hims_d_lab_sample_id: selected_row.hims_d_lab_sample_id,
            order_id: selected_row.hims_f_lab_order_id,
            sample_id: selected_row.sample_id,
            patient_id: selected_row.patient_id,
            visit_id: selected_row.visit_id,
            date_of_birth: selected_row.date_of_birth,
            gender: selected_row.gender,
            barcode_gen: selected_row.barcode_gen,
            remarks: remarks,
            status: strAccRej,
            portal_exists: userToken?.portal_exists,
          };
          const after_ack = await AcceptandRejectSample(inputobj).catch(
            (error) => {
              throw error;
            }
          );
          if (after_ack.success === false) {
            AlgaehMessagePop({
              display: after_ack.result,
              type: "error",
            });
            return;
          }
          setRemarks("");
          setIsOpen(false);
          refetch();
          if (sockets.connected) {
            sockets.emit("result_entry", {
              collected_date: new Date(),
            });
          }
          AlgaehMessagePop({
            type: "success",
            display: "Done Succesfully",
          });
          // await AcceptandRejectSample(inputobj);
        } catch (e) {
          AlgaehMessagePop({
            type: "error",
            display: e.message,
          });
        }
      },
    });
  };
  const onAcknowledge = () => {
    const filterData = sample_collection.filter(
      (f) => f.checked && f.sample_status !== "A"
    );

    if (filterData.length === 0) {
      AlgaehMessagePop({
        display: "Select at-least one record or All Records are  ",
        type: "warning",
      });
      return;
    }
    swal({
      title: `Are you sure to Acknowledge?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willProceed) => {
      if (willProceed.value) {
        let inpujObj = {
          batch_list: filterData,
        };
        AckBatchDetail(inpujObj)
          .then((result) => {
            refetch();
            // swal("Acknowledged Succefully... Batch No." + batch_number, {
            //   icon: "success",
            // });

            swal({
              title: "Batch Acknowledged Successfully",
              icon: "success",
            });
          })
          .catch((e) => {
            AlgaehMessagePop({
              display: e,
              type: "error",
            });
          });
      }
    });
  };
  const gridData = sample_collection.filter((f) => f.sample_status !== "A");
  return (
    <React.Fragment>
      <Modal
        title="Remarks"
        visible={isOpen}
        class="accessionRemarkPopUp"
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        <div className="popupInner">
          <div className="col-12">
            <label>Reason for Rejection</label>
            <textarea
              className="textArea"
              name="remarks"
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="popupFooter">
          <div className="col-12">
            <button
              onClick={(e) => onSubmit(selected_row, "R", e)}
              type="button"
              className="btn btn-primary"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              type="button"
              className="btn btn-default"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div className="hptl-phase1-accession-acknowledgement-form">
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
              onClick={() => {
                // setEnabledHESN(true)
                refetch();
              }}
            >
              Load
            </button>
          </div>
        </div>
        {/* <div className="row  margin-bottom-15 topResultCard">
          <div className="col-12">
            <div className="card-group">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Collected.length}</h5>
                  <p className="card-text">
                    <span className="badge badge-secondary">Collected</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Confirmed.length}</h5>
                  <p className="card-text">
                    <span className="badge badge-primary">Confirmed</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Cancelled.length}</h5>
                  <p className="card-text">
                    <span className="badge badge-danger">Cancelled</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Validated.length}</h5>
                  <p className="card-text">
                    <span className="badge badge-success">Validated</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Specimen Acknowledgement List
                  </h3>
                </div>
              </div>

              <div className="portlet-body" id="accessionAcknoweldgeGrid">
                <AlgaehDataGrid
                  // id="accessionAcknoweldgeGrid"
                  columns={[
                    {
                      label: (
                        <Checkbox
                          indeterminate={checkAll === STATUS.INDETERMINATE}
                          checked={checkAll === STATUS.CHECK}
                          onChange={selectAll}
                          disabled={gridData.length > 0 ? false : true}
                        ></Checkbox>
                      ),
                      fieldName: "select",
                      displayTemplate: (row) => {
                        return (
                          <CheckBoxPlot
                            row={row}
                            fullData={sample_collection ?? []}
                            setCheckAll={setCheckAll}
                          />
                        );
                      },
                      others: {
                        maxWidth: 50,
                        filterable: false,
                        sortable: false,
                      },
                    },
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            <Tooltip
                              title="Accept Specimen"
                              placement={"right"}
                            >
                              <i
                                style={{
                                  pointerEvents:
                                    row.sample_status === "A" ? "none" : "",

                                  opacity:
                                    row.sample_status === "A" ? "0.1" : "",
                                }}
                                className="fa fa-check"
                                aria-hidden="true"
                                onClick={(e) => onSubmit(row, "A", e)}
                              />
                            </Tooltip>
                            <Tooltip
                              title="Reject Specimen"
                              placement={"right"}
                            >
                              <i
                                style={{
                                  pointerEvents:
                                    row.sample_status === "A" ? "none" : "",

                                  opacity:
                                    row.sample_status === "A" ? "0.1" : "",
                                }}
                                className="fa fa-times"
                                aria-hidden="true"
                                onClick={() => {
                                  setIsOpen(!isOpen);
                                  setSelectedRow(row);
                                }}
                              />
                            </Tooltip>
                          </span>
                        );
                      },
                      others: {
                        width: 100,

                        style: { textAlign: "center" },
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "ordered_date" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>{changeDateFormat(row.ordered_date)}</span>
                        );
                      },
                      disabled: true,
                      others: {
                        width: 180,

                        style: { textAlign: "center" },
                      },
                      filterable: true,
                      filterType: "date",
                      sortable: true,
                    },

                    {
                      fieldName: "test_type",
                      label: <AlgaehLabel label={{ fieldName: "proiorty" }} />,
                      displayTemplate: (row) => {
                        return row.test_type === "S" ? (
                          <span className="badge badge-danger">Stat</span>
                        ) : (
                          <span className="badge badge-secondary">Routine</span>
                        );
                      },
                      disabled: true,
                      filterable: true,
                      filterType: "choices",
                      choices: [
                        {
                          name: "Stat",
                          value: "S",
                        },
                        {
                          name: "Routine",
                          value: "R",
                        },
                      ],
                      others: {
                        width: 90,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "Specimen",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: (row) => {
                        return row.status === "CL" ? (
                          <span className="badge badge-secondary">
                            Collected
                          </span>
                        ) : row.status === "CN" ? (
                          <span className="badge badge-danger">Cancelled</span>
                        ) : row.status === "CF" ? (
                          <span className="badge badge-primary">Confirmed</span>
                        ) : (
                          <span className="badge badge-success">Validated</span>
                        );
                      },
                      disabled: true,
                      filterable: true,
                      filterType: "choices",
                      choices: [
                        {
                          name: "Collected",
                          value: "CL",
                        },
                        {
                          name: "Cancelled",
                          value: "CN",
                        },
                        {
                          name: "Confirmed",
                          value: "CF",
                        },
                        {
                          name: "Validated",
                          value: "V",
                        },
                      ],
                      others: {
                        width: 90,

                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "sample_status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Specimen Ack." }} />
                      ),
                      displayTemplate: (row) => {
                        return row.sample_status === "N" ? (
                          <span className="badge badge-warning">Pending</span>
                        ) : row.sample_status === "A" ? (
                          <span className="badge badge-success">Accepted</span>
                        ) : row.sample_status === "R" ? (
                          <span className="badge badge-danger">Rejected</span>
                        ) : null;
                      },
                      disabled: true,
                      sortable: true,
                      filterable: true,
                      filterType: "choices",
                      choices: [
                        {
                          name: "Pending",
                          value: "N",
                        },
                        {
                          name: "Accepted",
                          value: "A",
                        },
                      ],
                      others: {
                        width: 140,

                        style: { textAlign: "center" },
                      },
                    },

                    {
                      fieldName: "lab_id_number",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Lab ID Number" }} />
                      ),
                      disabled: true,
                      sortable: true,
                      filterable: true,
                      others: {
                        width: 140,

                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "primary_id_no",
                      label: (
                        <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                      ),
                      disabled: false,
                      sortable: true,
                      filterable: true,
                      others: {
                        width: 150,

                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      ),
                      disabled: false,
                      sortable: true,
                      filterable: true,
                      others: {
                        width: 150,

                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_name" }} />
                      ),
                      disabled: true,
                      sortable: true,
                      filterable: true,
                      others: {
                        style: { textAlign: "left" },
                      },
                    },
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Test Name" }} />
                      ),

                      disabled: true,
                      sortable: true,
                      filterable: true,
                      others: {
                        style: { textAlign: "center" },
                      },
                    },
                  ]}
                  keyId="patient_code"
                  data={sample_collection ?? []}
                  pagination={true}
                  pageOptions={{ rows: 50, page: currentPage }}
                  pageEvent={(page) => {
                    setCurrentPage(page);
                  }}
                  isFilterable={true}
                  noDataText="No data available for selected period"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginLeft: 10 }}
                onClick={onAcknowledge}
                disabled={gridData.length > 0 ? false : true}
              >
                Acknowledge All
              </button>

              {/* <button
              onClick={() => {
                setEntryType("R");
                setBatchList([]);
                setBatchNUmber(null);
              }}
              className="btn btn-default"
            >
              Clear
            </button> */}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

/**
 * For checkboxes
 * @param {row} Object
 * @param {fullData} Array
 * @returns Component
 */
function CheckBoxPlot({ row, fullData, setCheckAll }) {
  const [checked, setChecked] = useState("N");
  useEffect(() => {
    setChecked(row.checked);
  }, [row.checked]);
  return (
    <input
      type="checkbox"
      checked={checked === "Y" ? true : false}
      onChange={(e) => {
        const check = e.target.checked === true ? "Y" : "N";

        if (row.id) {
          row.isDirty = true;
        }
        row.checked = check;

        const hasUncheck = fullData.filter((f) => {
          return f.checked === undefined || f.checked === "N";
        });
        const hasChecks = fullData.filter((f) => f.checked === "Y");
        setCheckAll(
          fullData.length === hasChecks.length
            ? STATUS.CHECK
            : fullData.length === hasUncheck.length
            ? STATUS.UNCHECK
            : STATUS.INDETERMINATE
        );
        setChecked(check);
      }}
      disabled={row.sample_status === "A"}
    />
  );
}
React.memo(CheckBoxPlot);
