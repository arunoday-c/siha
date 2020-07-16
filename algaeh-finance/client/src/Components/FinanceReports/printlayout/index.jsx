import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { AlgaehTable } from "algaeh-react-components";
import ReportHeader from "../header";
export default function ({
  title,
  columns,
  data,
  layout,
  tableprops,
  renderBeforeTable,
  renderAfterTable,
}) {
  const createPrintObject = useRef(undefined);
  const isExpand = layout === undefined ? true : layout.expand;
  return (
    <>
      <div className="row">
        <div className="col-12 reportHeaderAction">
          <span>
            <ReactToPrint
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
            />
          </span>
        </div>
      </div>
      <ReportHeader title={title} />
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
              className="reportGridPlain"
              columns={columns}
              data={columns.length === 0 ? [] : data}
              expandAll={isExpand}
              pagination={false}
              {...tableprops}
            />
            {renderAfterTable}
          </>
        )}
      </div>
    </>
  );
}
