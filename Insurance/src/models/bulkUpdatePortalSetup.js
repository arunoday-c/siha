import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import { publisher } from "../rabbitMQ/publisher";
export async function bulkUpdatePortalSetup(req, res, next) {
  const _mysql = new algaehMysql();

  try {
    const { insertArray, updateArray } = req.body;

    if (insertArray.length > 0) {
      for (let i = 0; i < insertArray.length; i++) {
        ((data, i) => {
          setTimeout(async () => {
            _mysql
              .executeQuery({
                query: `INSERT INTO hims_d_portal_setup(insurance_id,sub_insurance_id,service_types,
                hospital_id,insurance_sub_name,arabic_sub_name,
                insurance_provider_name,arabic_provider_name,sync_in_process) value(?,?,?,?,?,?,?,?,?);`,
                values: [
                  data.insurance_id,
                  data.sub_insurance_id,
                  data.service_types,
                  data.hospital_id,
                  data.insurance_sub_name,
                  data.arabic_sub_name,
                  data.insurance_provider_name,
                  data.arabic_provider_name,
                  1,
                ],
              })
              .then(async (result) => {
                const typeArray = data.service_types
                  .replace("[", "")
                  .replace("]", "")
                  .split(",");
                const services = await _mysql
                  .executeQuery({
                    query: `SELECT SER_INS.hims_d_services_insurance_id as services_insurance_id,SER_INS.insurance_id,
                    SER_INS.services_id,SER_INS.service_type_id,
                    SER_INS.hospital_id,SER_INS.pre_approval,SER_INS.covered,SUB_INS.user_id
                    FROM hims_d_services_insurance as SER_INS 
                    inner join hims_d_insurance_sub as SUB_INS on SUB_INS.insurance_provider_id = SER_INS.insurance_id
                    where SER_INS.insurance_id =? and SER_INS.service_type_id in (?);`,
                    values: [data.insurance_id, typeArray],
                  })
                  .catch((error) => {
                    throw error;
                  });

                await publisher(
                  "CORPORATE_MASTER",
                  {
                    ...data,
                    id: result.insertId,
                    user_id: data.user_id,
                    services,
                    mode: "INSERT",
                  },
                  "CORPORATE"
                ).catch(async (error) => {
                  console.error(
                    `Error at BulkUpdatePortalSetup insert @${new Date().toLocaleDateString()} ===>`,
                    JSON.stringify(error),
                    "Input ====>",
                    data
                  );

                  await _mysql.executeQuery({
                    query: `update hims_d_portal_setup set sync_in_process=0,sync_error='ERROR IN SYNC' where id=?`,
                    values: [result.insertId],
                  });
                });
              })
              .catch((error) => {
                console.error("Error Insert====>", error);
              })
              .finally(() => {
                console.log("Here it is in finally");
                if (i === insertArray.length - 1) {
                  _mysql.releaseConnection();
                }
              });
          }, 20000 * i + 1);
        })(insertArray[i], i);
      }
    }
    if (updateArray.length > 0) {
      for (let i = 0; i < updateArray.length; i++) {
        ((data, i) => {
          setTimeout(async () => {
            const { checked } = data;
            if (checked === "Y") {
              _mysql
                .executeQuery({
                  query: `update hims_d_portal_setup set service_types=?,insurance_id=?,sub_insurance_id=?,
                hospital_id=?,insurance_sub_name=?,arabic_sub_name=?,insurance_provider_name=?,arabic_provider_name=?,sync_error=? where id=?`,
                  values: [
                    data.service_types,
                    data.insurance_id,
                    data.sub_insurance_id,
                    data.hospital_id,
                    data.insurance_sub_name,
                    data.arabic_sub_name,
                    data.insurance_provider_name,
                    data.arabic_provider_name,
                    null,
                    data.id,
                  ],
                })
                .then(async (result) => {
                  const typeArray = data.service_types
                    .replace("[", "")
                    .replace("]", "")
                    .split(",");
                  const services = await _mysql
                    .executeQuery({
                      query: `SELECT SER_INS.hims_d_services_insurance_id as services_insurance_id,SER_INS.insurance_id,
                      SER_INS.services_id,SER_INS.service_type_id,
                      SER_INS.hospital_id,SER_INS.pre_approval,SER_INS.covered,SUB_INS.user_id
                      FROM hims_d_services_insurance as SER_INS 
                      inner join hims_d_insurance_sub as SUB_INS on SUB_INS.insurance_provider_id = SER_INS.insurance_id
                      where SER_INS.insurance_id =? and SER_INS.service_type_id in (?);`,
                      values: [data.insurance_id, typeArray],
                    })
                    .catch((error) => {
                      throw error;
                    });
                  await publisher(
                    "CORPORATE_MASTER",
                    {
                      ...data,
                      services,
                      mode: "UPDATE",
                      user_id: data.user_id,
                    },
                    "CORPORATE"
                  ).catch(async (error) => {
                    console.error(
                      `Error at BulkUpdatePortalSetup insert @${new Date().toLocaleDateString()} ===>`,
                      JSON.stringify(error),
                      "Input ====>",
                      data
                    );
                    await _mysql.executeQuery({
                      query: `update hims_d_portal_setup set sync_in_process=0,sync_error='ERROR IN UPDATE' where id=?`,
                      values: [data.id],
                    });
                  });
                })
                .catch((error) => {
                  console.error("Error Update====>", error);
                })
                .finally(() => {
                  if (i === updateArray.length - 1) {
                    _mysql.releaseConnection();
                  }
                });
            } else {
              _mysql
                .executeQuery({
                  query: `delete from hims_d_portal_setup where id=?`,
                  values: [data.id],
                })
                .then(async (result) => {
                  await publisher(
                    "CORPORATE_MASTER",
                    { id: data.id, mode: "DELETE" },
                    "CORPORATE"
                  ).catch(async (error) => {
                    console.error(
                      `Error at BulkUpdatePortalSetup insert @${new Date().toLocaleDateString()} ===>`,
                      JSON.stringify(error),
                      "Input ====>",
                      data
                    );
                    await _mysql.executeQuery({
                      query: `update hims_d_portal_setup set sync_in_process=0,sync_error='ERROR IN UPDATE' where id=?`,
                      values: [data.id],
                    });
                  });
                })
                .catch((error) => {
                  console.error("Error Update====>", error);
                })
                .finally(() => {
                  if (i === updateArray.length - 1) {
                    _mysql.releaseConnection();
                  }
                });
            }
          }, 20000 * i + 1);
        })(updateArray[i], i);
      }
    }

    res
      .status(201)
      .json({
        success: true,
        message: "Successfully created a request to sync..",
      })
      .end();
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
export async function corporateServiceMasterSync(data) {
  const _mysql = new algaehMysql();
  try {
    const { id, lastSync } = data;
    await _mysql.executeQuery({
      query: `update hims_d_portal_setup set sync_in_process=0,last_sync=? where id=?`,
      values: [lastSync, id],
      printQuery: true,
    });
    _mysql.releaseConnection();
  } catch (e) {
    _mysql.releaseConnection();
  }
}
export async function syncPortalServices(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const result = await _mysql
      .executeQuery({
        query: `SELECT hims_d_services_id as service_id,service_name,arabic_service_name,hospital_id,service_type_id
       FROM hims_d_services as S inner join hims_d_service_type as ST on ST.hims_d_service_type_id= S.service_type_id
       where ST.available_to_portal=1;`,
      })
      .catch((error) => {
        throw error;
      });
    publisher("CORPORATE_SERVICE_MASTER", result, "CORPORATE");
    res
      .status(200)
      .json({
        success: true,
        message: "Master Data is in sync",
      })
      .end();
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
