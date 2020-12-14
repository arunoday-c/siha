import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const getEmployeeDetails = ($this) => {
  let inputObj = {};
  // if ($this.state.AllBranches === true) {
  //   const all_branches = $this.props.organizations.map((item) => {
  //     return item.hims_d_hospital_id;
  //   });
  //   inputObj = { select_all: true, hospital_id: all_branches, show_all_status: true }
  // } else {
  //   inputObj = { hospital_id: $this.state.hospital_id, show_all_status: true }
  // }
  if ($this.state.hospital_id === -1) {
    const all_branches = $this.props.organizations.map((item) => {
      return item.hims_d_hospital_id;
    });
    inputObj = {
      select_all: true,
      hospital_id: all_branches,
      show_all_status: true,
    };
  } else {
    inputObj = { hospital_id: $this.state.hospital_id, show_all_status: true };
  }
  algaehApiCall({
    uri: "/employee/get",
    module: "hrManagement",
    method: "GET",
    data: inputObj,
    onSuccess: (response) => {
      if (response.data.success) {
        let data = response.data.records;

        $this.setState(
          { Employeedetails: data, forceRender: !!$this.state.afterClose },
          () => $this.setState({ forceRender: false })
        );
        AlgaehLoader({ show: false });
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
      AlgaehLoader({ show: false });
    },
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
    employee_status: row.employee_status,
  });
};

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value,
    },
    () => {
      getEmployeeDetails($this);
    }
  );
};

const selectAllBranches = ($this, e) => {
  let name = e.name || e.target.name;

  $this.setState(
    {
      [name]: e.target.checked,
    },
    () => {
      AlgaehLoader({ show: true });
      getEmployeeDetails($this);
    }
  );
};

export {
  getEmployeeDetails,
  EditEmployeeMaster,
  texthandle,
  selectAllBranches,
};
