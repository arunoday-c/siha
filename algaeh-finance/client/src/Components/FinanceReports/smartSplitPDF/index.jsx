import React, { useState } from "react";
import ReactToPrint from "react-to-print";
import "./splittedtable.scss";
export default function SmartTable({
  control,
  columnsToRepeat,
  columnPerPage,
  title,
}) {
  const [loading, setLoading] = useState(false);
  // function convertPixelTomm(pageSizeinMM) {
  //   const onepx = 0.2645833333; // in mm
  //   const cellMaxWidth = 180;
  //   const pixelToMM = Math.ceil(cellMaxWidth * onepx);
  // }

  function splitingTable() {
    const getHeader = document
      .getElementById("finance_report_header")
      .cloneNode(true);
    const rootDiv = document.createElement("div");
    // rootDiv.setAttribute("class", "newStickyGrid");

    const contentElecment = document.createElement("div");
    // contentElecment.setAttribute("class", "table-scroll reportGridPlain");

    try {
      let tableCollections = [];
      const cloneElement = control().cloneNode(true);
      const table = cloneElement.querySelector("table");
      table.setAttribute("class", "splitted-cols");
      const tblHeader = table.querySelector("thead");
      const tableHeader = tblHeader.querySelectorAll("th");
      const tableBody = table.querySelector("tbody").querySelectorAll("tr");
      let counter = 0;
      let theadTr = document.createElement("tr");
      for (let header = 0; header < tableHeader.length; header++) {
        const headerColumns = tableHeader[header].cloneNode(true);
        if (counter === columnPerPage - 1) {
          let thead = document.createElement("thead");
          const localTheadTr = theadTr.cloneNode(true);
          thead.appendChild(localTheadTr);
          let createTable = document.createElement("table");
          createTable.appendChild(thead);
          tableCollections.push(createTable);
          theadTr = document.createElement("tr");

          for (let x = 0; x < columnsToRepeat.length; x++) {
            const headerColumns = tableHeader[x].cloneNode(true);
            theadTr.appendChild(headerColumns);
          }
          theadTr.appendChild(headerColumns);
          counter = columnsToRepeat.length;
        } else {
          theadTr.appendChild(headerColumns);
        }
        counter++;
        if (header === tableHeader.length - 1 && counter <= columnPerPage - 1) {
          let thead = document.createElement("thead");
          const localTheadTr = theadTr.cloneNode(true);
          thead.appendChild(localTheadTr);
          let createTable = document.createElement("table");
          createTable.appendChild(thead);
          tableCollections.push(createTable);
        }
      }

      for (let t = 0; t < tableCollections.length; t++) {
        let tabtable = tableCollections[t];
        // const cleanDiv = document.createElement("div");
        // cleanDiv.setAttribute("class", "clearfix");
        // rootDiv.appendChild(cleanDiv);
        tabtable.setAttribute("class", "break-before");
        let tabheader = tabtable.querySelector("thead").querySelectorAll("th");
        let tbody = document.createElement("tbody");
        for (let row = 0; row < tableBody.length; row++) {
          const tr = document.createElement("tr");
          for (let h = 0; h < tabheader.length; h++) {
            const tabhead = tabheader[h];
            const datafieldName = tabhead.getAttribute("data-fieldname");

            const thIndex = tblHeader.querySelector(
              `th[data-fieldname='${datafieldName}']`
            ).cellIndex;
            const cello = tableBody[row].cells[thIndex].cloneNode(true);
            if (cello !== undefined && cello.nodeName === "TD") {
              tr.appendChild(cello);
            }
          }
          tbody.appendChild(tr);
        }
        tabtable.appendChild(tbody);
        contentElecment.appendChild(getHeader);
        contentElecment.appendChild(tabtable);

        rootDiv.appendChild(contentElecment);

        // rootDiv.appendChild(tabtable);
        // const horizontal = document.createElement("br");
        //rootDiv.appendChild(horizontal);
      }

      // setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
    return rootDiv;
  }

  return (
    <ReactToPrint
      trigger={() => (
        <i
          className={`fas fa-${loading === true ? "spinner fa-spin" : "print"}`}
          style={{ PointerEvent: loading ? "none" : "" }}
        />
      )}
      content={() => {
        return splitingTable();
      }}
      onBeforeGetContent={() => {
        setLoading(true);
      }}
      onAfterPrint={() => {
        setLoading(false);
      }}
      removeAfterPrint={true}
      documentTitle={title ? title : "Balance Sheet"}
      bodyClass="splitted-cols"
      pageStyle="@media print {
          html, body {

            overflow: initial !important;
            -webkit-print-color-adjust: exact;
          }
        }

        @page {
          size: auto;
          margin: 5mm;
        }"
    />
  );
}
