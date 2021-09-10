import { useEffect, useContext, memo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
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
export default memo(function SelectWardSection() {
  const { setWardHeaderData, wardHeaderData } =
    useContext(BedManagementContext);
  //   const [wardHeaderData, setWardHeaderData] = useState([]);
  const { control, setValue } = useForm<IFormInputs>();
  // useEffect(() => {
  //   getWardHeaderData();
  // }, []);
  const { hims_adm_ward_header_id } = useWatch({
    control,
    name: ["hims_adm_ward_header_id"],
  });
  useEffect(() => {
    getWardHeaderData(hims_adm_ward_header_id);
  }, [hims_adm_ward_header_id]); //eslint-disable-line

  const getWardHeaderData = async (data?: string) => {
    const { response, error } = await algaehAxios(
      "/bedManagement/getWardHeaderData",
      {
        module: "admission",
        method: "GET",
        data: { hims_adm_ward_header_id: data },
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
  return (
    <div>
      <div className="row inner-top-search">
        <Controller
          name="hims_adm_ward_header_id"
          control={control}
          // rules={{ required: "Select Ward Type " }}
          render={({ value, onChange }) => (
            <AlgaehAutoComplete
              div={{ className: "col-2  form-group mandatory" }}
              label={{
                forceLabel: "Filter By Ward",
                // isImp: true,
              }}
              // error={errors}
              selector={{
                name: "hims_adm_ward_header_id",
                value,
                onChange: (_: any, selected: any) => {
                  onChange(selected);

                  // getWardHeaderData(selected);
                  // setValue("service_amount", _.standard_fee);
                },

                onClear: () => {
                  onChange("");
                },

                dataSource: {
                  textField: "ward_desc",
                  valueField: "hims_adm_ward_header_id",
                  data: wardHeaderData,
                },
                // others: {
                //   disabled: hims_adm_ward_header_id,

                //   tabIndex: "4",
                // },
              }}
            />
          )}
        />{" "}
        <button
          className="btn btn-default btn-small"
          style={{ marginTop: 21 }}
          onClick={() => setValue("hims_adm_ward_header_id", undefined)}
        >
          clear
        </button>
      </div>
    </div>
  );
});
