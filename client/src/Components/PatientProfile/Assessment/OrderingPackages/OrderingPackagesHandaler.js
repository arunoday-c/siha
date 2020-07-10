import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import extend from "extend";
import Enumerable from "linq";
import moment from "moment";
import _ from "lodash";
//Text Handaler Change
const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

// When Service Type selects respective Service Type theService to be filter
const serviceTypeHandeler = ($this, e) => {
  $this.setState(
    {
      [e.name]: e.value,
      s_service: null
    },
    () => {
      if ($this.state.insured === "N") {
        $this.props.getServices({
          uri: "/serviceType/getService",
          module: "masterSettings",
          method: "GET",
          data: { service_type_id: $this.state.s_service_type },
          redux: {
            type: "SERVICES_GET_DATA",
            mappingName: "services"
          }
        });
      } else {
        $this.props.getServices({
          uri: "/serviceType/getServiceInsured",
          module: "masterSettings",
          method: "GET",
          data: {
            insurance_id: $this.state.insurance_provider_id,
            service_type_id: $this.state.s_service_type
          },
          redux: {
            type: "SERVICES_INS_GET_DATA",
            mappingName: "services"
          }
        });
      }
    }
  );
};

const serviceHandeler = ($this, e) => {
  // let date = new Date().setDate(
  //   new Date().getDate() + parseInt(e.expiry_days, 10)
  // );
  let from_bill = $this.props.from === "Billing" ? true : false;
  if (from_bill === true) {
    if (e.package_visit_type === "M") {
      $this.setState({ service_name: "" });
      swalMessage({
        title: "No rights to order Multi Visit Package",
        type: "warning"
      });
      return;
    }
  }
  let expiry_date =
    e.package_visit_type === "M"
      ? moment()
        .add(parseInt(e.expiry_days, 10), "days")
        .format("YYYY-MM-DD")
      : moment(new Date()).format("YYYY-MM-DD");
  $this.setState({
    s_service: e.hims_d_services_id,
    s_service_type: e.service_type_id,
    insurance_service_name: e.service_name,
    service_name: e.service_name,

    package_visit_type: e.package_visit_type,
    package_type: e.package_type,
    package_id: e.hims_d_package_header_id,
    expiry_date: expiry_date,
    actual_amount: e.total_service_amount,
    package_code: e.package_code
  });
};

const getPackageDetail = ($this, package_id) => {
  return new Promise((resolve, reject) => {
    algaehApiCall({
      uri: "/packagesetup/getPackage",
      module: "masterSettings",
      method: "GET",
      data: { hims_d_package_header_id: package_id },
      onSuccess: response => {
        if (response.data.success) {
          resolve(response.data.records);
        } else {
          reject(response);
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
        reject(error);
      }
    });
  });
};

//Process and gets selectd service data with all calculation
const ProcessService = $this => {
  // orderedList

  let SelectedService = Enumerable.from($this.props.pakageList)
    .where(
      w =>
        w.service_type_id === $this.state.s_service_type &&
        w.services_id === $this.state.s_service
    )
    .toArray();

  let PreSelectedService = Enumerable.from($this.state.orderpackagedata)
    .where(
      w =>
        w.service_type_id === $this.state.s_service_type &&
        w.services_id === $this.state.s_service
    )
    .toArray();

  debugger
  if (SelectedService.length === 0 && PreSelectedService.length === 0) {
    if ($this.state.s_service_type !== null && $this.state.s_service !== null) {
      let preserviceInput = $this.state.preserviceInput || [];
      let serviceInput = [
        {
          insured: $this.state.insured,
          vat_applicable: $this.props.vat_applicable,
          hims_d_services_id: $this.state.s_service,
          service_type_id: $this.state.s_service_type,
          primary_insurance_provider_id: $this.state.insurance_provider_id,
          primary_network_office_id:
            $this.state.hims_d_insurance_network_office_id,
          primary_network_id: $this.state.network_id,
          sec_insured: $this.state.sec_insured,
          secondary_insurance_provider_id:
            $this.state.secondary_insurance_provider_id,
          secondary_network_id: $this.state.secondary_network_id,
          secondary_network_office_id: $this.state.secondary_network_office_id,
          approval_amt: $this.state.approval_amt,
          approval_limit_yesno: $this.state.approval_limit_yesno,
          preapp_limit_amount: $this.state.preapp_limit_amount,
          package_id: $this.state.package_id,
          package_visit_type: $this.state.package_visit_type,
          package_type: $this.state.package_type,
          expiry_date: $this.state.expiry_date,
          actual_amount: $this.state.actual_amount
        }
      ];

      algaehApiCall({
        uri: "/billing/getBillDetails",
        module: "billing",
        method: "POST",
        data: serviceInput,
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;
            if (
              data.billdetails[0].preapp_limit_exceed === "Y" &&
              $this.state.approval_limit_yesno === "N"
            ) {
              swal({
                title: "Pre-Approval limit reached.",
                text:
                  "Service amount have exceeded insurance limit. If proceed all services will be senting for Pre Approval.",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                confirmButtonColor: "#",
                cancelButtonColor: "#d33",
                cancelButtonText: "No"
              }).then(willProceed => {
                if (willProceed.value) {
                  preserviceInput.push(serviceInput[0]);
                  for (let k = 0; k < preserviceInput.length; k++) {
                    preserviceInput[k].approval_limit_yesno =
                      data.billdetails[0].preapp_limit_exceed;
                  }
                  let approval_amt = data.billdetails[0].approval_amt;
                  let approval_limit_yesno =
                    data.billdetails[0].preapp_limit_exceed;

                  algaehApiCall({
                    uri: "/billing/getBillDetails",
                    module: "billing",
                    method: "POST",
                    data: preserviceInput,
                    onSuccess: response => {
                      if (response.data.success) {
                        let Service_data = response.data.records;

                        for (
                          let i = 0;
                          i < Service_data.billdetails.length;
                          i++
                        ) {
                          getPackageDetail(
                            $this,
                            Service_data.billdetails[i].package_id
                          )
                            .then(result => {
                              Service_data.billdetails[i].visit_id =
                                $this.state.visit_id;
                              Service_data.billdetails[i].patient_id =
                                $this.state.patient_id;

                              Service_data.billdetails[i].doctor_id =
                                $this.state.provider_id;
                              Service_data.billdetails[
                                i
                              ].insurance_provider_id =
                                $this.state.insurance_provider_id;
                              Service_data.billdetails[i].insurance_sub_id =
                                $this.state.sub_insurance_provider_id;
                              Service_data.billdetails[i].network_id =
                                $this.state.network_id;
                              Service_data.billdetails[i].policy_number =
                                $this.state.policy_number;
                              Service_data.billdetails[
                                i
                              ].insurance_service_name =
                                $this.state.insurance_service_name;
                              Service_data.billdetails[i].sec_company =
                                $this.state.sec_insured;

                              Service_data.billdetails[i].icd_code =
                                Service_data.billdetails[i].icd_code === ""
                                  ? null
                                  : Service_data.billdetails[i].icd_code;
                              // Service_data.billdetails[i].icd_code ===
                              //   Service_data.billdetails[0].icd_code;
                              // Approval Table

                              Service_data.billdetails[
                                i
                              ].insurance_network_office_id =
                                $this.state.hims_d_insurance_network_office_id;

                              Service_data.billdetails[i].requested_quantity =
                                Service_data.billdetails[i].quantity;
                              Service_data.billdetails[i].test_type =
                                $this.state.test_type;

                              Service_data.billdetails[
                                i
                              ].package_detail = result;

                              Service_data.billdetails[i].visit_id =
                                $this.state.visit_id;
                              Service_data.billdetails[i].patient_id =
                                $this.state.patient_id;
                              Service_data.billdetails[i].incharge_or_provider =
                                $this.state.provider_id;
                              Service_data.billdetails[i].ordered_by =
                                $this.state.provider_id;
                              Service_data.billdetails[i].billed = "N";

                              Service_data.billdetails[i].advance_amount = 0;
                              Service_data.billdetails[i].balance_amount = 0;
                              Service_data.billdetails[i].utilize_amount = 0;
                              Service_data.billdetails[i].package_code =
                                $this.state.package_code;
                            })
                            .catch(error => {
                              console.error(error);
                            });
                        }

                        $this.setState({
                          orderpackagedata: Service_data.billdetails,
                          approval_amt: approval_amt,
                          preserviceInput: preserviceInput,
                          approval_limit_yesno: approval_limit_yesno,
                          saved: false,
                          // s_service_type: null,
                          s_service: null,
                          test_type: "R",
                          service_name: "",
                          expiry_date: null
                        });

                        algaehApiCall({
                          uri: "/billing/billingCalculations",
                          module: "billing",
                          method: "POST",
                          data: { billdetails: Service_data.billdetails },
                          onSuccess: response => {
                            if (response.data.success) {
                              $this.setState({
                                sub_total_amount:
                                  response.data.records.sub_total_amount,
                                discount_amount:
                                  response.data.records.discount_amount,
                                net_total: response.data.records.net_total,
                                patient_payable:
                                  response.data.records.patient_payable,
                                company_payble:
                                  response.data.records.company_payble,
                                copay_amount:
                                  response.data.records.copay_amount,
                                sec_copay_amount:
                                  response.data.records.sec_copay_amount
                              });
                            }
                          },
                          onFailure: error => {
                            swalMessage({
                              title: error.message,
                              type: "error"
                            });
                          }
                        });
                      }
                    },
                    onFailure: error => {
                      swalMessage({
                        title: error.message,
                        type: "error"
                      });
                    }
                  });
                }
              });
            } else {
              let existingservices = $this.state.orderpackagedata;

              data.billdetails[0].visit_id = $this.state.visit_id;
              data.billdetails[0].patient_id = $this.state.patient_id;

              data.billdetails[0].insurance_provider_id =
                $this.state.insurance_provider_id;
              data.billdetails[0].insurance_sub_id =
                $this.state.sub_insurance_provider_id;
              data.billdetails[0].network_id = $this.state.network_id;
              data.billdetails[0].policy_number = $this.state.policy_number;
              data.billdetails[0].insurance_service_name =
                $this.state.insurance_service_name;
              // data.billdetails[0].icd_code = "1";

              data.billdetails[0].icd_code =
                data.billdetails[0].icd_code === ""
                  ? null
                  : data.billdetails[0].icd_code;
              //Approval Table TODO
              //TODO

              data.billdetails[0].insurance_network_office_id =
                $this.state.hims_d_insurance_network_office_id;

              data.billdetails[0].requested_quantity =
                data.billdetails[0].quantity;
              data.billdetails[0].doctor_id = $this.state.provider_id;
              data.billdetails[0].sec_company = $this.state.sec_insured;
              data.billdetails[0].test_type = $this.state.test_type;
              //If pre-approval required for selected service

              if (
                data.billdetails[0].pre_approval === "Y" &&
                $this.state.approval_limit_yesno === "N"
              ) {
                swalMessage({
                  title: "Selected Service is Pre-Approval required.",
                  type: "warning"
                });
              } else if (
                data.billdetails[0].insurance_yesno === "Y" &&
                $this.state.approval_limit_yesno === "Y"
              ) {
                data.billdetails[0].pre_approval = "Y";
              } else {
                data.billdetails[0].pre_approval = "N";
              }
              data.billdetails[0].visit_id = $this.state.visit_id;
              data.billdetails[0].patient_id = $this.state.patient_id;
              data.billdetails[0].incharge_or_provider =
                $this.state.provider_id;
              data.billdetails[0].ordered_by = $this.state.provider_id;
              data.billdetails[0].billed = "N";
              data.billdetails[0].advance_amount = 0;
              data.billdetails[0].balance_amount = 0;
              data.billdetails[0].utilize_amount = 0;
              data.billdetails[0].package_code = $this.state.package_code;
              getPackageDetail($this, data.billdetails[0].package_id)
                .then(result => {
                  data.billdetails[0].package_detail = result;
                  if (data.billdetails.length !== 0) {
                    existingservices.splice(0, 0, data.billdetails[0]);
                  }
                  let approval_amt = data.billdetails[0].approval_amt;
                  let preapp_limit_amount =
                    data.billdetails[0].preapp_limit_amount;

                  preserviceInput.push(serviceInput[0]);
                  $this.setState({
                    orderpackagedata: existingservices,
                    approval_amt: approval_amt,
                    preserviceInput: preserviceInput,
                    preapp_limit_amount: preapp_limit_amount,
                    saved: false,
                    // s_service_type: null,
                    s_service: null,
                    test_type: "R",
                    service_name: "",
                    expiry_date: null
                  });

                  algaehApiCall({
                    uri: "/billing/billingCalculations",
                    module: "billing",
                    method: "POST",
                    data: { billdetails: existingservices },
                    onSuccess: response => {
                      if (response.data.success) {
                        $this.setState({
                          sub_total_amount:
                            response.data.records.sub_total_amount,
                          discount_amount:
                            response.data.records.discount_amount,
                          net_total: response.data.records.net_total,
                          patient_payable:
                            response.data.records.patient_payable,
                          company_payble: response.data.records.company_payble,
                          copay_amount: response.data.records.copay_amount,
                          sec_copay_amount:
                            response.data.records.sec_copay_amount
                        });
                      }
                    },
                    onFailure: error => {
                      swalMessage({
                        title: error.message,
                        type: "error"
                      });
                    }
                  });
                })
                .catch(error => {
                  console.error(error);
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
    } else {
      swalMessage({
        title: "Please select service and service type.",
        type: "warning"
      });
    }
  } else {
    swalMessage({
      title: "Selected Service already ordered.",
      type: "warning"
    });
  }
};

//if services got delete and if pre apprival limit exceed
const deleteServices = ($this, row, rowId) => {
  let orderpackagedata = $this.state.orderpackagedata;
  let preserviceInput = $this.state.preserviceInput;

  const get_selected_row = _.find(
    preserviceInput,
    f => f.hims_d_services_id === row["services_id"]
  );

  const _index = preserviceInput.indexOf(get_selected_row);
  let saved = false;
  const _order_index = orderpackagedata.indexOf(row);
  orderpackagedata.splice(_order_index, 1);
  if (orderpackagedata.length === 0) {
    saved = true;

    $this.setState({
      patient_payable: null,
      company_payble: null,
      sec_company_paybale: null,
      sub_total_amount: null,
      discount_amount: null,
      net_total: null
    });
  }

  let app_amt = $this.state.approval_amt - row["company_payble"];

  if ($this.state.approval_limit_yesno === "Y") {
    if (app_amt < $this.state.preapp_limit_amount) {
      preserviceInput.splice(_index, 1);
      for (var k = 0; k < preserviceInput.length; k++) {
        preserviceInput[k].approval_limit_yesno = "N";
      }

      algaehApiCall({
        uri: "/billing/getBillDetails",
        module: "billing",
        method: "POST",
        data: preserviceInput,
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;

            algaehApiCall({
              uri: "/billing/billingCalculations",
              module: "billing",
              method: "POST",
              data: { billdetails: data.billdetails },
              onSuccess: response => {
                if (response.data.success) {
                  $this.setState({
                    orderpackagedata: data.billdetails,
                    approval_amt: app_amt,
                    preserviceInput: preserviceInput,
                    approval_limit_yesno: "N",
                    saved: saved,
                    sub_total_amount: response.data.records.sub_total_amount,
                    discount_amount: response.data.records.discount_amount,
                    net_total: response.data.records.net_total,
                    patient_payable: response.data.records.patient_payable,
                    company_payble: response.data.records.company_payble,
                    copay_amount: response.data.records.copay_amount,
                    sec_copay_amount: response.data.records.sec_copay_amount
                  });
                }
              },
              onFailure: error => {
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    } else {
      $this.setState({
        orderpackagedata: orderpackagedata,
        preserviceInput: preserviceInput,
        approval_amt: app_amt,
        saved: saved
      });
    }
  } else {
    $this.setState({
      orderpackagedata: orderpackagedata,
      preserviceInput: preserviceInput,
      approval_amt: app_amt,
      saved: saved
    });
  }
};
//Save Order
const SaveOrdersServices = ($this, e) => {
  algaehApiCall({
    uri: "/orderAndPreApproval/addPackage",
    data: $this.state.orderpackagedata,
    method: "POST",
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          s_service_type: null,
          s_service: null,
          selectedLang: "en",
          patient_id: $this.props.patient_id,
          visit_id: $this.props.visit_id,
          doctor_id: null,
          vat_applicable: $this.props.vat_applicable,

          orderpackagedata: [],
          approval_amt: 0,
          preapp_limit_amount: 0,
          preserviceInput: [],
          dummy_company_payble: 0,
          approval_limit_yesno: "N",
          insurance_service_name: null,
          saved: true,

          insured: "N",
          primary_insurance_provider_id: null,
          primary_network_office_id: null,
          primary_network_id: null,
          sec_insured: "N",
          secondary_insurance_provider_id: null,
          secondary_network_id: null,
          secondary_network_office_id: null,
          test_type: "R",
          addNew: false,
          patient_payable: null,
          company_payble: null,
          sec_company_paybale: null,
          sub_total_amount: null,
          discount_amount: null,
          net_total: null
        });
        $this.props.onClose && $this.props.onClose(e);

        swalMessage({
          title: "Ordered Successfully.",
          type: "success"
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.response.data.message,
        type: "error"
      });
    }
  });
};

const calculateAmount = ($this, row, e) => {
  let orderpackagedata = $this.state.orderpackagedata;

  let discount_percentage = 0;
  let discount_amout = 0;
  if (e.target.name === "discount_percentage") {
    discount_percentage =
      e.target.value === "" ? "" : parseFloat(e.target.value);
    discount_amout = 0;
  } else {
    discount_amout = e.target.value === "" ? "" : parseFloat(e.target.value);
    discount_percentage = 0;
  }
  if (parseFloat(discount_percentage) > 100) {
    swalMessage({
      title: "Discount % cannot be greater than 100.",
      type: "warning"
    });
    discount_percentage = 0;
  } else if (discount_amout > parseFloat(row.unit_cost)) {
    swalMessage({
      title: "Discount Amount cannot be greater than Unit Cost.",
      type: "warning"
    });
    discount_amout = 0;
  }
  row[e.target.name] = parseFloat(e.target.value);
  let inputParam = [
    {
      hims_d_services_id: row.services_id,
      quantity: row.quantity,
      discount_amout: discount_amout,
      discount_percentage: discount_percentage,

      insured: $this.state.insured === null ? "N" : $this.state.insured,
      vat_applicable: $this.props.vat_applicable,
      primary_insurance_provider_id: $this.state.insurance_provider_id,
      primary_network_office_id: $this.state.hims_d_insurance_network_office_id,
      primary_network_id: $this.state.network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id,
      approval_amt: $this.state.approval_amt,
      approval_limit_yesno: $this.state.approval_limit_yesno,
      preapp_limit_amount: $this.state.preapp_limit_amount
    }
  ];

  algaehApiCall({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    data: inputParam,
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        extend(row, data.billdetails[0]);
        orderpackagedata[row.rowIdx] = row;
        algaehApiCall({
          uri: "/billing/billingCalculations",
          module: "billing",
          method: "POST",
          data: { billdetails: orderpackagedata },
          onSuccess: response => {
            if (response.data.success) {
              let header_data = response.data.records;
              $this.setState({
                orderpackagedata: orderpackagedata,
                sub_total_amount: header_data.sub_total_amount,
                discount_amount: header_data.discount_amount,
                net_total: header_data.net_total,
                patient_payable: header_data.patient_payable,
                company_payble: header_data.company_payble,
                copay_amount: header_data.copay_amount,
                sec_copay_amount: header_data.sec_copay_amount,
                deductable_amount: header_data.deductable_amount,
                sec_deductable_amount: header_data.sec_deductable_amount
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
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

const updateBillDetail = ($this, e) => {
  $this.props.billingCalculations({
    uri: "/billing/billingCalculations",
    module: "billing",
    method: "POST",
    data: { billdetails: $this.state.orderpackagedata },
    redux: {
      type: "BILL_HEADER_GEN_GET_DATA",
      mappingName: "genbill"
    },
    afterSuccess: data => {
      $this.setState({
        sub_total_amount: data.sub_total_amount,
        discount_amount: data.discount_amount,
        net_total: data.net_total,
        patient_payable: data.patient_payable,
        company_payble: data.company_payble,
        copay_amount: data.copay_amount,
        sec_copay_amount: data.sec_copay_amount,
        deductable_amount: data.deductable_amount,
        sec_deductable_amount: data.sec_deductable_amount,
        addNewService: !$this.state.addNewService,
        saved: !$this.state.saved
      });
    }
  });
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  // row.update();
  calculateAmount($this, row, e);
};

const EditGrid = ($this, cancelRow) => {
  let _orderpackagedata = $this.state.orderpackagedata;

  if (cancelRow !== undefined) {
    _orderpackagedata[cancelRow.rowIdx] = cancelRow;
  }

  $this.setState({
    saved: !$this.state.saved,
    addNewService: !$this.state.addNewService,
    orderpackagedata: _orderpackagedata
  });
};

const makeZeroIngrid = ($this, row, e) => {
  if (e.target.value === "") {
    let orderpackagedata = $this.state.orderpackagedata;
    let _index = orderpackagedata.indexOf(row);
    row["discount_amout"] = 0;
    row["discount_percentage"] = 0;

    orderpackagedata[_index] = row;
    $this.setState({
      orderpackagedata: orderpackagedata
    });
  }
};

const ClosePackageMaster = ($this, e) => {
  if (e === false) {
    $this.setState({
      isOpen: !$this.state.isOpen
    });
  } else {
    $this.props.getServices({
      uri: "/serviceType/getService",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "serviceslist"
      }
    });

    $this.setState(
      {
        isOpen: !$this.state.isOpen,
        s_service: e.package_service_id,
        s_service_type: 14,
        package_code: e.package_code
      },
      () => {
        ProcessService($this, e);
      }
    );
  }
};

const ShowPackageMaster = ($this, e) => {
  $this.setState({
    isOpen: !$this.state.isOpen
  });
};
export {
  serviceTypeHandeler,
  serviceHandeler,
  texthandle,
  ProcessService,
  deleteServices,
  SaveOrdersServices,
  calculateAmount,
  updateBillDetail,
  onchangegridcol,
  EditGrid,
  makeZeroIngrid,
  ClosePackageMaster,
  ShowPackageMaster
};
