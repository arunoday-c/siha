import Excel from "exceljs/dist/es5/exceljs.browser";
export function generateExcel(req, res, next) {
  const { records, reportName, sheetName, columns } = req;
  let workbook = new Excel.Workbook();
  workbook.creator = "Algaeh technologies private limited";
  workbook.lastModifiedBy = reportName;
  workbook.created = new Date();
  workbook.modified = new Date();
  var worksheet = workbook.addWorksheet(sheetName, {
    properties: { tabColor: { argb: "FFC0000" } }
  });
  worksheet.columns = columns;
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" }
  };
  worksheet.getRow(1).font = {
    name: "Arial",
    size: 9,
    bold: true,
    color: { argb: "000000" }
  };
  worksheet.getRow(1).alignment = {
    vertical: "middle",
    horizontal: "center"
  };
  let skipIndexes = [];

  (async () => {
    const CreateRecords = async records => {
      let excelColumns = [];
      const { children } = records;
      await asyncForEach(columns, async (item, index) => {
        const value =
          index === 0 && children === undefined
            ? "  " + records[item.key]
            : records[item.key];
        excelColumns.push(value);
      });

      worksheet.addRow(excelColumns);

      if (Array.isArray(children)) {
        const rowIndex = worksheet.rowCount;
        skipIndexes.push(rowIndex);
        worksheet.getRow(rowIndex).font = {
          name: "Arial",
          size: 9,
          bold: true
        };
        await asyncForEach(children, async child => {
          await CreateRecords(child);
        });
      }
    };

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    if (Array.isArray(records)) {
    } else {
      const ObjRecords = Object.keys(records);
      await asyncForEach(ObjRecords, async item => {
        await CreateRecords(records[item]);
      });
      //   const totalRecords = worksheet.rowCount;
      //   for (let r = 2; r <= totalRecords; r++) {
      //     const indx = skipIndexes.find(f => f === r);
      //     if (indx === undefined) {
      //       worksheet.getRow(r).font = { name: "arial", size: 8 };
      //     }
      //     worksheet.getRow(r).eachCell(cell => {
      //       const widthColumn = cell.value.length;
      //       cell.width = widthColumn;
      //       cell.border = {
      //         top: { style: "thin" },
      //         left: { style: "thin" },
      //         bottom: { style: "thin" },
      //         right: { style: "thin" },
      //         color: { argb: "00000000" }
      //       };
      //     });
      //   }

      //   res.setHeader(
      //     "Content-Type",
      //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      //   );
      //   res.setHeader(
      //     "Content-Disposition",
      //     `attachment; filename=${reportName}.xlsx`
      //   );
      //   workbook.xlsx.write(res).then(function(data) {
      //     res.end();
      //     console.log("Excel done........");
      //   });
    }

    const totalRecords = worksheet.rowCount;
    for (let r = 2; r <= totalRecords; r++) {
      const indx = skipIndexes.find(f => f === r);
      if (indx === undefined) {
        worksheet.getRow(r).font = { name: "Arial", size: 9 };
      }
      worksheet.getRow(r).eachCell((cell, num) => {
        const widthColumn = cell.value.length;
        cell.width = widthColumn < 10 ? 10 : widthColumn;
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
          color: { argb: "00000000" }
        };
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${reportName}.xlsx`
    );
    workbook.xlsx.write(res).then(function(data) {
      res.end();
      console.log("Excel done........");
    });
  })();
}
