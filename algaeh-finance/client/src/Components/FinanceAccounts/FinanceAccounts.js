import React from "react";
import TreeComponent from "./TreeComponent";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import moment from "moment";

export default function FinanceAccounts({ inDrawer = false }) {
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
    debugger;
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

  return (
    <div className="">
      <AlgaehTabs content={content} />

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              type="button"
              className="btn btn-primary"
              onClick={exportExcelAccountOB}
            >
              <AlgaehLabel label={{ forceLabel: "Export" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
