import moment from "moment";
import Options from "../../../Options.json";
import Enumerable from "linq";
import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import { algaehApiCall } from "../../../utils/algaehApiCall";

const getMedicationList = ($this) => {
  let inputobj = {};

  if ($this.state.prescription_date !== null) {
    inputobj.prescription_date = moment($this.state.prescription_date).format(
      Options.dateFormatYear
    );
  }

  if ($this.state.patient_id !== null) {
    inputobj.patient_id = $this.state.patient_id;
  }

  $this.props.getMedicationList({
    uri: "/orderMedication/getPatientPrescription",
    method: "GET",
    data: inputobj,
    redux: {
      type: "MEDICATION_LIST_GET_DATA",
      mappingName: "medicationlist",
    },
    afterSuccess: (data) => {
      if (data.length !== 0) {
        let medication_list = Enumerable.from(data)
          .groupBy("$.patient_id", null, (k, g) => {
            let firstRecordSet = Enumerable.from(g).firstOrDefault();
            return {
              patient_code: firstRecordSet.patient_code,
              full_name: firstRecordSet.full_name,
              prescription_date: firstRecordSet.prescription_date,
              number_of_items: g.getSource().length,
              item_list: g.getSource(),
              provider_id: firstRecordSet.provider_id,
            };
          })
          .toArray();

        $this.setState({ medication_list: medication_list });
      } else {
        $this.setState({ medication_list: [] });
      }
    },
  });
};

const PatientSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: FrontDesk,
    },
    searchName: "patients",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      $this.setState(
        {
          patient_code: row.patient_code,
          patient_id: row.hims_d_patient_id,
        },
        () => {
          getMedicationList($this);
        }
      );
    },
  });
};

const Refresh = ($this) => {
  $this.setState(
    {
      prescription_date: new Date(),
      patient_id: null,
      patient_code: null,
    },
    () => {
      getMedicationList($this);
    }
  );
};

const datehandle = ($this, ctrl, e) => {
  $this.setState(
    {
      [e]: ctrl ? moment(ctrl)._d : moment(),
    },
    () => {
      ctrl && getMedicationList($this);
    }
  );
};

const ListOfItems = ($this, row) => {
  $this.setState({
    ...$this.state,
    itemlist: !$this.state.itemlist,
    item_list: row,
  });
};

const printPrescription = ($this, row) => {
  debugger;
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "prescription",
        reportParams: [
          {
            name: "hims_d_patient_id",
            value: row.item_list[0].patient_id,
          },
          {
            name: "visit_id",
            value: row.item_list[0].visit_id,
          },
          {
            name: "visit_code",
            value: null,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);

      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Prescription`;
      window.open(origin);
      // window.document.title = "";
    },
  });
};

export {
  getMedicationList,
  PatientSearch,
  Refresh,
  datehandle,
  ListOfItems,
  printPrescription,
};
