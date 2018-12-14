import { swalMessage } from "../../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../../utils/GlobalFunctions";
import extend from "extend";

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
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
          type: "EMP_SPECILITY_GET_DATA",
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

const AddDeptUser = ($this, context, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='deptUserdtl'",
    onSuccess: () => {
      if ($this.state.sub_department_id === null) {
        swalMessage({
          title: "Invalid Input. Department cannot be blank",
          type: "warning"
        });
      } else if ($this.state.speciality_id === null) {
        swalMessage({
          title: "Invalid Input. Speciality cannot be blank",
          type: "warning"
        });
      } else if ($this.state.specimapcategory === null) {
        swalMessage({
          title: "Invalid Input. Category cannot be blank",
          type: "warning"
        });
      } else {
        let deptDetails = $this.state.deptDetails;
        let insertdeptDetails = $this.state.insertdeptDetails;

        let intExists = false;
        for (let x = 0; x < deptDetails.length; x++) {
          if (
            deptDetails[x].sub_department_id === $this.state.sub_department_id
          ) {
            intExists = true;
          }
        }
        if (intExists === false) {
          let inpObj = {
            sub_department_id: $this.state.sub_department_id,
            category_speciality_id: $this.state.category_speciality_id,
            user_id: $this.state.user_id,
            category_id: $this.state.category_id,
            speciality_id: $this.state.speciality_id,
            services_id: $this.state.services_id
          };

          if ($this.state.hims_d_employee_id !== null) {
            inpObj.employee_id = $this.state.hims_d_employee_id;
            insertdeptDetails.push(inpObj);
          }
          deptDetails.push(inpObj);
          $this.setState({
            deptDetails: deptDetails,
            sub_department_id: null,
            insertdeptDetails: insertdeptDetails,
            user_id: null,
            speciality_id: null,
            category_id: null,
            services_id: null
          });

          if (context !== undefined) {
            context.updateState({
              deptDetails: deptDetails,
              insertdeptDetails: insertdeptDetails
            });
          }
        } else {
          swalMessage({
            title: "Invalid Input. Selected Department already defined",
            type: "warning"
          });
        }
      }
    }
  });
};

// getEmpSpeciality

const updateDeptUser = ($this, context, row) => {
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
      user_id: row.user_id,
      record_status: "A"
    };
    updatedeptDetails.push(Updateobj);
    extend(deptDetails[row.rowIdx], Updateobj);

    // deptDetails[row.rowIdx] = Updateobj;
  } else {
    {
      let Updateobj = {
        employee_id: row.employee_id,
        services_id: row.services_id,
        sub_department_id: row.sub_department_id,
        category_speciality_id: row.category_speciality_id,
        user_id: row.user_id,
        record_status: "A"
      };
      insertdeptDetails.push(Updateobj);
      // deptDetails[row.rowIdx] = Updateobj;
      extend(deptDetails[row.rowIdx], Updateobj);
    }
  }

  $this.setState({
    deptDetails: deptDetails,
    updatedeptDetails: updatedeptDetails,
    insertdeptDetails: insertdeptDetails
  });
  if (context !== undefined) {
    context.updateState({
      deptDetails: deptDetails,
      updatedeptDetails: updatedeptDetails,
      insertdeptDetails: insertdeptDetails
    });
  }
};

const deleteDeptUser = ($this, context, row) => {
  let deptDetails = $this.state.deptDetails;
  let updatedeptDetails = $this.state.updatedeptDetails;
  let insertdeptDetails = $this.state.insertdeptDetails;
  if ($this.state.hims_d_employee_id !== null) {
    if (row.hims_d_employee_department_id !== undefined) {
      let Updateobj = {
        hims_d_employee_department_id: row.hims_d_employee_department_id,
        employee_id: row.employee_id,
        services_id: row.services_id,
        sub_department_id: row.sub_department_id,
        category_speciality_id: row.category_speciality_id,
        user_id: row.user_id,
        record_status: "I"
      };
      updatedeptDetails.push(Updateobj);
    } else {
      for (let k = 0; k < insertdeptDetails.length; k++) {
        if (insertdeptDetails[k].sub_department_id === row.sub_department_id) {
          insertdeptDetails.splice(k, 1);
        }
      }
    }
  }
  for (let x = 0; x < deptDetails.length; x++) {
    if (deptDetails[x].sub_department_id === row.sub_department_id) {
      deptDetails.splice(x, 1);
    }
  }
  $this.setState({
    deptDetails: deptDetails,
    updatedeptDetails: updatedeptDetails,
    insertdeptDetails: insertdeptDetails
  });
  if (context !== undefined) {
    context.updateState({
      deptDetails: deptDetails,
      updatedeptDetails: updatedeptDetails,
      insertdeptDetails: insertdeptDetails
    });
  }
};

const colgridtexthandle = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

export {
  texthandle,
  AddDeptUser,
  deleteDeptUser,
  departmenttexthandle,
  specialitytexthandle,
  categorytexthandle,
  updateDeptUser,
  colgridtexthandle
};
