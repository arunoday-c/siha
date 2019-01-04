import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const getEmployeeDetails = $this => {
  algaehApiCall({
    uri: "/employee/get",
    method: "GET",

    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          debugger;
          $this.setState({ Employeedetails: data });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const EditEmployeeMaster = ($this, row) => {
  $this.setState({
    isOpen: !$this.state.isOpen,
    employeeDetailsPop: row,
    editEmployee: true
  });
};

export { getEmployeeDetails, EditEmployeeMaster };
