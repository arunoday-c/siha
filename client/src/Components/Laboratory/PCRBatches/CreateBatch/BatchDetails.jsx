import React, { memo, useCallback } from "react";
import { AlgaehFormGroup } from "algaeh-react-components";
import { Controller } from "react-hook-form";
import { debounce } from "lodash";
import "./../../../../styles/site.scss";

export default memo(function BatchDetails({
  control,
  errors,
  setValue,
  getValues,
  updateState,
}) {
  const onChangeHandeler = (e) => {
    const auto_insert = getValues("auto_insert");
    if (auto_insert === true) {
      e.persist();
      setValue("barcode_scanner", e.target.value);
      de_bounce(e);
    } else {
      setValue("barcode_scanner", e.target.value);
    }
  };

  const de_bounce = useCallback(
    debounce((e) => {
      updateState(e.target.value);
      setValue("barcode_scanner", "");
    }, 2500),
    []
  );

  return (
    <div className="appointment_status">
      <div className="row">
        <Controller
          name="batch_number"
          control={control}
          render={(props) => (
            <AlgaehFormGroup
              div={{ className: "col-3 mandatory form-group" }}
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
        />

        <Controller
          name="batch_name"
          control={control}
          render={(props) => (
            <AlgaehFormGroup
              div={{ className: "col-3 mandatory form-group" }}
              error={errors}
              label={{
                forceLabel: "Batch Name",
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

        <Controller
          name="batch_type"
          control={control}
          render={(props) => (
            <div className="col-4">
              <label>Batch Type</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    name="batch_type"
                    value="LI"
                    checked={props.value === "LI" ? true : false}
                    type="checkbox"
                    onChange={(e) => {
                      setValue("batch_type", e.target.value);
                    }}
                  />
                  <span>Lab ID</span>
                  <input
                    name="batch_type"
                    value="PI"
                    checked={props.value === "PI" ? true : false}
                    type="checkbox"
                    onChange={(e) => {
                      setValue("batch_type", e.target.value);
                    }}
                  />
                  <span>Patient ID</span>
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
            <div className="col-3 mandatory form-group ">
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

            // <AlgaehFormGroup
            //   div={{ className: "col-3 mandatory form-group" }}
            //   error={errors}
            //   label={{
            //     forceLabel: "Barcode Scanner",
            //     isImp: true,
            //   }}
            //   textBox={{
            //     ...props,
            //     className: "txt-fld",
            //     name: "barcode_scanner",
            //     placeholder: "Scan Barcode",
            //     onChange: onChangeHandeler,
            //   }}
            // />
          )}
        />

        <Controller
          name="auto_insert"
          control={control}
          render={(props) => (
            <div className="col">
              <label>Auto Insert</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    name="auto_insert"
                    defaultChecked={props.value}
                    type="checkbox"
                    onChange={(e) => {
                      setValue("auto_insert", e.target.checked);
                    }}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>
          )}
        />

        <button
          className="btn btn-primary"
          style={{ marginLeft: 10 }}
          onClick={() => {
            const barcode_scanner = getValues("barcode_scanner");
            updateState(barcode_scanner);
            setValue("barcode_scanner", "");
          }}
        >
          Add to List
        </button>
      </div>
    </div>
  );
});
