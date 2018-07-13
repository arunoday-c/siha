import AlgaehSearch from "../../../Wrapper/globalSearch";

const texthandle = ($this, context, e) => {
  $this.setState({
    [e.target.name]: e.target.value
  });

  if (context != null) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

const PatientSearch = ($this, context, e) => {
  debugger;
  AlgaehSearch({
    searchGrid: {
      columns: [
        {
          fieldName: "patient_code",
          label: "Patient Code"
        },
        {
          fieldName: "full_name",
          label: "Name"
        },
        {
          fieldName: "arabic_name",
          label: "Arabic Name"
        },
        {
          fieldName: "gender",
          label: "Gender"
        },
        {
          fieldName: "contact_number",
          label: "Contact Number"
        }
      ]
    },
    searchName: "patients",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({ patient_code: row.patient_code });
    }
  });
};

export { texthandle, PatientSearch };
