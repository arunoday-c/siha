import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import extend from "extend";
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

const selectItemHandeler = ($this, e) => {
  $this.setState({
    item_description: e.item_description,
    inventory_item_id: e.hims_d_inventory_item_master_id,
    service_type_id: e.service_type_id,
    services_id: e.services_id,
    batchno: e.batchno,
    expirydt: e.expirydt,
    grnno: e.grnno,
    barcode: e.barcode,
    qtyhand: e.qtyhand,
    uom_id: e.sales_uom,
    item_category_id: e.category_id,
    item_group_id: e.group_id,
    unit_cost: e.sale_price
  });
};

const ProcessService = ($this, e) => {

  if ($this.state.inventory_item_id !== null) {
    let preserviceInput = $this.state.preserviceInput || [];
    let serviceInput = [
      {
        insured: $this.state.insured,
        vat_applicable: $this.props.vat_applicable,
        hims_d_services_id: $this.state.services_id,
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
        unit_cost: $this.state.unit_cost
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

                let approval_amt = data.approval_amt;
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
                        Service_data.billdetails[i].visit_id =
                          $this.state.visit_id;
                        Service_data.billdetails[i].patient_id =
                          $this.state.patient_id;

                        Service_data.billdetails[i].doctor_id =
                          Window.global["provider_id"];
                        Service_data.billdetails[i].insurance_provider_id =
                          $this.state.insurance_provider_id;
                        Service_data.billdetails[i].insurance_sub_id =
                          $this.state.sub_insurance_provider_id;
                        Service_data.billdetails[i].network_id =
                          $this.state.network_id;
                        Service_data.billdetails[i].policy_number =
                          $this.state.policy_number;
                        Service_data.billdetails[i].insurance_service_name =
                          $this.state.insurance_service_name;

                        Service_data.billdetails[i].inventory_item_id =
                          $this.state.inventory_item_id;

                        Service_data.billdetails[i].item_id =
                          $this.state.inventory_item_id;
                        Service_data.billdetails[i].item_category_id =
                          $this.state.item_category_id;
                        Service_data.billdetails[i].item_group_id =
                          $this.state.item_group_id;

                        Service_data.billdetails[i].expiry_date =
                          $this.state.expirydt;
                        Service_data.billdetails[i].expirydt =
                          $this.state.expirydt;
                        Service_data.billdetails[i].batchno =
                          $this.state.batchno;
                        Service_data.billdetails[i].uom_id = $this.state.uom_id;
                        Service_data.billdetails[i].sales_uom =
                          $this.state.uom_id;
                        Service_data.billdetails[i].operation = "-";
                        Service_data.billdetails[i].grn_number =
                          $this.state.grnno;
                        Service_data.billdetails[i].qtyhand =
                          $this.state.qtyhand;
                        Service_data.billdetails[i].barcode =
                          $this.state.barcode;
                        Service_data.billdetails[i].extended_cost =
                          Service_data.billdetails[i].gross_amount;
                        Service_data.billdetails[i].net_total =
                          Service_data.billdetails[i].net_amout;

                        Service_data.billdetails[i].inventory_uom_id =
                          $this.state.uom_id;
                        Service_data.billdetails[i].location_type =
                          $this.state.location_type;

                        Service_data.billdetails[i].location_id =
                          $this.state.inventory_location_id;

                        Service_data.billdetails[
                          i
                        ].insurance_network_office_id =
                          $this.state.hims_d_insurance_network_office_id;

                        Service_data.billdetails[i].requested_quantity =
                          Service_data.billdetails[i].quantity;
                        Service_data.billdetails[i].test_type =
                          $this.state.test_type;
                        Service_data.billdetails[i].item_notchargable =
                          $this.state.item_notchargable;
                      }

                      $this.setState({
                        orderconsumabledata: Service_data.billdetails,
                        approval_amt: approval_amt,
                        preserviceInput: preserviceInput,
                        approval_limit_yesno: approval_limit_yesno,
                        saved: false
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
                              copay_amount: response.data.records.copay_amount,
                              sec_copay_amount:
                                response.data.records.sec_copay_amount,

                              inventory_item_id: null,
                              service_type_id: null,
                              services_id: null,
                              batchno: null,
                              expirydt: null,
                              grnno: null,
                              barcode: null,
                              qtyhand: null,
                              uom_id: null,
                              item_notchargable: "N",
                              itemchargable: false,
                              item_description: ""
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
            let existingservices = $this.state.orderconsumabledata;

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

            data.billdetails[0].inventory_item_id =
              $this.state.inventory_item_id;
            data.billdetails[0].item_id = $this.state.inventory_item_id;
            data.billdetails[0].item_category_id = $this.state.item_category_id;
            data.billdetails[0].item_group_id = $this.state.item_group_id;
            data.billdetails[0].expiry_date = $this.state.expirydt;
            data.billdetails[0].expirydt = $this.state.expirydt;
            data.billdetails[0].batchno = $this.state.batchno;
            data.billdetails[0].uom_id = $this.state.uom_id;
            data.billdetails[0].sales_uom = $this.state.uom_id;
            data.billdetails[0].inventory_uom_id = $this.state.uom_id;
            data.billdetails[0].operation = "-";
            data.billdetails[0].grn_number = $this.state.grnno;
            data.billdetails[0].qtyhand = $this.state.qtyhand;
            data.billdetails[0].barcode = $this.state.barcode;
            data.billdetails[0].location_type = $this.state.location_type;
            data.billdetails[0].location_id = $this.state.inventory_location_id;
            data.billdetails[0].extended_cost =
              data.billdetails[0].gross_amount;
            data.billdetails[0].net_total = data.billdetails[0].net_amout;

            data.billdetails[0].insurance_network_office_id =
              $this.state.hims_d_insurance_network_office_id;

            data.billdetails[0].requested_quantity =
              data.billdetails[0].quantity;
            data.billdetails[0].doctor_id = Window.global["provider_id"];
            data.billdetails[0].sec_company = $this.state.sec_insured;
            data.billdetails[0].test_type = $this.state.test_type;
            data.billdetails[0].item_notchargable =
              $this.state.item_notchargable;

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
            if (data.billdetails.length !== 0) {
              existingservices.splice(0, 0, data.billdetails[0]);
            }
            let approval_amt = data.billdetails[0].approval_amt;
            let preapp_limit_amount = data.billdetails[0].preapp_limit_amount;

            preserviceInput.push(serviceInput[0]);
            $this.setState({
              orderconsumabledata: existingservices,
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
                    sec_copay_amount: response.data.records.sec_copay_amount,
                    inventory_item_id: null,
                    service_type_id: null,
                    services_id: null,
                    batchno: null,
                    expirydt: null,
                    grnno: null,
                    barcode: null,
                    qtyhand: null,
                    uom_id: null,
                    item_notchargable: "N",
                    itemchargable: false,
                    item_description: ""
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
      title: "Please select Item.",
      type: "warning"
    });
  }
};

//if services got delete and if pre apprival limit exceed
const deleteServices = ($this, row, rowId) => {
  let orderconsumabledata = $this.state.orderconsumabledata;
  let preserviceInput = $this.state.preserviceInput;

  const get_selected_row = _.find(
    preserviceInput,
    f => f.hims_d_services_id === row["services_id"]
  );

  const _index = preserviceInput.indexOf(get_selected_row);
  let saved = false;
  const _order_index = orderconsumabledata.indexOf(row);

  orderconsumabledata.splice(_order_index, 1);
  if (orderconsumabledata.length === 0) {
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
  preserviceInput.splice(_index, 1);
  let app_amt = $this.state.approval_amt - row["company_payble"];

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

            algaehApiCall({
              uri: "/billing/billingCalculations",
              module: "billing",
              method: "POST",
              data: { billdetails: data.billdetails },
              onSuccess: response => {
                if (response.data.success) {
                  $this.setState({
                    orderconsumabledata: data.billdetails,
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
        orderconsumabledata: orderconsumabledata,
        preserviceInput: preserviceInput,
        approval_amt: app_amt,
        saved: saved
      });
    }
  } else {
    $this.setState({
      orderconsumabledata: orderconsumabledata,
      preserviceInput: preserviceInput,
      approval_amt: app_amt,
      saved: saved
    });
  }
};
//Save Order
const SaveOrdersServices = ($this, e) => {
  AlgaehLoader({ show: true });
  let inputObj = {
    visit_id: $this.state.visit_id,
    patient_id: $this.state.patient_id,
    incharge_or_provider: Window.global["provider_id"],
    doctor_id: Window.global["provider_id"],
    billed: "N",
    billdetails: $this.state.orderconsumabledata
  };
  algaehApiCall({
    uri: "/orderAndPreApproval/insertInvOrderedServices",
    data: inputObj,
    // module: "clicnicalDesk",
    method: "POST",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.state.transaction_type = "CS";
        $this.state.location_id = $this.state.inventory_location_id;
        $this.state.location_type = $this.state.location_type;
        $this.state.inventory_stock_detail = $this.state.orderconsumabledata;
        $this.state.provider_id = Window.global["provider_id"];
        $this.state.transaction_date = new Date();
        algaehApiCall({
          uri: "/inventoryconsumption/addInventoryConsumption",
          module: "inventory",
          data: $this.state,
          onSuccess: response => {
            AlgaehLoader({ show: false });
            if (response.data.success === true) {
              swalMessage({
                title: "Saved successfully . .",
                type: "success"
              });
              $this.setState(
                {
                  s_service_type: null,
                  s_service: null,
                  selectedLang: "en",

                  patient_id: Window.global["current_patient"],
                  visit_id: Window.global["visit_id"],
                  doctor_id: null,
                  vat_applicable: $this.props.vat_applicable,

                  orderconsumabledata: [],
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
                  net_total: null,
                  item_notchargable: "N",
                  itemchargable: false
                },
                () => {
                  $this.props.onClose && $this.props.onClose(e);
                }
              );
            }
          },
          onFailure: err => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      } else {
        AlgaehLoader({ show: false });
      }
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.response.data.message,
        type: "error"
      });
    }
  });
};

const calculateAmount = ($this, row, e) => {
  let orderconsumabledata = $this.state.orderconsumabledata;

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
        orderconsumabledata[row.rowIdx] = row;
        algaehApiCall({
          uri: "/billing/billingCalculations",
          module: "billing",
          method: "POST",
          data: { billdetails: orderconsumabledata },
          onSuccess: response => {
            if (response.data.success) {
              let header_data = response.data.records;
              $this.setState({
                orderconsumabledata: orderconsumabledata,
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
    data: { billdetails: $this.state.orderconsumabledata },
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
  let _orderconsumabledata = $this.state.orderconsumabledata;

  if (cancelRow !== undefined) {
    _orderconsumabledata[cancelRow.rowIdx] = cancelRow;
  }

  $this.setState({
    saved: !$this.state.saved,
    addNewService: !$this.state.addNewService,
    orderconsumabledata: _orderconsumabledata
  });
};

const ItemChargable = ($this, e) => {
  let item_notchargable = "N";
  if (!$this.state.itemchargable === true) {
    item_notchargable = "Y";
  }
  $this.setState({
    item_notchargable: item_notchargable,
    itemchargable: !$this.state.itemchargable
  });
};

const makeZeroIngrid = ($this, row, e) => {
  if (e.target.value === "") {
    let orderconsumabledata = $this.state.orderconsumabledata;
    let _index = orderconsumabledata.indexOf(row);
    row["discount_amout"] = 0;
    row["discount_percentage"] = 0;

    orderconsumabledata[_index] = row;
    $this.setState({
      orderconsumabledata: orderconsumabledata
    });
  }
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
  EditGrid,
  ItemChargable,
  makeZeroIngrid
};
