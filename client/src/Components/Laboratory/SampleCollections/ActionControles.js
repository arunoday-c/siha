import React, { memo } from "react";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import sockets from "../../../sockets";
import { Tooltip } from "algaeh-react-components";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import swal from "sweetalert2";

export default memo(function ActionControles({
  row,
  hospital_id,
  portal_exists,
  updateState,
  test_details,
}) {
  const CollectSample = (row) => {
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
      hims_d_hospital_id: hospital_id,
      service_id: row.service_id,
      service_code: row.service_code,
      send_out_test: row.send_out_test,
      send_in_test: row.send_in_test,
      collected_date: row.collected_date,
      container_id: row.container_id,
      test_id: row.test_id,
      container_code: row.container_code,
      lab_id_number: row.lab_id_number,
      visit_code: row.visit_code,
      primary_id_no: row.primary_id_no,
      service_status: "SAMPLE COLLECTED",
      portal_exists: portal_exists,
    };

    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/laboratory/updateLabOrderServices",
      module: "laboratory",
      data: inputobj,
      method: "PUT",
      onSuccess: (response) => {
        if (response.data.success === true) {
          if (sockets.connected) {
            sockets.emit("specimen_acknowledge", {
              test_details: response.data.records,
              collected_date: response.data.records.collected_date,
            });
          }
          updateState();

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

  const printBarcode = (row) => {
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
        hims_d_hospital_id: hospital_id,
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
            let testDetails = test_details;

            const _index = testDetails.indexOf(row);

            row["lab_id_number"] = response.data.records.lab_id_number;
            testDetails[_index] = row;

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

  const updateLabOrderServiceStatus = (row) => {
    swal({
      title: `Are you sure to change specimen as not collected?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        let normal_lab_order_id = [],
          micro_cul_lab_order_id = [];

        if (row.culture_test === "Y" && row.test_section === "M") {
          micro_cul_lab_order_id = [row.hims_f_lab_order_id];
        } else {
          normal_lab_order_id = [row.hims_f_lab_order_id];
        }
        algaehApiCall({
          uri: "/laboratory/updateLabOrderServiceStatus",
          module: "laboratory",
          data: {
            micro_cul_lab_order_id: micro_cul_lab_order_id,
            normal_lab_order_id: normal_lab_order_id,
            portal_exists: portal_exists,
          },
          method: "PUT",
          onSuccess: (response) => {
            if (response.data.success === true) {
              if (sockets.connected) {
                sockets.emit("specimen_acknowledge", {
                  test_details: response.data.records,
                  collected_date: response.data.records.collected_date,
                });
              }
              swalMessage({
                title: "Record Updated Successfully",
                type: "success",
              });
              updateState();
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

  return (
    <>
      {row.collected !== "Y" ? (
        <Tooltip title="Collect Specimen" zIndex={99999} placement={"right"}>
          <i
            style={{
              pointerEvents: row.billed === "N" ? "none" : "",
              opacity: row.billed === "N" ? "0.1" : "",
            }}
            className="fas fa-check"
            onClick={() => CollectSample(row)}
          />
        </Tooltip>
      ) : (
        <span>
          <Tooltip title="Generate Barcode" zIndex={99999} placement={"left"}>
            <i
              style={{
                pointerEvents: row.billed === "N" ? "none" : "",
                opacity: row.billed === "N" ? "0.1" : "",
              }}
              className="fas fa-barcode"
              onClick={() => printBarcode(row)}
            />
          </Tooltip>

          <Tooltip title="Cancel Sample" zIndex={99999} placement={"right"}>
            <i
              className="fa fa-share fa-flip-horizontal"
              onClick={() => updateLabOrderServiceStatus(row)}
            />
          </Tooltip>
        </span>
      )}
    </>
  );
});
