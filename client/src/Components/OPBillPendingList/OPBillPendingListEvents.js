import moment from "moment";
import Options from "../../Options.json";
import Enumerable from "linq";
import AlgaehSearch from "../Wrapper/globalSearch";
import FrontDesk from "../../Search/FrontDesk.json";

const getBillPatientList = $this => {
  let inputobj = {};

  if ($this.state.today_date !== null) {
    inputobj.created_date = moment($this.state.today_date).format(
      Options.dateFormatYear
    );
  }

  if ($this.state.patient_id !== null) {
    inputobj.patient_id = $this.state.patient_id;
  }
  debugger;

  $this.props.getBillPatientList({
    uri: "/opBilling/getPednigBills",
    // module: "billing",
    method: "GET",
    data: inputobj,
    redux: {
      type: "PENDING_BILLS_GET_DATA",
      mappingName: "patientlist"
    },
    afterSuccess: data => {
      let patient_list = Enumerable.from(data)
        .groupBy("$.patient_id", null, (k, g) => {
          let firstRecordSet = Enumerable.from(g).firstOrDefault();
          return {
            patient_code: firstRecordSet.patient_code,
            full_name: firstRecordSet.full_name,
            patient_list: g.getSource()
          };
        })
        .toArray();

      $this.setState({ patient_list: patient_list });
    }
  });
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
          getBillPatientList($this);
        }
      );
    }
  });
};

const Refresh = $this => {
  $this.setState(
    {
      today_date: new Date(),
      patient_id: null,
      patient_code: null
    },
    () => {
      getBillPatientList($this);
    }
  );
};

const datehandle = ($this, ctrl, e) => {
  $this.setState(
    {
      [e]: moment(ctrl)._d
    },
    () => {
      getBillPatientList($this);
    }
  );
};

export { getBillPatientList, PatientSearch, Refresh, datehandle };
