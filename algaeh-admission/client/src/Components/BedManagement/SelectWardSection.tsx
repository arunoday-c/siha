import { useEffect, useContext, memo } from "react";
// import { useForm, Controller, useWatch } from "react-hook-form";
import {
  AlgaehAutoComplete,
  algaehAxios,
  AlgaehMessagePop,
  // MainContext,
} from "algaeh-react-components";
import { Controller, useForm } from "react-hook-form";
import { BedManagementContext } from "./BedMangementContext";
// interface IFormInputs {
//   // name: string;
//   hims_adm_ward_header_id: string;
// }
export default memo(function SelectWardSection(props: any) {
  const { fromAdmissionprop } = props;
  // props: {
  //   control: any;
  //   setValue: any;
  //   Controller: any;
  //   getValues: any;
  //   handleSubmit: any;
  // }
  const {
    setWardHeaderData,
    wardHeaderDropdown,
    setWardHeaderDropdown,
    bedStatusData,
    hims_adm_bed_status_id,
    setBedStatusId,
    ward_header_id,
    setWardHeaderId,
    fromAdmission,
  } = useContext(BedManagementContext);
  // const { control, setValue, Controller, getValues, handleSubmit } = props;
  //   const [wardHeaderData, setWardHeaderData] = useState([]);
  // const { control, setValue, getValues, handleSubmit } = useForm({
  //   shouldFocusError: true,
  //   defaultValues: {
  //     hims_adm_bed_status_id: "Vacant",
  //     hims_adm_ward_header_id: undefined,
  //   },
  // });
  // useEffect(() => {
  //   getWardHeaderData();
  // }, []);
  // const { hims_adm_ward_header_id } = useWatch({
  //   control,
  //   name: ["hims_adm_ward_header_id"],
  // });
  useEffect(() => {
    getWardHeaderData({
      hims_adm_ward_header_id: ward_header_id,
      hims_adm_bed_status_id: fromAdmissionprop
        ? "Vacant"
        : hims_adm_bed_status_id === "All"
        ? null
        : hims_adm_bed_status_id,
    });
    getWardHeader();
  }, []); //eslint-disable-line

  const getWardHeaderData = async (data?: any) => {
    const { response, error } = await algaehAxios(
      "/bedManagement/getWardHeaderData",
      {
        module: "admission",
        method: "GET",
        data: { ...data },
      }
    );
    if (error) {
      if (error.show === true) {
        let extendedError: Error | any = error;
        AlgaehMessagePop({
          display: extendedError.response.data.message,
          type: "error",
        });
        throw error;
      }
    }
    if (response.data.success) {
      setWardHeaderData(response.data.records);
    }
  };
  const getWardHeader = async () => {
    const { response, error } = await algaehAxios(
      "/bedManagement/getWardHeader",
      {
        module: "admission",
        method: "GET",
      }
    );
    if (error) {
      if (error.show === true) {
        let extendedError: Error | any = error;
        AlgaehMessagePop({
          display: extendedError.response.data.message,
          type: "error",
        });
        throw error;
      }
    }
    if (response.data.success) {
      setWardHeaderDropdown(response.data.records);
    }
  };
  const onSubmit = () => {
    getWardHeaderData({
      hims_adm_ward_header_id: ward_header_id,
      hims_adm_bed_status_id: fromAdmissionprop
        ? "Vacant"
        : hims_adm_bed_status_id === "All"
        ? null
        : hims_adm_bed_status_id,
    });
  };

  const { control, reset, handleSubmit } = useForm({
    shouldFocusError: true,
    defaultValues: {
      hims_adm_ward_header_id: ward_header_id,
      hims_adm_bed_status_id: "All",
    },
  });
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} onError={onSubmit}>
        <div className="row inner-top-search">
          <Controller
            name="hims_adm_ward_header_id"
            control={control}
            render={({ value, onChange }) => (
              <AlgaehAutoComplete
                div={{ className: "col-2  form-group" }}
                label={{
                  forceLabel: "Filter By Ward",
                }}
                selector={{
                  name: "hims_adm_ward_header_id",
                  value,
                  onChange: (_: any, selected: any) => {
                    setWardHeaderId(selected);
                    onChange(selected);
                  },
                  onClear: () => {
                    setWardHeaderId("");
                    onChange("");
                  },
                  dataSource: {
                    textField: "ward_desc",
                    valueField: "hims_adm_ward_header_id",
                    data: wardHeaderDropdown,
                  },
                }}
              />
            )}
          />{" "}
          {/* <AlgaehAutoComplete
          div={{ className: "col-2  form-group" }}
          label={{
            forceLabel: "Filter By Ward",
          }}
          selector={{
            name: "hims_adm_ward_header_id",
            value: ward_header_id,
            onChange: (_: any, selected: any) => {
              setWardHeaderId(selected);
            },
            onClear: () => {
              setWardHeaderId("");
            },
            dataSource: {
              textField: "ward_desc",
              valueField: "hims_adm_ward_header_id",
              data: wardHeaderDropdown,
            },
          }}
        /> */}
          {fromAdmission ? null : (
            <Controller
              name="hims_adm_bed_status_id"
              control={control}
              render={({ value, onChange }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2  form-group" }}
                  label={{
                    forceLabel: "Bed Status",
                  }}
                  selector={{
                    name: "hims_adm_bed_status_id",
                    value,
                    onChange: (_: any, selected: any) => {
                      setBedStatusId(selected);
                      onChange(selected);
                    },

                    onClear: () => {
                      setBedStatusId("All");
                      onChange("All");
                    },

                    dataSource: {
                      textField: "description",
                      valueField: "description",
                      data: bedStatusData,
                    },
                  }}
                />
              )}
            />
            // <AlgaehAutoComplete
            //   div={{ className: "col-2  form-group" }}
            //   label={{
            //     forceLabel: "Bed Status",
            //   }}
            //   selector={{
            //     name: "hims_adm_bed_status_id",
            //     value: hims_adm_bed_status_id,
            //     onChange: (_: any, selected: any) => {
            //       setBedStatusId(selected);
            //     },

            //     onClear: () => {
            //       setBedStatusId("All");
            //     },

            //     dataSource: {
            //       textField: "description",
            //       valueField: "description",
            //       data: bedStatusData,
            //     },
            //   }}
            // />
          )}
          <div className="col" style={{ marginTop: 21 }}>
            <button
              className="btn btn-default btn-sm"
              onClick={() => {
                reset({
                  hims_adm_bed_status_id: "All",
                  hims_adm_ward_header_id: "",
                });
                setBedStatusId("All");
                setWardHeaderId("");
              }}
            >
              clear
            </button>
            <button
              style={{ marginLeft: 10 }}
              className="btn btn-primary btn-sm"
              type="submit"
              // onClick={() => {
              //
              //   getWardHeaderData({
              //     hims_adm_ward_header_id: ward_header_id,
              //     hims_adm_bed_status_id:
              //       hims_adm_bed_status_id === "All"
              //         ? null
              //         : hims_adm_bed_status_id,
              //   });
              // }}
            >
              Load
            </button>
          </div>
        </div>
      </form>
    </div>
  );
});
