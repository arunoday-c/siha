import Excel from "exceljs";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

export function GenerateExcel({
  columns,
  data,
  excelBodyRender,
  skipColumns,
  sheetName,
  tableprops,
}) {
  return new Promise((resolve, reject) => {
    if (data === undefined) {
      resolve(false);
    }
    try {
      let workbook = new Excel.Workbook();
      workbook.creator = "Algaeh technologies private limited";
      workbook.lastModifiedBy = "algaeh technologies";
      workbook.created = new Date();
      workbook.modified = new Date();
      let worksheet = workbook.addWorksheet(sheetName ?? "SHEET-1", {
        properties: {
          tabColor: { argb: "FFC0000" },
          defaultColWidth: 20,
          defaultRowHeight: 16,
        },
      });

      if (skipColumns === undefined && Array.isArray(columns)) {
        worksheet.columns = columns.map((item) => {
          const { label, fieldName } = item;
          return {
            key: fieldName,
            header: label,
          };
        });
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFF00" },
          };
          cell.font = {
            name: "Arial",
            size: 9,
            bold: true,
            color: { argb: "000000" },
          };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
        });
      }
      let details = [...data];

      function insertRows(records) {
        if (typeof excelBodyRender === "function") {
          excelBodyRender(records, (correctedData) => {
            let c_object = records;
            if (Array.isArray(columns)) {
              for (let c = 0; c < columns.length; c++) {
                const e_value = records[columns[c]["fieldName"]];
                c_object[columns[c]["fieldName"]] = isNaN(e_value)
                  ? e_value
                  : parseFloat(e_value);
              }
            }
            worksheet.addRow(c_object);
          });
        } else {
          debugger;
          let c_object = records;
          if (Array.isArray(columns)) {
            for (let c = 0; c < columns.length; c++) {
              const e_value = records[columns[c]["fieldName"]];
              c_object[columns[c]["fieldName"]] = isNaN(e_value)
                ? e_value
                : getAmountFormart(parseFloat(e_value), {
                    appendSymbol: false,
                  });
            }
          }
          worksheet.addRow(c_object);
          const row_count = worksheet.rowCount;
          worksheet.getRow(row_count).eachCell((cell) => {
            if (!isNaN(parseFloat(cell.value))) {
              cell.value = parseFloat(String(cell.value).replace(/,/g, ""));
              cell.numFmt = "#,##0.00";
              cell.alignment = { vertical: "middle", horizontal: "right" };
            }
          });
        }

        if (Array.isArray(records["children"])) {
          for (let x = 0; x < records["children"].length; x++) {
            insertRows(records["children"][x]);
          }
        }
      }
      for (let i = 0; i < details.length; i++) {
        insertRows(details[i]);
      }
      if (tableprops?.footer === true) {
        const tableFooter = document.getElementsByTagName("tfoot")[0];
        const elementTr = tableFooter.querySelector("tr");
        const elementsTd = elementTr.querySelectorAll("td");
        let footerFields = [];
        for (let f = 0; f < elementsTd.length; f++) {
          const e_value =
            elementsTd[f].innerText === ""
              ? ""
              : isNaN(elementsTd[f].innerText)
              ? elementsTd[f].innerText
              : parseFloat(elementsTd[f].innerText);
          footerFields.push(e_value);
        }
        worksheet.addRow(footerFields);
        const row_count = worksheet.rowCount;
        worksheet.getRow(row_count).eachCell((cell) => {
          if (cell.value !== "") {
            if (!isNaN(parseFloat(cell.value))) {
              cell.value = parseFloat(String(cell.value).replace(/,/g, ""));
              cell.numFmt = "#,##0.00";
              cell.alignment = { vertical: "middle", horizontal: "right" };
            }
          }
        });
      }
      workbook.xlsx.writeBuffer().then((buff) => {
        resolve(
          new Blob([buff], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
      });
    } catch (error) {
      reject(error);
    }
  });
}
