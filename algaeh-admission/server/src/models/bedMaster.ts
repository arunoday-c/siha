import algaehMysql from "algaeh-mysql";

import _ from "lodash";
// import algaehUtilities from "algaeh-utilities/utilities";
// import hims_adm_ip_bed from "../dbModels/hims_adm_ip_bed";
// import hims_d_services from "../dbModels/hims_d_services";
import { Request, Response, NextFunction } from "express";

export async function getBedStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // try {
  //   const result = await hims_adm_ip_bed.findAll({
  //     include: [
  //       {
  //         model: hims_d_services,
  //         attributes: ["service_name", "hims_d_services_id"],
  //       },
  //     ],
  //   });
  //   console.log("res", result);
  //   req["records"] = result;

  //   next();
  // } catch (e) {
  //   next(e);
  // }
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select IP.hims_adm_ip_bed_id,IP.bed_desc,IP.bed_short_name,IP.services_id,IP.bed_status,S.service_name   from hims_adm_ip_bed IP left join hims_d_services S on  IP.services_id= S.hims_d_services_id   order by hims_adm_ip_bed_id desc `,
        printQuery: true,
      })
      .then((result) => {
        req["records"] = result;
        _mysql.releaseConnection();
        next();
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    next(e);
    _mysql.releaseConnection();
  }
  // } finally {
  //   _mysql.releaseConnection();
  // }
}
export function AddNewBedType(req: Request, res: Response, next: NextFunction) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    // console.log("input", input, req, req.query);
    _mysql
      .executeQuery({
        query: `insert into hims_adm_ip_bed(
          bed_desc,bed_short_name,bed_status,services_id,created_by,created_date,updated_by,updated_date)values(
          ?,?,?,?,?,?,?,?)`,
        values: [
          input.bed_desc,
          input.bed_short_name,
          input.bed_status,
          input.services_id,

          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
        ],
        printQuery: true,
      })
      .then((result) => {
        req["records"] = result;
        _mysql.releaseConnection();
        next();
      })
      .catch((e) => {
        throw e;
      });
    // req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  //finally {
  //   _mysql.releaseConnection();
  // }
}
export function updateBedType(req: Request, res: Response, next: NextFunction) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    _mysql
      .executeQuery({
        query: `Update hims_adm_ip_bed set bed_desc=?,bed_short_name=?,bed_status=?,services_id=?,updated_by=? ,updated_date=? where hims_adm_ip_bed_id=?`,
        values: [
          input.bed_desc,
          input.bed_short_name,
          input.bed_status,
          input.services_id,

          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          input.hims_adm_ip_bed_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        req["records"] = result;
        _mysql.releaseConnection();
        next();
      })
      .catch((e) => {
        throw e;
      });
    // req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // } finally {
  //   _mysql.releaseConnection();
  // }
}
export function deleteBedStatus(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_adm_ip_bed SET bed_status = 'I' ,updated_by=? ,updated_date=? WHERE (hims_adm_ip_bed_id = ?)",
        values: [
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          input.hims_adm_ip_bed_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        req["records"] = result;
        _mysql.releaseConnection();
        next();
      })
      .catch((e) => {
        throw e;
      });
    // req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // finally {
  //   _mysql.releaseConnection();
  // }
}
export function getWardHeaderData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  let strQuery = "";
  if (req.query.hims_adm_ward_header_id) {
    strQuery +=
      " and WH.hims_adm_ward_header_id= " + req.query.hims_adm_ward_header_id;
  }
  try {
    _mysql
      .executeQuery({
        query: `select WH.hims_adm_ward_header_id,IB.services_id,IB.bed_desc,WH.ward_desc,S.service_name, WH.ward_short_name,IB.bed_desc,WH.ward_type,WD.hims_adm_ward_detail_id,WD.ward_header_id,
        WD.bed_id,WD.bed_no,WD.status,IB.bed_short_name  from hims_adm_ward_header as WH left join hims_adm_ward_detail as WD on 
       WD.ward_header_id= WH.hims_adm_ward_header_id 
       left join hims_adm_ip_bed IB on WD.bed_id=IB.hims_adm_ip_bed_id
       left join hims_d_services S on IB.services_id= S.hims_d_services_id  where WH.ward_status='A' ${strQuery} `,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        let history = _.chain(result)
          .groupBy((g) => g.hims_adm_ward_header_id)
          .map((detail, key) => {
            const {
              ward_desc,
              hims_adm_ward_header_id,
              ward_type,
              ward_short_name,
            } = _.head(detail);
            const item: {
              // hims_adm_ward_header_id: number;
              bed_id: number;
              bed_no: number;
              status: string;
              bed_desc: string;
              bed_short_name: string;
              service_name: string;
              hims_adm_ward_detail_id: number;
              isInserted: number;
            } = detail.map((item: any) => {
              return {
                // hims_adm_ward_header_id: item.hims_adm_ward_header_id,
                bed_id: item.bed_id,
                bed_no: item.bed_no,
                status: item.status,
                service_name: item.service_name,
                bed_desc: item.bed_desc,
                bed_short_name: item.bed_short_name,
                hims_adm_ward_detail_id: item.hims_adm_ward_detail_id,
                isInserted: 1,
              };
            });

            return {
              groupType: key,
              hims_adm_ward_header_id: hims_adm_ward_header_id,
              ward_short_name: ward_short_name,
              ward_type: ward_type,
              ward_desc: ward_desc,

              groupDetail: item,
            };
          })
          .value();
        // console.log("history", history);
        req["records"] = history;
        next();
      })
      .catch((e) => {
        throw e;
      });
    // req["records"] = result;
    // next();
  } catch (e) {
    next(e);
    _mysql.releaseConnection();

    // } finally {
    //   _mysql.releaseConnection();
    // }
  }
}
export async function addWardHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;

    const result = await _mysql
      .executeQuery({
        query: `insert into hims_adm_ward_header(
          ward_desc,ward_short_name,ward_type,created_by,created_date,updated_by,updated_date)values(
          ?,?,?,?,?,?,?)`,
        values: [
          input.ward_desc,
          input.ward_short_name,
          input.ward_type,

          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });

    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function updateWardHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    console.log("iam here");
    const input = req.body;

    const result = await _mysql
      .executeQuery({
        query: `Update hims_adm_ward_header set ward_desc=?,ward_short_name=?,ward_type=?,updated_by=? ,updated_date=? where hims_adm_ward_header_id=?;`,
        values: [
          input.ward_desc,
          input.ward_short_name,
          // input.ward_status,
          input.ward_type,

          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          input.hims_adm_ward_header_id,
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function onDeleteHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    const result = await _mysql
      .executeQuery({
        query: `Update  hims_adm_ward_header set ward_status='I',updated_by=? ,updated_date=? where hims_adm_ward_header_id=?`,
        values: [
          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          input.hims_adm_ward_header_id,
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function getWardDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const result = await _mysql
      .executeQuery({
        query: `select * from hims_adm_ward_detail `,
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function addWardDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    console.log(input, "input");
    const result = await _mysql
      .executeQuery({
        values: input.wardDetailsData,
        extraValues: {
          ward_header_id: input.insertId,
        },
        excludeValues: ["rIndex", "bed_desc"],
        // replcaeKeys: { status: "record_status" },
        query: "insert into hims_adm_ward_detail (??) values ?",
        printQuery: true,
        bulkInsertOrUpdate: true,
      })

      // const result = await _mysql
      //   .executeQuery({
      //     query: `insert into hims_adm_ward_detail(
      //       ward_header_id,bed_id,bed_no,created_by,created_date,updated_by,updated_date)values(
      //       ?,?,?,?,?,?,?)`,
      //     values: [
      //       input.ward_header_id,
      //       input.bed_id,
      //       input.bed_no,

      //       req["userIdentity"].algaeh_d_app_user_id,
      //       new Date(),
      //       req["userIdentity"].algaeh_d_app_user_id,
      //       new Date(),
      //     ],
      //     printQuery: true,
      //   })
      // .then((result) => {
      //   req["records"] = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function updateWardDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;

    const result = await _mysql
      .executeQuery({
        query: `Update hims_adm_ward_detail set bed_id=?,bed_no=?,updated_by=? ,updated_date=? where hims_adm_ward_detail_id=?`,
        values: [
          // input.ward_header_id,
          input.bed_id,
          input.bed_no,

          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          input.hims_adm_ward_detail_id,
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function onDeleteDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    const result = await _mysql
      .executeQuery({
        query: `delete from hims_adm_ward_detail where hims_adm_ward_detail_id=?;`,
        values: [input.hims_adm_ward_detail_id],
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}

export async function getBedService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const result = await _mysql
      .executeQuery({
        query: `select hims_d_services_id, service_code, arabic_service_name, S.cpt_code, CPT.cpt_code as cpt_p_code,
         service_name, service_desc, sub_department_id, hospital_id, service_type_id, standard_fee , discount, vat_applicable, vat_percent,
         effective_start_date, effectice_end_date, procedure_type, physiotherapy_service, head_id, child_id from 
          hims_d_services S left join hims_d_cpt_code CPT on CPT.hims_d_cpt_code_id = S.cpt_code     
            WHERE S.record_status ='A' and service_type_id='9' order by hims_d_services_id desc `,
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   _mysql.releaseConnection();
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export function bedDataFromMaster(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select bed_desc,hims_adm_ip_bed_id from hims_adm_ip_bed
            WHERE bed_status ='A';`,
        printQuery: true,
      })
      .then((result) => {
        req["records"] = result;
        _mysql.releaseConnection();
        next();
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    next(e);
    _mysql.releaseConnection();
  }
  // } finally {
  //   _mysql.releaseConnection();
  // }
}

export function bedStatusSetUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select hims_adm_bed_status_id,bed_color,description,steps,record_status,LAST_INSERT_ID(steps) as last_inserted from hims_adm_bed_status order by steps desc ;`,
        printQuery: true,
      })
      .then((result) => {
        req["records"] = result;
        _mysql.releaseConnection();
        next();
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    next(e);
    _mysql.releaseConnection();
  }
  // } finally {
  //   _mysql.releaseConnection();
  // }
}
export async function onDeleteBedStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    const result = await _mysql
      .executeQuery({
        query: `Update hims_adm_bed_status set record_status='I',updated_by=? ,updated_date=? where hims_adm_bed_status_id=?`,
        values: [
          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          input.hims_adm_bed_status_id,
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function addBedStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;

    const result = await _mysql
      .executeQuery({
        query: `insert into hims_adm_bed_status(
          bed_color,description,steps,created_by,created_date,updated_by,updated_date)values(
          ?,?,?,?,?,?,?)`,
        values: [
          input.bed_color,
          input.description,
          input.steps,

          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });

    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}

export async function updateBedStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    const result = await _mysql
      .executeQuery({
        query: `Update hims_adm_bed_status set bed_color=?,description=?,steps=?,updated_by=? ,updated_date=? where hims_adm_bed_status_id=?`,
        values: [
          input.bed_color,
          input.description,
          input.steps,

          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          input.hims_adm_bed_status_id,
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req["records"] = result;
      //   _mysql.releaseConnection();
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
