import { algaehApiCall } from "../../utils/algaehApiCall";
import { AlgaehMessagePop } from "algaeh-react-components";
export function LoadCustomerReceivables() {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_customer/getCustomerReceivables",
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}
export function onExcelGeneration(screenFrom, childIds) {
  generateReport("excel", screenFrom, childIds)
    .then((result) => {
      const a = document.createElement("a");
      a.href = result;
      a.download = `${
        screenFrom === "CUST" ? "Customer List" : "Supplier List"
      }.${"xlsx"}`;
      a.click();
    })
    .catch((error) => {
      // setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: error,
      });
    });
}
export function onPdfGeneration(screenFrom, childIds) {
  debugger;
  // setPleaseWait("Please wait pdf is generating...");
  // setLoading(true);

  generateReport("pdf", screenFrom, childIds)
    .then((result) => {
      const origin = `${
        window.location.origin
      }/reportviewer/web/viewer.html?file=${result}&filename=${
        screenFrom === "CUST" ? "Customer List" : "Supplier List"
      }`;
      // setLoading(false);
      window.open(origin);
    })
    .catch((error) => {
      // setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: error,
      });
    });
}
function generateReport(type, screenFrom, childIds) {
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
