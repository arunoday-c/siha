import moment from "moment";
import FrontDesk from "../../Search/FrontDesk.json";
import AlgaehSearch from "../Wrapper/globalSearch";
import Options from "../../Options.json";
import Enumerable from "linq";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getPreAprovalList($this);
    }
  );
};

const datehandle = ($this, ctrl, e) => {
  $this.setState(
    {
      [e]: moment(ctrl)._d
    },
    () => {
      getPreAprovalList($this);
    }
  );
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

  $this.props.getPreAprovalList({
    uri: "/orderAndPreApproval/getPreAprovalList",
    method: "GET",
    data: inputobj,
    redux: {
      type: "PRE_APPROVAL_GET_DATA",
      mappingName: "preapprovallist"
    },
    afterSuccess: data => {
      let pre_approval_Services = Enumerable.from(data)
        .groupBy("$.patient_id", null, (k, g) => {
          let firstRecordSet = Enumerable.from(g).firstOrDefault();
          return {
            patient_code: firstRecordSet.patient_code,
            full_name: firstRecordSet.full_name,
            created_date: firstRecordSet.created_date,
            doctor_id: firstRecordSet.doctor_id,
            insurance_provider_id: firstRecordSet.insurance_provider_id,

            icd_code: firstRecordSet.icd_code,
            number_of_Services: g.getSource().length,
            apprv_status: firstRecordSet.apprv_status,

            services_details: g.getSource()
          };
        })
        .toArray();

      $this.setState({ pre_approval_Services: pre_approval_Services });
    }
  });
};

const VerifyOrderModel = ($this, row, e) => {
  $this.setState({
    isVerifyOpen: !$this.state.isVerifyOpen,
    selected_services: row
  });
};
const CloseOrderModel = ($this, e) => {
  $this.setState({
    isVerifyOpen: !$this.state.isVerifyOpen
  });
};

export {
  texthandle,
  datehandle,
  PatientSearch,
  getPreAprovalList,
  VerifyOrderModel,
  CloseOrderModel
};
