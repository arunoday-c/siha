import React, { useState, memo } from "react";
import { useForm } from "react-hook-form";
import { newAlgaehApi } from "../../../../hooks";
// import BatchDetails from "./BatchDetails";
// import ListofBatches from "./ListofBatches";
import {
  AlgaehLabel,
  AlgaehMessagePop,
  // AlgaehDataGrid,
  // AlgaehAutoComplete,
} from "algaeh-react-components";
import swal from "sweetalert2";
import "./ValidateBatch.scss";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { Controller } from "react-hook-form";
import BatchValidationList from "./listData";
// const STATUS = {
//   CHECK: true,
//   UNCHECK: false,
//   INDETERMINATE: true,
// };

export default memo(function ValidateBatch() {
  //control, errors, setValue, getValues
  const { reset, control, setValue, getValues } = useForm({
    shouldFocusError: true,
    defaultValues: {
      entry_type: "R",
    },
  });

  const [batch_number, setBatchNUmber] = useState(null);
  const [batch_list, setBatchList] = useState([]);
  // const [checkAll ,setCheckAll] = useState(STATUS.UNCHECK);
  // let allChecked = useRef(undefined);

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
      uri: "/laboratory/createPCRBatch",
      module: "laboratory",
      method: "POST",
      data: data,
    });
    return result?.data?.records;
  };

  const onSaveAll = () => {
    let inpujObj = {
      batch_list: batch_list,
      status: "S",
    };
    UpdateBatchDetail(inpujObj)
      .then((result) => {
        swal("Batch Saved Succefully... Batch No." + batch_number, {
          icon: "success",
        });
      })
      .catch((e) => {
        AlgaehMessagePop({
          display: e,
          type: "error",
        });
      });
  };

  const onValidate = () => {
    let inpujObj = {
      batch_list: batch_list,
      status: "S",
    };
    UpdateBatchDetail(inpujObj)
      .then((result) => {
        swal("Batch Validated Succefully... Batch No." + batch_number, {
          icon: "success",
        });
      })
      .catch((e) => {
        AlgaehMessagePop({
          display: e,
          type: "error",
        });
      });
  };

  // const updateState = (data) => {
  //   setBatchList((result) => {
  //     result.push(data);
  //     return [...result];
  //   });
  // };

  // const deleteState = (data) => {
  //   debugger;
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
          entry_type: getValues("entry_type"),
        })
          .then((result) => {
            // const new_batch_list = batch_list;
            // console.log("new_batch_list", new_batch_list);
            //For testing need to remove this
            let lst = result;
            for (let i = 0; i < 100; i++) {
              lst.push(result[0]);
            }
            setBatchList(lst);
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

  // const selectAll = (e) => {
  //   const staus = e.target.checked;
  //   const myState = batch_list.map((f) => {
  //     return { ...f, checked: staus };
  //   });

  //   const hasUncheck = myState.filter((f) => {
  //     return f.checked === undefined || f.checked === false;
  //   });

  //   const totalRecords = myState.length;
  //   setCheckAll(
  //     totalRecords === hasUncheck.length
  //       ? "UNCHECK"
  //       : hasUncheck.length === 0
  //       ? "CHECK"
  //       : "INDETERMINATE"
  //   );
  //   setBatchList([...myState]);
  // };

  // const selectToGenerateBarcode = (row, e) => {
  //   const status = e.target.checked;
  //   row.checked = status;
  //   const records = batch_list;
  //   const hasUncheck = records.filter((f) => {
  //     return f.checked === undefined || f.checked === false;
  //   });

  //   const totalRecords = records.length;
  //   let ckStatus =
  //     totalRecords === hasUncheck.length
  //       ? "UNCHECK"
  //       : hasUncheck.length === 0
  //       ? "CHECK"
  //       : "INDETERMINATE";
  //   if (ckStatus === "INDETERMINATE") {
  //     allChecked.indeterminate = true;
  //   } else {
  //     allChecked.indeterminate = false;
  //   }
  //   setCheckAll(ckStatus);
  //   setBatchList([...records]);
  // };

  // const forceUpdate = (row) => {
  //   let new_batch_list = batch_list;
  //   let _index = new_batch_list.indexOf(row);
  //   new_batch_list[_index] = row;
  //   setBatchList(new_batch_list);
  // };

  return (
    <div className="ValidateBatchScreen">
      <div className="row inner-top-search">
        <Controller
          name="entry_type"
          control={control}
          render={(props) => (
            <div className="col form-group">
              <label>Batch Type</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    name="entry_type"
                    value="R"
                    checked={props.value === "R" ? true : false}
                    type="checkbox"
                    onChange={(e) => {
                      setValue("entry_type", e.target.value);
                    }}
                  />
                  <span>Relult Entry</span>
                </label>
                <label className="checkbox inline">
                  <input
                    name="entry_type"
                    value="A"
                    checked={props.value === "A" ? true : false}
                    type="checkbox"
                    onChange={(e) => {
                      setValue("entry_type", e.target.value);
                    }}
                  />
                  <span>Acknowledge</span>
                </label>
              </div>
            </div>
          )}
        />

        <div className="col-3 globalSearchCntr">
          <AlgaehLabel label={{ fieldName: "Select Batch" }} />
          <h6 onClick={() => batchSearch()}>
            {batch_number ? batch_number : "------"}
            <i className="fas fa-search fa-lg" />
          </h6>
        </div>
      </div>
      <div className="row">
        <BatchValidationList batch_list={batch_list} />
        {/* <AlgaehDataGrid
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
                return (
                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={(e) => selectToGenerateBarcode(row, e)}
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
              fieldName: "full_name",
              label: <AlgaehLabel label={{ fieldName: "Patient Name" }} />,
            },
            {
              fieldName: "primary_id_no",
              label: <AlgaehLabel label={{ forceLabel: "Patient ID" }} />,
              disabled: false,
            },
            {
              fieldName: "lab_id_number",

              label: <AlgaehLabel label={{ forceLabel: "Lab ID Number" }} />,

              disabled: false,
            },
            {
              fieldName: "test_name",
              label: <AlgaehLabel label={{ fieldName: "Test Name" }} />,
            },
            {
              fieldName: "specimen_name",
              label: <AlgaehLabel label={{ fieldName: "Specimen" }} />,
            },
            {
              fieldName: "specimen_name",
              label: <AlgaehLabel label={{ fieldName: "Specimen" }} />,
            },
            {
              fieldName: "analyte_name",
              label: <AlgaehLabel label={{ fieldName: "Analyte Name" }} />,
            },
            {
              fieldName: "result",
              label: <AlgaehLabel label={{ fieldName: "result" }} />,
              displayTemplate: (row) => {
                return (
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
          ]}
          data={batch_list}
          isFilterable={true}
          pagination={true}
        /> */}
      </div>

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
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
            <button
              onClick={() => {
                reset({
                  entry_type: "R",
                });
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
