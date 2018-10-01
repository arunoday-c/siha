const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const numberSet = ($this, context, e) => {
  debugger;
  $this.setState({
    [e.target.name]: e.target.value
  });
  if (context !== undefined) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

const AddSeviceTypeComm = ($this, context) => {
  debugger;
  if ($this.state.service_type_typ_id === null) {
  } else {
    let servTypeCommission = $this.state.servTypeCommission;
    let inpObj = {
      service_type_id: $this.state.service_type_typ_id,
      op_cash_comission_percent: $this.state.op_cash_servtyp_percent,
      op_credit_comission_percent: $this.state.op_credit_servtyp_percent,
      ip_cash_commission_percent: $this.state.ip_cash_servtyp_percent,
      ip_credit_commission_percent: $this.state.ip_credit_servtyp_percent
    };

    servTypeCommission.push(inpObj);
    $this.setState({
      servTypeCommission: servTypeCommission,
      service_type_typ_id: null,
      op_cash_servtyp_percent: 0,
      op_credit_servtyp_percent: 0,
      ip_cash_servtyp_percent: 0,
      ip_credit_servtyp_percent: 0
    });

    if (context !== undefined) {
      context.updateState({ servTypeCommission: servTypeCommission });
    }
  }
};

const AddServiceComm = ($this, context) => {
  if ($this.state.service_type_id === null) {
  } else if ($this.state.service_type_id === null) {
  } else {
    let serviceComm = $this.state.serviceComm;
    let inpObj = {
      service_type_id: $this.state.service_type_id,
      services_id: $this.state.services_id,
      op_cash_commission_percent: $this.state.op_cash_commission_percent,
      op_credit_commission_percent: $this.state.op_credit_commission_percent,
      ip_cash_commission_percent: $this.state.ip_cash_commission_percent,
      ip_credit_commission_percent: $this.state.ip_credit_commission_percent
    };

    serviceComm.push(inpObj);
    $this.setState({
      serviceComm: serviceComm,
      services_id: null,
      service_type_id: null,
      op_cash_commission_percent: 0,
      op_credit_commission_percent: 0,
      ip_cash_commission_percent: 0,
      ip_credit_commission_percent: 0
    });

    if (context !== undefined) {
      context.updateState({ serviceComm: serviceComm });
    }
  }
};

const deleteServiceComm = ($this, context, row) => {
  if (row.hims_m_doctor_service_commission_id === undefined) {
    let serviceComm = $this.state.serviceComm;
    let updateserviceComm = $this.state.updateserviceComm;
    let insertserviceComm = $this.state.insertserviceComm;
    if ($this.state.hims_d_item_master_id !== null) {
      if (row.hims_m_doctor_service_commission_id !== undefined) {
        let Updateobj = {
          hims_m_doctor_service_commission_id:
            row.hims_m_doctor_service_commission_id,
          record_status: "I"
        };
        updateserviceComm.push(Updateobj);
      } else {
        for (let k = 0; k < insertserviceComm.length; k++) {
          if (insertserviceComm[k].uom_id === row.uom_id) {
            insertserviceComm.splice(k, 1);
          }
        }
      }
    }
    for (let x = 0; x < serviceComm.length; x++) {
      if (serviceComm[x].uom_id === row.uom_id) {
        serviceComm.splice(x, 1);
      }
    }
    $this.setState({
      serviceComm: serviceComm,
      updateserviceComm: updateserviceComm,
      insertserviceComm: insertserviceComm
    });
    if (context !== undefined) {
      context.updateState({
        serviceComm: serviceComm,
        updateserviceComm: updateserviceComm,
        insertserviceComm: insertserviceComm
      });
    }
  }
};

const deleteSeviceTypeComm = ($this, context, row) => {
  if (row.hims_m_doctor_service_type_commission_id === undefined) {
    let servTypeCommission = $this.state.servTypeCommission;
    let updateservTypeCommission = $this.state.updateservTypeCommission;
    let insertservTypeCommission = $this.state.insertservTypeCommission;
    if ($this.state.hims_d_item_master_id !== null) {
      if (row.hims_m_doctor_service_type_commission_id !== undefined) {
        let Updateobj = {
          hims_m_doctor_service_type_commission_id:
            row.hims_m_doctor_service_type_commission_id,
          record_status: "I"
        };
        updateservTypeCommission.push(Updateobj);
      } else {
        for (let k = 0; k < insertservTypeCommission.length; k++) {
          if (insertservTypeCommission[k].uom_id === row.uom_id) {
            insertservTypeCommission.splice(k, 1);
          }
        }
      }
    }
    for (let x = 0; x < servTypeCommission.length; x++) {
      if (servTypeCommission[x].uom_id === row.uom_id) {
        servTypeCommission.splice(x, 1);
      }
    }
    $this.setState({
      servTypeCommission: servTypeCommission,
      updateservTypeCommission: updateservTypeCommission,
      insertservTypeCommission: insertservTypeCommission
    });
    if (context !== undefined) {
      context.updateState({
        servTypeCommission: servTypeCommission,
        updateservTypeCommission: updateservTypeCommission,
        insertservTypeCommission: insertservTypeCommission
      });
    }
  }
};

const serviceTypeHandeler = ($this, context, e) => {
  $this.setState({
    [e.name]: e.value
  });
  if (context != null) {
    context.updateState({ [e.name]: e.value });
  }
};

const serviceServTypeHandeler = ($this, context, e) => {
  $this.setState(
    {
      [e.name]: e.value,
      services_id: null
    },
    () => {
      $this.props.getServices({
        uri: "/serviceType/getService",
        method: "GET",
        data: { service_type_id: $this.state.service_type_id },
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "services"
        }
      });
    }
  );
  if (context != null) {
    context.updateState({ [e.name]: e.value });
  }
};

export {
  texthandle,
  AddSeviceTypeComm,
  deleteSeviceTypeComm,
  serviceTypeHandeler,
  serviceServTypeHandeler,
  numberSet,
  AddServiceComm,
  deleteServiceComm
};
