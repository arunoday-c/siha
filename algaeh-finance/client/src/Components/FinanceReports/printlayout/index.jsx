import React, { useRef, useState } from "react";
// import ReactToPrint from "react-to-print";
import { AlgaehTable } from "algaeh-react-components";
import ReportHeader from "../header";
import SmartTable from "../smartSplitPDF";
import { GenerateExcel } from "./workers/worker";
export default function ({
  title,
  columns,
  data,
  layout,
  tableprops,
  renderBeforeTable,
  renderAfterTable,
  excelBodyRender,
}) {
  const isExpand = layout === undefined ? true : layout.expand;
  const createPrintObject = useRef(undefined);
  const [loadingExcel, setExcelLoading] = useState(false);
  function downloadExcel() {
    setExcelLoading(true);
    GenerateExcel({ columns, data, excelBodyRender })
      .then((result) => {
        setExcelLoading(false);
        if (typeof result !== "boolean") {
          const a: HTMLAnchorElement = document.createElement("a");
          a.style.display = "none";
          document.body.appendChild(a);

          const url: string = window.URL.createObjectURL(result);

          a.href = url;
          a.download = `${title}.xlsx`;

          a.click();

          window.URL.revokeObjectURL(url);

          if (a && a.parentElement) {
            a.parentElement.removeChild(a);
          }
        }
      })
      .catch((error) => {
        setExcelLoading(false);
        console.error("error", error);
      });
  }

  return (
    <>
      <div className="row">
        <div className="col-12 reportHeaderAction">
          <span>
            {/* <i className="fas fa-print" /> */}
            {/* <ReactToPrint
              trigger={() => <i className="fas fa-print" />}
              content={() => createPrintObject.current}
              removeAfterPrint={true}
              bodyClass="reportPreviewSecLeft"
              pageStyle="@media print {
          html, body {
            height: initial !important;
            overflow: initial !important;
            -webkit-print-color-adjust: exact;
          }
        }
        
        @page {
          size: auto;
          margin: 20mm;
        }"
            /> */}
            <SmartTable
              control={() => createPrintObject.current}
              columnsToRepeat={[0]}
              columnPerPage={7}
            />
          </span>
          <span>
            <i
              className={`fas ${
                loadingExcel ? "fa-spinner fa-spin" : "fa-file-excel"
              }`}
              style={{ pointerEvents: !data || loadingExcel ? "none" : "" }}
              onClick={downloadExcel}
            />
          </span>
          {/* <span>
            <i className="fas fa-file-pdf" />
          </span> */}
        </div>
      </div>

      <div className="row" ref={createPrintObject}>
        <div className="col-12">
          <ReportHeader title={title} />
        </div>
        <div className="col-12">
          {!data ? (
            <div style={{ textAlign: "center" }}>
              <i
                className="fas fa-filter"
                style={{
                  fontSize: "4rem",
                  margin: "50px 0 20px",
                  color: "rgb(204, 204, 204)",
                }}
              ></i>
              <p
                style={{
                  fontSize: "1rem",
                }}
              >
                Apply filter and click load
              </p>
            </div>
          ) : (
            <>
              {renderBeforeTable}
              <AlgaehTable
                className="financeReportStyle"
                columns={columns}
                data={columns.length === 0 ? [] : data}
                expandAll={isExpand}
                pagination={false}
                freezable={true}
                {...tableprops}
              />
              {renderAfterTable}
            </>
          )}
        </div>
      </div>
    </>
  );
}
