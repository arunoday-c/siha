import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

module.exports = {
  getUomLocationStock: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_m_inventory_item_uom_id, item_master_id, uom_id, stocking_uom, conversion_factor, hims_m_inventory_item_uom.uom_status, \
          hims_d_inventory_uom.uom_description  \
          from hims_m_inventory_item_uom,hims_d_inventory_uom where hims_m_inventory_item_uom.record_status='A' and \
          hims_m_inventory_item_uom.uom_id = hims_d_inventory_uom.hims_d_inventory_uom_id and hims_m_inventory_item_uom.item_master_id=? ;\
          SELECT hims_m_inventory_item_location_id, item_id, inventory_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
          avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
          from hims_m_inventory_item_location where record_status='A'  and item_id=? and inventory_location_id=? and expirydt > CURDATE() \
          and qtyhand>0  order by expirydt",
          values: [req.query.item_id, req.query.item_id, req.query.location_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = {
            uomResult: result[0],
            locationResult: result[1]
          };
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
  getItemMoment: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("req.query: ", req.query);
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

      _mysql
        .executeQuery({
          query:
            "SELECT * from hims_f_inventory_trans_history  WHERE record_status = 'A' " +
            _strAppend,
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

  getItemLocationStock: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_m_inventory_item_location_id, item_id, inventory_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
          avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
          from hims_m_inventory_item_location where record_status='A'  and item_id=? and inventory_location_id=? \
          and qtyhand>0  order by expirydt",
          values: [req.query.item_id, req.query.location_id],
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

  getUserLocationPermission: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_m_inventory_location_permission_id,user_id, location_id,L.hims_d_inventory_location_id,L.location_description,\
          L.location_type,L.allow_pos from hims_m_inventory_location_permission LP,hims_d_inventory_location L \
          where LP.record_status='A' and\
           L.record_status='A' and LP.location_id=L.hims_d_inventory_location_id  and allow='Y' and user_id=?",
          values: [req.userIdentity.algaeh_d_app_user_id],
          printQuery: true
        })
        .then(result => {
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

            _mysql
              .executeQuery({
                query:
                  "select  hims_d_inventory_location_id, location_description, location_status, location_type,\
                 allow_pos from hims_d_inventory_location where record_status='A' " +
                  _strQry,
                values: intValues,
                printQuery: true
              })
              .then(resultLoctaion => {
                _mysql.releaseConnection();
                req.records = resultLoctaion;
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = result;
            next();
          }
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
  getItemandLocationStock: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValues = [];
      let strAppend = "";
      if (req.query.item_id != null) {
        strAppend += " and item_id=?";
        intValues.push(req.query.item_id);
      }
      if (req.query.inventory_location_id != null) {
        strAppend += " and inventory_location_id=?";
        intValues.push(req.query.inventory_location_id);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT hims_m_inventory_item_location_id, item_id, inventory_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
          avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
          from hims_m_inventory_item_location where record_status='A' and qtyhand>0" +
            strAppend +
            "order by expirydt",
          values: intValues,
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

  updateInventoryItemMaster: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();
    utilities.logger().log("updateInventoryItemMaster: ");

    try {
      let inputParam = req.body;
      let execute_query = "";

      for (let i = 0; i < inputParam.inventory_stock_detail.length; i++) {
        _mysql
          .executeQuery({
            query:
              "select batch_no, item_code from `hims_d_inventory_item_master` WHERE `hims_d_inventory_item_master_id`=?",
            values: [inputParam.inventory_stock_detail[i].item_id],
            printQuery: true
          })
          .then(result => {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var chars =
              String(hours) +
              String(minutes) +
              String(seconds) +
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var length = 2;
            var resultString = "";
            for (var j = length; j > 0; --j)
              resultString += chars[Math.floor(Math.random() * chars.length)];
            resultString +=
              req.userIdentity.algaeh_d_app_user_id +
              req.userIdentity.hospital_id;

            let batch_no = parseInt(result[0].batch_no) + 1;
            let barcode = result[0].item_code + "B" + resultString;

            console.log("batch_no", "B" + resultString);
            console.log("barcode", barcode);

            req.body.inventory_stock_detail[i].batchno = "B" + resultString;
            req.body.inventory_stock_detail[i].barcode = barcode;
            utilities
              .logger()
              .log("batch_no: ", req.body.inventory_stock_detail[i].batch_no);
            if (i == inputParam.inventory_stock_detail.length - 1) {
              next();
            }
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
