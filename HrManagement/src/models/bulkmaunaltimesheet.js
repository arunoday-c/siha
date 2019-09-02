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
  //return excelManualTimeSheetRead(req, res, next);
  new Promise((resolve, reject) => {
    const query = req.query;
    const start = moment(query.from_date);
    const end = moment(query.to_date);

    const sheetName = `${start.format("DD-MM-YYYY")}-${end.format(
      "DD-MM-YYYY"
    )}`;

    try {
      (async () => {
        const columns = await generateDates(
          start.format("YYYY-MM-DD"),
          end.format("YYYY-MM-DD")
        );

        //Create instance of excel
        var workbook = new Excel.Workbook();
        workbook.creator = "Algaeh technologies private limited";
        workbook.lastModifiedBy = "Manual Time sheet";
        workbook.created = new Date();
        workbook.modified = new Date();
        // Set workbook dates to 1904 date system
        // workbook.properties.date1904 = true;

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

        const data = req.records; //require("../../testDB/data.json");

        // Add a couple of Rows by key-value, after the last current row, using the column keys
        for (let i = 0; i < data.length; i++) {
          const rest = data[i];
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
        worksheet.addRow([JSON.stringify(query)]);
        worksheet.lastRow.hidden = true;
        await worksheet.protect("algaeh@2019", {
          selectLockedCells: true,
          selectUnlockedCells: true
        });

        //For Help Document
        var helpSheet = workbook.addWorksheet("Help", {
          properties: { tabColor: { argb: "48A897" } }
        });
        helpSheet.columns = [
          {
            header: "Abbrevation",
            horizontal: "center",
            width: 10
          },
          {
            header: "Full Form",
            width: 50,
            horizontal: "center"
          },
          {
            header: "Comments",
            width: 70,
            horizontal: "center"
          }
        ];

        helpSheet.addRow([
          "WO",
          "Week Off",
          "User can mention hour if employee worked on WO days"
        ]);
        helpSheet.addRow([
          "HO",
          "Public Holiday",
          "User can mention hour if employee worked on HO days"
        ]);
        helpSheet.addRow([
          "PR",
          "Present Days/Project assigned Days",
          "Mouse Hover on Red Dot mark to view assigned project for that day"
        ]);
        helpSheet.addRow(["UL", "Unpaid Leave", ""]);
        helpSheet.addRow(["PL", "Paid Leave", ""]);
        helpSheet.addRow(["HPL", "Half day Paid leave", ""]);
        helpSheet.addRow(["HUL", "Half day unpaid leave", ""]);
        helpSheet.addRow([
          "N",
          "Not Editable/ Project Not assigned to Employee",
          ""
        ]);

        helpSheet.mergeCells("A10:E10");
        helpSheet.mergeCells("A11:E11");
        helpSheet.addRow(["Time Format", "Example"]);
        helpSheet.addRow(["HH:MM", "If user want to assign 9 hr, Follow 9:00"]);
        helpSheet.getRow(1).eachCell((cell, index) => {
          cell.font = { bold: true, color: { argb: "ffffff" } };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center"
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "16365C" }
          };
        });
        helpSheet.getRow(12).eachCell((cell, index) => {
          cell.font = { bold: true, color: { argb: "ffffff" } };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center"
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "963634" }
          };
        });
        helpSheet.eachRow((row, index) => {
          if (index !== 1 && index !== 12 && index !== 10 && index !== 11) {
            row.eachCell((cell, celIndex) => {
              cell.border = {
                top: { style: "thin", color: { argb: "000000" } },
                left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                right: { style: "thin", color: { argb: "000000" } }
              };

              if (index === 2 && celIndex === 1) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "E7FEFD" }
                };
                cell.alignment = {
                  vertical: "middle",
                  horizontal: "center"
                };
              }
              if (index === 3 && celIndex === 1) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "EAEAFD" }
                };
                cell.alignment = {
                  vertical: "middle",
                  horizontal: "center"
                };
              }
              if (index === 4 && celIndex === 1) {
                cell.alignment = {
                  vertical: "middle",
                  horizontal: "center"
                };
              }
              if (
                (index === 5 && celIndex === 1) ||
                (index === 8 && celIndex === 1)
              ) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FF0000" }
                };
                cell.alignment = {
                  vertical: "middle",
                  horizontal: "center"
                };
              }
              if (
                (index === 6 && celIndex === 1) ||
                (index === 7 && celIndex === 1)
              ) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "EC7C00" }
                };
                cell.alignment = {
                  vertical: "middle",
                  horizontal: "center"
                };
              }

              if (index === 9 && celIndex === 1) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "F5F5F5" }
                };
                cell.alignment = {
                  vertical: "middle",
                  horizontal: "center"
                };
              }
            });
          }
        });

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
  let buffer = "";
  const isValidDate = d => {
    return d instanceof Date && !isNaN(d);
  };
  req.on("data", chunk => {
    buffer += chunk.toString();
  });
  req.on("end", () => {
    const buff = new Buffer.from(buffer, "base64");
    var workbook = new Excel.Workbook();
    let filter;
    let excelArray = [];
    let properFile = true;
    workbook.xlsx
      .load(buff)
      .then(() => {
        console.log("workbook.creator", workbook.creator);
        if (workbook.creator !== "Algaeh technologies private limited") {
          properFile = false;
          next(
            new Error(
              "Uploaded template is incorrect. Please upload downloaded template only"
            )
          );
          return;
        }

        var worksheet = workbook.getWorksheet(1);
        //  workbook.eachSheet(function(worksheet, sheetId) {

        let columns = [];
        const lastRow = worksheet.lastRow;
        filter = JSON.parse(lastRow.values[1]);
        worksheet.eachRow(function(row, rowNumber) {
          console.log("rowNumber" + rowNumber);
          if (rowNumber === 1) {
            columns = row.values;
          } else {
            let internal = {};
            let internalArray = [];

            for (let i = 0; i < columns.length; i++) {
              if (columns[i] !== undefined) {
                const columnName = columns[i]
                  .replace("Emp. Code", "employee_code")
                  .replace("Employee Name", "full_name");
                if (
                  columnName === "employee_code" ||
                  columnName === "full_name"
                ) {
                  internal[columnName] = row.values[i];
                } else {
                  let conversion = row.values[i];

                  if (typeof conversion === "object") {
                    let d = new Date(conversion);
                    conversion = d.getUTCHours() + "." + d.getUTCMinutes();
                  }

                  internalArray.push({ [columnName]: conversion });
                  if (i === columns.length - 1) {
                    excelArray.push({ ...internal, dates: internalArray });
                  }
                }
              }
            }
          }
        });
        //  });
      })
      .then(() => {
        if (properFile) {
          excelArray.pop();
          filter.month = parseInt(filter.month);
          filter.year = parseInt(filter.year);
          req.body = { ...filter, data: excelArray };
          next();
        }
      })
      .catch(error => {
        next(error);
      });
  });
}
