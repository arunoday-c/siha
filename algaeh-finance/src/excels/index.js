import Excel from "exceljs/dist/es5/exceljs.browser";
export function generateExcel(req, res, next) {
  const {
    records,
    reportName,
    sheetName,
    columns,
    excelHeader,
    noPlotCloumn,
    excelFooter
  } = req;
  let workbook = new Excel.Workbook();
  workbook.creator = "Algaeh technologies private limited";
  workbook.lastModifiedBy = reportName;
  workbook.created = new Date();
  workbook.modified = new Date();
  var worksheet = workbook.addWorksheet(sheetName, {
    properties: { tabColor: { argb: "FFC0000" } }
  });
  if (typeof excelHeader === "function") {
    excelHeader(worksheet);
  }
  if (Array.isArray(columns) && noPlotCloumn === undefined) {
    worksheet.columns = columns;
    worksheet.getRow(1).eachCell(cell => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" }
      };
      cell.font = {
        name: "Arial",
        size: 9,
        bold: true,
        color: { argb: "000000" }
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center"
      };
    });
  }
  (async () => {
    const CreateRecords = async (records, depthLevel) => {
      depthLevel = depthLevel || 0;
      const { children } = records;
      const hasChildrens = Array.isArray(children);
      worksheet.addRow([]);
      const rowIndex = worksheet.rowCount;
      const padSpaces = (value, childsThere) => {
        let result = "";
        const deps = depthLevel > 0 && childsThere === true ? 0 : depthLevel;
        for (let s = 0; s < deps; s++) {
          result += " ";
        }
        result += value;
        return result;
      };
      await asyncForEach(columns, async (item, index) => {
        // const value =
        //   index === 0 && children === undefined
        //     ? "      " + records[item.key]
        //     : records[item.key];
        const value =
          index === 0
            ? padSpaces(records[item.key], hasChildrens)
            : records[item.key];
        let row = worksheet.getRow(rowIndex);
        let cells = row.getCell(index + 1);
        if (item.manual === undefined) {
          cells.font = {
            name: "Arial",
            size: 9,
            bold: hasChildrens
          };
        }

        cells.value = value !== undefined ? value : "";
        if (item.others !== undefined) {
          Object.keys(item.others).forEach(other => {
            const component = item.others;
            cells[other] = component[other];
          });
        }
      });

      if (hasChildrens) {
        await asyncForEach(children, async (child, index) => {
          await CreateRecords(child, 5);
        });
      }
    };

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    if (Array.isArray(records)) {
      if (records.length > 0) {
        await asyncForEach(records, async item => {
          if (item !== undefined) {
            await CreateRecords(item);
          }
        });
      }

      if (typeof excelFooter === "function") {
        excelFooter(worksheet);
      }
    } else {
      const ObjRecords = Object.keys(records);
      await asyncForEach(ObjRecords, async item => {
        if (
          typeof records[item] === "object" &&
          !Array.isArray(records[item]) &&
          records[item] !== undefined
        ) {
          await CreateRecords(records[item]);
        }
      });
      if (typeof excelFooter === "function") {
        excelFooter(worksheet);
      }
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
