import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import moment from "moment";
import _ from "lodash";

module.exports = {
  addPackage: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;

    const _mysql = new algaehMysql(_options);
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_package_header` (`package_code`, `package_name`, `package_amount`,\
          `total_service_amount`, `profit_loss`, `pl_amount`,`package_service_id`, `package_type`,`expiry_days`,\
          `advance_type`, `advance_amount`, `advance_percentage`, `package_visit_type`,\
          `created_date`, `created_by`, `updated_date`, `updated_by`)\
         VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.package_code,
            input.package_name,
            input.package_amount,
            input.total_service_amount,
            input.profit_loss,
            input.pl_amount,
            input.package_service_id,
            input.package_type,
            input.expiry_days,
            input.advance_type,
            input.advance_amount,
            input.advance_percentage,
            input.package_visit_type,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.insertId != null) {
            const IncludeValues = [
              "service_type_id",
              "service_id",
              "service_amount",
              "qty",
              "tot_service_amount",
              "appropriate_amount"
            ];
            _mysql
              .executeQuery({
                query: "INSERT INTO hims_d_package_detail(??) VALUES ?",
                values: input.PakageDetail,
                includeValues: IncludeValues,
                extraValues: {
                  package_header_id: headerResult.insertId,
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  created_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date()
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(detailResult => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    hims_d_package_header_id: headerResult.insertId,
                    package_service_id: input.package_service_id
                  };
                  next();
                });
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  getPackage: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_package_header_id != null) {
        _strQry = "and hims_d_package_header_id=?";
        intValues.push(req.query.hims_d_package_header_id);
      }
      _mysql
        .executeQuery({
          query:
            "select PH.hims_d_package_header_id,PH.package_code, PH.package_name, PH.package_amount,\
            PH.total_service_amount, PH.profit_loss,PH.pl_amount, PH.package_service_id, PH.package_type,\
            PH.expiry_days, PH.advance_type, PH.advance_amount, PH.advance_percentage,\
            PH.package_visit_type, PH.approved, PD.hims_d_package_detail_id, PD.service_type_id, PD.service_id, \
            PD.service_amount, PD.qty,PD.tot_service_amount,PD.appropriate_amount,PD.qty as available_qty \
            from hims_d_package_header PH, hims_d_package_detail PD where \
            PH.hims_d_package_header_id=PD.package_header_id " +
            _strQry +
            " order by hims_d_package_header_id desc;",
          values: intValues,
          printQuery: true
        })
        .then(headerResult => {
          _mysql.releaseConnection();
          req.records = headerResult;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updatePackageSetup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body;
      let strQuery = "";

      if (req.body.approved === "Y") {
        strQuery =
          ",approved = 'Y', approved_by = '" +
          req.userIdentity.algaeh_d_app_user_id +
          "', approved_date = now() ";
      }
      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_d_package_header` SET `package_code`=?, `package_name`=?, `package_amount`=?,\
          `total_service_amount`=?, `profit_loss`=?, `pl_amount`=?, \
          `package_type`=?,`expiry_days`=?,`advance_type`=?, `advance_amount`=?, `advance_percentage`=?,\
          `package_visit_type`=?,`updated_date`=?, `updated_by`=?" +
            strQuery +
            " WHERE record_status='A' and `hims_d_package_header_id`=?",
          values: [
            input.package_code,
            input.package_name,
            input.package_amount,
            input.total_service_amount,
            input.profit_loss,
            input.pl_amount,
            input.package_type,
            input.expiry_days,
            input.advance_type,
            input.advance_amount,
            input.advance_percentage,
            input.package_visit_type,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_package_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult != null) {
            new Promise((resolve, reject) => {
              try {
                if (input.insertPackage.length != 0) {
                  const IncludeValues = [
                    "package_header_id",
                    "service_type_id",
                    "service_id",
                    "service_amount",
                    "qty",
                    "tot_service_amount",
                    "appropriate_amount"
                  ];

                  _mysql
                    .executeQuery({
                      query: "INSERT INTO hims_d_package_detail(??) VALUES ?",
                      values: input.insertPackage,
                      includeValues: IncludeValues,
                      extraValues: {
                        created_by: req.userIdentity.algaeh_d_app_user_id,
                        created_date: new Date(),
                        updated_by: req.userIdentity.algaeh_d_app_user_id,
                        updated_date: new Date()
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(insertPackage => {
                      return resolve(insertPackage);
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                        reject(error);
                      });
                    });
                } else {
                  return resolve();
                }
              } catch (e) {
                reject(e);
              }
            })
              .then(results => {
                if (input.deletePackage.length != 0) {
                  let qry = "";
                  let inputParam = req.body.deletePackage;
                  for (let i = 0; i < req.body.deletePackage.length; i++) {
                    qry += mysql.format(
                      "DELETE FROM `hims_d_package_detail` where hims_d_package_detail_id=?;",
                      [inputParam[i].hims_d_package_detail_id]
                    );
                  }

                  _mysql
                    .executeQuery({
                      query: qry,
                      printQuery: true
                    })
                    .then(deletePackage => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = deletePackage;
                        next();
                      });
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                        reject(error);
                      });
                    });
                } else {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = results;
                    next();
                  });
                }
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = headerResult;
              next();
            });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  }
};
