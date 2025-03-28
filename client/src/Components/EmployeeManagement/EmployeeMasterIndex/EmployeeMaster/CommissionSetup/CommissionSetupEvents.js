import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../../Wrapper/fullPageLoader";

const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const numberSet = ($this, e) => {
  $this.setState({
    [e.target.name]: e.target.value
  });
  // $this.props.EmpMasterIOputs.updateEmployeeTabs({
  //   [e.target.name]: e.target.value
  // });
};

const AddSeviceTypeComm = $this => {
  if ($this.state.service_type_typ_id === null) {
    swalMessage({
      title: "Selected the Service Type .",
      type: "warning"
    });
  } else {
    let intExists = false;

    let servTypeCommission = $this.state.servTypeCommission;
    let insertservTypeCommission = $this.state.insertservTypeCommission;

    for (let x = 0; x < servTypeCommission.length; x++) {
      if (
        servTypeCommission[x].service_type_id ===
        $this.state.service_type_typ_id
      ) {
        intExists = true;
      }
    }

    if (intExists === false) {
      let inpObj = {
        service_type_id: $this.state.service_type_typ_id,
        op_cash_comission_percent: $this.state.op_cash_servtyp_percent,
        op_credit_comission_percent: $this.state.op_credit_servtyp_percent,
        ip_cash_commission_percent: $this.state.ip_cash_servtyp_percent,
        ip_credit_commission_percent: $this.state.ip_credit_servtyp_percent
      };

      if ($this.state.hims_d_employee_id !== null) {
        inpObj.provider_id = $this.state.hims_d_employee_id;
        insertservTypeCommission.push(inpObj);
      }

      servTypeCommission.push(inpObj);
      $this.setState({
        servTypeCommission: servTypeCommission,
        insertservTypeCommission: insertservTypeCommission,
        service_type_typ_id: null,
        op_cash_servtyp_percent: 0,
        op_credit_servtyp_percent: 0,
        ip_cash_servtyp_percent: 0,
        ip_credit_servtyp_percent: 0
      });

      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        servTypeCommission: servTypeCommission,
        insertservTypeCommission: insertservTypeCommission
      });
    } else {
      swalMessage({
        title: "Selected Service Type already defined.",
        type: "warning"
      });
    }
  }
};

const AddServiceComm = $this => {
  if ($this.state.service_type_id === null) {
  } else if ($this.state.service_type_id === null) {
  } else {
    let serviceComm = $this.state.serviceComm;
    let insertserviceComm = $this.state.insertserviceComm;
    let intServiceExists = false;
    for (let x = 0; x < serviceComm.length; x++) {
      if (serviceComm[x].services_id === $this.state.services_id) {
        intServiceExists = true;
      }
    }
    if (intServiceExists === false) {
      let inpObj = {
        service_type_id: $this.state.service_type_id,
        services_id: $this.state.services_id,
        op_cash_commission_percent: $this.state.op_cash_commission_percent,
        op_credit_commission_percent: $this.state.op_credit_commission_percent,
        ip_cash_commission_percent: $this.state.ip_cash_commission_percent,
        ip_credit_commission_percent: $this.state.ip_credit_commission_percent
      };

      if ($this.state.hims_d_employee_id !== null) {
        inpObj.provider_id = $this.state.hims_d_employee_id;
        insertserviceComm.push(inpObj);
      }
      serviceComm.push(inpObj);
      $this.setState({
        serviceComm: serviceComm,
        insertserviceComm: insertserviceComm,
        services_id: null,
        service_type_id: null,
        op_cash_commission_percent: 0,
        op_credit_commission_percent: 0,
        ip_cash_commission_percent: 0,
        ip_credit_commission_percent: 0
      });

      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        serviceComm: serviceComm,
        insertserviceComm: insertserviceComm
      });
    } else {
      swalMessage({
        title: "Selected Service already defined",
        type: "warning"
      });
    }
  }
};

const deleteServiceComm = ($this, row) => {
  let serviceComm = $this.state.serviceComm;
  let updateserviceComm = $this.state.updateserviceComm;
  let insertserviceComm = $this.state.insertserviceComm;
  if ($this.state.hims_d_employee_id !== null) {
    if (row.hims_m_doctor_service_commission_id !== undefined) {
      let Updateobj = {
        hims_m_doctor_service_commission_id:
          row.hims_m_doctor_service_commission_id,
        provider_id: row.provider_id,
        services_id: row.services_id,
        service_type_id: row.service_type_id,
        op_cash_commission_percent: row.op_cash_commission_percent,
        op_credit_commission_percent: row.op_credit_commission_percent,
        ip_cash_commission_percent: row.ip_cash_commission_percent,
        ip_credit_commission_percent: row.ip_credit_commission_percent,

        record_status: "I"
      };
      updateserviceComm.push(Updateobj);
    } else {
      for (let k = 0; k < insertserviceComm.length; k++) {
        if (insertserviceComm[k].services_id === row.services_id) {
          insertserviceComm.splice(k, 1);
        }
      }
    }
  }
  for (let x = 0; x < serviceComm.length; x++) {
    if (serviceComm[x].services_id === row.services_id) {
      serviceComm.splice(x, 1);
    }
  }
  $this.setState({
    serviceComm: serviceComm,
    updateserviceComm: updateserviceComm,
    insertserviceComm: insertserviceComm
  });

  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    serviceComm: serviceComm,
    updateserviceComm: updateserviceComm,
    insertserviceComm: insertserviceComm
  });
};

const deleteSeviceTypeComm = ($this, row) => {
  let servTypeCommission = $this.state.servTypeCommission;
  let updateservTypeCommission = $this.state.updateservTypeCommission;
  let insertservTypeCommission = $this.state.insertservTypeCommission;
  if ($this.state.hims_d_employee_id !== null) {
    if (row.hims_m_doctor_service_type_commission_id !== undefined) {
      let Updateobj = {
        hims_m_doctor_service_type_commission_id:
          row.hims_m_doctor_service_type_commission_id,
        provider_id: row.provider_id,
        service_type_id: row.service_type_id,
        op_cash_commission_percent: row.op_cash_commission_percent,
        op_credit_commission_percent: row.op_credit_commission_percent,
        ip_cash_commission_percent: row.ip_cash_commission_percent,
        ip_credit_commission_percent: row.ip_credit_commission_percent,

        record_status: "I"
      };
      updateservTypeCommission.push(Updateobj);
    } else {
      for (let k = 0; k < insertservTypeCommission.length; k++) {
        if (
          insertservTypeCommission[k].service_type_id === row.service_type_id
        ) {
          insertservTypeCommission.splice(k, 1);
        }
      }
    }
  }
  for (let x = 0; x < servTypeCommission.length; x++) {
    if (servTypeCommission[x].service_type_id === row.service_type_id) {
      servTypeCommission.splice(x, 1);
    }
  }
  $this.setState({
    servTypeCommission: servTypeCommission,
    updateservTypeCommission: updateservTypeCommission,
    insertservTypeCommission: insertservTypeCommission
  });

  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    servTypeCommission: servTypeCommission,
    updateservTypeCommission: updateservTypeCommission,
    insertservTypeCommission: insertservTypeCommission
  });
};

const serviceTypeHandeler = ($this, e) => {
  $this.setState({
    [e.name]: e.value
  });

  // $this.props.EmpMasterIOputs.updateEmployeeTabs({
  //   [e.name]: e.value
  // });
};

const serviceServTypeHandeler = ($this, e) => {
  $this.setState(
    {
      [e.name]: e.value,
      services_id: null
    },
    () => {
      $this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        data: { service_type_id: $this.state.service_type_id },
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "empservices"
        }
      });
    }
  );

  // $this.props.EmpMasterIOputs.updateEmployeeTabs({
  //   [e.name]: e.value
  // });
};

const getServiceTypeDepartments = $this => {
  algaehApiCall({
    uri: "/employee/getDoctorServiceTypeCommission",
    module: "hrManagement",
    method: "GET",
    data: { provider_id: $this.state.hims_d_employee_id },
    onSuccess: response => {
      if (response.data.success) {
        if (response.data.records.length > 0) {
          $this.setState({ servTypeCommission: response.data.records });

          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            servTypeCommission: response.data.records
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

const getServiceDepartments = $this => {
  algaehApiCall({
    uri: "/employee/getDoctorServiceCommission",
    module: "hrManagement",
    method: "GET",
    data: { provider_id: $this.state.hims_d_employee_id },
    onSuccess: response => {
      if (response.data.success) {
        if (response.data.records.length > 0) {
          $this.setState({ serviceComm: response.data.records });

          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            serviceComm: response.data.records
          });
        }
      }
      AlgaehLoader({ show: false });
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};
export {
  texthandle,
  AddSeviceTypeComm,
  deleteSeviceTypeComm,
  serviceTypeHandeler,
  serviceServTypeHandeler,
  numberSet,
  AddServiceComm,
  deleteServiceComm,
  getServiceTypeDepartments,
  getServiceDepartments
};
