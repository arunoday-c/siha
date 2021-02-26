import algaehMysql from "algaeh-mysql";

import _ from "lodash";
// import algaehUtilities from "algaeh-utilities/utilities";

import { Request, Response, NextFunction } from "express";

export function getBedStatus(req: Request, res: Response, next: NextFunction) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select IP.bed_desc,IP.bed_short_name,IP.services_id,IP.bed_status,S.service_name   from hims_adm_ip_bed IP left join hims_d_services S on  IP.services_id=S. hims_d_services_id `,
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
  try {
    _mysql
      .executeQuery({
        query: `select * from hims_adm_ward_header `,
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
    // next();
  } catch (e) {
    next(e);
  } finally {
    console.log("release");
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
        query: `Update hims_adm_ward_header set ward_desc=?,ward_short_name=?,ward_status=?,updated_by=? ,updated_date=? where hims_adm_ward_header=?`,
        values: [
          input.ward_desc,
          input.ward_short_name,
          input.ward_status,

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
    // next();
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

    const result = await _mysql
      .executeQuery({
        query: `insert into hims_adm_ward_detail(
          ward_header_id,bed_id,bed_no,created_by,created_date,updated_by,updated_date)values(
          ?,?,?,?,?,?,?)`,
        values: [
          input.ward_header_id,
          input.bed_id,
          input.bed_no,

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
    // next();
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
    console.log("iam here");
    const input = req.body;
    const result = await _mysql
      .executeQuery({
        query: `Update hims_adm_ward_detail set ward_header_id=?,bed_id=?,bed_no=?,updated_by=? ,updated_date=? where hims_adm_ward_detail_id=?`,
        values: [
          input.ward_header_id,
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
    // next();
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
        query: `Update  hims_adm_ward_detail set status='I',updated_by=? ,updated_date=? where hims_adm_ward_detail_id=?`,
        values: [
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
    // next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}

export function getBedService(req: Request, res: Response, next: NextFunction) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select hims_d_services_id, service_code, arabic_service_name, S.cpt_code, CPT.cpt_code as cpt_p_code,
         service_name, service_desc, sub_department_id, hospital_id, service_type_id, standard_fee , discount, vat_applicable, vat_percent,
         effective_start_date, effectice_end_date, procedure_type, physiotherapy_service, head_id, child_id from 
          hims_d_services S left join hims_d_cpt_code CPT on CPT.hims_d_cpt_code_id = S.cpt_code     
            WHERE S.record_status ='A' and service_type_id='9' order by hims_d_services_id desc `,
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
