import React, { useState, memo, useRef } from "react";
import { useForm } from "react-hook-form";
import { newAlgaehApi } from "../../../../hooks";
// import BatchDetails from "./BatchDetails";
// import ListofBatches from "./ListofBatches";
import {
  AlgaehLabel,
  AlgaehMessagePop,
  AlgaehDataGrid,
  AlgaehAutoComplete,
} from "algaeh-react-components";
import swal from "sweetalert2";
import "./ValidateBatch.scss";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { Controller } from "react-hook-form";
// import BatchValidationList from "./listData";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};

export default memo(function ValidateBatch() {
  //control, errors, setValue, getValues
  const { control } = useForm({
    shouldFocusError: true,
    // defaultValues: {
    //   entry_type: "R",
    // },
  });

  const [batch_number, setBatchNUmber] = useState(null);
  const [batch_list, setBatchList] = useState([]);
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  const [entry_type, setEntryType] = useState("R");
  const [currentPage, setCurrentPage] = useState(1);
  let allChecked = useRef(undefined);

  const getBatchDetail = async (data) => {
    const result = await newAlgaehApi({
      uri: "/laboratory/getBatchDetail",
      module: "laboratory",
      method: "GET",
      data: data,
    });
    return result?.data?.records;
  };
  const UpdateBatchDetail = async (data) => {
    const result = await newAlgaehApi({
      uri: "/laboratory/updateBatchDetail",
      module: "laboratory",
      method: "PUT",
      data: data,
    });
    return result?.data?.records;
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

  const onSaveAll = () => {
    const filterData = batch_list.filter((f) => f.checked);

    if (filterData.length === 0) {
      AlgaehMessagePop({
        display: "Select alteast one record.",
        type: "warning",
      });
      return;
    }
    let inpujObj = {
      batch_list: filterData,
      status: "E",
    };
    UpdateBatchDetail(inpujObj)
      .then((result) => {
        swal({
          title: "Batch Saved Successfully",
          text: batch_number,
          icon: "success",
        });

        // swal("Saved Succefully... Batch No." + batch_number, {
        //   icon: "success",
        // });
      })
      .catch((e) => {
        AlgaehMessagePop({
          display: e,
          type: "error",
        });
      });
  };

  const onValidate = () => {
    const filterData = batch_list.filter((f) => f.checked);

    debugger;
    if (filterData.length === 0) {
      AlgaehMessagePop({
        display: "Select alteast one record.",
        type: "warning",
      });
      return;
    }
    swal({
      title: `Are you sure to Validate ?`,
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
          status: "V",
        };
        UpdateBatchDetail(inpujObj)
          .then((result) => {
            swal("Validated Succefully... Batch No." + batch_number, {
              icon: "success",
            });

            setEntryType("R");
            setBatchList([]);
            setBatchNUmber(null);
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
  const onAcknowledge = () => {
    const filterData = batch_list.filter((f) => f.checked);

    if (filterData.length === 0) {
      AlgaehMessagePop({
        display: "Select alteast one record.",
        type: "warning",
      });
      return;
    }
    swal({
      title: `Are you sure to Acknowledge ?`,
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
            swal("Acknowledgeed Succefully... Batch No." + batch_number, {
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

  // const updateState = (data) => {
  //   setBatchList((result) => {
  //     result.push(data);
  //     return [...result];
  //   });
  // };

  // const deleteState = (data) => {
  //
  //   setBatchList((result) => {
  //     const _index = result.indexOf(data);
  //     result.splice(_index, 1);
  //     return [...result];
  //   });
  // };

  const batchSearch = () => {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Lab.BatchGen,
      },
      searchName: "BatchGen",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        setBatchNUmber(row.batch_number);
        getBatchDetail({
          hims_f_lab_batch_header_id: row.hims_f_lab_batch_header_id,
          entry_type: entry_type,
        })
          .then((result) => {
            // let lst = result;
            // for (let i = 0; i < 100; i++) {
            //   lst.push(result[0]);
            // }
            setBatchList(result);
          })
          .catch((e) => {
            AlgaehMessagePop({
              display: e,
              type: "error",
            });
          });
      },
    });
  };

  const selectAll = (e) => {
    debugger;
    const staus = e.target.checked;
    const myState = batch_list.map((f) => {
      return { ...f, checked: staus };
    });

    const hasUncheck = myState.filter((f) => {
      return (
        f.checked === undefined ||
        f.checked === false ||
        f.specimen_status === "A"
      );
    });

    const totalRecords = myState.length;
    setCheckAll(
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE"
    );
    setBatchList([...myState]);
  };

  const selectToGenerateBarcode = (row, e) => {
    const status = e.target.checked;
    row.checked = status;
    const records = batch_list;
    const hasUncheck = records.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });

    const totalRecords = records.length;
    let ckStatus =
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE";
    if (ckStatus === "INDETERMINATE") {
      allChecked.indeterminate = true;
    } else {
      allChecked.indeterminate = false;
    }
    setCheckAll(ckStatus);
    setBatchList([...records]);
  };

  const forceUpdate = (row) => {
    let new_batch_list = batch_list;
    let _index = new_batch_list.indexOf(row);
    new_batch_list[_index] = row;
    setBatchList(new_batch_list);
  };

  return (
    <div className="ValidateBatchScreen">
      <div className="row inner-top-search">
        <Controller
          name="entry_type"
          control={control}
          render={(props) => (
            <div className="col-3">
              <label>Batch Type</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    name="entry_type"
                    value="A"
                    checked={entry_type === "A" ? true : false}
                    type="checkbox"
                    onChange={(e) => {
                      setEntryType(e.target.value);
                      setBatchList([]);
                      setBatchNUmber(null);
                    }}
                  />
                  <span>Sample Acknowledge</span>
                </label>
                <label className="checkbox inline">
                  <input
                    name="entry_type"
                    value="R"
                    checked={entry_type === "R" ? true : false}
                    type="checkbox"
                    onChange={(e) => {
                      setEntryType(e.target.value);
                      setBatchList([]);
                      setBatchNUmber(null);
                    }}
                  />
                  <span>Result Entry</span>
                </label>
              </div>
            </div>
          )}
        />

        <div className="col-3 globalSearchCntr form-group">
          <AlgaehLabel label={{ fieldName: "Select Batch" }} />
          <h6 onClick={() => batchSearch()}>
            {batch_number ? batch_number : "------"}
            <i className="fas fa-search fa-lg" />
          </h6>
        </div>
      </div>
      <div className="row">
        {/* <BatchValidationList batch_list={batch_list} /> */}
        <div className="col-12" id="batchValidateGridCntr">
          <AlgaehDataGrid
            columns={[
              {
                label: (
                  <input
                    type="checkbox"
                    defaultChecked={checkAll === "CHECK" ? true : false}
                    ref={(input) => {
                      allChecked = input;
                    }}
                    onChange={selectAll}
                  />
                ),
                fieldName: "select",
                displayTemplate: (row) => {
                  debugger;
                  return (
                    <input
                      type="checkbox"
                      checked={row.checked}
                      disabled={
                        entry_type === "A"
                          ? row.specimen_status === "A"
                            ? true
                            : false
                          : row.lab_status === "V"
                          ? true
                          : false
                      }
                      onChange={(e) => selectToGenerateBarcode(row, e)}
                    />
                  );
                },
                others: {
                  width: 50,
                  filterable: false,
                  sortable: false,
                },
              },
              {
                fieldName: "status",
                label: <AlgaehLabel label={{ fieldName: "Status" }} />,
                displayTemplate: (row) => {
                  debugger;
                  return entry_type === "A"
                    ? row.specimen_status === "A"
                      ? "Acknowledge"
                      : "Not Acknowledge"
                    : row.lab_status === "V"
                    ? "Validated"
                    : "Not Validated";
                },
                // filterable: true,
                sortable: true,
              },
              {
                fieldName: "full_name",
                label: <AlgaehLabel label={{ fieldName: "Patient Name" }} />,
                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
              {
                fieldName: "primary_id_no",
                label: <AlgaehLabel label={{ forceLabel: "Patient ID" }} />,

                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
              {
                fieldName: "lab_id_number",

                label: <AlgaehLabel label={{ forceLabel: "Lab ID Number" }} />,

                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
              {
                fieldName: "result",
                label: <AlgaehLabel label={{ fieldName: "result" }} />,
                displayTemplate: (row) => {
                  return row.lab_status === "V" ? (
                    row.result
                  ) : (
                    <span>
                      <AlgaehAutoComplete
                        div={{ className: "noLabel" }}
                        selector={{
                          name: "result",
                          className: "select-fld",
                          value: row.result === null ? "" : row.result,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: [
                              {
                                name: "Negative",
                                value: "Negative",
                              },
                              {
                                name: "Positive",
                                value: "Positive",
                              },
                              {
                                name: "Not Seen",
                                value: "Not Seen",
                              },
                              {
                                name: "Reactive",
                                value: "Reactive",
                              },
                              {
                                name: "Non-Reactive",
                                value: "Non-Reactive",
                              },
                            ],
                          },
                          updateInternally: true,
                          onChange: (e, value) => {
                            row.result = value;
                            forceUpdate(row);
                          },
                          onClear: (e) => {
                            forceUpdate(row);
                          },
                        }}
                      />
                    </span>
                  );
                },
              },
              {
                fieldName: "test_name",
                label: <AlgaehLabel label={{ fieldName: "Test Name" }} />,
                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
              {
                fieldName: "specimen_name",
                label: <AlgaehLabel label={{ fieldName: "Specimen" }} />,
                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
              {
                fieldName: "specimen_name",
                label: <AlgaehLabel label={{ fieldName: "Specimen" }} />,
                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
              {
                fieldName: "analyte_name",
                label: <AlgaehLabel label={{ fieldName: "Analyte Name" }} />,
                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
            ]}
            data={batch_list}
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

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            {entry_type === "R" ? (
              <>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginLeft: 10 }}
                  onClick={onValidate}
                  disabled={batch_list.length > 0 ? false : true}
                >
                  Validate All
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginLeft: 10 }}
                  onClick={onSaveAll}
                  disabled={batch_list.length > 0 ? false : true}
                >
                  Save All
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginLeft: 10 }}
                onClick={onAcknowledge}
                disabled={batch_list.length > 0 ? false : true}
              >
                Acknowledge All
              </button>
            )}

            <button
              onClick={() => {
                setEntryType("R");
                setBatchList([]);
                setBatchNUmber(null);
              }}
              className="btn btn-default"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
