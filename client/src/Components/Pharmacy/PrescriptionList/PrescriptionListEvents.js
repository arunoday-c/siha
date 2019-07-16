import moment from "moment";
import Options from "../../../Options.json";
import Enumerable from "linq";
import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";

const getMedicationList = $this => {
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
      mappingName: "medicationlist"
    },
    afterSuccess: data => {
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
              provider_id: firstRecordSet.provider_id
            };
          })
          .toArray();

        $this.setState({ medication_list: medication_list });
      } else {
        $this.setState({ medication_list: [] });
      }
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
          getMedicationList($this);
        }
      );
    }
  });
};

const Refresh = $this => {
  $this.setState(
    {
      prescription_date: new Date(),
      patient_id: null,
      patient_code: null
    },
    () => {
      getMedicationList($this);
    }
  );
};

const datehandle = ($this, ctrl, e) => {
  $this.setState(
    {
      [e]: moment(ctrl)._d
    },
    () => {
      getMedicationList($this);
    }
  );
};

const ListOfItems = ($this, row) => {
  // let rowSelected = {};
  // let saveupdate = false,
  //   btnupdate = true;
  // if (
  //   e.hims_d_insurance_network_id !== undefined &&
  //   e.hims_d_insurance_network_id !== null
  // ) {
  //   rowSelected = row;
  //   saveupdate = true;
  //   btnupdate = false;
  //   // addNewNetwork(this, this);
  // }
  $this.setState({
    ...$this.state,
    itemlist: !$this.state.itemlist,
    item_list: row
  });
};

export { getMedicationList, PatientSearch, Refresh, datehandle, ListOfItems };
