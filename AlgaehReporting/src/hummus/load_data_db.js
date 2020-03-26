import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import fs from "fs-extra";
import path from "path";
import utilitites from "algaeh-utilities/utilities";
import moment from "moment";
import writtenForm from "written-number";
function executeJS(xObject, supportingJS, hospital_id) {
  try {
    if (fs.existsSync(supportingJS)) {
      const { executePDF } = __non_webpack_require__(supportingJS);
      return executePDF(xObject);
    } else {
      return new Promise.resolve([]);
    }
  } catch (error) {
    new utilitites().logger().log(hospital_id, error, "error");
    return new Promise.reject(error);
  }
}
export function getReportData(req) {
  const { report } = req.query;
  return new Promise((resolve, reject) => {
    const _mysql = new algaehMysql();
    try {
      const _inputParam = JSON.parse(report);
      const { hospital_id } = req.userIdentity;
      _mysql
        .executeQuery({
          query:
            "SELECT report_name_for_header,report_name,report_query,report_input_series,data_manupulation,\
                report_header_file_name,report_footer_file_name from algaeh_d_reports where status='A' and report_name in (?);",
          values: [_inputParam.reportName],
          printQuery: true
        })
        .then(data => {
          _inputParam["hospital_id"] = hospital_id;
          _inputParam["crypto"] = req.userIdentity;
          const _reportCount = data.length;

          if (_reportCount > 0) {
            let _reportOutput = [];
            const _data = data[0];
            const {
              report_query,
              report_name,
              report_input_series,
              report_footer_file_name,
              report_header_file_name,
              report_name_for_header
            } = _data;

            const _inputOrders = eval(
              report_input_series === null ? [] : report_input_series
            );
            let _value = [];
            const { reportParams } = _inputParam;
            for (var i = 0; i < _inputOrders.length; i++) {
              const _params = _.find(
                reportParams,
                f => f.name == _inputOrders[i]
              );
              if (_params != undefined) {
                _value.push(_params.value);
              } else if (_inputOrders[i] == "login_branch") {
                _value.push(hospital_id);
              } else {
                _value.push(null);
              }
            }
            if (report_query === null || report_query === "") {
              const supportingJS = path.join(
                process.cwd(),
                "algaeh_report_tool/templates",
                `${report_name}.js`
              );
              executeJS(
                {
                  mysql: _mysql,
                  inputs: _inputOrders,
                  args: _inputParam,
                  loadash: _,
                  moment: moment,
                  writtenForm: writtenForm,
                  utilitites: () => {
                    return new utilitites();
                  },
                  currencyFormat: (currency, formater, addSymbol) => {
                    return new utilitites().getCurrencyFormart(
                      currency,
                      formater,
                      addSymbol
                    );
                  }
                },
                supportingJS,
                hospital_id
              )
                .then(result => {
                  _mysql.releaseConnection();
                  const conv = Array.isArray(result) ? result : result.result;
                  resolve({
                    data: conv,
                    report_footer_file_name: report_footer_file_name,
                    report_header_file_name: report_header_file_name,
                    report_name_for_header: report_name_for_header
                  });
                })
                .catch(error => {
                  _mysql.releaseConnection();
                  reject(error);
                });
            } else {
              _mysql
                .executeQuery({
                  query: report_query,
                  values: _value,
                  printQuery: true
                })
                .then(resp => {
                  const supportingJS = path.join(
                    process.cwd(),
                    "algaeh_report_tool/templates",
                    `${report_name}.js`
                  );
                  executeJS(
                    {
                      mysql: _mysql,
                      inputs: _inputOrders,
                      args: _inputParam,
                      loadash: _,
                      moment: moment,
                      result: resp,
                      writtenForm: writtenForm,
                      utilitites: () => {
                        return new utilitites();
                      },
                      currencyFormat: (currency, formater, addSymbol) => {
                        return new utilitites().getCurrencyFormart(
                          currency,
                          formater,
                          addSymbol
                        );
                      }
                    },
                    supportingJS,
                    hospital_id
                  )
                    .then(result => {
                      _mysql.releaseConnection();
                      resolve({
                        data: result,
                        report_footer_file_name: report_footer_file_name,
                        report_header_file_name: report_header_file_name,
                        report_name_for_header: report_name_for_header
                      });
                    })
                    .catch(error => {
                      _mysql.releaseConnection();
                      reject(error);
                    });
                });
            }
          } else {
            _mysql.releaseConnection();
            reject(new Error("No such report exists"));
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          reject(error);
        });
    } catch (error) {
      _mysql.releaseConnection();
      reject(error);
    }
  });
}
