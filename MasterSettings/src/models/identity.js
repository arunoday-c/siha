import algaehMysql from "algaeh-mysql";
import { deleteCacheMaster } from "algaeh-utilities/checksecurity";
export default {
  addIdentity: (req, res, next) => {
    let inputParam = req.body;

    const employeeIds = inputParam.employeeIDs.join(",");
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_identity_document` (`identity_document_code`, `identity_document_name`,`arabic_identity_document_name`,`nationality_id`,`masked_identity`,initial_value_identity,`notify_expiry`,`notify_before`,`employees_id`  \
            , `created_by` ,`created_date`) \
         VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?,?)",
          values: [
            inputParam.identity_document_code,
            inputParam.identity_document_name,
            inputParam.arabic_identity_document_name,
            inputParam.nationality_id,
            inputParam.masked_identity,
            inputParam.initial_value_identity,
            inputParam.notify_expiry,
            inputParam.notify_before,
            employeeIds,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
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

  updateIdentity: (req, res, next) => {
    let inputParam = req.body;

    const employeeIds =
      inputParam.employeeIDs.length === 0
        ? null
        : inputParam.employeeIDs.join(",");
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: `UPDATE hims_d_identity_document SET  identity_document_name =?, arabic_identity_document_name = ?,
             nationality_id = ?,masked_identity = ?,initial_value_identity=?,notify_expiry = ?,notify_before = ?,employees_id = ?,
             updated_by=?, updated_date=? ,identity_status = ? 
             WHERE record_status='A' AND hims_d_identity_document_id=?;
             update hims_d_nationality set identity_document_id=? where hims_d_nationality_id=?`,
          values: [
            inputParam.identity_document_name,
            inputParam.arabic_identity_document_name,
            inputParam.nationality_id,
            inputParam.masked_identity,
            inputParam.initial_value_identity,
            inputParam.notify_expiry,
            inputParam.notify_before,
            employeeIds,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.identity_status,
            inputParam.hims_d_identity_document_id,
            inputParam.hims_d_identity_document_id,
            inputParam.nationality_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          deleteCacheMaster("nationality");
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

  selectIdentity: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_identity_document_id != null) {
        _strAppend += "and hims_d_identity_document_id=?";
        inputValues.push(input.hims_d_identity_document_id);
      }
      if (input.identity_status != null) {
        _strAppend += "and identity_status=?";
        inputValues.push(input.identity_status);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT `hims_d_identity_document_id`, `identity_document_code`, `identity_document_name`, initial_value_identity,`arabic_identity_document_name`,ID.`nationality_id`,`masked_identity`, `identity_status`,`employees_id`,`notify_expiry`,`notify_before`\
          ,N.nationality as nationality_name FROM `hims_d_identity_document` as ID left join \
          hims_d_nationality as N on ID.nationality_id = N.hims_d_nationality_id  WHERE ID.record_status ='A' " +
            _strAppend, //+
          // " order by hims_d_identity_document_id desc",

          values: inputValues,
          printQuery: true,
        })
        .then((result) => {
          const array = result
            .map((f) => f.employees_id)
            .filter((f) => {
              return f !== null;
            })
            .join()
            .split(",");

          _mysql
            .executeQuery({
              query: `SELECT hims_d_employee_id,full_name,arabic_name,employee_code from hims_d_employee where hims_d_employee_id in (?)`,
              values: [array],
              printQuery: true,
            })
            .then((res) => {
              const records = result.map((item) => {
                let employeeNames = {};
                let employees = [];
                if (item.employees_id !== null) {
                  const employeeIds = item.employees_id.split(",");
                  employeeIds.forEach((m) => {
                    const itm = res.find(
                      (f) => String(f.hims_d_employee_id) === m
                    );

                    if (itm != undefined) {
                      employees.push({
                        full_name: itm.full_name,
                        arabic_name: itm.arabic_name,
                        hims_d_employee_id: m,
                        employee_code: itm.employee_code,
                      });
                    }
                  });
                }

                return { ...item, employees };
              });
              _mysql.releaseConnection();
              console.log("records", records);
              req.records = records;
              next();
              _mysql.releaseConnection();
              req.records = res;

              next();
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
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
  deleteIdentity: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_identity_document SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_identity_document_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_identity_document_id,
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
};
