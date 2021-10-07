import React, { useState } from "react";
import {
  AlgaehModal,
  AlgaehMessagePop,
  //   AlgaehDateHandler,
  Spin,
} from "algaeh-react-components";
// import moment from "moment";
import { algaehApiCall } from "../../utils/algaehApiCall";
function ModalPrintCustomerAndSupplier({
  title,
  visible,
  screenFrom,
  onCancel,
  childIds,
  //   filteredDataToPrint,
}) {
  const [plaseWait, setPleaseWait] = useState(
    "Please wait report is preparing.."
  );
  //   const previousMonthDate = [moment().startOf("month"), moment()];
  //   const [dateRange, setDateRange] = useState(previousMonthDate);
  const [loading, setLoading] = useState(false);

  function onPdfGeneration() {
    setPleaseWait("Please wait pdf is generating...");
    setLoading(true);
    console.log("childIds", childIds);

    generateReport("pdf")
      .then((result) => {
        const origin = `${
          window.location.origin
        }/reportviewer/web/viewer.html?file=${result}&filename=${
          screenFrom === "CUST" ? "Customer List" : "Supplier List"
        }`;
        setLoading(false);
        window.open(origin);
      })
      .catch((error) => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }
  function onExcelGeneration() {
    generateReport("excel")
      .then((result) => {
        const a = document.createElement("a");
        a.href = result;
        a.download = `${
          screenFrom === "CUST" ? "Customer List" : "Supplier List"
        }.${"xlsx"}`;
        a.click();
      })
      .catch((error) => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }
  function onCancelClick() {
    setLoading(false);
    onCancel();
  }
  function generateReport(type) {
    return new Promise((resolve, reject) => {
      try {
        // const from_date =
        //   dateRange.length === 0
        //     ? {}
        //     : {
        //         name: "from_date",
        //         value: moment(dateRange[0]).format("YYYY-MM-DD"),
        //       };
        // const to_date =
        //   dateRange.length === 0
        //     ? {}
        //     : {
        //         name: "to_date",
        //         value: moment(dateRange[1]).format("YYYY-MM-DD"),
        //       };

        algaehApiCall({
          cancelRequestId:
            screenFrom === "CUST" ? "Customer List" : "Supplier List",
          uri: type === "excel" ? "/excelReport" : "/report",
          module: "reports",
          method: "GET",
          headers: {
            Accept: "blob",
          },
          others: { responseType: "blob" },
          data: {
            report: {
              displayName:
                screenFrom === "CUST" ? "Customer List" : "Supplier List",

              reportName:
                screenFrom === "CUST"
                  ? "customerStatementSummary"
                  : "supplierStatementSummary",

              template_name: null,
              reportQuery: null,
              pageSize: "A4",
              pageOrentation: "portrait",
              reportParams: [
                // { name: "filteredData", value: filteredDataToPrint },
                { name: "childIds", value: childIds },
                // from_date,
                // to_date,
              ],
              outputFileType: type === "excel" ? "EXCEL" : "PDF",
            },
          },
          onSuccess: (response) => {
            const url = URL.createObjectURL(response.data);
            resolve(url);
          },
          onCatch: (error) => {
            reject(error);
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  return (
    <AlgaehModal
      className="algaehStatementStyle"
      title={title}
      visible={visible}
      maskClosable={false}
      closable={false}
      destroyOnClose={true}
      afterClose={() => {
        setLoading(false);
      }}
      footer={
        <div>
          <span className="ant-btn ant-btn-primary ant-btn-circle ant-btn-icon-only">
            <i className="fas fa-file-pdf" onClick={onPdfGeneration}></i>
          </span>
          <span
            className="ant-btn ant-btn-success ant-btn-circle ant-btn-icon-only"
            style={{ backgroundColor: "#00a796", color: "#fff" }}
          >
            <i className="fas fa-file-excel" onClick={onExcelGeneration}></i>
          </span>
          <span className="ant-btn ant-btn-dangerous ant-btn-circle ant-btn-icon-only">
            <i className="fas fa-times" onClick={onCancelClick}></i>
          </span>
        </div>
      }
    >
      <Spin tip={plaseWait} spinning={loading}>
        <div className="row">
          {/* <AlgaehDateHandler
            type={"range"}
            div={{
              className: "col-12 form-group",
            }}
            label={{
              forceLabel: "Select Date Range",
            }}
            textBox={{
              name: "selectRange",
              value: dateRange,
            }}
            maxDate={moment().add(1, "days")}
            events={{
              onChange: (dateSelected) => {
                setDateRange(dateSelected);
              },
            }}
          /> */}
        </div>
      </Spin>
    </AlgaehModal>
  );
}

export default ModalPrintCustomerAndSupplier;
