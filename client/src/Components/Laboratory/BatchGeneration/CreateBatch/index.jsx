import React, { useState, memo } from "react";
import { useForm } from "react-hook-form";
import { newAlgaehApi } from "../../../../hooks";
import BatchDetails from "./BatchDetails";
import ListofBatches from "./ListofBatches";
import { AlgaehMessagePop } from "algaeh-react-components";
import swal from "sweetalert2";
import "./CreateBatch.scss";

export default memo(function CreateBatch() {
  const { control, errors, reset, setValue, getValues } = useForm({
    shouldFocusError: true,
    defaultValues: {
      batch_name: "",
      barcode_scanner: "",
      auto_insert: true,
      scan_by: "LI",
    },
  });

  const [batch_list, setBatchList] = useState([]);

  const createBatch = async (data) => {
    const result = await newAlgaehApi({
      uri: "/laboratory/createPCRBatch",
      module: "laboratory",
      method: "POST",
      data: data,
    });
    return result?.data?.records;
  };
  const onSubmit = () => {
    let inpujObj = {
      batch_name: getValues("batch_name"),
      batch_list: batch_list,
    };
    createBatch(inpujObj)
      .then((result) => {
        swal({
          title: "Batch Created Successfully",
          text: result.batch_number,
          icon: "success",
        });
        reset({
          barcode_scanner: "",
          batch_number: "",
          batch_name: "",
          auto_insert: true,
        });
        setBatchList([]);
      })
      .catch((e) => {
        AlgaehMessagePop({
          display: e,
          type: "error",
        });
      });
  };

  const updateState = (data) => {
    setBatchList((result) => {
      result.push(data);
      return [...result];
    });
  };

  const deleteState = (data) => {
    debugger;
    setBatchList((result) => {
      const final_data = result.filter(
        (f) => f.lab_id_number !== data.lab_id_number
      );

      return [...final_data];
    });
  };

  return (
    <div className="CreateBatchScreen">
      <div className="row inner-top-search">
        <BatchDetails
          control={control}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
          updateState={updateState}
          batch_list={batch_list}
        />
      </div>
      <div className="row">
        <ListofBatches batch_list={batch_list} deleteState={deleteState} />
        {/* <div className="col-8">details section here</div> */}
      </div>

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginLeft: 10 }}
              onClick={onSubmit}
              disabled={batch_list.length > 0 ? false : true}
            >
              Create Batch
            </button>{" "}
            <button
              onClick={() => {
                reset({
                  scan_by: "LI",
                  barcode_scanner: "",
                  batch_number: "",
                  batch_name: "",
                  auto_insert: true,
                });
                setBatchList([]);
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
