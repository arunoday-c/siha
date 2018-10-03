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
      debugger;
      $this.props.getEmpSpeciality({
        uri: "/employeesetups/getEmpSpeciality",
        method: "GET",
        data: { sub_department_id: $this.state.sub_department_id },
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
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      debugger;
      $this.props.getEmployeeCategory({
        uri: "/employee/getEmployeeCategory",
        method: "GET",
        data: { speciality_id: $this.state.speciality_id },
        redux: {
          type: "EMP_SPEC_CATEGORY_GET_DATA",
          mappingName: "specimapcategory"
        },
        afterSuccess: data => {
          debugger;
        }
      });
    }
  );
};

const categorytexthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    category_speciality_id: e.selected.category_speciality_id
  });
};

const AddDeptUser = ($this, context) => {
  debugger;
  let deptDetails = $this.state.deptDetails;
  let insertdeptDetails = $this.state.insertdeptDetails;
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
    user_id: null
  });

  if (context !== undefined) {
    context.updateState({ deptDetails: deptDetails });
  }
};

// getEmpSpeciality

const deleteDeptUser = ($this, context, row) => {
  if (row.hims_m_doctor_service_commission_id === undefined) {
    let deptDetails = $this.state.deptDetails;
    let updatedeptDetails = $this.state.updatedeptDetails;
    let insertdeptDetails = $this.state.insertdeptDetails;
    if ($this.state.hims_d_item_master_id !== null) {
      if (row.hims_m_doctor_service_commission_id !== undefined) {
        let Updateobj = {
          hims_m_doctor_service_commission_id:
            row.hims_m_doctor_service_commission_id,
          record_status: "I"
        };
        updatedeptDetails.push(Updateobj);
      } else {
        for (let k = 0; k < insertdeptDetails.length; k++) {
          if (insertdeptDetails[k].uom_id === row.uom_id) {
            insertdeptDetails.splice(k, 1);
          }
        }
      }
    }
    for (let x = 0; x < deptDetails.length; x++) {
      if (deptDetails[x].uom_id === row.uom_id) {
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
  }
};

export {
  texthandle,
  AddDeptUser,
  deleteDeptUser,
  departmenttexthandle,
  specialitytexthandle,
  categorytexthandle
};
