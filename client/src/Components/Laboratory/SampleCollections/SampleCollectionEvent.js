import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import Options from "../../../Options.json";
import moment from "moment";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import sockets from "../../../sockets";
import swal from "sweetalert2";

// import Enumerable from "linq";
// import swal from "sweetalert2";
const CollectSample = ($this, row) => {
  if (row.container_id === null || row.container_id === undefined) {
    swalMessage({
      title: "Please select Container",
      type: "warning",
    });
    return;
  } else if (row.sample_id === null || row.sample_id === undefined) {
    swalMessage({
      title: "Please select Sample",
      type: "warning",
    });
    return;
  } else if (row.send_out_test === null || row.send_out_test === undefined) {
    swalMessage({
      title: "Please select Send Out",
      type: "warning",
    });
    return;
  } else if (row.send_in_test === null || row.send_in_test === undefined) {
    swalMessage({
      title: "Please select Send In",
      type: "warning",
    });
    return;
  }
  let inputobj = {
    hims_f_lab_order_id: row.hims_f_lab_order_id,
    hims_d_lab_sample_id: row.hims_d_lab_sample_id,
    visit_id: row.visit_id,
    order_id: row.hims_f_lab_order_id,
    sample_id: row.sample_id,
    collected: "Y",
    status: "N",
    hims_d_hospital_id: $this.state.hospital_id,
    service_id: row.service_id,
    service_code: row.service_code,
    send_out_test: row.send_out_test,
    send_in_test: row.send_in_test,
    collected_date: row.collected_date,
    container_id: row.container_id,
    test_id: row.test_id,
    container_code: row.container_code,
    lab_id_number: row.lab_id_number,
  };

  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/laboratory/updateLabOrderServices",
    module: "laboratory",
    data: inputobj,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        getSampleCollectionDetails($this, {
          patient_id: row.patient_id,
          visit_id: row.visit_id,
          collected: "Y",
        });

        swalMessage({
          title: "Collected Successfully",
          type: "success",
        });
      }
      AlgaehLoader({ show: false });
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.response.data.message || error.message,
        type: "error",
      });
    },
  });
};

const printBulkBarcode = ($this) => {
  const data = $this.state.test_details;
  const filterData = data.filter((f) => f.checked);
  const labOrderId = filterData.map((item) => item.hims_f_lab_order_id);

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
        others: {
          width: "50mm",
          height: "20mm",
          showHeaderFooter: false,
        },
        reportName: "specimenBarcodeBulk",
        reportParams: [
          {
            name: "hims_f_lab_order_id",
            value: labOrderId,
          },
        ],
        outputFileType: "PDF",
      },
    },

    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
      window.open(origin);
    },

    // onSuccess: (res) => {
    //   const urlBlob = URL.createObjectURL(res.data);
    //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
    //   window.open(origin);
    //    window.document.title = "Specimen Barcode";
    // },
  });
};
const updateLabOrderServiceStatus = ($this, row) => {
  // if (row.status === "N") {
  algaehApiCall({
    uri: "/laboratory/updateLabOrderServiceStatus",
    module: "laboratory",
    data: {
      hims_f_lab_order_id: row.hims_f_lab_order_id,
      hims_d_lab_sample_id: row.hims_d_lab_sample_id,
      send_in_test: row.send_in_test,
      collected_date: row.collected_date,
    },
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        swalMessage({
          title: "Record Updated Successfully",
          type: "success",
        });
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.response.data.message || error.message,
        type: "error",
      });
    },
  });
  // } else {
  //   return;
  // }
};

const updateLabOrderServiceMultiple = ($this) => {
  swal({
    title: `Are you sure to change all specimen not collected?`,
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willDelete) => {
    if (willDelete.value) {
      algaehApiCall({
        uri: "/laboratory/updateLabOrderServiceMultiple",
        module: "laboratory",
        data: { labOrderArray: $this.state.test_details },
        method: "PUT",
        onSuccess: (response) => {
          if (response.data.success === true) {
            swalMessage({
              title: "Record Updated Successfully",
              type: "success",
            });
          }
        },
        onFailure: (error) => {
          swalMessage({
            title: error.response.data.message || error.message,
            type: "error",
          });
        },
      });
    }
  });
};
const printBarcode = ($this, row) => {
  if (row.lab_id_number !== null) {
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
          others: {
            width: "50mm",
            height: "20mm",
            showHeaderFooter: false,
          },
          reportName: "specimenBarcode",
          reportParams: [
            {
              name: "hims_f_lab_order_id",
              value: row.hims_f_lab_order_id,
            },
          ],
          outputFileType: "PDF",
        },
      },

      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
        window.open(origin);
      },
      // onSuccess: (res) => {
      //   const urlBlob = URL.createObjectURL(res.data);
      //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
      //   window.open(origin);
      //   window.document.title = "Specimen Barcode";
      // },
    });
  } else {
    let inputobj = {
      hims_f_lab_order_id: row.hims_f_lab_order_id,
      hims_d_lab_sample_id: row.hims_d_lab_sample_id,
      order_id: row.hims_f_lab_order_id,
      sample_id: row.sample_id,
      collected: "Y",
      status: "N",
      hims_d_hospital_id: $this.state.hospital_id,
      service_id: row.service_id,
      service_code: row.service_code,
      send_out_test: row.send_out_test,
      container_id: row.container_id,
      test_id: row.hims_d_investigation_test_id,
      container_code: row.container_code,
    };

    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/laboratory/generateBarCode",
      module: "laboratory",
      data: inputobj,
      method: "PUT",
      onSuccess: (response) => {
        if (response.data.success === true) {
          let test_details = $this.state.test_details;

          const _index = test_details.indexOf(row);

          row["lab_id_number"] = response.data.records.lab_id_number;
          test_details[_index] = row;
          $this.setState({ test_details: test_details });

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
                others: {
                  width: "50mm",
                  height: "20mm",
                  showHeaderFooter: false,
                },
                reportName: "specimenBarcode",
                reportParams: [
                  {
                    name: "hims_f_lab_order_id",
                    value: row.hims_f_lab_order_id,
                  },
                ],
                outputFileType: "PDF",
              },
            },

            onSuccess: (res) => {
              const urlBlob = URL.createObjectURL(res.data);
              const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
              window.open(origin);
            },

            // onSuccess: (res) => {
            //   const urlBlob = URL.createObjectURL(res.data);
            //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
            //   window.open(origin);
            //    window.document.title = "Specimen Barcode";
            // },
          });
        }
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        swalMessage({
          title: error.response.data.message || error.message,
          type: "error",
        });
      },
    });
  }
};

// const printBarcode = ($this, row, e) => {
//   AlgaehReport({
//     report: {
//       fileName: "sampleBarcode",
//       barcode: {
//         parameter: "bar_code",
//         options: {
//           format: "",
//           lineColor: "#0aa",
//           width: 4,
//           height: 40
//         }
//       }
//     },
//     data: {
//       bar_code: $this.state.patient_code + row.service_code
//     }
//   });
// };

const dateFormater = (value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const onCleargridcol = ($this, row, e) => {
  let test_details = $this.state.test_details;
  let _index = test_details.indexOf(row);
  row[e] = null;
  test_details[_index] = row;
  $this.setState({ test_details: test_details });
};

const onchangegridcol = ($this, row, e) => {
  let test_details = $this.state.test_details;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let _index = test_details.indexOf(row);
  row[name] = value;

  switch (name) {
    case "container_id":
      row["container_code"] = e.selected.container_id;
      test_details[_index] = row;
      $this.setState({ test_details: test_details });
      break;
    case "send_in_test":
      row["send_in_test"] = value;
      test_details[_index] = row;
      $this.setState(
        {
          test_details: test_details,
        },
        () => $this.forceUpdate()
      );
      break;
    default:
      test_details[_index] = row;
      $this.setState({ test_details: test_details });
      break;
  }
};

const onchangegridcoldatehandle = ($this, row, ctrl, e) => {
  let test_details = $this.state.test_details;
  if (Date.parse(moment(ctrl)._d) > Date.parse(new Date())) {
    swalMessage({
      title: "Collected date cannot be future Date.",
      type: "warning",
    });
  } else {
    let _index = test_details.indexOf(row);
    row["collected_date"] = moment(ctrl)._d;
    test_details[_index] = row;
    $this.setState({
      test_details: test_details,
    });
  }
};

const getSampleCollectionDetails = ($this, selected_patient) => {
  let inputobj = {};

  if (selected_patient.patient_id !== null) {
    inputobj.patient_id = selected_patient.patient_id;
  }
  if (selected_patient.visit_id !== null) {
    inputobj.visit_id = selected_patient.visit_id;
  }
  if (selected_patient.ip_id !== null) {
    inputobj.ip_id = selected_patient.ip_id;
  }
  algaehApiCall({
    uri: "/laboratory/getLabOrderedServices",
    module: "laboratory",
    method: "GET",
    data: inputobj,
    onSuccess: (response) => {
      selected_patient.test_details = response.data.records;
      if (response.data.success) {
        $this.setState({ ...selected_patient });
      }
      if (selected_patient.collected === "Y") {
        if (sockets.connected) {
          sockets.emit("specimen_acknowledge", {
            test_details: response.data.records,
            collected_date: selected_patient.collected_date,
          });
        }
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};
export {
  CollectSample,
  printBarcode,
  updateLabOrderServiceStatus,
  updateLabOrderServiceMultiple,
  dateFormater,
  onchangegridcol,
  onchangegridcoldatehandle,
  printBulkBarcode,
  onCleargridcol,
  getSampleCollectionDetails,
};
