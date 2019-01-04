import { swalMessage } from "../../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../../utils/GlobalFunctions";
import Enumerable from "linq";
import moment from "moment";
import Options from "../../../../../Options.json";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  debugger;
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
        method: "GET",
        data: {
          sub_department_id: $this.state.sub_department_id,
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
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='deptUserdtl'",
    onSuccess: () => {
      if ($this.state.sub_department_id === null) {
        swalMessage({
          title: "Department. cannot be blank",
          type: "warning"
        });
      } else if ($this.state.speciality_id === null) {
        swalMessage({
          title: "Speciality. cannot be blank",
          type: "warning"
        });
      } else if ($this.state.category_id === null) {
        swalMessage({
          title: "Category. cannot be blank",
          type: "warning"
        });
      } else if ($this.state.designation_id === null) {
        swalMessage({
          title: "Designation. cannot be blank",
          type: "warning"
        });
      } else if ($this.state.reporting_to_id === null) {
        swalMessage({
          title: "Reporting To. cannot be blank",
          type: "warning"
        });
      } else {
        debugger;
        let deptDetails = $this.state.deptDetails;

        if (deptDetails === undefined) {
          deptDetails = [];
        } else {
          const _departs = Enumerable.from(deptDetails)
            .where(w => w.sub_department_id === $this.state.sub_department_id)
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
          sub_department_id: $this.state.sub_department_id,
          category_speciality_id: $this.state.category_speciality_id,
          user_id: $this.state.user_id,
          category_id: $this.state.category_id,
          speciality_id: $this.state.speciality_id,
          services_id: $this.state.services_id,
          reporting_to_id: $this.state.reporting_to_id,
          employee_designation_id: $this.state.designation_id,
          from_date: $this.state.from_date,
          dep_status: "A",
          hims_d_designation_id: $this.state.hims_d_designation_id
        });

        debugger;
        $this.setState({
          deptDetails: deptDetails,
          sub_department_id: null,
          category_speciality_id: null,
          user_id: null,
          category_id: null,
          speciality_id: null,
          services_id: null,
          reporting_to_id: null,
          designation_id: null,
          from_date: null,
          hims_d_designation_id: null
        });
        $this.props.EmpMasterIOputs.updateEmployeeTabs({
          deptDetails: deptDetails,
          insertdeptDetails: deptDetails
        });
      }
    }
  });
};

// getEmpSpeciality

const updateDeptUser = ($this, row) => {
  let deptDetails = Enumerable.from($this.state.deptDetails)
    .where(w => w.sub_department_id !== row.sub_department_id)
    .toArray();
  deptDetails.push(row);
  $this.setState({
    deptDetails: deptDetails
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    deptDetails: deptDetails
  });
  // let updatedeptDetails = $this.state.updatedeptDetails;
  // let insertdeptDetails = $this.state.insertdeptDetails;
  // if (row.hims_d_employee_department_id !== undefined) {
  //   let Updateobj = {
  //     hims_d_employee_department_id: row.hims_d_employee_department_id,
  //     employee_id: row.employee_id,
  //     services_id: row.services_id,
  //     sub_department_id: row.sub_department_id,
  //     category_speciality_id: row.category_speciality_id,
  //     user_id: row.user_id,
  //     record_status: "A"
  //   };
  //   updatedeptDetails.push(Updateobj);
  //   extend(deptDetails[row.rowIdx], Updateobj);
  //   // deptDetails[row.rowIdx] = Updateobj;
  // } else {
  //   {
  //     let Updateobj = {
  //       employee_id: row.employee_id,
  //       services_id: row.services_id,
  //       sub_department_id: row.sub_department_id,
  //       category_speciality_id: row.category_speciality_id,
  //       user_id: row.user_id,
  //       record_status: "A"
  //     };
  //     insertdeptDetails.push(Updateobj);
  //     // deptDetails[row.rowIdx] = Updateobj;
  //     extend(deptDetails[row.rowIdx], Updateobj);
  //   }
  // }
  // $this.setState({
  //   deptDetails: deptDetails,
  //   updatedeptDetails: updatedeptDetails,
  //   insertdeptDetails: insertdeptDetails
  // });
  // $this.props.EmpMasterIOputs.updateEmployeeTabs({
  //   deptDetails: deptDetails,
  //   updatedeptDetails: updatedeptDetails,
  //   insertdeptDetails: insertdeptDetails
  // });
  // if (context !== undefined) {
  //   context.updateState({
  //     deptDetails: deptDetails,
  //     updatedeptDetails: updatedeptDetails,
  //     insertdeptDetails: insertdeptDetails
  //   });
  // }
};

const deleteDeptUser = ($this, row) => {
  let deptDetails = Enumerable.from($this.state.deptDetails)
    .where(w => w.sub_department_id !== row.sub_department_id)
    .toArray();

  $this.setState({
    deptDetails: deptDetails
  });

  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    deptDetails: deptDetails
  });
};

const colgridtexthandle = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const dateFormater = value => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: ctrl
  });
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
  datehandle
};
