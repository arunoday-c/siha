import Excel from "exceljs/modern.browser";
import path from "path";
import moment from "moment";

async function generateDates(fromdate, todate, format) {
  format = format || "DD-MM-YYYY";
  let columns = [
    {
      header: "Emp. Code",
      key: "employee_code",
      horizontal: "center"
    },
    {
      header: "Employee Name",
      key: "full_name",
      width: 40,
      horizontal: "center"
    }
  ];
  let start = new Date(moment(fromdate, "YYYY-MM-DD")._d);
  let end = new Date(moment(todate, "YYYY-MM-DD")._d);
  while (start <= end) {
    const dt = moment(start);
    columns.push({
      header: dt.format(format),
      key: dt.format("YYYYMMDD"),
      horizontal: "center",
      width: 10
    });
    var newDate = start.setDate(start.getDate() + 1);
    start = new Date(newDate);
  }
  return await columns;
}

export function excelManualTimeSheet(req, res, next) {
  new Promise((resolve, reject) => {
    const sheetName =
      req.query.sheetName === undefined
        ? "Manual Timesheet"
        : req.query.sheetName;
    try {
      (async () => {
        const columns = await generateDates("2019-07-26", "2019-08-25");

        //Create instance of excel
        var workbook = new Excel.Workbook();
        workbook.creator = "Algaeh technologies private limited";
        workbook.lastModifiedBy = "Manual Time sheet";
        workbook.created = new Date();
        workbook.modified = new Date();
        // Set workbook dates to 1904 date system
        workbook.properties.date1904 = true;

        //Work worksheet creation
        var worksheet = workbook.addWorksheet(sheetName, {
          properties: { tabColor: { argb: "FFC0000" } }
        });
        //Adding columns
        worksheet.columns = columns;

        //Differencate headers
        worksheet.getRow(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "000000" }
        };
        worksheet.getRow(1).font = {
          name: "calibri",
          family: 4,
          size: 12,
          bold: true,
          color: { argb: "FFFFFF" }
        };
        worksheet.getRow(1).alignment = {
          vertical: "middle",
          horizontal: "center"
        };

        //To freez first column
        worksheet.views = [
          {
            state: "frozen",
            xSplit: 2,
            ySplit: 0,
            activeCell: "A1",
            topLeftCell: "C1"
          },
          {
            state: "frozen",
            xSplit: 0,
            ySplit: 1,
            activeCell: "A1"
          }
        ];

        //// TODO: need to remove hardcoded data
        const data = require("../../testDB/data.json");

        // Add a couple of Rows by key-value, after the last current row, using the column keys
        for (let i = 0; i < data.result.length; i++) {
          const rest = data.result[i];
          let employee = {
            full_name: rest.full_name,
            employee_code: rest.employee_code
          };
          for (let j = 0; j < rest.dates.length; j++) {
            const dates = rest.dates[j];
            const date = moment(dates.attendance_date, "YYYY-MM-DD").format(
              "YYYYMMDD"
            );
            employee[date] =
              dates[date] +
              "||" +
              dates["color"] +
              "||" +
              (dates.project_desc === undefined ? "" : dates.project_desc);
          }
          worksheet.addRow(employee);
        }

        worksheet.eachRow(function(row, rowNumber) {
          if (rowNumber === 1) {
            row.protection = { locked: true };
          } else {
            row.protection = { locked: false };
            row.eachCell((cell, colNumber) => {
              let valueColor = cell.value.split("||");
              cell.value = valueColor[0];
              let colorR = valueColor[1];
              cell.border = {
                top: { style: "double", color: { argb: "000000" } },
                left: { style: "double", color: { argb: "000000" } },
                bottom: { style: "double", color: { argb: "000000" } },
                right: { style: "double", color: { argb: "000000" } }
              };
              if (colNumber === 1 || colNumber === 2) {
                cell.protection = { locked: true };
              } else {
                cell.alignment = {
                  vertical: "middle",
                  horizontal: "center"
                };

                if (cell.value === "N") {
                  cell.protection = { locked: true };
                  cell.font = { color: { argb: "BFBFBF" } };
                }

                if (cell.value !== "PR") {
                  if (colorR !== "") {
                    cell.fill = {
                      type: "pattern",
                      pattern: "solid",
                      fgColor: { argb: colorR.replace("#", "") }
                    };
                  }
                } else {
                  cell.note = {
                    texts: [
                      {
                        font: {
                          size: 12,
                          color: { theme: 1 },
                          name: "Calibri",
                          family: 2,
                          scheme: "minor"
                        },
                        text: "Project Name :=  "
                      },
                      {
                        font: {
                          bold: true,
                          size: 12,
                          color: { theme: 1 },
                          name: "Calibri",
                          family: 2,
                          scheme: "minor"
                        },
                        text: valueColor[2]
                      }
                    ]
                  };
                }
              }
            });
          }
        });
        worksheet.addRow([3, "Sam", new Date()]);
        worksheet.lastRow.hidden = true;
        await worksheet.protect("", {
          selectLockedCells: true,
          selectUnlockedCells: true
        });
        // const fileName = path.join(
        //   __dirname,
        //   "../../../../Output",
        //   "test.xlsx"
        // );
        // console.log("File Path", fileName);
        // workbook.xlsx.writeFile(fileName).then(function() {
        //   console.log("Done");
        // });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + "Report.xlsx"
        );
        workbook.xlsx.write(res).then(function(data) {
          res.end();
          console.log("File write done........");
        });
      })();
    } catch (e) {
      next(e);
    }
  });
}
export function excelManualTimeSheetRead(req, res, next) {
  const fileName = path.join(__dirname, "../../../../Output", "test.xlsx");
  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(fileName).then(function() {
    workbook.eachSheet(function(worksheet, sheetId) {
      //var worksheet = workbook.getWorksheet(sheet);
      worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
      });
    });
  });
}
