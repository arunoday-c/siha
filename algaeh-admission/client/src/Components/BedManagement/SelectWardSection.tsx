import { useEffect, useContext, memo } from "react";
// import { useForm, Controller, useWatch } from "react-hook-form";
import {
  AlgaehAutoComplete,
  algaehAxios,
  AlgaehMessagePop,
  // MainContext,
} from "algaeh-react-components";

import { BedManagementContext } from "./BedMangementContext";
interface IFormInputs {
  // name: string;
  hims_adm_ward_header_id: string;
}
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
  return (
    <div>
      {/* <form onSubmit={handleSubmit(getWardHeaderData)}> */}
      <div className="row inner-top-search">
        {/* <Controller
            name="hims_adm_ward_header_id"
            control={control}
            // rules={{ required: "Select Ward Type " }}
            render={({ value, onChange }: { value: any; onChange: any }) => ( */}
        <AlgaehAutoComplete
          div={{ className: "col-2  form-group mandatory" }}
          label={{
            forceLabel: "Filter By Ward",
            // isImp: true,
          }}
          // error={errors}
          selector={{
            name: "hims_adm_ward_header_id",
            value: ward_header_id,
            onChange: (_: any, selected: any) => {
              // onChange(selected);
              setWardHeaderId(selected);
              // getWardHeaderData(selected);
              // setValue("service_amount", _.standard_fee);
            },

            onClear: () => {
              // onChange("");
              setWardHeaderId("");
            },

            dataSource: {
              textField: "ward_desc",
              valueField: "hims_adm_ward_header_id",
              data: wardHeaderDropdown,
            },
            // others: {
            //   disabled: hims_adm_ward_header_id,

            //   tabIndex: "4",
            // },
          }}
        />
        {/* )}
          />{" "} */}
        {/* <Controller
            name="hims_adm_bed_status_id"
            control={control}
            // rules={{ required: "Select Ward Type " }}
            render={({ value, onChange }: { value: any; onChange: any }) => ( */}
        {fromAdmission ? null : (
          <AlgaehAutoComplete
            div={{ className: "col-2  form-group mandatory" }}
            label={{
              forceLabel: "Bed Status",
              // isImp: true,
            }}
            // error={errors}
            selector={{
              name: "hims_adm_bed_status_id",
              value: hims_adm_bed_status_id,
              onChange: (_: any, selected: any) => {
                // onChange(selected);

                setBedStatusId(selected);

                // getWardHeaderData(selected);
                // setValue("service_amount", _.standard_fee);
              },

              onClear: () => {
                setBedStatusId("");
                // onChange("");
              },

              dataSource: {
                textField: "description",
                valueField: "description",
                data: bedStatusData,
              },
              // others: {
              //   disabled: hims_adm_ward_header_id,

              //   tabIndex: "4",
              // },
            }}
          />
        )}

        {/* )}
          />{" "} */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            getWardHeaderData({
              hims_adm_ward_header_id: ward_header_id,
              hims_adm_bed_status_id: hims_adm_bed_status_id,
            });
          }}
        >
          Load
        </button>
        <button
          className="btn btn-default btn-small"
          style={{ marginTop: 21 }}
          // onClick={() => setValue("hims_adm_ward_header_id", undefined)}
        >
          clear
        </button>
      </div>
      {/* </form> */}
    </div>
  );
});
