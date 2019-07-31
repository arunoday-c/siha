import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import _ from "lodash";

const getEmployeeDetails = $this => {
  algaehApiCall({
    uri: "/employee/get",
    module: "hrManagement",
    method: "GET",

    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          $this.setState(
            { Employeedetails: data, forceRender: !!$this.state.afterClose },
            () => $this.setState({ forceRender: false })
          );
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
      AlgaehLoader({ show: false });
    }
  });
};

const EditEmployeeMaster = ($this, row) => {
  row.deptDetails = [];
  row.contributioncomponents = [];
  row.deductioncomponents = [];
  row.earningComponents = [];
  row.idDetails = [];
  row.dependentDetails = [];

  row.insertearnComp = [];
  row.insertDeductionComp = [];
  row.insertContributeComp = [];

  row.deleteearnComp = [];
  row.deleteDeductionComp = [];
  row.deleteContributeComp = [];

  row.updateearnComp = [];
  row.updateDeductionComp = [];
  row.updateContributeComp = [];

  $this.setState({
    isOpen: !$this.state.isOpen,
    employeeDetailsPop: row,
    editEmployee: true,
    employee_status: row.employee_status
  });
};

export { getEmployeeDetails, EditEmployeeMaster };
