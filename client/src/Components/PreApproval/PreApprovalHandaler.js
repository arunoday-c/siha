import moment from "moment";
import FrontDesk from "../../Search/FrontDesk.json";
import AlgaehSearch from "../Wrapper/globalSearch";
import Options from "../../Options.json";
import Enumerable from "linq";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getPreAprovalList($this);
      getMedicationAprovalList($this);
    }
  );
};

const datehandle = ($this, ctrl, e) => {
  let intFailure = false;
  if (e === "date") {
    if (Date.parse($this.state.to_date) < Date.parse(moment(ctrl)._d)) {
      intFailure = true;
      swalMessage({
        title: "From Date cannot be grater than To Date.",
        type: "warning"
      });
    }
  } else if (e === "to_date") {
    if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.date)) {
      intFailure = true;
      swalMessage({
        title: "To Date cannot be less than From Date.",
        type: "warning"
      });
    }
  }

  if (intFailure === false) {
    $this.setState(
      {
        [e]: moment(ctrl)._d
      },
      () => {
        getPreAprovalList($this);
        getMedicationAprovalList($this);
      }
    );
  }
};

const PatientSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: FrontDesk
    },
    searchName: "patients",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState(
        {
          patient_code: row.patient_code,
          patient_id: row.hims_d_patient_id
        },
        () => {
          getPreAprovalList($this);
          getMedicationAprovalList($this);
        }
      );
    }
  });
};

const getPreAprovalList = $this => {
  let inputobj = {};

  if ($this.state.date !== null) {
    inputobj.created_date = moment($this.state.date).format(
      Options.dateFormatYear
    );
  }
  if ($this.state.to_date !== null) {
    inputobj.to_date = moment($this.state.to_date).format(
      Options.dateFormatYear
    );
  }

  if ($this.state.dis_status !== null) {
    inputobj.apprv_status = $this.state.dis_status;
  }
  if ($this.state.doctor_id !== null) {
    inputobj.doctor_id = $this.state.doctor_id;
  }
  if ($this.state.patient_id !== null) {
    inputobj.patient_id = $this.state.patient_id;
  }
  if ($this.state.insurance_id !== null) {
    inputobj.insurance_provider_id = $this.state.insurance_id;
  }

  algaehApiCall({
    uri: "/orderAndPreApproval/getPreAprovalList",
    method: "GET",
    data: inputobj,
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        let pre_approval_Services = Enumerable.from(data)
          .groupBy("$.patient_id", null, (k, g) => {
            let firstRecordSet = Enumerable.from(g).firstOrDefault();

            return {
              patient_code: firstRecordSet.patient_code,
              full_name: firstRecordSet.full_name,
              created_date: firstRecordSet.created_date,
              doctor_id: firstRecordSet.doctor_id,
              insurance_provider_id: firstRecordSet.insurance_provider_id,
              patient_id: firstRecordSet.patient_id,
              visit_id: firstRecordSet.visit_id,
              department_type: firstRecordSet.department_type,
              icd_code: firstRecordSet.icd_code,
              number_of_Services: g.getSource().length,
              apprv_status: firstRecordSet.apprv_status,
              card_no: firstRecordSet.card_no,
              sub_department_name: firstRecordSet.sub_department_name,
              doctor_name: firstRecordSet.doctor_name,
              insurance_provider_name: firstRecordSet.insurance_provider_name,
              services_details: g.getSource()
            };
          })
          .toArray();

        $this.setState({ pre_approval_Services: pre_approval_Services });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.response.data.message,
        type: "warning"
      });
    }
  });
};

const VerifyOrderModel = ($this, oFrom, row, e) => {
  $this.setState({
    isVerifyOpen: !$this.state.isVerifyOpen,
    selected_services: row,
    openFrom: oFrom
  });
};
const CloseOrderModel = ($this, e) => {
  $this.setState({
    isVerifyOpen: !$this.state.isVerifyOpen
  });
};

const openUCAFReport = ($this, row) => {
  if (row.department_type === "N") {
    algaehApiCall({
      uri: "/ucaf/getPatientUCAF",
      method: "GET",
      data: {
        patient_id: row.patient_id,
        visit_id: row.visit_id,
        forceReplace: true
      },
      onSuccess: response => {
        if (response.data.success) {
          $this.setState({ openUCAF: true, UCAFData: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "warning"
        });
      }
    });
  }
};

const getMedicationAprovalList = $this => {
  let inputobj = {};

  if ($this.state.date !== null) {
    inputobj.created_date = moment($this.state.date).format(
      Options.dateFormatYear
    );
  }

  if ($this.state.to_date !== null) {
    inputobj.to_date = moment($this.state.to_date).format(
      Options.dateFormatYear
    );
  }

  if ($this.state.dis_status !== null) {
    inputobj.apprv_status = $this.state.dis_status;
  }
  if ($this.state.doctor_id !== null) {
    inputobj.doctor_id = $this.state.doctor_id;
  }
  if ($this.state.patient_id !== null) {
    inputobj.patient_id = $this.state.patient_id;
  }
  if ($this.state.insurance_id !== null) {
    inputobj.insurance_provider_id = $this.state.insurance_id;
  }

  algaehApiCall({
    uri: "/orderAndPreApproval/getMedicationAprovalList",
    method: "GET",
    data: inputobj,
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        let medca_approval_Services = Enumerable.from(data)
          .groupBy("$.patient_id", null, (k, g) => {
            let firstRecordSet = Enumerable.from(g).firstOrDefault();
            return {
              patient_code: firstRecordSet.patient_code,
              full_name: firstRecordSet.full_name,
              created_date: firstRecordSet.created_date,
              doctor_id: firstRecordSet.doctor_id,
              insurance_provider_id: firstRecordSet.insurance_provider_id,
              patient_id: firstRecordSet.patient_id,
              visit_id: firstRecordSet.visit_id,
              department_type: firstRecordSet.department_type,
              icd_code: firstRecordSet.icd_code,
              number_of_Services: g.getSource().length,
              apprv_status: firstRecordSet.apprv_status,
              card_no: firstRecordSet.card_no,
              sub_department_name: firstRecordSet.sub_department_name,
              doctor_name: firstRecordSet.doctor_name,
              insurance_provider_name: firstRecordSet.insurance_provider_name,

              services_details: g.getSource()
            };
          })
          .toArray();

        $this.setState({ medca_approval_Services: medca_approval_Services });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.response.data.message,
        type: "warning"
      });
    }
  });
};

export {
  texthandle,
  datehandle,
  PatientSearch,
  getPreAprovalList,
  VerifyOrderModel,
  CloseOrderModel,
  openUCAFReport,
  getMedicationAprovalList
};
