import React, { useState, useEffect } from "react";
import TreeComponent from "./TreeComponent";
import {
  AlgaehTabs,
  AlgaehLabel,
  Spin,
  AlgaehSecurityComponent,
} from "algaeh-react-components";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import moment from "moment";
import "./alice.scss";
// import { getAccounts } from ".././FinanceAccountEvent";

export default function FinanceAccounts({ inDrawer = false }) {
  let fileInput = React.createRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (message !== "") {
      setInterval(() => {
        window.location.reload(true);
      }, 2500);
    }
  }, [message]);
  const TABS = [
    { label: "assets", assetCode: 1 },
    { label: "liabilities", assetCode: 2 },
    { label: "income", assetCode: 4 },
    { label: "capital", assetCode: 3 },
    { label: "expense", assetCode: 5 },
  ];

  const content = TABS.map((tab) => {
    return {
      title: (
        <AlgaehLabel
          label={{
            fieldName: tab.label,
          }}
        />
      ),
      children: (
        <TreeComponent
          assetCode={tab.assetCode}
          title={`${tab.label} Accounts`}
          inDrawer={inDrawer}
        />
      ),
    };
  });

  function exportExcelAccountOB() {
    algaehApiCall({
      uri: "/finance/getAccountsExport",
      method: "GET",
      module: "finance",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      onSuccess: (response) => {
        const urlBlob = URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = urlBlob;
        a.download = `AccountsOpeningBalance-${moment(new Date()).format(
          "YYYY-MM-DD"
        )}.xlsx`;
        a.click();

        // AlgaehLoader({ show: false });
      },
      onCatch: (error) => {
        var reader = new FileReader();
        reader.onload = function () {
          // AlgaehLoader({ show: false });
          const parse = JSON.parse(reader.result);

          swalMessage({
            type: "error",
            title: parse !== undefined ? parse.result.message : parse,
          });
        };
        reader.readAsText(error.response.data);
      },
    });
  }

  function importExcelAccountOB(files) {
    setLoading(true);
    // AlgaehLoader({ show: true });
    debugger;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e) => {
      const data = e.target.result.split(",")[1];

      algaehApiCall({
        uri: "/finance/excelOBAccImport",
        module: "finance",
        headers: {
          Accept: "blob",
        },
        // header: {
        //   "x-leaves-data": leaves_data,
        // },
        data:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
          data,
        method: "post",
        onSuccess: (response) => {
          if (response.data.success === true) {
            setLoading(false);
            swalMessage({
              title: "Uploded Successfully,page will refresh automatically...",
              type: "success",
            });
            setMessage("Uploded Successfully...");
          } else {
            swalMessage({
              title: "Error while upload,page will refresh automatically",
              type: "error",
            });
            setMessage("Error while upload");
          }
        },
      });
    };
  }
  // function importExcelAccountOB() {
  //   algaehApiCall({
  //     uri: "/finance/getAccountsExport",
  //     method: "GET",
  //     module: "finance",
  //     headers: {
  //       Accept: "blob",
  //     },
  //     others: { responseType: "blob" },
  //     onSuccess: (response) => {
  //       const urlBlob = URL.createObjectURL(response.data);
  //       const a = document.createElement("a");
  //       a.href = urlBlob;
  //       a.download = `AccountsOpeningBalance-${moment(new Date()).format(
  //         "YYYY-MM-DD"
  //       )}.xlsx`;
  //       a.click();

  //       // AlgaehLoader({ show: false });
  //     },
  //     onCatch: (error) => {
  //       var reader = new FileReader();
  //       reader.onload = function () {
  //         // AlgaehLoader({ show: false });
  //         const parse = JSON.parse(reader.result);

  //         swalMessage({
  //           type: "error",
  //           title: parse !== undefined ? parse.result.message : parse,
  //         });
  //       };
  //       reader.readAsText(error.response.data);
  //     },
  //   });
  // }

  return (
    <div className="">
      <AlgaehTabs content={content} />

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <AlgaehSecurityComponent componentCode="ACC_UPL_BTN">
              <div className="uploadManualDiv   btn-with-icon">
                <Spin spinning={loading}>
                  <input
                    className="inputfile"
                    type="file"
                    name="manualTimeSheet"
                    ref={fileInput}
                    onChange={(e) => {
                      if (e.target.files.length > 0)
                        importExcelAccountOB(e.target.files);
                    }}
                    // onChange={importExcelAccountOB}
                  />
                  <label onClick={() => fileInput.current.click()}>
                    <i className="fas fa-file-upload"></i> Upload Template
                  </label>
                </Spin>
              </div>{" "}
              <button
                type="button"
                className="btn btn-other"
                onClick={exportExcelAccountOB}
              >
                <AlgaehLabel label={{ forceLabel: "Download Template" }} />
              </button>
            </AlgaehSecurityComponent>

            {/* <button
              type="button"
              className="btn btn-primary"
              onClick={importExcelAccountOB}
            >
              <AlgaehLabel label={{ forceLabel: "Import " }} />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
