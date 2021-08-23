import React, { memo, useCallback } from "react";
import {
  AlgaehDateHandler,
  AlgaehFormGroup,
  AlgaehMessagePop,
} from "algaeh-react-components";
import { Controller } from "react-hook-form";
import { debounce } from "lodash";
import "./../../../../styles/site.scss";
import { newAlgaehApi } from "../../../../hooks";

export const checkIDExists = async (inputObj) => {
  const result = await newAlgaehApi({
    uri: "/laboratory/checkIDExists",
    module: "laboratory",
    method: "GET",
    data: inputObj,
  });
  return result?.data;
};
export const loadSampleCollected = async (inputObj) => {
  const result = await newAlgaehApi({
    uri: "/laboratory/getSampleCollectedAck",
    module: "laboratory",
    method: "GET",
    data: inputObj,
  });
  return result?.data;
};
export default memo(function BatchDetails({
  control,
  errors,
  setValue,
  getValues,
  updateState,
  batch_list,
  auto_insert,
  updateAutoState,
  batch_creation,
  updateBatchCreation,
}) {
  const onChangeHandeler = (e) => {
    // const auto_insert = getValues("auto_insert");
    if (auto_insert === true) {
      e.persist();
      setValue("barcode_scanner", e.target.value);
      de_bounce(e, batch_list);
    } else {
      setValue("barcode_scanner", e.target.value);
    }
  };

  const de_bounce = useCallback(
    debounce(async (e, new_batch_list) => {
      const scan_by = getValues("scan_by");

      const after_ack = await checkIDExists({
        id_number: e.target.value,
        scan_by: getValues("scan_by"),
      }).catch((error) => {
        throw error;
      });

      if (after_ack.success === false) {
        AlgaehMessagePop({
          display: after_ack.message,
          type: "error",
        });
        setValue("barcode_scanner", "");
        return;
      }

      const data_exists = new_batch_list.filter(
        (f) => f.lab_id_number === after_ack.records.lab_id_number
      );

      if (data_exists.length > 0) {
        AlgaehMessagePop({
          display: "Selected ID already Exists",
          type: "warning",
        });
        setValue("barcode_scanner", "");
        return;
      }

      if (scan_by === "LI") {
        updateState({
          id_number: e.target.value,
          lab_id_number: e.target.value,
          order_id: after_ack.records.hims_f_lab_order_id,
          primary_id_no: after_ack.records.id_number,
          patient_name: after_ack.records.patient_name,
          description: after_ack.records.description,
        });
      } else {
        updateState({
          id_number: e.target.value,
          lab_id_number: after_ack.records.id_number,
          order_id: after_ack.records.hims_f_lab_order_id,
          primary_id_no: e.target.value,
          patient_name: after_ack.records.patient_name,
          description: after_ack.records.description,
        });
      }

      setValue("barcode_scanner", "");
    }, 500),
    []
  );

  const onClickLoad = async () => {
    try {
      const after_load = await loadSampleCollected({
        selected_date: getValues("selected_date"),
      }).catch((error) => {
        throw error;
      });

      if (after_load.success === false) {
        AlgaehMessagePop({
          display: after_load.message,
          type: "error",
        });
        setValue("barcode_scanner", "");
        return;
      }
      if (after_load.records.length > 0) {
        updateState(after_load.records);
      } else {
        AlgaehMessagePop({
          display: "No Records Found",
          type: "warning",
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        display: e.message,
        type: "error",
      });
    }
  };

  const onClickAddtoList = async () => {
    const barcode_scanner = getValues("barcode_scanner");

    if (barcode_scanner === "") {
      AlgaehMessagePop({
        display: "Enter Barcode.",
        type: "warning",
      });
      return;
    }
    const scan_by = getValues("scan_by");

    const data_exists = batch_list.filter(
      (f) => f.id_number === barcode_scanner
    );

    if (data_exists.length > 0) {
      AlgaehMessagePop({
        display: "Selected ID already Exists",
        type: "warning",
      });
      setValue("barcode_scanner", "");
      return;
    }
    const after_ack = await checkIDExists({
      id_number: barcode_scanner,
      scan_by: getValues("scan_by"),
    }).catch((error) => {
      throw error;
    });

    if (after_ack.success === false) {
      AlgaehMessagePop({
        display: after_ack.message,
        type: "error",
      });
      setValue("barcode_scanner", "");
      return;
    }

    if (scan_by === "LI") {
      updateState({
        id_number: barcode_scanner,
        lab_id_number: barcode_scanner,
        order_id: after_ack.records.hims_f_lab_order_id,
        primary_id_no: after_ack.records.id_number,
      });
    } else {
      updateState({
        id_number: barcode_scanner,
        lab_id_number: after_ack.records.id_number,
        order_id: after_ack.records.hims_f_lab_order_id,
        primary_id_no: barcode_scanner,
      });
    }

    setValue("barcode_scanner", "");
  };

  return (
    <div className="col appointment_status">
      <div className="row">
        {/* <Controller
          name="batch_number"
          control={control}
          render={(props) => (
            <AlgaehFormGroup
              div={{ className: "col mandatory form-group" }}
              error={errors}
              label={{
                forceLabel: "Batch Number",
              }}
              textBox={{
                ...props,
                className: "txt-fld",
                name: "batch_number",
                disabled: true,
                placeholder: "Auto Generation",
              }}
            />
          )}
        /> */}

        <Controller
          name="batch_creation"
          control={control}
          render={(props) => (
            <div className="col-3 form-group">
              <label>Create Batch</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    name="batch_creation"
                    value="L"
                    checked={batch_creation === "L" ? true : false}
                    type="checkbox"
                    onChange={(e) => {
                      updateBatchCreation(e.target.value);
                    }}
                  />
                  <span>By Loading Data</span>
                </label>
                <label className="checkbox inline">
                  <input
                    name="batch_creation"
                    value="S"
                    checked={batch_creation === "S" ? true : false}
                    type="checkbox"
                    onChange={(e) => {
                      updateBatchCreation(e.target.value);
                    }}
                  />
                  <span>By Barcode Scaning</span>
                </label>
              </div>
            </div>
          )}
        />

        {batch_creation === "S" ? (
          <>
            <Controller
              name="scan_by"
              control={control}
              render={(props) => (
                <div className="col-2 form-group">
                  <label>Scan Type</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        name="scan_by"
                        value="LI"
                        checked={props.value === "LI" ? true : false}
                        type="checkbox"
                        onChange={(e) => {
                          setValue("scan_by", e.target.value);
                        }}
                      />
                      <span>Lab ID</span>
                    </label>
                    <label className="checkbox inline">
                      <input
                        name="scan_by"
                        value="PI"
                        checked={props.value === "PI" ? true : false}
                        type="checkbox"
                        onChange={(e) => {
                          setValue("scan_by", e.target.value);
                        }}
                      />
                      <span>Patient ID</span>
                    </label>
                  </div>
                </div>
              )}
            />
            <Controller
              name="auto_insert"
              control={control}
              render={(props) => (
                <div className="col-1 mandatory form-group">
                  <label>Auto Insert</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        name="auto_insert"
                        defaultChecked={auto_insert}
                        type="checkbox"
                        onChange={(e) => {
                          updateAutoState(e.target.checked);
                        }}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>
              )}
            />

            <Controller
              name="barcode_scanner"
              control={control}
              rules={{ required: "Required" }}
              render={(props) => (
                <div className="col-2 mandatory form-group">
                  <label className="style_Label undefined">
                    Barcode Scanner<span className="imp">&nbsp;*</span>
                  </label>

                  <input
                    name="barcode_scanner"
                    className="ant-input txt-fld"
                    placeholder="Scan Barcode"
                    type="text"
                    value={props.value}
                    onChange={onChangeHandeler}
                  />
                </div>
              )}
            />
            <Controller
              name="batch_name"
              control={control}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col form-group" }}
                  error={errors}
                  label={{
                    forceLabel: "Custom Batch Name",
                  }}
                  textBox={{
                    ...props,
                    className: "txt-fld",
                    name: "batch_name",
                    placeholder: "Batch Name",
                  }}
                />
              )}
            />
            {auto_insert === false ? (
              <div className="col-1 mandatory form-group">
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 21 }}
                  onClick={onClickAddtoList}
                >
                  Add to List
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <Controller
              control={control}
              name="selected_date"
              render={(props) => (
                <AlgaehDateHandler
                  div={{
                    className: "col-3 mandatory",
                  }}
                  error={errors}
                  label={{
                    fieldName: "Select Date",
                    isImp: true,
                  }}
                  textBox={{
                    ...props,
                    className: "txt-fld",
                    name: "selected_date",
                    // value,
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: (mdate) => {
                      if (mdate) {
                        setValue("selected_date", mdate._d);
                        // onChange(mdate._d);
                      } else {
                        setValue("selected_date", undefined);
                        // onChange(undefined);
                      }
                    },
                    onClear: () => {
                      setValue("selected_date", undefined);
                      // onChange(undefined);
                    },
                  }}
                />
              )}
            />
            <Controller
              name="batch_name"
              control={control}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col form-group" }}
                  error={errors}
                  label={{
                    forceLabel: "Custom Batch Name",
                  }}
                  textBox={{
                    ...props,
                    className: "txt-fld",
                    name: "batch_name",
                    placeholder: "Batch Name",
                  }}
                />
              )}
            />
            <div className="col-1 mandatory form-group">
              <button
                className="btn btn-primary"
                style={{ marginTop: 21 }}
                onClick={onClickLoad}
              >
                Load
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
