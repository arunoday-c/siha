import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import extend from "extend";
import Enumerable from "linq";
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
  $this.setState({
    s_service: e.hims_d_services_id,
    s_service_type: e.service_type_id,
    insurance_service_name: e.service_name,
    service_name: e.service_name
  });
};

//Process and gets selectd service data with all calculation
const ProcessService = ($this, favouriteOrder, e) => {
  // orderedList
  let s_service = $this.state.s_service,
    s_service_type = $this.state.s_service_type;
  $this.setState(
    {
      loading_ProcessService: true
    },
    () => {
      let SelectedService = undefined;
      let PreSelectedService = undefined;
      if ($this.state.s_service_type !== 2) {
        SelectedService = _.find(
          $this.props.orderedList,
          f =>
            f.service_type_id === $this.state.s_service_type &&
            f.services_id === $this.state.s_service
        );

        PreSelectedService = _.find(
          $this.state.orderservicesdata,
          f =>
            f.service_type_id === $this.state.s_service_type &&
            f.services_id === $this.state.s_service
        );
      }

      if (SelectedService === undefined && PreSelectedService === undefined) {
        if (
          $this.state.s_service_type !== null &&
          $this.state.s_service !== null
        ) {
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
              secondary_network_office_id:
                $this.state.secondary_network_office_id,
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
                              Service_data.billdetails[i].visit_id =
                                $this.state.visit_id;
                              Service_data.billdetails[i].patient_id =
                                $this.state.patient_id;

                              Service_data.billdetails[i].doctor_id =
                                Window.global["provider_id"];
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
                              // Service_data.billdetails[i].icd_code === Service_data.billdetails[0].icd_code;
                              // Approval Table

                              Service_data.billdetails[
                                i
                              ].insurance_network_office_id =
                                $this.state.hims_d_insurance_network_office_id;

                              Service_data.billdetails[i].requested_quantity =
                                Service_data.billdetails[i].quantity;
                              Service_data.billdetails[i].test_type =
                                $this.state.test_type;
                            }

                            $this.setState({
                              orderservicesdata: Service_data.billdetails,
                              approval_amt: approval_amt,
                              preserviceInput: preserviceInput,
                              approval_limit_yesno: approval_limit_yesno,
                              saved: false,
                              // s_service_type: null,
                              s_service: null,
                              test_type: "R",
                              service_name: ""
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
                                      response.data.records.sec_copay_amount,
                                    loading_ProcessService: false
                                  });
                                }
                              },
                              onFailure: error => {
                                $this.setState(
                                  {
                                    loading_ProcessService: false
                                  },
                                  () => {
                                    swalMessage({
                                      title: error.message,
                                      type: "error"
                                    });
                                  }
                                );
                              }
                            });
                          }
                        },
                        onFailure: error => {
                          $this.setState(
                            {
                              loading_ProcessService: false
                            },
                            () => {
                              swalMessage({
                                title: error.message,
                                type: "error"
                              });
                            }
                          );
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
                  // data.billdetails[0].icd_code = "1";
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
                  let preapp_limit_amount =
                    data.billdetails[0].preapp_limit_amount;

                  preserviceInput.push(serviceInput[0]);
                  $this.setState({
                    orderservicesdata: existingservices,
                    approval_amt: approval_amt,
                    preserviceInput: preserviceInput,
                    preapp_limit_amount: preapp_limit_amount,
                    saved: false,
                    // s_service_type: null,
                    s_service: null,
                    test_type: "R",
                    service_name: ""
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
                            response.data.records.sec_copay_amount,
                          loading_ProcessService: false
                        });
                      }
                    },
                    onFailure: error => {
                      $this.setState(
                        {
                          loading_ProcessService: false
                        },
                        () => {
                          swalMessage({
                            title: error.message,
                            type: "error"
                          });
                        }
                      );
                    }
                  });
                }

                if (favouriteOrder === "F") {
                  let fav_exists = _.find(
                    $this.state.all_favouriteservices,
                    f =>
                      f.service_type_id === s_service_type &&
                      f.services_id === s_service
                  );
                  if (fav_exists === undefined) {
                    algaehApiCall({
                      uri: "/favouriteOrders/addFavouriteServices",
                      module: "masterSettings",
                      method: "POST",
                      data: {
                        services_id: s_service,
                        service_type_id: s_service_type,
                        doctor_id: Window.global["provider_id"]
                      },
                      onSuccess: response => {
                        if (response.data.success) {
                          getFavouriteServices($this);
                        }
                      },
                      onFailure: error => {
                        $this.setState(
                          {
                            loading_ProcessService: false
                          },
                          () => {
                            swalMessage({
                              title: error.message,
                              type: "error"
                            });
                          }
                        );
                      }
                    });
                  }
                }
              }
            },
            onFailure: error => {
              $this.setState(
                {
                  loading_ProcessService: false
                },
                () => {
                  swalMessage({
                    title: error.message,
                    type: "error"
                  });
                }
              );
            }
          });
        } else {
          $this.setState(
            {
              loading_ProcessService: false
            },
            () => {
              swalMessage({
                title: "Please select service and service type.",
                type: "warning"
              });
            }
          );
        }
      } else {
        $this.setState(
          {
            loading_ProcessService: false
          },
          () => {
            swalMessage({
              title: "Selected Service already ordered.",
              type: "warning"
            });
          }
        );
      }
    }
  );
};

//if services got delete and if pre apprival limit exceed
const deleteServices = ($this, row, rowId) => {
  let orderservicesdata = $this.state.orderservicesdata;
  let preserviceInput = $this.state.preserviceInput;

  const get_selected_row = _.find(
    preserviceInput,
    f => f.hims_d_services_id === row["services_id"]
  );

  const _index = preserviceInput.indexOf(get_selected_row);
  let saved = false;

  const _order_index = orderservicesdata.indexOf(row);

  orderservicesdata.splice(_order_index, 1);
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
                    orderservicesdata: data.billdetails,
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
  $this.setState(
    {
      loading_saveOrderService: true
    },
    () => {
      let inputObj = {
        visit_id: $this.state.visit_id,
        patient_id: $this.state.patient_id,
        incharge_or_provider: Window.global["provider_id"],
        doctor_id: Window.global["provider_id"],
        ordered_by: Window.global["provider_id"],
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
                s_service_type: null,
                s_service: null,
                selectedLang: "en",
                patient_id: Window.global["current_patient"],
                visit_id: Window.global["visit_id"],
                doctor_id: null,
                vat_applicable: $this.props.vat_applicable,
                loading_saveOrderService: false,
                orderservicesdata: [],
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
              },
              () => {
                if ($this.serviceSocket.connected) {
                  $this.serviceSocket.emit("service_ordered", inputObj);
                }
              }
            );
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
        },
        onCatch: error => {
          $this.setState({
            loading_saveOrderService: false
          });
          swalMessage({
            title: error,
            type: "error"
          });
        }
      });
    }
  );
};

const calculateAmount = ($this, row, e) => {
  let orderservicesdata = $this.state.orderservicesdata;
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
        orderservicesdata[row.rowIdx] = row;
        algaehApiCall({
          uri: "/billing/billingCalculations",
          module: "billing",
          method: "POST",
          data: { billdetails: orderservicesdata },
          onSuccess: response => {
            if (response.data.success) {
              let header_data = response.data.records;
              $this.setState({
                orderservicesdata: orderservicesdata,
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
  // row.update();
  calculateAmount($this, row, e);
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

const makeZeroIngrid = ($this, row, e) => {
  if (e.target.value === "") {
    let orderservicesdata = $this.state.orderservicesdata;
    let _index = orderservicesdata.indexOf(row);
    row["discount_amout"] = 0;
    row["discount_percentage"] = 0;

    orderservicesdata[_index] = row;
    $this.setState({
      orderservicesdata: orderservicesdata
    });
  }
};

const openFavouriteOrder = $this => {
  $this.setState({
    isOpen: !$this.state.isOpen
  });
};

const openViewFavouriteOrder = $this => {
  algaehApiCall({
    uri: "/favouriteOrders/getFavouriteOrder",
    module: "masterSettings",
    method: "GET",
    data: { doctor_id: Window.global["provider_id"] },
    onSuccess: response => {
      if (response.data.success) {
        let ItemList = Enumerable.from(response.data.records)
          .groupBy("$.hims_d_favourite_orders_header_id", null, (k, g) => {
            let firstRecordSet = Enumerable.from(g).firstOrDefault();

            return {
              hims_d_favourite_orders_header_id:
                firstRecordSet.hims_d_favourite_orders_header_id,
              favourite_description: firstRecordSet.favourite_description,
              favourite_details: g.getSource()
            };
          })
          .toArray();

        $this.setState({
          all_favourites: ItemList,
          isFavOpen: !$this.state.isFavOpen
        });
      }
    }
  });
};

const closeViewFavouriteOrder = ($this, e) => {
  if (e.length > 0) {
    $this.setState(
      {
        all_favourites: e,
        isFavOpen: !$this.state.isFavOpen
      },
      () => {
        ProcessFromFavourite($this, "Orders");
      }
    );
  } else {
    $this.setState({
      isFavOpen: !$this.state.isFavOpen
    });
  }
};
const getFavouriteServices = $this => {
  algaehApiCall({
    uri: "/favouriteOrders/getFavouriteServices",
    module: "masterSettings",
    method: "GET",
    data: { doctor_id: Window.global["provider_id"] },
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          all_favouriteservices: response.data.records
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

const selectToProcess = ($this, row, e) => {
  let all_favouriteservices = $this.state.all_favouriteservices;
  let add_to_list = true;
  if (e.target.checked === true) {
    row["select_to_process"] = "Y";
  } else if (e.target.checked === false) {
    row["select_to_process"] = "N";
  }

  all_favouriteservices[row.rowIdx] = row;

  let listOfinclude = Enumerable.from(all_favouriteservices)
    .where(w => w.select_to_process === "Y")
    .toArray();
  if (listOfinclude.length > 0) {
    add_to_list = false;
  }
  $this.setState({
    add_to_list: add_to_list,
    all_favouriteservices: all_favouriteservices
  });
};

//Process and gets selectd service data with all calculation
const ProcessFromFavourite = ($this, from) => {
  // orderedList

  let serviceInput = [];
  let preserviceInput = $this.state.preserviceInput || [];
  let Selected_Services = null;
  if (from === "Services") {
    Selected_Services = Enumerable.from($this.state.all_favouriteservices)
      .where(w => w.select_to_process === "Y")
      .toArray();
  } else {
    Selected_Services = $this.state.all_favourites;
  }

  if (Selected_Services.length <= 0) {
    swalMessage({
      title: "Need to select atleast one sevice",
      type: "warning"
    });
    return;
  }

  for (let d = 0; d < Selected_Services.length; d++) {
    let SelectedService = undefined;
    let PreSelectedService = undefined;
    if (Selected_Services[d].service_type_id !== 2) {
      SelectedService = _.find(
        $this.props.orderedList,
        f =>
          f.service_type_id === Selected_Services[d].service_type_id &&
          f.services_id === Selected_Services[d].services_id
      );

      PreSelectedService = _.find(
        $this.state.orderservicesdata,
        f =>
          f.service_type_id === Selected_Services[d].service_type_id &&
          f.services_id === Selected_Services[d].services_id
      );
    }

    if (SelectedService !== undefined || PreSelectedService !== undefined) {
      $this.setState(
        {
          loading_ProcessService: false
        },
        () => {
          swalMessage({
            title: "Selected Service already ordered.",
            type: "warning"
          });
        }
      );
      return;
    }
    serviceInput.push({
      insured: $this.state.insured,
      vat_applicable: $this.props.vat_applicable,
      service_type_id: Selected_Services[d].service_type_id,
      hims_d_services_id: Selected_Services[d].services_id,
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
      preapp_limit_amount: $this.state.preapp_limit_amount,
      bulkProcess: "Y"
    });

    preserviceInput.push({
      insured: $this.state.insured,
      vat_applicable: $this.props.vat_applicable,
      service_type_id: Selected_Services[d].service_type_id,
      hims_d_services_id: Selected_Services[d].services_id,
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
    });
  }
  $this.setState(
    {
      loading_bulk_Service: true
    },
    () => {
      getFavouriteServices($this);

      algaehApiCall({
        uri: "/billing/getBillDetails",
        module: "billing",
        method: "POST",
        data: serviceInput,
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;
            let preapp_limit_exceed = _.find(
              data.billdetails,
              f => f.preapp_limit_exceed === "Y"
            );
            if (
              preapp_limit_exceed !== undefined &&
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
                cancelButtonText: "No",
                allowEscapeKey: false,
                allowOutsideClick: false
              }).then(willProceed => {
                if (willProceed.value) {
                  // preserviceInput.push(serviceInput[0]);

                  for (let k = 0; k < preserviceInput.length; k++) {
                    preserviceInput[k].approval_limit_yesno = "Y";
                  }
                  let approval_amt = data.billdetails[0].approval_amt;
                  let approval_limit_yesno = "Y";

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
                          // Service_data.billdetails[i].insurance_service_name =
                          //   $this.state.insurance_service_name;
                          Service_data.billdetails[i].sec_company =
                            $this.state.sec_insured;
                          // Service_data.billdetails[i].icd_code === Service_data.billdetails[0].icd_code;
                          // Approval Table

                          Service_data.billdetails[
                            i
                          ].insurance_network_office_id =
                            $this.state.hims_d_insurance_network_office_id;

                          Service_data.billdetails[i].requested_quantity =
                            Service_data.billdetails[i].quantity;
                          Service_data.billdetails[i].test_type =
                            $this.state.test_type;
                        }

                        $this.setState({
                          orderservicesdata: Service_data.billdetails,
                          approval_amt: approval_amt,
                          preserviceInput: preserviceInput,
                          approval_limit_yesno: approval_limit_yesno,
                          saved: false,
                          preapp_limit_amount: parseFloat(
                            data.billdetails[0].preapp_limit_amount
                          ),
                          // s_service_type: null,
                          s_service: null,
                          test_type: "R",
                          service_name: ""
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
                                  response.data.records.sec_copay_amount,
                                loading_bulk_Service: false,
                                add_to_list: true
                              });
                            }
                          },
                          onFailure: error => {
                            $this.setState(
                              {
                                loading_bulk_Service: false
                              },
                              () => {
                                swalMessage({
                                  title: error.message,
                                  type: "error"
                                });
                              }
                            );
                          }
                        });
                      }
                    },
                    onFailure: error => {
                      $this.setState(
                        {
                          loading_bulk_Service: false
                        },
                        () => {
                          swalMessage({
                            title: error.message,
                            type: "error"
                          });
                        }
                      );
                    }
                  });
                } else {
                  $this.setState({
                    preserviceInput: [],
                    loading_bulk_Service: false
                  });
                }
              });
            } else {
              let existingservices = $this.state.orderservicesdata;
              let approval_amt = 0;
              let preapp_limit_amount = 0;
              for (let c = 0; c < data.billdetails.length; c++) {
                data.billdetails[c].visit_id = $this.state.visit_id;
                data.billdetails[c].patient_id = $this.state.patient_id;

                data.billdetails[c].insurance_provider_id =
                  $this.state.insurance_provider_id;
                data.billdetails[c].insurance_sub_id =
                  $this.state.sub_insurance_provider_id;
                data.billdetails[c].network_id = $this.state.network_id;
                data.billdetails[c].policy_number = $this.state.policy_number;
                // data.billdetails[c].insurance_service_name =
                //   $this.state.insurance_service_name;
                // data.billdetails[c].icd_code = "1";
                // data.billdetails[0].icd_code === ""
                //   ? null
                //   : data.billdetails[0].icd_code;
                //Approval Table TODO
                //TODO

                data.billdetails[c].insurance_network_office_id =
                  $this.state.hims_d_insurance_network_office_id;

                data.billdetails[c].requested_quantity =
                  data.billdetails[c].quantity;
                data.billdetails[c].doctor_id = Window.global["provider_id"];
                data.billdetails[c].sec_company = $this.state.sec_insured;
                data.billdetails[c].test_type = $this.state.test_type;
                //If pre-approval required for selected service

                if (
                  data.billdetails[c].pre_approval === "Y" &&
                  $this.state.approval_limit_yesno === "N"
                ) {
                  swalMessage({
                    title: "Selected Service is Pre-Approval required.",
                    type: "warning"
                  });
                } else if (
                  data.billdetails[c].insurance_yesno === "Y" &&
                  $this.state.approval_limit_yesno === "Y"
                ) {
                  data.billdetails[c].pre_approval = "Y";
                } else {
                  data.billdetails[c].pre_approval = "N";
                }
                if (data.billdetails.length !== 0) {
                  existingservices.splice(0, 0, data.billdetails[c]);
                }
                approval_amt =
                  approval_amt + parseFloat(data.billdetails[c].approval_amt);
                preapp_limit_amount = parseFloat(
                  data.billdetails[c].preapp_limit_amount
                );
                // preserviceInput.push(serviceInput[c]);
              }

              $this.setState({
                orderservicesdata: existingservices,
                approval_amt: approval_amt,
                preserviceInput: preserviceInput,
                preapp_limit_amount: preapp_limit_amount,
                saved: false,
                // s_service_type: null,
                s_service: null,
                test_type: "R",
                service_name: ""
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
                      loading_bulk_Service: false,
                      add_to_list: true
                    });
                  }
                },
                onFailure: error => {
                  $this.setState(
                    {
                      loading_bulk_Service: false
                    },
                    () => {
                      swalMessage({
                        title: error.message,
                        type: "error"
                      });
                    }
                  );
                }
              });
            }
          }
        },
        onFailure: error => {
          $this.setState(
            {
              loading_bulk_Service: false
            },
            () => {
              swalMessage({
                title: error.message,
                type: "error"
              });
            }
          );
        }
      });
    }
  );
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
  openFavouriteOrder,
  getFavouriteServices,
  selectToProcess,
  ProcessFromFavourite,
  openViewFavouriteOrder,
  closeViewFavouriteOrder
};
