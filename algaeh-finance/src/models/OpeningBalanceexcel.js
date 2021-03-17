import _ from "lodash";
import Excel from "exceljs/dist/es5/exceljs.browser";
// import algaehUtilities from "algaeh-utilities/utilities";

export default {
  excelOBAccExport(req, res, next) {
    new Promise((resolve, reject) => {
      // const selected_type = req.query.selected_type;

      const sheetName = "Accounts";

      try {
        (async () => {
          //Create instance of excel

          var workbook = new Excel.Workbook();
          workbook.creator = "Algaeh technologies private limited";
          workbook.lastModifiedBy = "Accounts Opening Balance";
          workbook.created = new Date();
          workbook.modified = new Date();
          // Set workbook dates to 1904 date system
          // workbook.properties.date1904 = true;

          //Work worksheet creation
          var worksheet = workbook.addWorksheet(sheetName, {
            properties: { tabColor: { argb: "FFC0000" } },
          });
          //Adding columns
          worksheet.columns = [
            {
              header: "Account Code",
              key: "ledger_code",
              width: 20,
              horizontal: "center",
            },
            {
              header: "Account Name",
              key: "child_name",
              width: 20,
              horizontal: "center",
            },
            {
              header: "Payment Date",
              key: "payment_date",
              width: 20,
              horizontal: "center",
            },
            {
              header: "Insert into Header",
              key: "insert_into_header",
              width: 20,
              // horizontal: "center",
            },
            {
              header: "Payment Type",
              key: "payment_type",
              width: 20,
              horizontal: "center",
            },
            {
              header: "Amount",
              key: "opening_balance",
              width: 20,
              horizontal: "center",
            },
            {
              header: "Voucher Id",
              key: "finance_voucher_id",
              width: 0,
            },
            {
              header: "Root Id",
              key: "root_id",
              width: 0,
            },
          ];

          //Differencate headers
          worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "000000" },
          };
          worksheet.getRow(1).font = {
            name: "calibri",
            family: 4,
            size: 12,
            bold: true,
            color: { argb: "FFFFFF" },
          };
          worksheet.getRow(1).alignment = {
            vertical: "middle",
            horizontal: "center",
          };

          //To freez first column
          // worksheet.views = [
          //   {
          //     state: "frozen",
          //     xSplit: 2,
          //     ySplit: 0,
          //     activeCell: "A1",
          //     topLeftCell: "C1",
          //   },
          //   {
          //     state: "frozen",
          //     xSplit: 0,
          //     ySplit: 1,
          //     activeCell: "A1",
          //   },
          // ];

          const data = req.records; //require("../../testDB/data.json");

          // Add a couple of Rows by key-value, after the last current row, using the column keys
          for (let i = 0; i < data.length; i++) {
            const rest = data[i];

            let account_details = {
              ledger_code: rest.ledger_code,
              child_name: rest.child_name,
              root_id: rest.root_id,
              payment_date: rest.payment_date,
              insert_into_header: rest.insert_into_header,
              payment_type: rest.payment_type,
              opening_balance: rest.opening_balance,
              finance_voucher_id: rest.finance_voucher_id,
            };

            worksheet.addRow(account_details);
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
                  horizontal: "center",
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

          // worksheet.addRow(["", selected_type]);
          worksheet.lastRow.hidden = true;
          await worksheet.protect("algaeh@2019", {
            selectLockedCells: true,
            selectUnlockedCells: true,
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
  },

  excelOBAccImport(req, res, next) {
    let buffer = "";
    // const utilities = new algaehUtilities();
    const leaves_data =
      req.headers["x-leaves-data"] === ""
        ? ""
        : JSON.parse(req.headers["x-leaves-data"]);

    req.on("data", (chunk) => {
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
        .catch((error) => {
          next(error);
        });
    });
  },
};
