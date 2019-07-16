import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import moment from "moment";
import Options from "../../../Options.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getRadTestList($this);
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
          getRadTestList($this);
        }
      );
    }
  });
};

const datehandle = ($this, ctrl, e) => {
  let intFailure = false;
  if (e === "from_date") {
    if (Date.parse($this.state.to_date) < Date.parse(moment(ctrl)._d)) {
      intFailure = true;
      swalMessage({
        title: "From Date cannot be grater than To Date.",
        type: "warning"
      });
    }
  } else if (e === "to_date") {
    if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.from_date)) {
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
        getRadTestList($this);
      }
    );
  }
};

const getRadTestList = $this => {
  let inputobj = {};

  if ($this.state.from_date !== null) {
    inputobj.from_date = moment($this.state.from_date).format(
      Options.dateFormatYear
    );
  }
  if ($this.state.to_date !== null) {
    inputobj.to_date = moment($this.state.to_date).format(
      Options.dateFormatYear
    );
  }

  if ($this.state.patient_id !== null) {
    inputobj.patient_id = $this.state.patient_id;
  }

  if ($this.state.status !== null) {
    inputobj.status = $this.state.status;
  }

  if ($this.state.proiorty !== null) {
    inputobj.test_type = $this.state.proiorty;
  }

  algaehApiCall({
    uri: "/radiology/getRadOrderedServices",
    module: "radiology",
    method: "GET",
    data: inputobj,

    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          radtestlist: response.data.records,
          user_id: response.data.user_id
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
  // $this.props.getRadiologyTestList({
  //   uri: "/radiology/getRadOrderedServices",
  //   module: "radiology",
  //   method: "GET",
  //   data: inputobj,
  //   redux: {
  //     type: "RAD_LIST_GET_DATA",
  //     mappingName: "radtestlist"
  //   }
  // });
};

const openResultEntry = ($this, row) => {
  if (row.billed === "Y") {
    algaehApiCall({
      uri: "/radiology/getRadTemplateList",
      module: "radiology",
      method: "GET",
      data: { services_id: row.service_id },
      onSuccess: response => {
        if (response.data.success === true) {
          let Template = row;
          Template.technician_id =
            Template.technician_id === null
              ? $this.state.user_id
              : Template.technician_id;

          row.exam_start_date_time = row.exam_start_date_time
            ? new Date(row.exam_start_date_time)
            : null;
          Template.Templatelist = response.data.records;
          $this.setState({
            resultEntry: !$this.state.resultEntry,
            selectedPatient: Template
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
    // $this.props.getTemplateList({
    //   uri: "/radiology/getRadTemplateList",
    //   module: "radiology",
    //   method: "GET",
    //   data: { services_id: row.service_id },
    //   redux: {
    //     type: "TEMPLATE_LIST_GET_DATA",
    //     mappingName: "templatelist"
    //   },
    //   afterSuccess: data => {
    //     let Template = row;
    //     Template.technician_id =
    //       Template.technician_id === null
    //         ? $this.state.user_id
    //         : Template.technician_id;
    //     row.exam_start_date_time = new Date(row.exam_start_date_time);
    //     Template.Templatelist = data;
    //     $this.setState({
    //       resultEntry: !$this.state.resultEntry,
    //       selectedPatient: Template
    //     });
    //   }
    // });
  } else {
    swalMessage({
      title: "Please make the payment.",
      type: "warning"
    });
  }
};

const closeResultEntry = $this => {
  $this.setState(
    {
      resultEntry: !$this.state.resultEntry
    },
    () => {
      getRadTestList($this);
    }
  );
};

const Refresh = $this => {
  let month = moment().format("MM");
  let year = moment().format("YYYY");

  $this.setState(
    {
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      to_date: new Date(),
      patient_id: null,
      patient_code: null,
      status: null,
      proiorty: null
    },
    () => {
      getRadTestList($this);
    }
  );
};

export {
  texthandle,
  PatientSearch,
  datehandle,
  getRadTestList,
  openResultEntry,
  closeResultEntry,
  Refresh
};
