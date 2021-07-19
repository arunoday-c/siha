import React, { useState, memo } from "react";
import { useForm } from "react-hook-form";
import { newAlgaehApi } from "../../../../hooks";
import BatchDetails from "./BatchDetails";
import ListofBatches from "./ListofBatches";

export default memo(function CreateBatch() {
  const { control, errors, reset, handleSubmit, setValue, getValues } = useForm(
    {
      shouldFocusError: true,
      defaultValues: {
        auto_insert: true,
        batch_type: "LI",
      },
    }
  );

  const [batch_list, setBatchList] = useState([]);

  const createBatch = async (data) => {
    const result = await newAlgaehApi({
      uri: "/laboratory/createPCRBatch",
      module: "laboratory",
      method: "GET",
      data: {},
    });
    return result?.data?.records;
  };
  const onSubmit = (data) => {
    debugger;
    createBatch(data).then((result) => {
      reset({
        barcode_scanner: "",
        batch_number: "",
        batch_name: "",
        auto_insert: true,
      });
      setBatchList([]);
    });
  };

  const updateState = (data) => {
    setBatchList((result) => {
      result.push({ id_number: data });
      return [...result];
    });
  };

  const deleteState = (data) => {
    debugger;
    setBatchList((result) => {
      result.splice(data, 1);
      return [...result];
    });
  };

  const onClick = () => {
    debugger;
    handleSubmit(onSubmit)();
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
            onClick={onClick}
          >
            Create Batch
          </button>
        </div>
      </div>
      {/* </form> */}
    </div>
  );
});
