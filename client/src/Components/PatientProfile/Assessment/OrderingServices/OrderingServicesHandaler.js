import AlgaehSearch from "../../../Wrapper/globalSearch";
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import extend from "extend";

//Text Handaler Change
const texthandle = ($this, e) => {
  $this.setState({
    [e.target.name]: e.target.value
  });
};

// When Service Type selects respective Service Type theService to be filter
const serviceTypeHandeler = ($this, e) => {
  $this.setState(
    {
      [e.name]: e.value
    },
    () => {
      $this.props.getServices({
        uri: "/serviceType/getService",
        method: "GET",
        data: { service_type_id: $this.state.s_service_type },
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "services"
        }
      });
    }
  );
};

const serviceHandeler = ($this, e) => {
  $this.setState({
    [e.name]: e.value,
    s_service_type: e.selected.service_type_id,
    insurance_service_name: e.selected.service_name
  });
};

//Process and gets selectd service data with all calculation
const ProcessService = ($this, e) => {
  let preserviceInput = $this.state.preserviceInput || [];
  let serviceInput = [
    {
      insured: $this.state.insured,
      vat_applicable: $this.state.vat_applicable,
      hims_d_services_id: $this.state.s_service,
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

  $this.props.generateBill({
    uri: "/billing/getBillDetails",
    method: "POST",
    data: serviceInput,
    cancelRequestId: "getBillDetails",
    redux: {
      type: "BILL_GEN_GET_DATA",
      mappingName: "orderservices"
    },
    afterSuccess: data => {
      //If Limit exceed then all the selected services convert to pre-approval
      if (
        data.billdetails[0].preapp_limit_exceed === "Y" &&
        $this.state.approval_limit_yesno === "N"
      ) {
        preserviceInput.push(serviceInput[0]);
        for (let i = 0; i < preserviceInput.length; i++) {
          preserviceInput[i].approval_limit_yesno =
            data.billdetails[0].preapp_limit_exceed;
        }

        swal({
          title:
            "With this service Approval Limit exceed. Do you want to proceed, If proceeds all the selected services will be pro aproved and will be as cash.",
          type: "warning",
          buttons: true,
          dangerMode: true
        }).then(willProceed => {
          if (willProceed) {
            let approval_amt = data.billdetails[0].approval_amt;
            let approval_limit_yesno = data.billdetails[0].preapp_limit_exceed;

            $this.props.generateBill({
              uri: "/billing/getBillDetails",
              method: "POST",
              data: preserviceInput,
              redux: {
                type: "BILL_GEN_GET_DATA",
                mappingName: "xxx"
              },
              afterSuccess: data => {
                for (let i = 0; i < data.billdetails.length; i++) {
                  data.billdetails[i].visit_id = $this.state.visit_id;
                  data.billdetails[i].patient_id = $this.state.patient_id;

                  data.billdetails[i].doctor_id = Window.global["provider_id"];
                  data.billdetails[i].insurance_provider_id =
                    $this.state.insurance_provider_id;
                  data.billdetails[i].insurance_sub_id =
                    $this.state.sub_insurance_provider_id;
                  data.billdetails[i].network_id = $this.state.network_id;
                  data.billdetails[i].policy_number = $this.state.policy_number;
                  data.billdetails[i].insurance_service_name =
                    $this.state.insurance_service_name;

                  // data.billdetails[i].icd_code === data.billdetails[0].icd_code;
                  // Approval Table

                  data.billdetails[i].insurance_network_office_id =
                    $this.state.hims_d_insurance_network_office_id;

                  data.billdetails[i].requested_quantity =
                    data.billdetails[i].quantity;
                }

                $this.setState({
                  orderservicesdata: data.billdetails,
                  approval_amt: approval_amt,
                  preserviceInput: preserviceInput,
                  approval_limit_yesno: approval_limit_yesno
                });

                $this.props.billingCalculations({
                  uri: "/billing/billingCalculations",
                  method: "POST",
                  data: { billdetails: data.billdetails },
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
                      sec_copay_amount: data.sec_copay_amount
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        let existingservices = $this.state.orderservicesdata;

        data.billdetails[0].visit_id = $this.state.visit_id;
        data.billdetails[0].patient_id = $this.state.patient_id;
        // data.billdetails[0].doctor_id = $this.state.doctor_id;
        data.billdetails[0].doctor_id = "2";
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
        //Approval Table

        data.billdetails[0].insurance_network_office_id =
          $this.state.hims_d_insurance_network_office_id;

        data.billdetails[0].requested_quantity = data.billdetails[0].quantity;
        data.billdetails[0].doctor_id = Window.global["provider_id"];

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
          preapp_limit_amount: preapp_limit_amount
        });

        $this.props.billingCalculations({
          uri: "/billing/billingCalculations",
          method: "POST",
          data: { billdetails: existingservices },
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
              sec_copay_amount: data.sec_copay_amount
            });
          }
        });
      }
    }
  });
};

const VisitSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: [
        {
          fieldName: "visit_code",
          label: "Visit Code"
        },
        {
          fieldName: "patient_code",
          label: "Patient Code"
        },
        {
          fieldName: "full_name",
          label: "Patient Name"
        }
      ]
    },
    searchName: "visit",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState(
        {
          visit_code: row.visit_code,
          patient_code: row.patient_code,
          full_name: row.full_name,
          patient_id: row.patient_id,
          visit_id: row.hims_f_patient_visit_id,
          insured: row.insured
        },
        () => {
          if ($this.state.insured === "Y") {
          }
        }
      );
    }
  });
};

//if services got delete and if pre apprival limit exceed
const deleteServices = ($this, row, rowId) => {
  let orderservicesdata = $this.state.orderservicesdata;
  let preserviceInput = $this.state.preserviceInput;

  orderservicesdata.splice(rowId, 1);

  let app_amt = $this.state.approval_amt - row["company_payble"];
  for (var i = 0; i < preserviceInput.length; i++) {
    if (preserviceInput[i].hims_d_services_id === row["services_id"]) {
      preserviceInput.splice(i, 1);
    }
  }
  if ($this.state.approval_limit_yesno === "Y") {
    if (app_amt < $this.state.preapp_limit_amount) {
      for (var i = 0; i < preserviceInput.length; i++) {
        preserviceInput[i].approval_limit_yesno = "N";
      }
      $this.props.generateBill({
        uri: "/billing/getBillDetails",
        method: "POST",
        data: preserviceInput,
        redux: {
          type: "BILL_GEN_GET_DATA",
          mappingName: "xxx"
        },
        afterSuccess: data => {
          $this.setState({
            orderservicesdata: data.billdetails,
            approval_amt: app_amt,
            preserviceInput: preserviceInput,
            approval_limit_yesno: "N"
          });
        }
      });
    } else {
      $this.setState({
        orderservicesdata: orderservicesdata,
        preserviceInput: preserviceInput,
        approval_amt: app_amt
      });
    }
  } else {
    $this.setState({
      orderservicesdata: orderservicesdata,
      preserviceInput: preserviceInput,
      approval_amt: app_amt
    });
  }
};
//Save Order
const SaveOrdersServices = ($this, e) => {
  algaehApiCall({
    uri: "/orderAndPreApproval/insertOrderedServices",
    data: $this.state.orderservicesdata,
    method: "POST",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Ordered Successfully...",
          type: "success"
        });
        this.setState({ saved: true });
      }
    },
    onFailure: error => {}
  });
};

const calculateAmount = ($this, row, ctrl, e) => {
  e = e || ctrl;

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
      vat_applicable: $this.state.vat_applicable,
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

  $this.props.billingCalculations({
    uri: "/billing/getBillDetails",
    method: "POST",
    data: inputParam,
    redux: {
      type: "BILL_GEN_GET_DATA",
      mappingName: "xxx"
    },
    afterSuccess: data => {
      extend(row, data.billdetails[0]);
      for (let i = 0; i < orderservicesdata.length; i++) {
        if (orderservicesdata[i].service_type_id === row.service_type_id) {
          orderservicesdata[i] = row;
        }
      }
      $this.setState({ orderservicesdata: orderservicesdata });
    }
  });
};

const updateBillDetail = ($this, e) => {
  $this.props.billingCalculations({
    uri: "/billing/billingCalculations",
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
        sec_deductable_amount: data.sec_deductable_amount
      });
    }
  });
};

export {
  serviceTypeHandeler,
  serviceHandeler,
  texthandle,
  ProcessService,
  VisitSearch,
  deleteServices,
  SaveOrdersServices,
  calculateAmount,
  updateBillDetail
};
