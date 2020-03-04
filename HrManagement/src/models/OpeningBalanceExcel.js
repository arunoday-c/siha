import Excel from "exceljs/modern.browser";
import path from "path";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

async function generateColumns(leaveData) {
  // format = format || "DD-MM-YYYY";
  let columns = [
    {
      header: "Emp. Id",
      key: "employee_id",
      width: 0
    },
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
    },
    {
      header: "Year",
      key: "year",
      width: 40,
      horizontal: "center"
    }
  ];

  for (let i = 0; i < leaveData.length; i++) {
    columns.push({
      header: leaveData[i].leave_description,
      key: leaveData[i].hims_d_leave_id,
      horizontal: "center",
      width: 15
    });
  }

  return await columns;
}

function excelEmployeeLeaveSalaryOpenBalance(req, res, next) {
  new Promise((resolve, reject) => {
    const selected_type = req.query.selected_type;

    const sheetName = "Employee Leave Salary";

    try {
      (async () => {
        //Create instance of excel
        var workbook = new Excel.Workbook();
        workbook.creator = "Algaeh technologies private limited";
        workbook.lastModifiedBy = "Leave Salary Opening Balance";
        workbook.created = new Date();
        workbook.modified = new Date();
        // Set workbook dates to 1904 date system
        // workbook.properties.date1904 = true;

        //Work worksheet creation
        var worksheet = workbook.addWorksheet(sheetName, {
          properties: { tabColor: { argb: "FFC0000" } }
        });
        //Adding columns
        worksheet.columns = [
          {
            header: "Emp. Id",
            key: "employee_id",
            width: 0
          },
          {
            header: "Emp. Code",
            key: "employee_code",
            width: 20,
            horizontal: "center"
          },
          {
            header: "Employee Name",
            key: "full_name",
            width: 40,
            horizontal: "center"
          },
          {
            header: "Leave Days",
            key: "balance_leave_days",
            width: 20,
            horizontal: "center"
          },
          {
            header: "Leave Salary Amount",
            key: "balance_leave_salary_amount",
            width: 20,
            horizontal: "center"
          },
          {
            header: "Airticket Amount",
            key: "balance_airticket_amount",
            width: 20,
            horizontal: "center"
          },
          {
            header: "Airfare Months",
            key: "airfare_months",
            width: 20,
            horizontal: "center"
          },
          {
            header: "Hospital ID",
            key: "hospital_id",
            width: 0
          }
        ];

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
            employee_id: rest.employee_id,
            full_name: rest.full_name,
            employee_code: rest.employee_code,
            balance_leave_days: rest.balance_leave_days || 0,
            balance_leave_salary_amount: rest.balance_leave_salary_amount || 0,
            balance_airticket_amount: rest.balance_airticket_amount || 0,
            airfare_months: rest.airfare_months || 0,
            hospital_id: rest.hospital_id
          };

          worksheet.addRow(employee);
        }

        worksheet.eachRow(function (row, rowNumber) {
          if (rowNumber === 1) {
            row.protection = { locked: true };
          } else {
            row.protection = { locked: false };
            row.eachCell((cell, colNumber) => {
              let value = cell.value;

              cell.alignment = {
                vertical: "middle",
                horizontal: "center"
              };
              if (colNumber === 1 || colNumber === 2 || colNumber === 3) {
                cell.protection = { locked: true };
              }
            });
          }
        });

        worksheet.addRow(["", selected_type]);
        worksheet.lastRow.hidden = true;
        await worksheet.protect("algaeh@2019", {
          selectLockedCells: true,
          selectUnlockedCells: true
        });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + "Report.xlsx"
        );
        workbook.xlsx.write(res).then(function (data) {
          res.end();
        });
      })();
    } catch (e) {
      next(e);
    }
  });
}

function excelEmployeeGratuityOpenBalance(req, res, next) {
  new Promise((resolve, reject) => {
    const selected_type = req.query.selected_type;

    const sheetName = "Employee Gratuity";

    try {
      (async () => {
        //Create instance of excel

        var workbook = new Excel.Workbook();
        workbook.creator = "Algaeh technologies private limited";
        workbook.lastModifiedBy = "Gratuity Opening Balance";
        workbook.created = new Date();
        workbook.modified = new Date();
        // Set workbook dates to 1904 date system
        // workbook.properties.date1904 = true;

        //Work worksheet creation
        var worksheet = workbook.addWorksheet(sheetName, {
          properties: { tabColor: { argb: "FFC0000" } }
        });
        //Adding columns
        worksheet.columns = [
          {
            header: "Emp. Id",
            key: "employee_id",
            width: 0
          },
          {
            header: "Emp. Code",
            key: "employee_code",
            width: 20,
            horizontal: "center"
          },
          {
            header: "Employee Name",
            key: "full_name",
            width: 40,
            horizontal: "center"
          },
          {
            header: "Year",
            key: "year",
            width: 20,
            horizontal: "center"
          },
          {
            header: "Month",
            key: "month",
            width: 20,
            horizontal: "center"
          },
          {
            header: "Gratuity Amount",
            key: "gratuity_amount",
            width: 20,
            horizontal: "center"
          }
        ];

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
            employee_code: rest.employee_code,
            employee_id: rest.employee_id,
            year: req.query.year,
            month: rest.month || 0,
            gratuity_amount: rest.gratuity_amount || 0
          };

          worksheet.addRow(employee);
        }

        worksheet.eachRow(function (row, rowNumber) {
          if (rowNumber === 1) {
            row.protection = { locked: true };
          } else {
            row.protection = { locked: false };
            row.eachCell((cell, colNumber) => {
              let value = cell.value;

              cell.alignment = {
                vertical: "middle",
                horizontal: "center"
              };
              if (
                colNumber === 1 ||
                colNumber === 2 ||
                colNumber === 3 ||
                colNumber === 4
              ) {
                cell.protection = { locked: true };
              }
            });
          }
        });

        worksheet.addRow(["", selected_type]);
        worksheet.lastRow.hidden = true;
        await worksheet.protect("algaeh@2019", {
          selectLockedCells: true,
          selectUnlockedCells: true
        });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + "Report.xlsx"
        );
        workbook.xlsx.write(res).then(function (data) {
          res.end();
        });
      })();
    } catch (e) {
      next(e);
    }
  });
}

function excelEmployeeLeaveOpenBalance(req, res, next) {
  new Promise((resolve, reject) => {
    const selected_type = req.query.selected_type;

    const sheetName = "Employee Leaves";

    try {
      (async () => {
        const columns = await generateColumns(req.records.leaves);

        //Create instance of excel
        var workbook = new Excel.Workbook();
        workbook.creator = "Algaeh technologies private limited";
        workbook.lastModifiedBy = "Leave Opening Balance";
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

        const data = req.records.employee_leaves; //require("../../testDB/data.json");
        const leave_data = req.records.leaves;

        // Add a couple of Rows by key-value, after the last current row, using the column keys
        for (let i = 0; i < data.length; i++) {
          const rest = data[i];

          let employee = {
            full_name: rest.full_name,
            employee_code: rest.employee_code,
            employee_id: rest.employee_id,
            year: rest.year
          };

          for (let j = 0; j < leave_data.length; j++) {
            employee[leave_data[j].hims_d_leave_id] =
              rest[leave_data[j].hims_d_leave_id];
          }

          worksheet.addRow(employee);
        }

        worksheet.eachRow(function (row, rowNumber) {
          if (rowNumber === 1) {
            row.protection = { locked: true };
          } else {
            row.protection = { locked: false };
            row.eachCell((cell, colNumber) => {
              let value = cell.value;

              cell.alignment = {
                vertical: "middle",
                horizontal: "center"
              };
              if (
                colNumber === 1 ||
                colNumber === 2 ||
                colNumber === 3 ||
                colNumber === 4
              ) {
                cell.protection = { locked: true };
              }

              if (value === "N") {
                cell.protection = { locked: true };
                cell.font = { color: { argb: "BFBFBF" } };
              }
            });
          }
        });
        worksheet.addRow(["", selected_type]);

        worksheet.lastRow.hidden = true;
        await worksheet.protect("algaeh@2019", {
          selectLockedCells: true,
          selectUnlockedCells: true
        });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + "Report.xlsx"
        );
        workbook.xlsx.write(res).then(function (data) {
          res.end();
        });
      })();
    } catch (e) {
      next(e);
    }
  });
}

function excelEmployeeOpeningBalanceRead(req, res, next) {
  let buffer = "";
  // const utilities = new algaehUtilities();
  const leaves_data = req.headers["x-leaves-data"] === "" ? "" : JSON.parse(req.headers["x-leaves-data"]);

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
        var worksheet = workbook.getWorksheet(1);
        let columns = [];
        const lastRow = worksheet.lastRow;
        try {
          filter = lastRow.values[2];
        } catch (e) {
          properFile = false;
          next(
            new Error(
              "Uploaded template is incorrect. Please upload downloaded template only"
            )
          );
          return;
        }

        worksheet.eachRow(function (row, rowNumber) {
          if (filter === "GR") {
            if (rowNumber === 1) {
              columns = row.values;
            } else {
              let internal = {};

              for (let i = 0; i < columns.length; i++) {
                if (columns[i] !== undefined) {
                  const columnName = columns[i]
                    .replace("Emp. Id", "employee_id")
                    .replace("Emp. Code", "employee_code")
                    .replace("Employee Name", "full_name")
                    .replace("Year", "year")
                    .replace("Month", "month")
                    .replace("Gratuity Amount", "gratuity_amount");

                  internal[columnName] = row.values[i];
                  if (i === columns.length - 1) {
                    excelArray.push(internal);
                  }
                }
              }
            }
          } else if (filter === "LS") {
            if (rowNumber === 1) {
              columns = row.values;
            } else {
              let internal = {};

              for (let i = 0; i < columns.length; i++) {
                if (columns[i] !== undefined) {
                  const columnName = columns[i]
                    .replace("Emp. Id", "employee_id")
                    .replace("Emp. Code", "employee_code")
                    .replace("Employee Name", "full_name")
                    .replace("Leave Days", "balance_leave_days")
                    .replace(
                      "Leave Salary Amount",
                      "balance_leave_salary_amount"
                    )
                    .replace("Airticket Amount", "balance_airticket_amount")
                    .replace("Airfare Months", "airfare_months")
                    .replace("Hospital ID", "hospital_id");
                  internal[columnName] = row.values[i];
                  if (i === columns.length - 1) {
                    excelArray.push(internal);
                  }
                }
              }
            }
          } else if (filter === "LE") {
            if (rowNumber === 1) {
              columns = row.values;
            } else {
              let internal = {};

              for (let i = 0; i < columns.length; i++) {
                if (columns[i] !== undefined) {
                  let columnName = columns[i]
                    .replace("Emp. Id", "employee_id")
                    .replace("Emp. Code", "employee_code")
                    .replace("Employee Name", "full_name")
                    .replace("Year", "year");

                  for (let i = 0; i < leaves_data.length; i++) {
                    columnName = columnName.replace(
                      leaves_data[i].leave_description,
                      leaves_data[i].hims_d_leave_id
                    );
                  }

                  // console.log("columnName", columnName);
                  internal[columnName] =
                    row.values[i] === undefined ? 0 : row.values[i];
                  if (i === columns.length - 1) {
                    excelArray.push(internal);
                  }
                }
              }
            }
          }
        });
      })
      .then(() => {
        if (properFile) {
          excelArray.pop();
          req.body = excelArray;
          req.filter = filter;
          next();
        }
      })
      .catch(error => {
        next(error);
      });
  });
}

export default {
  excelEmployeeGratuityOpenBalance,
  excelEmployeeLeaveSalaryOpenBalance,
  excelEmployeeLeaveOpenBalance,
  excelEmployeeOpeningBalanceRead
};
