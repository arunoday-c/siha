import algaehExcel from "algaeh-utilities/excel-generation";
import algaehMysql from "algaeh-mysql";

export default {
  generateExcel: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: "SHOW FULL COLUMNS FROM hims_f_daily_time_sheet",
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          const _excel = new algaehExcel();
          _excel.CreateExcelWorkBook(
            {
              sheets: [
                {
                  sheetName: "Daily Time Sheet",
                  columns: result.map(item => {
                    return {
                      header: item["Comment"],
                      key: item["Field"]
                    };
                  }),

                  rows: [
                    {
                      employee_id: "EMP0001",
                      hims_f_daily_time_sheet_id: 1,
                      biometric_id: null,
                      attendance_date: new Date(),
                      in_time: new Date(),
                      out_date: new Date(),
                      out_time: new Date(),
                      year: 2019,
                      month: "2",
                      status: "PR",
                      posted: "N",
                      hours: "10",
                      minutes: "15",
                      actual_hours: "8",
                      actual_minutes: "10",
                      worked_hours: "10",
                      expected_out_date: new Date(),
                      expected_out_time: new Date()
                    }
                  ]
                }
              ]
            },
            res
          );

          _excel.FlushExcel();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
