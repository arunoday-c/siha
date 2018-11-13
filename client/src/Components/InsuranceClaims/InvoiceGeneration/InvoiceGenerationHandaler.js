import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const VisitSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.VisitDetails.VisitList
    },
    searchName: "visit",
    uri: "/gloabelSearch/get",
    inputs: "pv.insured = 'Y'",
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
          visit_id: row.hims_f_patient_visit_id
        },
        () => {
          // if ($this.state.insured === "Y") {
          //   $this.props.getPatientInsurance({
          //     uri: "/insurance/getPatientInsurance",
          //     method: "GET",
          //     data: {
          //       patient_id: $this.state.patient_id,
          //       patient_visit_id: $this.state.visit_id
          //     },
          //     redux: {
          //       type: "EXIT_INSURANCE_GET_DATA",
          //       mappingName: "existinsurance"
          //     },
          //     afterSuccess: data => {
          //       debugger;
          //       data[0].mode_of_pay = "2";
          //       $this.setState(data[0]);
          //     }
          //   });
          // }
          getOrderServices($this);
          getVisitWiseBillDetailS($this);
        }
      );
    }
  });
};

const getVisitWiseBillDetailS = $this => {
  let inputobj = { visit_id: $this.state.visit_id, insurance_yesno: "Y" };

  $this.props.getMedicationList({
    uri: "/invoiceGeneration/getVisitWiseBillDetailS",
    method: "GET",
    data: inputobj,
    redux: {
      type: "BILLED_VISITWISE_GET_DATA",
      mappingName: "visitwisebilldetail"
    },
    afterSuccess: data => {
      if (data.length != 0) {
        //created by Adnan
        let gross_total = Enumerable.from(data)
          .select(w => w.gross_amount)
          .sum();

        let discout_total = Enumerable.from(data)
          .select(w => w.discount_amout)
          .sum();
        //created by Adnan
        debugger;

        for (let i = 0; i < data.length; i++) {
          data[i].service_id = data[i].services_id;
          data[i].bill_header_id = data[i].hims_f_billing_header_id;
          data[i].bill_detail_id = data[i].hims_f_billing_details_id;
        }

        $this.setState({
          saveEnable: false,
          clearEnable: false,
          Invoice_Detail: data,
          //created by Adnan
          totalGross: gross_total,
          totalDiscount: discout_total
          //created by Adnan
        });

        $this.props.billingCalculations({
          uri: "/billing/billingCalculations",
          method: "POST",
          data: { billdetails: data },
          redux: {
            type: "INVOICE_HEADER_GEN_GET_DATA",
            mappingName: "invheadercal"
          }
        });
      }
    }
  });
};
const getOrderServices = $this => {
  let inputobj = { visit_id: $this.state.visit_id, insurance_yesno: "Y" };

  $this.props.getMedicationList({
    uri: "/orderAndPreApproval/getOrderServices",
    method: "GET",
    data: inputobj,
    redux: {
      type: "ORDERED_SERVICES_GET_DATA",
      mappingName: "orderedserviceslist"
    }
  });
};

const FinalizedAndInvoice = $this => {
  debugger;
  let NotBilled = Enumerable.from($this.props.orderedserviceslist)
    .where(w => w.billed === "N")
    .toArray();

  if (NotBilled.length !== 0) {
    swalMessage({
      title:
        "Invalid Input. Some of the Services Not Billed, Please Billed and Proceed.",
      type: "warning"
    });
  } else {
    algaehApiCall({
      uri: "/invoiceGeneration/addInvoiceGeneration",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success === true) {
          $this.setState({
            saveEnable: true,
            generateVoice: false,

            invoice_number: response.data.records.invoice_number,
            hims_f_invoice_header_id:
              response.data.records.hims_f_invoice_header_id
          });
          swalMessage({
            title: "Invoice Generated Successfully . .",
            type: "success"
          });
        }
      }
    });
  }
};

const ClearData = $this => {
  $this.setState({
    visit_code: "",
    patient_code: "",
    full_name: "",
    patient_id: "",
    visit_id: "",
    saveEnable: true,
    clearEnable: true,
    Invoice_Detail: [],
    generateVoice: true
  });

  $this.props.initialStateOrders({
    redux: {
      type: "ORDERED_SERVICES_GET_DATA",
      mappingName: "orderedserviceslist",
      data: []
    }
  });
};

const getCtrlCode = ($this, docNumber) => {
  debugger;
  AlgaehLoader({ show: true });
  $this.props.getInvoiceGeneration({
    uri: "/invoiceGeneration/getInvoiceGeneration",
    method: "GET",
    // printInput: true,
    data: { invoice_number: docNumber },
    redux: {
      type: "INVOICE_GEN_GET_DATA",
      mappingName: "invoiceGen"
    },
    afterSuccess: data => {
      debugger;
      data.generateVoice = false;
      data.clearEnable = false;

      $this.setState(data);
      AlgaehLoader({ show: false });
    }
  });
};

export {
  VisitSearch,
  getOrderServices,
  FinalizedAndInvoice,
  ClearData,
  getVisitWiseBillDetailS,
  getCtrlCode
};
