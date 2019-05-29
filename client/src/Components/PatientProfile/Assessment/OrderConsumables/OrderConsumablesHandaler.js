import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import extend from "extend";
import Enumerable from "linq";

//Text Handaler Change
const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const selectItemHandeler = ($this, e) => {
  debugger;
  $this.setState({
    [e.name]: e.hims_d_inventory_item_master_id,
    service_type_id: e.service_type_id,
    services_id: e.services_id,
    batchno: e.batchno,
    expirydt: e.expirydt,
    grnno: e.grnno,
    barcode: e.barcode,
    qtyhand: e.qtyhand,
    uom_id: e.sales_uom
  });
};

//Process and gets selectd service data with all calculation
const ProcessService = ($this, e) => {
  debugger;

  let SelectedService = Enumerable.from($this.props.orderedList)
    .where(
      w =>
        w.service_type_id === $this.state.s_service_type &&
        w.services_id === $this.state.s_service
    )
    .toArray();

  let PreSelectedService = Enumerable.from($this.state.orderservicesdata)
    .where(
      w =>
        w.service_type_id === $this.state.s_service_type &&
        w.services_id === $this.state.s_service
    )
    .toArray();

  if (SelectedService.length === 0 && PreSelectedService.length === 0) {
    if ($this.state.s_service_type !== null && $this.state.s_service !== null) {
      let preserviceInput = $this.state.preserviceInput || [];
      let serviceInput = [
        {
          insured: $this.state.insured,
          vat_applicable: $this.props.vat_applicable,
          hims_d_services_id: $this.state.s_service,
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
          preapp_limit_amount: $this.state.preapp_limit_amount
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
              preserviceInput.push(serviceInput[0]);
              for (let k = 0; k < preserviceInput.length; k++) {
                preserviceInput[k].approval_limit_yesno =
                  data.billdetails[0].preapp_limit_exceed;
              }

              swal({
                title:
                  "With this service Approval Limit exceed. Do you want to proceed, If proceeds all the selected services will be pro aproved and will be as cash.",
                type: "warning",
                buttons: true
              }).then(willProceed => {
                if (willProceed) {
                  let approval_amt = data.billdetails[0].approval_amt;
                  let approval_limit_yesno =
                    data.billdetails[0].preapp_limit_exceed;

                  algaehApiCall({
                    uri: "/billing/getBillDetails",
                    module: "billing",
                    method: "POST",
                    data: serviceInput,
                    onSuccess: response => {
                      if (response.data.success) {
                        let data = response.data.records;

                        for (let i = 0; i < data.billdetails.length; i++) {
                          data.billdetails[i].visit_id = $this.state.visit_id;
                          data.billdetails[i].patient_id =
                            $this.state.patient_id;

                          data.billdetails[i].doctor_id =
                            Window.global["provider_id"];
                          data.billdetails[i].insurance_provider_id =
                            $this.state.insurance_provider_id;
                          data.billdetails[i].insurance_sub_id =
                            $this.state.sub_insurance_provider_id;
                          data.billdetails[i].network_id =
                            $this.state.network_id;
                          data.billdetails[i].policy_number =
                            $this.state.policy_number;
                          data.billdetails[i].insurance_service_name =
                            $this.state.insurance_service_name;

                          data.billdetails[0].item_id = $this.state.item_id;
                          data.billdetails[0].item_category =
                            $this.state.item_category;
                          data.billdetails[0].item_group_id =
                            $this.state.item_group_id;
                          data.billdetails[0].expirydt = $this.state.expirydt;
                          data.billdetails[0].batchno = $this.state.batchno;
                          data.billdetails[0].uom_id = $this.state.uom_id;
                          data.billdetails[0].operation = "-";
                          data.billdetails[0].grn_no = $this.state.grn_no;
                          data.billdetails[0].qtyhand = $this.state.qtyhand;
                          data.billdetails[0].barcode = $this.state.barcode;
                          data.billdetails[0].service_id =
                            data.billdetails[0].services_id;

                          data.billdetails[i].insurance_network_office_id =
                            $this.state.hims_d_insurance_network_office_id;

                          data.billdetails[i].requested_quantity =
                            data.billdetails[i].quantity;
                          data.billdetails[i].test_type = $this.state.test_type;
                        }

                        $this.setState({
                          orderservicesdata: data.billdetails,
                          approval_amt: approval_amt,
                          preserviceInput: preserviceInput,
                          approval_limit_yesno: approval_limit_yesno,
                          saved: false,
                          // s_service_type: null,
                          s_service: null,
                          test_type: "R"
                        });

                        algaehApiCall({
                          uri: "/billing/billingCalculations",
                          module: "billing",
                          method: "POST",
                          data: { billdetails: data.billdetails },
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
              let existingservices = $this.state.orderservicesdata;

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
              data.billdetails[0].icd_code = "1";
              // data.billdetails[0].icd_code === ""
              //   ? null
              //   : data.billdetails[0].icd_code;
              //Approval Table TODO
              //TODO

              data.billdetails[0].insurance_network_office_id =
                $this.state.hims_d_insurance_network_office_id;

              data.billdetails[0].requested_quantity =
                data.billdetails[0].quantity;
              data.billdetails[0].doctor_id = Window.global["provider_id"];
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
              } else {
                data.billdetails[0].pre_approval = "N";
              }
              if (data.billdetails.length !== 0) {
                existingservices.splice(0, 0, data.billdetails[0]);
              }
              let approval_amt = data.billdetails[0].approval_amt;
              let preapp_limit_amount = data.billdetails[0].preapp_limit_amount;

              preserviceInput.push(serviceInput[0]);
              $this.setState({
                orderservicesdata: existingservices,
                approval_amt: approval_amt,
                preserviceInput: preserviceInput,
                preapp_limit_amount: preapp_limit_amount,
                saved: false,
                // s_service_type: null,
                s_service: null,
                test_type: "R"
              });

              algaehApiCall({
                uri: "/billing/billingCalculations",
                module: "billing",
                method: "POST",
                data: { billdetails: existingservices },
                onSuccess: response => {
                  if (response.data.success) {
                    $this.setState({
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
  let orderservicesdata = $this.state.orderservicesdata;
  let preserviceInput = $this.state.preserviceInput;
  let saved = false;

  orderservicesdata.splice(row.rowIdx, 1);

  if (orderservicesdata.length === 0) {
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
  for (var i = 0; i < preserviceInput.length; i++) {
    if (preserviceInput[i].hims_d_services_id === row["services_id"]) {
      preserviceInput.splice(i, 1);
    }
  }
  if ($this.state.approval_limit_yesno === "Y") {
    if (app_amt < $this.state.preapp_limit_amount) {
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
            $this.setState({
              orderservicesdata: data.billdetails,
              approval_amt: app_amt,
              preserviceInput: preserviceInput,
              approval_limit_yesno: "N",
              saved: saved
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
        orderservicesdata: orderservicesdata,
        preserviceInput: preserviceInput,
        approval_amt: app_amt,
        saved: saved
      });
    }
  } else {
    $this.setState({
      orderservicesdata: orderservicesdata,
      preserviceInput: preserviceInput,
      approval_amt: app_amt,
      saved: saved
    });
  }
};
//Save Order
const SaveOrdersServices = ($this, e) => {
  let inputObj = {
    visit_id: $this.state.visit_id,
    patient_id: $this.state.patient_id,
    incharge_or_provider: Window.global["provider_id"],
    billed: "N",
    billdetails: $this.state.orderservicesdata
  };
  algaehApiCall({
    uri: "/orderAndPreApproval/insertOrderedServices",
    data: inputObj,
    method: "POST",
    onSuccess: response => {
      if (response.data.success) {
        $this.setState(
          {
            addNew: true
          },
          () => {
            $this.props.onClose && $this.props.onClose(e);
          }
        );
        swalMessage({
          title: "Ordered Successfully...",
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

const calculateAmount = ($this, row, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value !== e.target.oldvalue) {
    let orderservicesdata = $this.state.orderservicesdata;

    row[e.target.name] = parseFloat(e.target.value);
    let inputParam = [
      {
        hims_d_services_id: row.services_id,
        quantity: row.quantity,
        discount_amout:
          e.target.name === "discount_percentage" ? 0 : row.discount_amout,
        discount_percentage:
          e.target.name === "discount_amout" ? 0 : row.discount_percentage,

        insured: $this.state.insured === null ? "N" : $this.state.insured,
        vat_applicable: $this.props.vat_applicable,
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
          orderservicesdata[row.rowIdx] = row;
          $this.setState({ orderservicesdata: orderservicesdata });
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
};

const updateBillDetail = ($this, e) => {
  $this.props.billingCalculations({
    uri: "/billing/billingCalculations",
    module: "billing",
    method: "POST",
    data: { billdetails: $this.state.orderservicesdata },
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
  row.update();
};

const EditGrid = ($this, cancelRow) => {
  let _orderservicesdata = $this.state.orderservicesdata;

  if (cancelRow !== undefined) {
    _orderservicesdata[cancelRow.rowIdx] = cancelRow;
  }

  $this.setState({
    saved: !$this.state.saved,
    addNewService: !$this.state.addNewService,
    orderservicesdata: _orderservicesdata
  });
};

export {
  selectItemHandeler,
  texthandle,
  ProcessService,
  deleteServices,
  SaveOrdersServices,
  calculateAmount,
  updateBillDetail,
  onchangegridcol,
  EditGrid
};
