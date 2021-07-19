import React, { useState, memo } from "react";
import { useForm } from "react-hook-form";
import { newAlgaehApi } from "../../../../hooks";
import BatchDetails from "./BatchDetails";
import ListofBatches from "./ListofBatches";
import { AlgaehMessagePop } from "algaeh-react-components";
import swal from "sweetalert2";

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
    debugger;
    const result = await newAlgaehApi({
      uri: "/laboratory/createPCRBatch",
      module: "laboratory",
      method: "POST",
      data: data,
    });
    return result?.data?.records;
  };
  const onSubmit = () => {
    debugger;
    let inpujObj = {
      batch_name: getValues("batch_name"),
      batch_list: batch_list,
    };
    createBatch(inpujObj)
      .then((result) => {
        debugger;
        swal("Batch Created Succefully... Batch No." + result.batch_number, {
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
    setBatchList((result) => {
      const _index = result.indexOf(data);
      result.splice(_index, 1);
      return [...result];
    });
  };

  return (
    <div className="appointment_status">
      {/* <form onSubmit={handleSubmit(onSubmit)} onError={onSubmit}> */}
      <div className="row inner-top-search">
        <BatchDetails
          control={control}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
          updateState={updateState}
          batch_list={batch_list}
        />

        <ListofBatches batch_list={batch_list} deleteState={deleteState} />

        <div className="col" style={{ marginTop: 21 }}>
          <button
            onClick={() => {
              reset({
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
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginLeft: 10 }}
            onClick={onSubmit}
          >
            Create Batch
          </button>
        </div>
      </div>
      {/* </form> */}
    </div>
  );
});
