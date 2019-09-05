import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import _ from "lodash";

module.exports = {
  addFavouriteOrder: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("input: ", input);

    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_d_favourite_orders_header` (favourite_description, favourite_status, doctor_id, \
            created_by, created_date, updated_by, updated_date) values (?,?,?,?,?,?,?)",
        values: [
          input.favourite_description,
          input.favourite_status,
          input.doctor_id,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date()
        ],

        printQuery: true
      })
      .then(result => {
        if (result.insertId > 0) {
          let IncludeValues = ["service_type_id", "services_id"];

          _mysql
            .executeQuery({
              query: "INSERT INTO hims_d_favourite_orders_detail(??) VALUES ?",
              values: input.favourite_details,
              includeValues: IncludeValues,
              extraValues: {
                favourite_orders_header_id: result.insertId
              },
              bulkInsertOrUpdate: true,
              printQuery: true
            })

            .then(detail_result => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = detail_result;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  getFavouriteOrder: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let strQry = "";

      if (input.hims_d_favourite_orders_header_id > 0) {
        strQry += ` and  hims_d_favourite_orders_header_id=${
          input.hims_d_favourite_orders_header_id
        }`;
      }

      if (input.doctor_id > 0) {
        strQry += ` and  doctor_id=${input.doctor_id}`;
      }
      _mysql
        .executeQuery({
          query:
            "select hims_d_favourite_orders_header_id, favourite_description, favourite_status, doctor_id, \
            hims_d_favourite_orders_detail_id, service_type_id, services_id from hims_d_favourite_orders_header FH \
            inner join hims_d_favourite_orders_detail FD on FH.hims_d_favourite_orders_header_id = FD.favourite_orders_header_id \
            where 1=1 " +
            strQry +
            " order by hims_d_favourite_orders_header_id desc;",
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
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

  updateFavouriteOrder: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body;

      const utilities = new algaehUtilities();
      utilities.logger().log("input: ", input);
      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_d_favourite_orders_header` SET `favourite_description`=?, `favourite_status`=?, \
            `doctor_id`=?, `updated_date`=?, `updated_by`=? \
            WHERE `hims_d_favourite_orders_header_id`=?",
          values: [
            input.favourite_description,
            input.favourite_status,
            input.doctor_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_favourite_orders_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult != null) {
            new Promise((resolve, reject) => {
              try {
                if (input.insert_favourite_details.length != 0) {
                  const IncludeValues = [
                    "favourite_orders_header_id",
                    "service_type_id",
                    "services_id"
                  ];

                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO hims_d_favourite_orders_detail(??) VALUES ?",
                      values: input.insert_favourite_details,
                      includeValues: IncludeValues,

                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(insert_favourite_details => {
                      return resolve(insert_favourite_details);
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
                if (input.delete_favourite_details.length != 0) {
                  let qry = "";
                  let inputParam = req.body.delete_favourite_details;
                  for (
                    let i = 0;
                    i < req.body.delete_favourite_details.length;
                    i++
                  ) {
                    qry += mysql.format(
                      "DELETE FROM `hims_d_favourite_orders_detail` where hims_d_favourite_orders_detail_id=?;",
                      [inputParam[i].hims_d_favourite_orders_detail_id]
                    );
                  }

                  _mysql
                    .executeQuery({
                      query: qry,
                      printQuery: true
                    })
                    .then(delete_favourite_details => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = delete_favourite_details;
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
  },

  addFavouriteServices: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("input: ", input);

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_favourite_services` (service_type_id, services_id, doctor_id, \
            created_by, created_date, updated_by, updated_date) values (?,?,?,?,?,?,?)",
        values: [
          input.service_type_id,
          input.services_id,
          input.doctor_id,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date()
        ],

        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  getFavouriteServices: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let strQry = "";

      if (input.hims_d_favourite_services_id > 0) {
        strQry += ` and  hims_d_favourite_services_id=${
          input.hims_d_favourite_services_id
        }`;
      }

      if (input.doctor_id > 0) {
        strQry += ` and  doctor_id=${input.doctor_id}`;
      }
      _mysql
        .executeQuery({
          query:
            "select * from hims_d_favourite_services where 1=1 " +
            strQry +
            " order by hims_d_favourite_services_id desc;",
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
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
  }
};
