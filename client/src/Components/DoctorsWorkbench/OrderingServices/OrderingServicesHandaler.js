import AlgaehSearch from "../../Wrapper/globalSearch";
import { successfulMessage } from "../../../utils/GlobalFunctions";
import swal from "sweetalert";
import { algaehApiCall, getCookie } from "../../../utils/algaehApiCall";

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
  debugger;
  $this.setState({
    [e.name]: e.value,
    insurance_service_name: e.selected.service_name
  });
};

const ProcessService = ($this, e) => {
  let preserviceInput = $this.state.preserviceInput || [];
  let serviceInput = [
    {
      insured: $this.state.insured,
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
  debugger;

  $this.props.generateBill({
    uri: "/billing/getBillDetails",
    method: "POST",
    data: serviceInput,
    redux: {
      type: "BILL_GEN_GET_DATA",
      mappingName: "orderservices"
    },
    afterSuccess: data => {
      debugger;

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
          icon: "warning",
          buttons: true,
          dangerMode: true
        }).then(willProceed => {
          if (willProceed) {
            let approval_amt = data.billdetails[0].approval_amt;
            let approval_limit_yesno = data.billdetails[0].preapp_limit_exceed;

            data.billdetails[0].visit_id = $this.state.visit_id;
            data.billdetails[0].patient_id = $this.state.patient_id;
            data.billdetails[0].doctor_id = $this.state.doctor_id;
            data.billdetails[0].insurance_company =
              $this.state.insurance_provider_id;
            data.billdetails[0].insurance_sub_company =
              $this.state.sub_insurance_provider_id;
            data.billdetails[0].network_id = $this.state.network_id;
            data.billdetails[0].policy_number = $this.state.policy_number;
            data.billdetails[0].created_by = getCookie("UserID");

            debugger;
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
                  orderservices: data.billdetails,
                  approval_amt: approval_amt,
                  preserviceInput: preserviceInput,
                  approval_limit_yesno: approval_limit_yesno
                });
              }
            });
          }
        });
      } else {
        debugger;
        let existingservices = $this.state.orderservices;

        data.billdetails[0].visit_id = $this.state.visit_id;
        data.billdetails[0].patient_id = $this.state.patient_id;
        data.billdetails[0].doctor_id = $this.state.doctor_id;
        data.billdetails[0].insurance_company =
          $this.state.insurance_provider_id;
        data.billdetails[0].insurance_sub_company =
          $this.state.sub_insurance_provider_id;
        data.billdetails[0].network_id = $this.state.network_id;
        data.billdetails[0].policy_number = $this.state.policy_number;
        data.billdetails[0].created_by = getCookie("UserID");
        data.billdetails[0].insurance_service_name =
          $this.state.insurance_service_name;
        data.billdetails[0].icd_code =
          data.billdetails[0].icd_code === ""
            ? null
            : data.billdetails[0].icd_code;

        if (data.billdetails.length !== 0) {
          existingservices.splice(0, 0, data.billdetails[0]);
        }
        debugger;
        if (
          data.billdetails[0].pre_approval === "Y" &&
          $this.state.approval_limit_yesno === "N"
        ) {
          successfulMessage({
            message: "Selected Service is Pre-Approval required.",
            title: "Warning",
            icon: "warning"
          });
        }
        let approval_amt = data.billdetails[0].approval_amt;
        let preapp_limit_amount = data.billdetails[0].preapp_limit_amount;

        preserviceInput.push(serviceInput[0]);
        $this.setState({
          orderservices: existingservices,
          approval_amt: approval_amt,
          preserviceInput: preserviceInput,
          preapp_limit_amount: preapp_limit_amount
        });
      }
    }
  });
};

const VisitSearch = ($this, e) => {
  debugger;
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
      debugger;
      callBack(text);
    },
    onRowSelect: row => {
      debugger;
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
          debugger;
          if ($this.state.insured === "Y") {
            $this.props.getPatientInsurance({
              uri: "/insurance/getPatientInsurance",
              method: "GET",
              data: {
                patient_id: $this.state.patient_id,
                patient_visit_id: $this.state.patient_visit_id
              },
              redux: {
                type: "EXIT_INSURANCE_GET_DATA",
                mappingName: "existinginsurance"
              },
              afterSuccess: data => {
                debugger;
              }
            });
          }
        }
      );
    }
  });
};

const deleteServices = ($this, row, rowId) => {
  debugger;
  let orderservices = $this.state.orderservices;
  let preserviceInput = $this.state.preserviceInput;

  orderservices.splice(rowId, 1);

  let app_amt = $this.state.approval_amt - row["company_payble"];
  for (var i = 0; i < preserviceInput.length; i++) {
    if (preserviceInput[i].hims_d_services_id === row["services_id"]) {
      preserviceInput.splice(i, 1);
    }
  }
  if ($this.state.approval_limit_yesno === "Y") {
    if (app_amt < $this.state.preapp_limit_amount) {
      debugger;
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
            orderservices: data.billdetails,
            approval_amt: app_amt,
            preserviceInput: preserviceInput
          });
        }
      });
    } else {
      $this.setState({
        orderservices: orderservices,
        preserviceInput: preserviceInput,
        approval_amt: app_amt
      });
    }
  } else {
    $this.setState({
      orderservices: orderservices,
      preserviceInput: preserviceInput,
      approval_amt: app_amt
    });
  }
};

const SaveOrdersServices = ($this, e) => {
  debugger;
  algaehApiCall({
    uri: "/orderAndPreApproval/insertOrderedServices",
    data: $this.state.orderservices,
    method: "POST",
    onSuccess: response => {
      if (response.data.success) {
        successfulMessage({
          message: "Ordered Successfully...",
          title: "Success",
          icon: "success"
        });
      }
    },
    onFailure: error => {}
  });
};

export {
  serviceTypeHandeler,
  serviceHandeler,
  texthandle,
  ProcessService,
  VisitSearch,
  deleteServices,
  SaveOrdersServices
};
