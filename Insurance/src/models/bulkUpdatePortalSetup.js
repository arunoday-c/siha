import algaehMysql from "algaeh-mysql";
import _ from "lodash";
export async function bulkUpdatePortalSetup(req, res, next) {
  const _mysql = new algaehMysql();

  try {
    let result = undefined;

    let input = req.body;
    let array = input.data;
    const insertArray = array.filter((f) => !f.id);
    const updateArray = array.filter((f) => f.id);

    if (insertArray.length > 0) {
      const insurtColumns = [
        "insurance_id",
        "sub_insurance_id",
        "service_types",
        "hospital_id",
      ];

      result = await _mysql
        .executeQuery({
          query: `INSERT INTO hims_d_portal_setup(??) VALUES ?;
          SELECT LAST_INSERT_ID(id) from hims_d_portal_setup ; `,
          values: insertArray,
          includeValues: insurtColumns,
          printQuery: true,
          bulkInsertOrUpdate: true,
          extraValues: {
            // last_sync: new Date(),
            // created_date: new Date(),
            // created_by: req.userIdentity.algaeh_d_app_user_id,
            // updated_date: new Date(),
            // updated_by: req.userIdentity.algaeh_d_app_user_id,
          },
        })
        .then((res) => {
          _mysql.releaseConnection();
          console.log("result=====> ", JSON.stringify(res));
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          throw new Error(error);
          // next(error);
        });
    }
    console.log("result=====> ", JSON.stringify(result));
    if (updateArray.length > 0) {
      let qry = "";
      updateArray.map((item) => {
        qry += _mysql.format(
          `update hims_d_portal_setup set service_types=? where id=?;`,
          [item.service_types, item.id]
        );
      });

      await _mysql
        .executeQuery({
          query: qry,
          bulkInsertOrUpdate: true,
          printQuery: true,
        })
        .then((res) => {
          _mysql.releaseConnection();
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          throw new Error(error);
          // next(error);
        });
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
