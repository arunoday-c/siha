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
      scan_by: "LI",
      selected_date: new Date(),
    },
  });

  const [batch_list, setBatchList] = useState([]);
  const [auto_insert, setAutoInsert] = useState(true);
  const [batch_creation, setBatchCreation] = useState("L");

  const createBatch = async (data) => {
    const settings = { header: undefined, footer: undefined };
    const result = await newAlgaehApi({
      uri: "/laboratory/createPCRBatch",
      skipParse: true,
      data: Buffer.from(JSON.stringify(data), "utf8"),
      module: "laboratory",
      header: {
        "content-type": "application/octet-stream",
        ...settings,
      },
      method: "POST",
      // uri: "/laboratory/bulkSampleAcknowledge",
      // module: "laboratory",
      // method: "PUT",
      // data: data,
    });
    return result?.data?.records;
    // const result = await newAlgaehApi({
    //   uri: "/laboratory/createPCRBatch",
    //   module: "laboratory",
    //   method: "POST",
    //   data: data,
    // });
    // return result?.data?.records;
  };
  const onSubmit = () => {
    const filterData = batch_list.filter((f) => f.checked);
    if (filterData.length > 0) {
      swal({
        title: `Are you sure to Create Batch & Acknowledge Sample?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
      }).then((willProceed) => {
        if (willProceed.value) {
          const inpujObj = {
            batch_name: getValues("batch_name"),
            batch_list: filterData,
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
              });
              setBatchList([]);
            })
            .catch((e) => {
              debugger;
              AlgaehMessagePop({
                display: e.message,
                type: "error",
              });
            });
        }
      });
    } else {
      AlgaehMessagePop({
        display: "Please Select Atleast one record",
        type: "warning",
      });
    }
  };

  const updateState = (data) => {
    debugger;
    if (Array.isArray(data)) {
      setBatchList(data);
    } else {
      setBatchList((result) => {
        result.push(data);
        return [...result];
      });
    }
  };

  const updateAutoState = (data) => {
    setAutoInsert(data);
  };

  const updateBatchCreation = (data) => {
    setBatchCreation(data);
  };

  const deleteState = (data) => {
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
          updateAutoState={updateAutoState}
          batch_list={batch_list}
          auto_insert={auto_insert}
          batch_creation={batch_creation}
          updateBatchCreation={updateBatchCreation}
        />
      </div>
      <div className="row">
        <ListofBatches
          batch_list={batch_list}
          deleteState={deleteState}
          updateState={updateState}
        />
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
              Create Batch & Ack Sample
            </button>
            <button
              onClick={() => {
                reset({
                  scan_by: "LI",
                  barcode_scanner: "",
                  batch_number: "",
                  batch_name: "",
                  selected_date: new Date(),
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
