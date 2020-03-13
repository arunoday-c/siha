import Excel from "exceljs/dist/es5/exceljs.browser";
export function generateExcel(req, res, next) {
  const { records, reportName, sheetName, columns } = req;
  let workbook = new Excel.Workbook();
  workbook.creator = "Algaeh technologies private limited";
  workbook.lastModifiedBy = reportName;
  workbook.created = new Date();
  workbook.modified = new Date();
  var worksheet = workbook.addWorksheet(sheetName, {
    properties: { tabColor: { argb: "FFC0000" }, useStyles: true }
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

  (async () => {
    const CreateRecords = async records => {
      const { children } = records;
      const hasChildrens = Array.isArray(children);
      worksheet.addRow([]);
      const rowIndex = worksheet.rowCount;
      await asyncForEach(columns, async (item, index) => {
        const value =
          index === 0 && children === undefined
            ? "      " + records[item.key]
            : records[item.key];
        let row = worksheet.getRow(rowIndex);
        let cells = row.getCell(index + 1);
        row.font = {
          name: "Arial",
          size: 9,
          bold: hasChildrens
        };
        cells.value = value;

        if (item.others !== undefined) {
          Object.keys(item.others).forEach(other => {
            row.eachCell((cell, cIndx) => {
              const component = item.others;
              if (cIndx === index + 1) {
                cell[other] = component[other];
              }
            });
          });
        }
      });

      if (hasChildrens) {
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
      await asyncForEach(records, async item => {
        await CreateRecords(item);
      });
    } else {
      const ObjRecords = Object.keys(records);
      await asyncForEach(ObjRecords, async item => {
        await CreateRecords(records[item]);
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
