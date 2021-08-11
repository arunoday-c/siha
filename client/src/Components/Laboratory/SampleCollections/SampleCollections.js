import React, { useContext, useState, useEffect } from "react";
// import Options from "../../../Options.json";
import {
  // AlgaehDataGrid,
  AlgaehLabel,
  MainContext,
  AlgaehModal,
  RawSecurityComponent,
  // AlgaehAutoComplete,
  AlgaehMessagePop,
  // DatePicker,
  AlgaehSecurityComponent,
  // AlgaehFormGroup,
} from "algaeh-react-components";

// import variableJson from "../../../utils/GlobalVariables.json";
// import moment from "moment";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
// import Options from "../../../Options.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import sockets from "../../../sockets";
import swal from "sweetalert2";
// import axios from "axios";
import "./SampleCollections.scss";
import "../../../styles/site.scss";

import SampleCollectionList from "./SampleCollectionList";

function SampleCollectionPatient({ onClose, selected_patient = {}, isOpen }) {
  const { userToken } = useContext(MainContext);
  const [hospital_id, setHospital_id] = useState(null);
  const [showCheckBoxColumn, setShowCheckBoxColumn] = useState(false);
  const [portal_exists, setPortal_exists] = useState(false);

  // const [editableGrid, setEditableGrid] = useState(undefined);
  const [test_details, setTest_details] = useState([]);
  const [under_process, setUnderProcess] = useState(false);
  const [display_message, setDisplayMessage] = useState("");
  let [, setState] = useState();

  useEffect(() => {
    // RawSecurityComponent({ componentCode: "ID_NOTIFY_EXP" }).then((result) => {

    //   if (result === "hide") {
    //     this.setState({ showCheckBoxColumn: true });
    //   }
    // });

    setPortal_exists(userToken.portal_exists);
    setHospital_id(userToken.hims_d_hospital_id);

    RawSecurityComponent({ componentCode: "BTN_BLK_SAM_BAR_COL" }).then(
      (result) => {
        if (result === "hide") {
          setShowCheckBoxColumn(false);
        } else {
          setShowCheckBoxColumn(true);
        }
      }
    );

    // RawSecurityComponent({ componentCode: "SPEC_COLL_STATUS_CHANGE" }).then(
    //   (result) => {
    //     if (result === "hide") {
    //       setEditableGrid(undefined);
    //     } else {
    //       setEditableGrid("editOnly");
    //     }
    //   }
    // );
  }, []);

  const { data: labspecimen } = useQuery(
    ["getLabSpecimen", {}],
    getLabSpecimen,
    {
      keepPreviousData: true,
      onSuccess: (data) => {},
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getLabSpecimen(key) {
    const result = await newAlgaehApi({
      uri: "/labmasters/selectSpecimen",
      module: "laboratory",
      method: "GET",
    });
    return result?.data?.records;
  }

  const { refetch: labOrderRefetch } = useQuery(
    ["getSampleCollectionDetails", { selected_patient }],
    getSampleCollectionDetails,
    {
      onSuccess: (data) => {
        setTest_details(data);
        setUnderProcess(false);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getSampleCollectionDetails(key, selected_patient) {
    let inputobj = {};
    if (selected_patient.selected_patient.patient_id !== null) {
      inputobj.patient_id = selected_patient.selected_patient.patient_id;
    }
    if (selected_patient.selected_patient.visit_id !== null) {
      inputobj.visit_id = selected_patient.selected_patient.visit_id;
    }

    const result = await newAlgaehApi({
      uri: "/laboratory/getLabOrderedServices",
      module: "laboratory",
      method: "GET",
      data: inputobj,
    });
    return result?.data?.records;
  }

  // const CollectSample = (row) => {
  //   if (row.container_id === null || row.container_id === undefined) {
  //     swalMessage({
  //       title: "Please select Container",
  //       type: "warning",
  //     });
  //     return;
  //   } else if (row.sample_id === null || row.sample_id === undefined) {
  //     swalMessage({
  //       title: "Please select Sample",
  //       type: "warning",
  //     });
  //     return;
  //   } else if (row.send_out_test === null || row.send_out_test === undefined) {
  //     swalMessage({
  //       title: "Please select Send Out",
  //       type: "warning",
  //     });
  //     return;
  //   } else if (row.send_in_test === null || row.send_in_test === undefined) {
  //     swalMessage({
  //       title: "Please select Send In",
  //       type: "warning",
  //     });
  //     return;
  //   }

  //   let inputobj = {
  //     hims_f_lab_order_id: row.hims_f_lab_order_id,
  //     hims_d_lab_sample_id: row.hims_d_lab_sample_id,
  //     visit_id: row.visit_id,
  //     order_id: row.hims_f_lab_order_id,
  //     sample_id: row.sample_id,
  //     collected: "Y",
  //     status: "N",
  //     hims_d_hospital_id: hospital_id,
  //     service_id: row.service_id,
  //     service_code: row.service_code,
  //     send_out_test: row.send_out_test,
  //     send_in_test: row.send_in_test,
  //     collected_date: row.collected_date,
  //     container_id: row.container_id,
  //     test_id: row.test_id,
  //     container_code: row.container_code,
  //     lab_id_number: row.lab_id_number,
  //     visit_code: row.visit_code,
  //     primary_id_no: row.primary_id_no,
  //     service_status: "SAMPLE COLLECTED",
  //     portal_exists: portal_exists,
  //   };

  //   AlgaehLoader({ show: true });
  //   algaehApiCall({
  //     uri: "/laboratory/updateLabOrderServices",
  //     module: "laboratory",
  //     data: inputobj,
  //     method: "PUT",
  //     onSuccess: (response) => {
  //       if (response.data.success === true) {
  //         if (sockets.connected) {
  //           sockets.emit("specimen_acknowledge", {
  //             test_details: response.data.records,
  //             collected_date: response.data.records.collected_date,
  //           });
  //         }
  //         labOrderRefetch();

  //         swalMessage({
  //           title: "Collected Successfully",
  //           type: "success",
  //         });
  //       }
  //       AlgaehLoader({ show: false });
  //     },
  //     onFailure: (error) => {
  //       AlgaehLoader({ show: false });
  //       swalMessage({
  //         title: error.response.data.message || error.message,
  //         type: "error",
  //       });
  //     },
  //   });
  // };

  const BulkSampleCollection = () => {
    const data = test_details;

    const filterData = data.filter(
      (f) => f.checked && (f.collected === "N" || f.collected === null)
    );

    const sample_validate = filterData.find((f) => f.sample_id === null);

    const container_validate = filterData.find((f) => f.container_id === null);
    const send_out_validate = filterData.find((f) => f.send_out_test === null);
    const send_in_validate = filterData.find((f) => f.send_in_test === null);

    if (sample_validate) {
      swalMessage({
        title: "Please select Sample in " + sample_validate.service_name,
        type: "warning",
      });
      return;
    } else if (container_validate) {
      swalMessage({
        title: "Please select Container in " + container_validate.service_name,
        type: "warning",
      });
      return;
    } else if (send_out_validate) {
      swalMessage({
        title: "Please select Send Out in " + send_out_validate.service_name,
        type: "warning",
      });
      return;
    } else if (send_in_validate) {
      swalMessage({
        title: "Please select Send In in " + send_in_validate.service_name,
        type: "warning",
      });
      return;
    }

    // AlgaehLoader({ show: true });
    if (filterData.length > 0) {
      swal({
        title: `Are you sure to collect Sample Bulk?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
      }).then((willProcess) => {
        if (willProcess.value) {
          setDisplayMessage("Bulk collection in progress...");
          setUnderProcess(true);
          const addedData = filterData.map((item) => {
            return {
              hims_f_lab_order_id: item.hims_f_lab_order_id,
              hims_d_lab_sample_id: item.hims_d_lab_sample_id,
              visit_id: item.visit_id,
              order_id: item.hims_f_lab_order_id,
              sample_id: item.sample_id,
              collected: "Y",
              status: "N",
              hims_d_hospital_id: hospital_id,
              service_id: item.service_id,
              service_code: item.service_code,
              send_out_test: item.send_out_test,
              send_in_test: item.send_in_test,
              container_id: item.container_id,
              test_id: item.hims_d_investigation_test_id,
              container_code: item.container_code,
              lab_id_number: item.lab_id_number,
              visit_code: item.visit_code,
              primary_id_no: item.primary_id_no,
              service_status: "SAMPLE COLLECTED",
              portal_exists: portal_exists,
            };
          });

          algaehApiCall({
            uri: "/laboratory/bulkSampleCollection",
            module: "laboratory",
            data: {
              bulkCollection: addedData,
              portal_exists: portal_exists,
            },
            method: "PUT",
            onSuccess: (response) => {
              if (response.data.success === true) {
                labOrderRefetch();
                swalMessage({
                  title: "Collected Successfully",
                  type: "success",
                });
              }
              AlgaehLoader({ show: false });
            },
            onFailure: (error) => {
              setUnderProcess(false);
              AlgaehLoader({ show: false });
              swalMessage({
                title: error.response.data.message || error.message,
                type: "error",
              });
            },
          });
        }
      });
    } else {
      swalMessage({
        title: "No sample to collect",
        type: "warning",
      });
    }
  };
  const printBulkBarcode = () => {
    const data = test_details;
    const filterData = data.filter((f) => f.checked && f.collected === "Y");
    if (filterData.length === 0) {
      swalMessage({
        title: "Select alteast one record.",
        type: "warning",
      });
      return;
    }
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
  // const forceUpdate = (row) => {
  //   let testDetails = test_details;

  //   let _index = testDetails.indexOf(row);

  //   testDetails[_index] = row;
  //   setTest_details(testDetails);
  //   setState({});
  // };
  // const updateLabOrderServiceStatus = (row) => {
  //   swal({
  //     title: `Are you sure to change specimen as not collected?`,
  //     type: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes",
  //     confirmButtonColor: "#44b8bd",
  //     cancelButtonColor: "#d33",
  //     cancelButtonText: "No",
  //   }).then((willDelete) => {
  //     if (willDelete.value) {
  //       let normal_lab_order_id = [],
  //         micro_cul_lab_order_id = [];

  //       if (row.culture_test === "Y" && row.test_section === "M") {
  //         micro_cul_lab_order_id = [row.hims_f_lab_order_id];
  //       } else {
  //         normal_lab_order_id = [row.hims_f_lab_order_id];
  //       }
  //       algaehApiCall({
  //         uri: "/laboratory/updateLabOrderServiceStatus",
  //         module: "laboratory",
  //         data: {
  //           micro_cul_lab_order_id: micro_cul_lab_order_id,
  //           normal_lab_order_id: normal_lab_order_id,
  //           portal_exists: portal_exists,
  //         },
  //         method: "PUT",
  //         onSuccess: (response) => {
  //           if (response.data.success === true) {
  //             swalMessage({
  //               title: "Record Updated Successfully",
  //               type: "success",
  //             });
  //             labOrderRefetch();
  //           }
  //         },
  //         onFailure: (error) => {
  //           swalMessage({
  //             title: error.response.data.message || error.message,
  //             type: "error",
  //           });
  //         },
  //       });
  //     }
  //   });

  //   // } else {
  //   //   return;
  //   // }
  // };

  const updateLabOrderServiceMultiple = () => {
    let normal_lab_order_id = [],
      micro_cul_lab_order_id = [];
    test_details.map((o) => {
      if (o.checked && o.collected === "Y" && o.culture_test === "N") {
        normal_lab_order_id.push(o.hims_f_lab_order_id);
      } else if (o.checked && o.collected === "Y" && o.culture_test === "Y") {
        micro_cul_lab_order_id.push(o.hims_f_lab_order_id);
      }
      return null;
    });
    if (
      normal_lab_order_id.length === 0 &&
      micro_cul_lab_order_id.length === 0
    ) {
      swalMessage({
        title: "Select alteast one record.",
        type: "warning",
      });
      return;
    }
    // if (row.test_section === "M" && row.culture_test === "Y") {
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
        setDisplayMessage("Bulk cancellation in progress...");
        setUnderProcess(true);
        algaehApiCall({
          uri: "/laboratory/updateLabOrderServiceStatus",
          module: "laboratory",
          data: {
            normal_lab_order_id: normal_lab_order_id,
            micro_cul_lab_order_id: micro_cul_lab_order_id,
            portal_exists: portal_exists,
          },
          method: "PUT",
          onSuccess: (response) => {
            if (response.data.success === true) {
              swalMessage({
                title: "Cancelled Successfully",
                type: "success",
              });

              labOrderRefetch();
            }
          },
          onFailure: (error) => {
            setUnderProcess(false);
            swalMessage({
              title: error.response.data.message || error.message,
              type: "error",
            });
          },
        });
      }
    });
  };
  // const printBarcode = (row) => {
  //   if (row.lab_id_number !== null) {
  //     algaehApiCall({
  //       uri: "/report",
  //       method: "GET",
  //       module: "reports",
  //       headers: {
  //         Accept: "blob",
  //       },
  //       others: { responseType: "blob" },
  //       data: {
  //         report: {
  //           others: {
  //             width: "50mm",
  //             height: "20mm",
  //             showHeaderFooter: false,
  //           },
  //           reportName: "specimenBarcode",
  //           reportParams: [
  //             {
  //               name: "hims_f_lab_order_id",
  //               value: row.hims_f_lab_order_id,
  //             },
  //           ],
  //           outputFileType: "PDF",
  //         },
  //       },

  //       onSuccess: (res) => {
  //         const urlBlob = URL.createObjectURL(res.data);
  //         const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
  //         window.open(origin);
  //       },
  //       // onSuccess: (res) => {
  //       //   const urlBlob = URL.createObjectURL(res.data);
  //       //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
  //       //   window.open(origin);
  //       //   window.document.title = "Specimen Barcode";
  //       // },
  //     });
  //   } else {
  //     let inputobj = {
  //       hims_f_lab_order_id: row.hims_f_lab_order_id,
  //       hims_d_lab_sample_id: row.hims_d_lab_sample_id,
  //       order_id: row.hims_f_lab_order_id,
  //       sample_id: row.sample_id,
  //       collected: "Y",
  //       status: "N",
  //       hims_d_hospital_id: hospital_id,
  //       service_id: row.service_id,
  //       service_code: row.service_code,
  //       send_out_test: row.send_out_test,
  //       container_id: row.container_id,
  //       test_id: row.hims_d_investigation_test_id,
  //       container_code: row.container_code,
  //     };

  //     AlgaehLoader({ show: true });
  //     algaehApiCall({
  //       uri: "/laboratory/generateBarCode",
  //       module: "laboratory",
  //       data: inputobj,
  //       method: "PUT",
  //       onSuccess: (response) => {
  //         if (response.data.success === true) {
  //           let testDetails = test_details;

  //           const _index = testDetails.indexOf(row);

  //           row["lab_id_number"] = response.data.records.lab_id_number;
  //           testDetails[_index] = row;

  //           algaehApiCall({
  //             uri: "/report",
  //             method: "GET",
  //             module: "reports",
  //             headers: {
  //               Accept: "blob",
  //             },
  //             others: { responseType: "blob" },
  //             data: {
  //               report: {
  //                 others: {
  //                   width: "50mm",
  //                   height: "20mm",
  //                   showHeaderFooter: false,
  //                 },
  //                 reportName: "specimenBarcode",
  //                 reportParams: [
  //                   {
  //                     name: "hims_f_lab_order_id",
  //                     value: row.hims_f_lab_order_id,
  //                   },
  //                 ],
  //                 outputFileType: "PDF",
  //               },
  //             },

  //             onSuccess: (res) => {
  //               const urlBlob = URL.createObjectURL(res.data);
  //               const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
  //               window.open(origin);
  //             },

  //             // onSuccess: (res) => {
  //             //   const urlBlob = URL.createObjectURL(res.data);
  //             //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
  //             //   window.open(origin);
  //             //    window.document.title = "Specimen Barcode";
  //             // },
  //           });
  //         }
  //         AlgaehLoader({ show: false });
  //       },
  //       onFailure: (error) => {
  //         swalMessage({
  //           title: error.response.data.message || error.message,
  //           type: "error",
  //         });
  //       },
  //     });
  //   }
  // };

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

  // const onchangegridcoldatehandle = (row, ctrl, e) => {
  //   let testDetails = test_details;
  //   if (Date.parse(moment(ctrl)._d) > Date.parse(new Date())) {
  //     swalMessage({
  //       title: "Collected date cannot be future Date.",
  //       type: "warning",
  //     });
  //   } else {
  //     let _index = testDetails.indexOf(row);
  //     row["collected_date"] = moment(ctrl)._d;
  //     testDetails[_index] = row;
  //     setTest_details(testDetails);
  //   }
  // };

  // const getSampleCollectionDetails = ($this, selected_patient) => {
  //   let inputobj = {};

  //   if (selected_patient.patient_id !== null) {
  //     inputobj.patient_id = selected_patient.patient_id;
  //   }
  //   if (selected_patient.visit_id !== null) {
  //     inputobj.visit_id = selected_patient.visit_id;
  //   }
  //   algaehApiCall({
  //     uri: "/laboratory/getLabOrderedServices",
  //     module: "laboratory",
  //     method: "GET",
  //     data: inputobj,
  //     onSuccess: (response) => {
  //       selected_patient.test_details = response.data.records;
  //       if (response.data.success) {
  //         $this.setState({ ...selected_patient });
  //       }
  //       if (selected_patient.collected === "Y") {
  //         if (sockets.connected) {
  //           sockets.emit("specimen_acknowledge", {
  //             test_details: response.data.records,
  //             collected_date: selected_patient.collected_date,
  //           });
  //         }
  //       }
  //     },
  //     onFailure: (error) => {
  //       swalMessage({
  //         title: error.message,
  //         type: "error",
  //       });
  //     },
  //   });
  // };

  const { data: labcontainer } = useQuery(
    ["getLabContainer", {}],
    getLabContainer,
    {
      keepPreviousData: true,
      onSuccess: (data) => {},
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getLabContainer(key) {
    const result = await newAlgaehApi({
      uri: "/labmasters/selectContainer",
      module: "laboratory",
      method: "GET",
    });
    return result?.data?.records;
  }
  const { data: userdrtails } = useQuery(
    ["getUserDetails", {}],
    getUserDetails,
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        // setEnabledHESN(false);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  // const selectAll = (e) => {
  //   const staus = e.target.checked;
  //   const myState = test_details.map((f) => {
  //     return { ...f, checked: staus };
  //   });

  //   const hasUncheck = myState.filter((f) => {
  //     return f.checked === undefined || f.checked === false;
  //   });

  //   const totalRecords = myState.length;
  //   setCheckAll(
  //     totalRecords === hasUncheck.length
  //       ? "UNCHECK"
  //       : hasUncheck.length === 0
  //       ? "CHECK"
  //       : "INDETERMINATE"
  //   );
  //   setTest_details([...myState]);
  // };

  // const selectToGenerateBarcode = (row, e) => {
  //   const status = e.target.checked;
  //   row.checked = status;
  //   const records = test_details;
  //   const hasUncheck = records.filter((f) => {
  //     return f.checked === undefined || f.checked === false;
  //   });

  //   const totalRecords = records.length;
  //   let ckStatus =
  //     totalRecords === hasUncheck.length
  //       ? "UNCHECK"
  //       : hasUncheck.length === 0
  //       ? "CHECK"
  //       : "INDETERMINATE";
  //   if (ckStatus === "INDETERMINATE") {
  //     allChecked.indeterminate = true;
  //   } else {
  //     allChecked.indeterminate = false;
  //   }
  //   setCheckAll(ckStatus);
  //   setTest_details([...records]);
  // };

  const updateState = () => {
    labOrderRefetch();
  };
  const updateTestDetails = (data) => {
    setTest_details(data);
  };

  const forceUpdate = (row) => {
    let testDetails = test_details;

    let _index = testDetails.indexOf(row);

    testDetails[_index] = row;
    setTest_details(testDetails);
    setState({});
  };

  async function getUserDetails(key) {
    const result = await newAlgaehApi({
      uri: "/algaehappuser/selectAppUsers",
      method: "GET",
    });
    return result?.data?.records;
  }

  return (
    <div>
      <AlgaehModal
        title="Specimen Collections"
        visible={isOpen}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        footer={[
          <button onClick={onClose} className="btn btn-default">
            Close
          </button>,
          <AlgaehSecurityComponent componentCode="BTN_BLK_SAM_BAR_COL">
            <button
              className="btn btn-primary"
              onClick={BulkSampleCollection.bind(this, this)}
            >
              <AlgaehLabel
                label={{
                  forceLabel: "Collect Specimen",
                }}
              />
            </button>
          </AlgaehSecurityComponent>,

          <AlgaehSecurityComponent componentCode="BTN_BLK_SAM_BAR_COL">
            <button
              className="btn btn-default"
              onClick={printBulkBarcode.bind(this, this)}
            >
              <AlgaehLabel
                label={{
                  forceLabel: "Print Barcode",
                }}
              />
            </button>
          </AlgaehSecurityComponent>,
          <AlgaehSecurityComponent componentCode="SPEC_COLL_STATUS_CHANGE">
            <button
              className="btn btn-default"
              onClick={updateLabOrderServiceMultiple.bind(this, this)}
            >
              <AlgaehLabel
                label={{
                  forceLabel: "Cancel Collected Specimen",
                }}
              />
            </button>
          </AlgaehSecurityComponent>,
        ]}
        className={`row algaehNewModal SpecimenModalPopup`}
      >
        <div className="col-lg-12 popupInner">
          <div className="row">
            <div className="col-lg-2">
              <AlgaehLabel
                label={{
                  fieldName: "patient_code",
                }}
              />
              <h6>
                {selected_patient.patient_code
                  ? selected_patient.patient_code
                  : "Patient Code"}
              </h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  fieldName: "patient_name",
                }}
              />
              <h6>
                {selected_patient.full_name
                  ? selected_patient.full_name
                  : "Patient Name"}
              </h6>
            </div>

            {/* <div className="col">
              <AlgaehLabel
                label={{
                  fieldName: "ordered_by",
                }}
              />
              <h6>
                {selected_patient.doctor_name
                  ? selected_patient.doctor_name
                  : "------"}
              </h6>
            </div> */}
            <div className="col-lg-3">
              <AlgaehLabel
                label={{
                  fieldName: "ordered_date",
                }}
              />
              <h6>
                {selected_patient.ordered_date
                  ? selected_patient.ordered_date
                  : "Ordered Date"}
              </h6>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12" id="samplecollection_grid">
              {under_process === true ? (
                <div
                  style={{
                    height: "68vh",
                    textAlign: "center",
                    paddingTop: "30vh",
                    background: "#efefef",
                  }}
                >
                  <h2>{display_message}</h2>
                </div>
              ) : (
                <SampleCollectionList
                  hospital_id={hospital_id}
                  portal_exists={portal_exists}
                  updateState={updateState}
                  showCheckBoxColumn={showCheckBoxColumn}
                  test_details={test_details}
                  updateTestDetails={updateTestDetails}
                  labspecimen={labspecimen}
                  labcontainer={labcontainer}
                  userdrtails={userdrtails}
                  forceUpdate={forceUpdate}
                />
              )}
            </div>
          </div>
          {/* <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    className="btn btn-default"
                    onClick={(e) => {
                      onClose(e);
                    }}
                  >
                    <AlgaehLabel label={{ fieldName: "btnclose" }} />
                  </button>
                  
                 
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </AlgaehModal>
    </div>
  );
}

export default SampleCollectionPatient;
