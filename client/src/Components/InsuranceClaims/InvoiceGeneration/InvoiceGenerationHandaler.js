import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const VisitSearch = ($this, e) => {
  let input =
    $this.state.select_invoice === "CH"
      ? "pv.insured = 'N' and pv.invoice_generated='N'"
      : "pv.insured = 'Y' and pv.invoice_generated='N'";
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.VisitDetails.VisitList
    },
    searchName: "visit",
    uri: "/gloabelSearch/get",
    inputs: input,
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
          if ($this.state.select_invoice === "CD") {
            algaehApiCall({
              uri: "/patientRegistration/getPatientInsurance",
              module: "frontDesk",
              method: "GET",
              data: {
                patient_id: $this.state.patient_id,
                patient_visit_id: $this.state.visit_id
              },
              onSuccess: response => {
                if (response.data.success) {
                  response.data.records[0].sub_insurance_id =
                    response.data.records[0].sub_insurance_provider_id;

                  response.data.records[0].network_office_id =
                    response.data.records[0].hims_d_insurance_network_office_id;

                  $this.setState({ ...response.data.records[0] });
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
          }

          getOrderServices($this);
          getVisitWiseBillDetailS($this);
        }
      );
    }
  });
};

const getVisitWiseBillDetailS = $this => {
  let inputobj = { visit_id: $this.state.visit_id, insurance_yesno: "Y" };

  algaehApiCall({
    uri: "/invoiceGeneration/getVisitWiseBillDetailS",
    module: "insurance",
    method: "GET",
    data: inputobj,
    onSuccess: response => {
      AlgaehLoader({ show: true });
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          let gross_total = Enumerable.from(data)
            .select(w => parseFloat(w.gross_amount))
            .sum();

          let discout_total = Enumerable.from(data)
            .select(w => parseFloat(w.discount_amout))
            .sum();

          let net_total = Enumerable.from(data)
            .select(w => parseFloat(w.net_amout))
            .sum();

          for (let i = 0; i < data.length; i++) {
            data[i].service_id = data[i].services_id;
            data[i].bill_header_id = data[i].hims_f_billing_header_id;
            data[i].bill_detail_id = data[i].hims_f_billing_details_id;
            data[i].bill_detail_id = data[i].hims_f_billing_details_id;
            data[i].company_resp = data[i].comapany_resp;
            data[i].company_payable = data[i].company_payble;

            data[i].discount_amount = data[i].discount_amout;
            data[i].net_amount = data[i].net_amout;
          }

          $this.setState({
            saveEnable: false,
            clearEnable: false,
            Invoice_Detail: data,
            gross_amount: gross_total,
            discount_amount: discout_total,
            net_amout: net_total
          });

          algaehApiCall({
            uri: "/billing/billingCalculations",
            module: "billing",
            method: "POST",
            data: { billdetails: data },
            onSuccess: response => {
              if (response.data.success) {
                response.data.records.patient_resp =
                  response.data.records.patient_res;
                response.data.records.patient_payable =
                  response.data.records.patient_payable;
                response.data.records.company_resp =
                  response.data.records.company_res;
                response.data.records.company_payable =
                  response.data.records.company_payble;
                response.data.records.sec_comapany_resp =
                  response.data.records.sec_company_res;
                response.data.records.sec_company_payable =
                  response.data.records.sec_company_paybale;
                $this.setState({ ...response.data.records });
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
  let NotBilled = Enumerable.from($this.props.orderedserviceslist)
    .where(w => w.billed === "N")
    .toArray();

  if (NotBilled.length !== 0) {
    swalMessage({
      title: "Some of the Services Not Billed, Please Billed and Proceed.",
      type: "warning"
    });
  } else {
    algaehApiCall({
      uri: "/invoiceGeneration/addInvoiceGeneration",
      module: "insurance",
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
  $this.setState(
    {
      hims_f_invoice_header_id: null,
      invoice_number: null,
      invoice_date: new Date(),
      visit_code: "",
      patient_code: "",
      full_name: "",
      patient_id: "",
      visit_id: "",
      saveEnable: true,
      clearEnable: true,
      Invoice_Detail: [],
      generateVoice: true,
      gross_amount: 0,
      discount_amount: 0,
      patient_resp: 0,
      patient_tax: 0,
      patient_payable: 0,
      company_resp: 0,
      company_tax: 0,
      company_payble: 0,
      sec_company_resp: 0,
      sec_company_tax: 0,
      sec_company_payable: 0,
      net_amout: 0,
      insurance_provider_name: "---",
      sub_insurance_provider_name: "---",
      network_type: "---",
      policy_number: "---",
      card_number: "---",
      effective_end_date: "---",
      secondary_insurance_provider_name: "---",
      secondary_network_type: "---",
      secondary_policy_number: "---",
      secondary_card_number: "---",
      secondary_effective_end_date: "---",
      select_invoice: "CH",
      creidt_invoice: false,
      cash_invoice: true,
      dataExists: false
    },
    () => {
      $this.props.initialStateOrders({
        redux: {
          type: "ORDERED_SERVICES_GET_DATA",
          mappingName: "orderedserviceslist",
          data: []
        }
      });
    }
  );
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });
  $this.props.getInvoiceGeneration({
    uri: "/invoiceGeneration/getInvoiceGeneration",
    method: "GET",
    module: "insurance",
    // printInput: true,
    data: { invoice_number: docNumber },
    redux: {
      type: "INVOICE_GEN_GET_DATA",
      mappingName: "invoiceGen"
    },
    afterSuccess: data => {
      data.generateVoice = false;
      data.clearEnable = false;
      if (data.insurance_provider_id !== null) {
        data.select_invoice = "CD";

        data.creidt_invoice = true;
        data.cash_invoice = false;
      } else {
        data.select_invoice = "CH";

        data.creidt_invoice = false;
        data.cash_invoice = true;
      }
      data.dataExists = true;
      if (data.insurance_provider_id !== null) {
        $this.props.getPatientInsurance({
          uri: "/patientRegistration/getPatientInsurance",
          module: "frontDesk",
          method: "GET",
          data: {
            patient_id: data.patient_id,
            patient_visit_id: data.visit_id
          },
          redux: {
            type: "EXIT_INSURANCE_GET_DATA",
            mappingName: "existinsurance"
          }
        });
      }
      $this.setState(data);
      AlgaehLoader({ show: false });
    }
  });
};

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

export {
  VisitSearch,
  getOrderServices,
  FinalizedAndInvoice,
  ClearData,
  getVisitWiseBillDetailS,
  getCtrlCode,
  texthandle
};
