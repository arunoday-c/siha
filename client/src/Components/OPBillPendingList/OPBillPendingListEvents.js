import moment from "moment";
import Options from "../../Options.json";
import Enumerable from "linq";

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

  $this.props.getBillPatientList({
    uri: "/opBilling/getPednigBills",
    module: "billing",
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

export { getBillPatientList, datehandle };
