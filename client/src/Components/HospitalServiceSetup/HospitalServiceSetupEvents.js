import { algaehApiCall } from "../../utils/algaehApiCall.js";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value,
    },
    () => {
      getHospotalServices($this);
    }
  );
};

const getHospotalServices = ($this) => {
  let inputObj = {};

  if ($this.state.service_name !== null) {
    inputObj = { hims_d_services_id: $this.state.service_name };
  }
  if ($this.state.sub_department_id !== null) {
    inputObj = { sub_department_id: $this.state.sub_department_id };
  }
  if ($this.state.hospital_id !== null) {
    inputObj = { hospital_id: $this.state.hospital_id };
  }

  if ($this.state.service_type_id !== null) {
    inputObj = { service_type_id: $this.state.service_type_id };
  }

  $this.props.getServices({
    uri: "/serviceType/getService",
    module: "masterSettings",
    method: "GET",
    data: inputObj,
    redux: {
      type: "SERVICES_GET_DATA",
      mappingName: "hospitalservices",
    },
  });
};

const downloadHospitalService = ($this) => {
  debugger;

  algaehApiCall({
    uri: "/report",
    // uri: "/excelReport",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "hospitalServiceReport",
        pageOrentation: "landscape",
        // excelTabName: `${$this.state.inputs.hospital_name} | ${moment(
        //   $this.state.inputs.month,
        //   "MM"
        // ).format("MMM")}-${$this.state.inputs.year}`,
        excelHeader: false,
        reportParams: [
          // {
          //   name: "hospital_id",
          //   value: $this.state.inputs.hospital_id,
          // },
          {
            name: "accound_id_assigned",
            value: $this.state.accound_id_assigned ? "Y" : "N",
          },
        ],
        // outputFileType: "EXCEL", //"EXCEL", //"PDF",
      },
    },
    onSuccess: (res) => {
      // const urlBlob = URL.createObjectURL(res.data);
      // const a = document.createElement("a");
      // a.href = urlBlob;
      // a.download = `Leave & Airfare Reconciliation Report ${moment(
      //   $this.state.inputs.month,
      //   "MM"
      // ).format("MMM")}-${$this.state.inputs.year}.${"xlsx"}`;
      // a.click();

      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${$this.state.inputs.hospital_name} Leave and Airfare Reconciliation - ${$this.state.monthName} ${$this.state.inputs.year}`;
      window.open(origin);
    },
  });
};

export { texthandle, getHospotalServices, downloadHospitalService };
