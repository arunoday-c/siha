import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../../utils/GlobalFunctions";
import Enumerable from "linq";
import moment from "moment";
import Options from "../../../../../Options.json";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [name]: value
  });
};

const departmenttexthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      $this.props.getEmpSpeciality({
        uri: "/specialityAndCategory/getEmployeeSpecialityMaster",
        module: "masterSettings",
        method: "GET",
        data: {
          sub_department_id: $this.state.sub_department,
          speciality_status: "A"
        },
        redux: {
          type: "EMP_DEP_SPECILITY_GET_DATA",
          mappingName: "empdepspeciality"
        }
      });
    }
  );
};

const specialitytexthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  // let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.props.getEmployeeCategory({
    uri: "/specialityAndCategory/getCategorySpecialityMap",
    module: "masterSettings",
    method: "GET",
    data: {
      category_speciality_status: "A",
      speciality_status: "A",
      employee_category_status: "A",
      hims_d_employee_speciality_id: value
    },
    redux: {
      type: "EMP_SPEC_CATEGORY_GET_DATA",
      mappingName: "specimapcategory"
    },
    afterSuccess: data => {
      $this.setState({
        speciality_id: value
      });
    }
  });
};

const categorytexthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    category_speciality_id: e.selected.hims_m_category_speciality_mappings_id
  });
};

const AddDeptUser = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='deptUserdtl'",
    onSuccess: () => {
      let deptDetails = $this.state.deptDetails;
      let insertdeptDetails = $this.state.insertdeptDetails;

      if (deptDetails === undefined) {
        deptDetails = [];
      } else {
        const _departs = Enumerable.from(deptDetails)
          .where(w => w.sub_department_id === $this.state.sub_department)
          .any();
        if (_departs) {
          swalMessage({
            title: "Same department is already added.",
            type: "warning"
          });
          return;
        }
      }

      deptDetails.push({
        employee_id: $this.state.hims_d_employee_id,
        sub_department_id: $this.state.sub_department,
        category_speciality_id: $this.state.category_speciality_id,
        user_id: $this.state.user_id,
        category_id: $this.state.category_id,
        speciality_id: $this.state.speciality_id,
        services_id: $this.state.services_id,
        reporting_to_id: $this.state.reporting_to,
        employee_designation_id: $this.state.designation_id,
        from_date: $this.state.from_date,
        dep_status: "A"
      });

      insertdeptDetails.push({
        employee_id: $this.state.hims_d_employee_id,
        sub_department_id: $this.state.sub_department,
        category_speciality_id: $this.state.category_speciality_id,
        user_id: $this.state.user_id,
        category_id: $this.state.category_id,
        speciality_id: $this.state.speciality_id,
        services_id: $this.state.services_id,
        reporting_to_id: $this.state.reporting_to,
        employee_designation_id: $this.state.designation_id,
        from_date: $this.state.from_date,
        dep_status: "A"
      });

      $this.setState({
        deptDetails: deptDetails,
        sub_department: null,
        category_speciality_id: null,
        user_id: null,
        category_id: null,
        speciality_id: null,
        services_id: null,
        reporting_to: null,
        designation_id: null,
        from_date: null,
        reporting_to_id: $this.state.reporting_to,
        sub_department_id: $this.state.sub_department,
        employee_designation_id: $this.state.designation_id
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        deptDetails: deptDetails,
        insertdeptDetails: insertdeptDetails,
        reporting_to_id: $this.state.reporting_to,
        sub_department_id: $this.state.sub_department,
        employee_designation_id: $this.state.designation_id
      });
    }
  });
};

// getEmpSpeciality

const updateDeptUser = ($this, row) => {
  // let deptDetails = Enumerable.from($this.state.deptDetails)
  //   .where(w => w.sub_department_id !== row.sub_department_id)
  //   .toArray();
  // deptDetails.push(row);
  // $this.setState({
  //   deptDetails: deptDetails
  // });
  // $this.props.EmpMasterIOputs.updateEmployeeTabs({
  //   deptDetails: deptDetails
  // });

  let deptDetails = $this.state.deptDetails;
  let updatedeptDetails = $this.state.updatedeptDetails;
  let insertdeptDetails = $this.state.insertdeptDetails;
  if (row.hims_d_employee_department_id !== undefined) {
    let Updateobj = {
      hims_d_employee_department_id: row.hims_d_employee_department_id,
      employee_id: row.employee_id,
      services_id: row.services_id,
      sub_department_id: row.sub_department_id,
      category_speciality_id: row.category_speciality_id,
      speciality_id: row.speciality_id,
      category_id: row.category_id,
      reporting_to_id: row.reporting_to_id,
      from_date: row.from_date,
      to_date: row.to_date,
      employee_designation_id: row.employee_designation_id,
      user_id: row.user_id,
      dep_status: row.dep_status,
      record_status: "A"
    };
    updatedeptDetails.push(Updateobj);
    deptDetails[row.rowIdx] = Updateobj;
    // deptDetails[row.rowIdx] = Updateobj;
  } else {
    {
      let Updateobj = {
        employee_id: row.employee_id,
        services_id: row.services_id,
        sub_department_id: row.sub_department_id,
        category_speciality_id: row.category_speciality_id,
        speciality_id: row.speciality_id,
        category_id: row.category_id,
        reporting_to_id: row.reporting_to_id,
        employee_designation_id: row.employee_designation_id,
        from_date: row.from_date,
        to_date: row.to_date,
        user_id: row.user_id,
        dep_status: row.dep_status,
        record_status: "A"
      };
      insertdeptDetails.push(Updateobj);
      deptDetails[row.rowIdx] = Updateobj;
      // extend(deptDetails[row.rowIdx], Updateobj);
    }
  }
  $this.setState({
    deptDetails: deptDetails,
    updatedeptDetails: updatedeptDetails,
    insertdeptDetails: insertdeptDetails,
    reporting_to_id: row.reporting_to_id,
    sub_department_id: row.sub_department_id,
    employee_designation_id: row.employee_designation_id
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    deptDetails: deptDetails,
    updatedeptDetails: updatedeptDetails,
    insertdeptDetails: insertdeptDetails,
    reporting_to_id: row.reporting_to_id,
    sub_department_id: row.sub_department_id,
    employee_designation_id: row.employee_designation_id
  });
};

const deleteDeptUser = ($this, row) => {
  // let deptDetails = Enumerable.from($this.state.deptDetails)
  //   .where(w => w.sub_department_id !== row.sub_department_id)
  //   .toArray();

  // $this.setState({
  //   deptDetails: deptDetails
  // });

  // $this.props.EmpMasterIOputs.updateEmployeeTabs({
  //   deptDetails: deptDetails
  // });

  let deptDetails = $this.state.deptDetails;
  let updatedeptDetails = $this.state.updatedeptDetails;
  let insertdeptDetails = $this.state.insertdeptDetails;
  if (row.hims_d_employee_department_id !== undefined) {
    let Updateobj = {
      hims_d_employee_department_id: row.hims_d_employee_department_id,
      employee_id: row.employee_id,
      services_id: row.services_id,
      sub_department_id: row.sub_department_id,
      category_speciality_id: row.category_speciality_id,
      speciality_id: row.speciality_id,
      category_id: row.category_id,
      reporting_to_id: row.reporting_to_id,
      from_date: row.from_date,
      to_date: row.to_date,
      employee_designation_id: row.employee_designation_id,
      user_id: row.user_id,
      dep_status: row.dep_status,
      record_status: "I"
    };
    updatedeptDetails.push(Updateobj);
    deptDetails[row.rowIdx] = Updateobj;
    deptDetails.splice(row.rowIdx, 1);
  } else {
    {
      for (let x = 0; x < insertdeptDetails.length; x++) {
        if (insertdeptDetails[x].earnings_id === row.earnings_id) {
          insertdeptDetails.splice(x, 1);
        }
      }
      deptDetails.splice(row.rowIdx, 1);
    }
  }
  $this.setState({
    deptDetails: deptDetails,
    updatedeptDetails: updatedeptDetails,
    insertdeptDetails: insertdeptDetails
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    deptDetails: deptDetails,
    updatedeptDetails: updatedeptDetails,
    insertdeptDetails: insertdeptDetails
  });
};

const colgridtexthandle = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const getEmployeeDepartments = $this => {
  algaehApiCall({
    uri: "/employee/getEmployeeDepartments",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: $this.state.hims_d_employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          $this.setState({ deptDetails: data }, () => {
            $this.props.EmpMasterIOputs.updateEmployeeTabs({
              deptDetails: $this.state.deptDetails
            });
          });
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

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
  //this.resetState();
};

const onchangegridcolstatus = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  if (value === "I") {
    row["to_date"] = new Date();
  } else {
    row["to_date"] = null;
  }
  row.update();
  //this.resetState();
};

export {
  texthandle,
  AddDeptUser,
  deleteDeptUser,
  departmenttexthandle,
  specialitytexthandle,
  categorytexthandle,
  updateDeptUser,
  colgridtexthandle,
  dateFormater,
  datehandle,
  getEmployeeDepartments,
  onchangegridcol,
  onchangegridcolstatus
};
