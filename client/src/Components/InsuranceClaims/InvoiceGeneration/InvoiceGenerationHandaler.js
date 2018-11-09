import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import Enumerable from "linq";
import { swalMessage } from "../../../utils/algaehApiCall";

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
      debugger;
      $this.setState(
        {
          visit_code: row.visit_code,
          patient_code: row.patient_code,
          full_name: row.full_name,
          patient_id: row.patient_id,
          visit_id: row.hims_f_patient_visit_id

          // insured: row.insured,
          // sec_insured: row.sec_insured,
          // episode_id: row.episode_id
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
        }
      );
    }
  });
};

const getOrderServices = $this => {
  debugger;
  let inputobj = { visit_id: $this.state.visit_id, insurance_yesno: "Y" };

  $this.props.getMedicationList({
    uri: "/orderAndPreApproval/getOrderServices",
    method: "GET",
    data: inputobj,
    redux: {
      type: "ORDERED_SERVICES_GET_DATA",
      mappingName: "orderedserviceslist"
    },
    afterSuccess: data => {
      if (data.length != 0) {
        $this.setState({
          saveEnable: false,
          clearEnable: true
        });
      }
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
    $this.setState({
      clearEnable: false,
      saveEnable: true
    });
  }
};

const ClearData = $this => {
  debugger;
  $this.setState({
    visit_code: "",
    patient_code: "",
    full_name: "",
    patient_id: "",
    visit_id: "",
    saveEnable: true,
    clearEnable: true
  });

  $this.props.initialStateOrders({
    redux: {
      type: "ORDERED_SERVICES_GET_DATA",
      mappingName: "orderedserviceslist",
      data: []
    }
  });
};

export { VisitSearch, getOrderServices, FinalizedAndInvoice, ClearData };
