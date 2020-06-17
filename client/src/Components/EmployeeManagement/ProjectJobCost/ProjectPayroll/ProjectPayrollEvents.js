import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
// import swal from "sweetalert2";
import Enumerable from "linq";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import _ from "lodash";
export default function ProjectPayrollEvents() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
      });
    },
    // getAllDepartments: function getAllDepartments($this) {
    //   algaehApiCall({
    //     uri: "branchMaster/getBranchWiseDepartments",
    //     method: "GET",
    //     module: "masterSettings",
    //     onSuccess: (response) => {
    //       if (response.data.success) {
    //         $this.setState({ allDepartments: response.data.records });
    //       }
    //     },
    //     onFailure: (error) => {
    //       swalMessage({
    //         title: error.message,
    //         type: "error",
    //       });
    //     },
    //   });
    // },

    employeeSearch: ($this) => {
      if (
        $this.state.hospital_id === null ||
        $this.state.hospital_id === undefined
      ) {
        swalMessage({
          title: "Please Select Branch",
          type: "warning",
        });
        document.querySelector("[name='hospital_id']").focus();
        return;
      }

      let input_data = " hospital_id=" + $this.state.hospital_id;

      AlgaehSearch({
        searchGrid: {
          columns: spotlightSearch.Employee_details.employee,
        },
        searchName: "employee",
        inputs: input_data,
        uri: "/gloabelSearch/get",
        onContainsChange: (text, serchBy, callBack) => {
          callBack(text);
        },
        onRowSelect: (row) => {
          $this.setState({
            employee_name: row.full_name,
            employee_id: row.hims_d_employee_id,
          });
        },
      });
    },
    openSalaryComponents: ($this, row) => {
      debugger;
      const salaryprocess_Earning = Enumerable.from(
        $this.state.project_payroll_detail
      )
        .where(
          (w) =>
            w.project_wise_payroll_id === row.hims_f_project_wise_payroll_id
        )
        .toArray();

      row.earning_details = salaryprocess_Earning;

      $this.setState({
        isOpen: !$this.state.isOpen,
        selected_employee: row,
      });
    },
    LoadProjectDetails: ($this) => {
      // if ($this.state.project_id === null && $this.state.employee_id === null) {
      // swalMessage({
      //   title: "Please select Project or Employee.",
      //   type: "warning",
      // });
      // } else {
      let lbl_total = "Total Project";
      let inputObj = {
        hospital_id: $this.state.hospital_id,
        year: $this.state.year,
        month: $this.state.month,
      };
      if ($this.state.project_id !== null) {
        inputObj.project_id = $this.state.project_id;
        lbl_total = "Total Employees";
      }

      if ($this.state.employee_id !== null) {
        inputObj.employee_id = $this.state.employee_id;
      }

      algaehApiCall({
        uri: "/projectjobcosting/getProjectWiseJobCost",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: (response) => {
          debugger;
          if (response.data.records.length > 0) {
            let data = response.data.records;
            $this.setState({
              project_wise_payroll: response.data.records,
              lbl_total: lbl_total,
              total_worked_hours: _.sumBy(data, "total_hours"),
              total_cost: _.sumBy(data, (item) => {
                return parseFloat(item["cost"]);
              }),
              noEmployees: data.length,
            });
            debugger;
          } else {
            AlgaehLoader({ show: false });
            swalMessage({
              title: "Please process attendance for selected month",
              type: "error",
            });
          }
        },
        onFailure: (error) => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: "Please process attendance for selected month",
            type: "error",
          });
        },
      });
      // }
    },
  };
}
// export function getBranchDetails($this) {
//   algaehApiCall({
//     uri: "/branchMaster/getBranchWiseDepartments",
//     method: "GET",
//     data: {
//       hospital_id: $this.state.hospital_id,
//     },
//     module: "masterSettings",
//     onSuccess: (res) => {
//       if (res.data.success) {
//         $this.setState({
//           allDepartments: res.data.records,
//         });
//       }
//     },
//     onFailure: (err) => {
//       swalMessage({
//         title: err.message,
//         type: "error",
//       });
//     },
//   });
// }
