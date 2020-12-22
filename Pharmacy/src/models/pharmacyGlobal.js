import algaehMysql from "algaeh-mysql";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export default {
  getUomLocationStock: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_m_item_uom_id, item_master_id, uom_id, stocking_uom, conversion_factor,\
             ITU.uom_status, PU.uom_description from \
             hims_m_item_uom ITU,hims_d_pharmacy_uom PU where ITU.record_status='A' and \
             ITU.uom_id = PU.hims_d_pharmacy_uom_id and \
             ITU.item_master_id=? ;\
             SELECT hims_m_item_location_id, item_id, pharmacy_location_id, item_location_status, batchno, \
             expirydt,barcode, qtyhand, qtypo, cost_uom,avgcost, last_purchase_cost, item_type, \
             grn_id, grnno, sale_price, mrp_price, sales_uom,PU.uom_description, git_qty \
             from hims_m_item_location IL,hims_d_pharmacy_uom PU, hims_d_item_master IM where\
             IL.sales_uom = PU.hims_d_pharmacy_uom_id and IL.item_id = IM.hims_d_item_master_id and \
             IL.record_status='A'  and item_id=? and pharmacy_location_id=? and qtyhand>0 \
             and (date(expirydt) > date(CURDATE())|| exp_date_required='N') order by date(expirydt);",
          values: [req.query.item_id, req.query.item_id, req.query.location_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = {
            uomResult: result[0],
            locationResult: result[1],
          };
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getVisitPrescriptionDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT H.hims_f_prescription_id,H.patient_id, H.encounter_id, H.provider_id, H.episode_id, \
            H.prescription_date,H.prescription_status,H.cancelled,D.hims_f_prescription_detail_id, \
            D.prescription_id, D.item_id, D.generic_id, D.dosage,D.med_units, D.frequency, D.no_of_days,\
            D.dispense, D.frequency_type, D.frequency_time,D.frequency_route,D.start_date, D.item_status, \
            D.service_id, D.uom_id,D.item_category_id, D.item_group_id, D.pre_approval, D.insured\
            from hims_f_prescription H,hims_f_prescription_detail D  \
            WHERE H.hims_f_prescription_id = D.prescription_id and H.visit_id=?",
          values: [req.query.visit_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getItemMoment: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";

      if (req.query.from_date != null) {
        _strAppend +=
          " and date(transaction_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        _strAppend += " and date(transaction_date) <= date(now())";
      }

      // delete req.query.from_date;
      // delete req.query.to_date;

      if (req.query.from_location_id != null) {
        _strAppend +=
          " and from_location_id='" + req.query.from_location_id + "'";
      }

      if (req.query.item_code_id != null) {
        _strAppend += " and item_code_id='" + req.query.item_code_id + "'";
      }

      if (req.query.barcode != null) {
        _strAppend += " and barcode='" + req.query.barcode + "'";
      }

      if (req.query.transaction_type != null) {
        _strAppend +=
          " and transaction_type='" + req.query.transaction_type + "'";
      }

      // delete req.query.from_date;
      // delete req.query.to_date;

      _mysql
        .executeQuery({
          query:
            "SELECT * from hims_f_pharmacy_trans_history  WHERE record_status = 'A' " +
            _strAppend,

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getItemLocationStockBackup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_m_item_location_id, item_id, pharmacy_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
          avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
          from hims_m_item_location where record_status='A'  and item_id=? and pharmacy_location_id=? \
          and qtyhand>0  order by expirydt",
          values: [req.query.item_id, req.query.location_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getUserLocationPermission: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_m_location_permission_id,user_id, location_id,L.hims_d_pharmacy_location_id,L.location_description,\
          L.location_type,L.allow_pos from hims_m_location_permission LP,hims_d_pharmacy_location L \
          where LP.record_status='A' and\
           L.record_status='A' and LP.location_id=L.hims_d_pharmacy_location_id  and allow='Y' and user_id=?",
          values: [req.userIdentity.algaeh_d_app_user_id],
          printQuery: true,
        })
        .then((result) => {
          if (result.length < 1) {
            let _strQry = "";
            let intValues = [];

            if (req.query.location_status != null) {
              _strQry += " and location_status=?";
              intValues.push(req.query.location_status);
            }
            if (req.query.hospital_id != null) {
              _strQry += " and hospital_id=?";
              intValues.push(req.query.hospital_id);
            }
            if (req.query.allow_pos == "Y") {
              _strQry += " and allow_pos='Y' ";
            }

            if (req.query.git_location == "N") {
              _strQry += " and git_location='N' ";
            }

            _mysql
              .executeQuery({
                query:
                  "select  hims_d_pharmacy_location_id, location_description, location_status, location_type,\
              allow_pos from hims_d_pharmacy_location where record_status='A' " +
                  _strQry,
                values: intValues,
                printQuery: true,
              })
              .then((resultLoctaion) => {
                _mysql.releaseConnection();
                req.records = resultLoctaion;
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = result;
            next();
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getItemandLocationStock: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValues = [];
      let strAppend = "";
      if (req.query.item_id != null) {
        strAppend += " and item_id=?";
        intValues.push(req.query.item_id);
      }
      if (req.query.pharmacy_location_id != null) {
        strAppend += " and pharmacy_location_id=?";
        intValues.push(req.query.pharmacy_location_id);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT hims_m_item_location_id, item_description, item_id, pharmacy_location_id, item_location_status, batchno, expirydt, \
            barcode, qtyhand, qtypo, cost_uom,avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, \
            mrp_price, sales_uom, git_qty, IM.stocking_uom_id, vendor_batchno from hims_m_item_location IL, \
            hims_d_item_master IM \
            where item_id = IM.hims_d_item_master_id and (date(IL.expirydt) > date(CURDATE()) or IL.expirydt is null) and IL.record_status='A' and qtyhand>0" +
            strAppend +
            "order by date(expirydt);",
          values: intValues,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  downloadPharStock: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValues = [req.query.pharmacy_location_id];
      let strAppend = "";
      if (req.query.item_id != null) {
        strAppend += " and IL.item_id=? ";
        intValues.push(req.query.item_id);
      }
      if (req.query.pharmacy_location_id != null) {
        strAppend += " and pharmacy_location_id=? ";
        intValues.push(req.query.pharmacy_location_id);
      }

      _mysql
        .executeQuery({
          query:
            `SELECT 
            IM.item_code AS 'Item Code',
            IM.item_description AS 'Item Name',
            ILOC.location_description as 'Location',
            COALESCE(ILR.reorder_qty, IM.reorder_qty, 0) AS 'Reorder Quantity',
            vendor_batchno as 'Vendor Batch No',
            batchno AS 'Batch Number',
            expirydt AS 'Expiry Date',
            SUM(qtyhand) AS 'Quantity At Hand',
            uom_description AS 'Stock UOM'
        FROM
        hims_d_item_master IM
                LEFT JOIN
                hims_m_item_location IL ON IM.hims_d_item_master_id = IL.item_id
                LEFT JOIN
                hims_d_phar_location_reorder ILR ON ILR.item_id = IL.item_id
                AND location_id = ?
                LEFT JOIN
            hims_d_pharmacy_uom IU ON IU.hims_d_pharmacy_uom_id = IM.stocking_uom_id
                LEFT JOIN
                hims_d_pharmacy_location ILOC ON ILOC.hims_d_pharmacy_location_id = pharmacy_location_id
        WHERE (date(IL.expirydt) > date(CURDATE()) or IL.expirydt is null) and qtyhand> 0
        ` +
            strAppend +
            "group by IL.item_id order by date(expirydt)",
          values: intValues,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  downloadPharStockDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValues = [];
      let strAppend = "";
      if (req.query.item_id != null) {
        strAppend += " and item_id=?";
        intValues.push(req.query.item_id);
      }
      if (req.query.pharmacy_location_id != null) {
        strAppend += " and pharmacy_location_id=?";
        intValues.push(req.query.pharmacy_location_id);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT item_description as Item, IPL.location_description,vendor_batchno as 'Vendor Batch No', batchno as 'Batch Number', expirydt as 'Expiry Date', \
            qtyhand as 'Quantity At Hand' from hims_m_item_location IL, \
            hims_d_item_master IM, hims_d_pharmacy_location IPL \
            where (date(IL.expirydt) > date(CURDATE()) or IL.expirydt is null) and qtyhand> 0 \
            and item_id = IM.hims_d_item_master_id and pharmacy_location_id = IPL.hims_d_pharmacy_location_id and IL.record_status='A'" +
            strAppend +
            "order by date(expirydt)",
          values: intValues,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateItemMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("updateItemMaster: ", req.body);

    try {
      let inputParam = req.body;

      _mysql
        .executeQueryWithTransaction({
          query: "select 1=1",
          printQuery: true,
        })
        .then((openconn) => {
          for (let i = 0; i < inputParam.pharmacy_stock_detail.length; i++) {
            _mysql
              .executeQueryWithTransaction({
                query:
                  "select  item_code from `hims_d_item_master` WHERE `hims_d_item_master_id`=?",
                values: [inputParam.pharmacy_stock_detail[i].item_id],
                printQuery: true,
              })
              .then((result) => {
                req.connection = {
                  connection: _mysql.connection,
                  isTransactionConnection: _mysql.isTransactionConnection,
                  pool: _mysql.pool,
                };
                var date = new Date();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                var day = date.getDate();
                var year = String(new Date().getFullYear()).substring(2, 4);
                var month = date.getMonth();
                if (String(month).length == 1) {
                  month = "0" + month;
                }

                var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

                var length = 2;
                var resultString =
                  year + month + day + hours + minutes + seconds;
                for (var j = length; j > 0; --j)
                  resultString +=
                    chars[Math.floor(Math.random() * chars.length)];
                resultString +=
                  req.userIdentity.algaeh_d_app_user_id +
                  req.userIdentity.hospital_id;

                req.body.pharmacy_stock_detail[i].batchno = "B" + resultString;
                req.body.pharmacy_stock_detail[i].barcode = "B" + resultString;
                if (i == inputParam.pharmacy_stock_detail.length - 1) {
                  next();
                }
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getItemLocationStock: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValues = [req.query.pharmacy_location_id];
      let strAppend = "";
      if (req.query.item_id != null) {
        strAppend += " and IL.item_id=?";
        intValues.push(req.query.item_id);
      }
      if (req.query.pharmacy_location_id != null) {
        strAppend += " and pharmacy_location_id=?";
        intValues.push(req.query.pharmacy_location_id);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT IM.item_code,IM.item_description,IM.stocking_uom_id,  coalesce(PLR.reorder_qty, IM.reorder_qty,0) as reorder_qty ,\
            hims_m_item_location_id, IL.item_id, pharmacy_location_id,\
            item_location_status, batchno, expirydt, barcode, sum(qtyhand) as qtyhand, qtypo, cost_uom,avgcost,\
            last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom,\
            CASE WHEN sum(qtyhand)<=coalesce(PLR.reorder_qty, IM.reorder_qty,0) THEN 'R'   else 'NR' END as reorder from \
            hims_d_item_master IM left  join hims_m_item_location IL on IM.hims_d_item_master_id=IL.item_id \
            left  join hims_d_phar_location_reorder PLR on PLR.item_id=IL.item_id and location_id=? \
            where qtyhand>0 and IM.item_status ='A' " +
            strAppend +
            "group by item_id order by date(expirydt)",
          values: intValues,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getConsumptionSelectedMonth: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT sum(transaction_qty) as transaction_qty FROM hims_f_pharmacy_trans_history \
            where date(transaction_date) between date(?) and date(?) and item_code_id=? and from_location_id=?;",
          values: [
            req.query.from_date,
            req.query.to_date,
            req.query.item_code_id,
            req.query.from_location_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  insertExpiryNotification: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQueryWithTransaction({
          query:
            "SELECT notification_before, notification_type from hims_d_pharmacy_options;",
          printQuery: true,
        })
        .then((result) => {
          const utilities = new algaehUtilities();
          utilities.logger().log("result: ", result[0].notification_type);
          let expiry_date_filter = null;
          let today_date = new Date();

          if (result[0].notification_type == "D") {
            expiry_date_filter = new Date(
              today_date.setDate(
                today_date.getDate() + parseInt(result[0].notification_before)
              )
            );
          } else if (result[0].notification_type == "M") {
            expiry_date_filter = new Date(
              today_date.setMonth(
                today_date.getMonth() + parseInt(result[0].notification_before)
              )
            );
          } else if (result[0].notification_type == "Y") {
            expiry_date_filter = new Date(
              today_date.setFullYear(
                today_date.getFullYear() +
                  parseInt(result[0].notification_before)
              )
            );
          }

          utilities.logger().log("expiry_date_filter: ", expiry_date_filter);

          _mysql
            .executeQuery({
              query:
                "SELECT hims_m_item_location_id, item_id, pharmacy_location_id, batchno, expirydt, barcode, \
                notification_insert,hospital_id from hims_m_item_location \
                where qtyhand > 0 and notification_insert='N' and date(expirydt) <= date(?)",
              values: [expiry_date_filter],
              printQuery: true,
            })
            .then((item_expiry_result) => {
              utilities
                .logger()
                .log("item_expiry_result: ", item_expiry_result);
              if (item_expiry_result.length > 0) {
                let str_query = "";

                for (let i = 0; i < item_expiry_result.length; i++) {
                  str_query += mysql.format(
                    "UPDATE `hims_m_item_location` SET notification_insert = 'Y' WHERE hims_m_item_location_id=?;",
                    [item_expiry_result[i].hims_m_item_location_id]
                  );

                  str_query += mysql.format(
                    "INSERT INTO hims_d_pharmacy_notification_expiry (`loaction_id`, `item_id`, `expiry_date`, `batchno`,\
                     `barcode`, `hospital_id`, `created_by`, `created_date`, `updated_date`, `updated_by`) \
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                    [
                      item_expiry_result[i].pharmacy_location_id,
                      item_expiry_result[i].item_id,
                      item_expiry_result[i].expirydt,
                      item_expiry_result[i].batchno,
                      item_expiry_result[i].barcode,
                      item_expiry_result[i].hospital_id,
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                    ]
                  );
                }

                _mysql
                  .executeQuery({
                    query: str_query,
                    printQuery: true,
                  })
                  .then((notification_result) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = notification_result;
                      next();
                    });
                  })
                  .catch((e) => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              } else {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = item_expiry_result;
                  next();
                });
              }
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  getExpiringItemList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT NE.*, PL.location_description, IM.item_description \
            FROM hims_d_pharmacy_notification_expiry NE, hims_d_pharmacy_location PL, hims_d_item_master IM where \
            NE.loaction_id = PL.hims_d_pharmacy_location_id and  NE.item_id=IM.hims_d_item_master_id and \
            NE.loaction_id=? order by expiry_date;",
          values: [req.query.location_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
};
