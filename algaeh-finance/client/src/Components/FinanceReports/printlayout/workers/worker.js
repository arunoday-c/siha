import Excel from "exceljs";
export function GenerateExcel({
  columns,
  data,
  excelBodyRender,
  skipColumns,
  sheetName,
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
            worksheet.addRow(correctedData);
          });
        } else {
          worksheet.addRow(records);
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
      workbook.xlsx.writeBuffer().then((buff) => {
        resolve(
          new Blob([buff], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
      });
    } catch (error) {
      reject(error);
    }
  });
}
