import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

const employeeSearch = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee
    },
    searchName: "employee",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState(
        {
          employee_name: row.full_name,
          hims_d_employee_id: row.hims_d_employee_id,
          overtime_group_id: row.overtime_group_id
        },
        () => {
          algaehApiCall({
            uri: "/employeesetups/getOvertimeGroups",
            data: {
              hims_d_overtime_group_id: $this.state.overtime_group_id
            },
            method: "GET",
            onSuccess: res => {
              if (res.data.success) {
                //Take Data and do stff here
              }
            },
            onFailure: err => {
              swalMessage({
                title: err.message,
                type: "error"
              });
            }
          });
        }
      );
    }
  });
};

export { employeeSearch };
