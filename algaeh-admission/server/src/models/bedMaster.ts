import algaehMysql from "algaeh-mysql";
// import { fn, col } from "sequelize";
import _ from "lodash";
// import algaehUtilities from "algaeh-utilities/utilities";
import hims_adm_ip_bed from "../dbModels/hims_adm_ip_bed";
import hims_d_services from "../dbModels/hims_d_services";
import hims_adm_ward_header from "../dbModels/hims_adm_ward_header";
import hims_adm_ward_detail from "../dbModels/hims_adm_ward_detail";
import hims_d_cpt_code from "../dbModels/hims_d_cpt_code";
import hims_adm_bed_status from "../dbModels/hims_adm_bed_status";
import hims_adm_atd_bed_details from "../dbModels/hims_adm_atd_bed_details";
import { Request, Response, NextFunction } from "express";
// import sequelize from "../connection";
// const sequelize = require("sequelize");
export async function getBedStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await hims_adm_ip_bed.findAll({
      attributes: [
        "hims_adm_ip_bed_id",
        "bed_desc",
        "bed_short_name",
        "services_id",
        "bed_status",
      ],
      include: [
        {
          model: hims_d_services,
          attributes: ["service_name", "hims_d_services_id"],
          as: "S",
        },
      ],
      nest: false,
      raw: true,
    });
    req["records"] = result;

    next();
  } catch (e) {
    next(e);
  }
  // const _mysql = new algaehMysql();
  // try {
  //   _mysql
  //     .executeQuery({
  //       query: `select IP.hims_adm_ip_bed_id,IP.bed_desc,IP.bed_short_name,IP.services_id,IP.bed_status,S.service_name   from hims_adm_ip_bed IP left join hims_d_services S on  IP.services_id= S.hims_d_services_id   order by hims_adm_ip_bed_id desc `,
  //       printQuery: true,
  //     })
  //     .then((result) => {
  //       req["records"] = result;
  //       _mysql.releaseConnection();
  //       next();
  //     })
  //     .catch((e) => {
  //       throw e;
  //     });
  // } catch (e) {
  //   next(e);
  //   _mysql.releaseConnection();
  // }
  // } finally {
  //   _mysql.releaseConnection();
  // }
}
export async function AddNewBedType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;
    // console.log("input", input, req, req.query);
    // _mysql
    // .executeQuery({
    //   query: `insert into hims_adm_ip_bed(
    //     bed_desc,bed_short_name,bed_status,services_id,created_by,created_date,updated_by,updated_date)values(
    //     ?,?,?,?,?,?,?,?)`,
    //   values: [
    //     input.bed_desc,
    //     input.bed_short_name,
    //     input.bed_status,
    //     input.services_id,

    //     req["userIdentity"].algaeh_d_app_user_id,
    //     new Date(),
    //     req["userIdentity"].algaeh_d_app_user_id,
    //     new Date(),
    //   ],
    //   printQuery: true,
    // })
    // .then((result) => {
    const result = await hims_adm_ip_bed.create({
      bed_desc: input.bed_desc,
      bed_short_name: input.bed_short_name,
      bed_status: input.bed_status,
      services_id: input.services_id,
      created_by: req["userIdentity"].algaeh_d_app_user_id,
      updated_by: req["userIdentity"].algaeh_d_app_user_id,
    });
    req["records"] = result;
    // _mysql.releaseConnection();
    next();
    //   })
    //   .catch((e) => {
    //     throw e;
    //   });
    // // req["records"] = result;
    // next();
  } catch (e) {
    next(e);
  }
  //finally {
  //   _mysql.releaseConnection();
  // }
}
export async function updateBedType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;
    // _mysql
    // .executeQuery({
    //   query: `Update hims_adm_ip_bed set bed_desc=?,bed_short_name=?,bed_status=?,services_id=?,updated_by=? ,updated_date=? where hims_adm_ip_bed_id=?`,
    //   values: [
    //     input.bed_desc,
    //     input.bed_short_name,
    //     input.bed_status,
    //     input.services_id,

    //     req["userIdentity"].algaeh_d_app_user_id,
    //     new Date(),
    //     input.hims_adm_ip_bed_id,
    //   ],
    //   printQuery: true,
    // })
    // .then((result) => {
    const result = await hims_adm_ip_bed.update(
      {
        bed_desc: input.bed_desc,
        bed_short_name: input.bed_short_name,
        bed_status: input.bed_status,
        services_id: input.services_id,
        updated_by: req["userIdentity"].algaeh_d_app_user_id,
      },
      {
        where: {
          hims_adm_ip_bed_id: input.hims_adm_ip_bed_id,
        },
      }
    );
    req["records"] = result;
    // _mysql.releaseConnection();
    next();
    //   })
    //   .catch((e) => {
    //     throw e;
    //   });
    // // req["records"] = result;
    // next();
  } catch (e) {
    next(e);
  }
  // } finally {
  //   _mysql.releaseConnection();
  // }
}
export async function deleteBedStatus(req, res, next) {
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;

    // _mysql
    //   .executeQuery({
    //     query:
    //       "UPDATE hims_adm_ip_bed SET bed_status = 'I' ,updated_by=? ,updated_date=? WHERE (hims_adm_ip_bed_id = ?)",
    //     values: [
    //       req.userIdentity.algaeh_d_app_user_id,
    //       new Date(),
    //       input.hims_adm_ip_bed_id,
    //     ],
    //     printQuery: true,
    //   })
    //   .then((result) => {
    const result = await hims_adm_ip_bed.update(
      {
        bed_status: "I",
        updated_by: req.userIdentity.algaeh_d_app_user_id,
      },
      {
        where: {
          hims_adm_ip_bed_id: input.hims_adm_ip_bed_id,
        },
      }
    );
    req["records"] = result;
    // _mysql.releaseConnection();
    next();
    //   })
    //   .catch((e) => {
    //     throw e;
    //   });
    // // req["records"] = result;
    // next();
  } catch (e) {
    next(e);
  }
  // finally {
  //   _mysql.releaseConnection();
  // }
}

export async function getWardHeaderData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  // let strQuery = "";
  // if (req.query.hims_adm_ward_header_id) {
  //   strQuery +=
  //     " and WH.hims_adm_ward_header_id= " + req.query.hims_adm_ward_header_id;
  // }

  try {
    // _mysql
    //   .executeQuery({
    //     query: `select WH.hims_adm_ward_header_id,IB.services_id,IB.bed_desc,WH.ward_desc,S.service_name, WH.ward_short_name,IB.bed_desc,WH.ward_type,WD.hims_adm_ward_detail_id,WD.ward_header_id,
    //     WD.bed_id,WD.bed_no,WD.status,IB.bed_short_name  from hims_adm_ward_header as WH left join hims_adm_ward_detail as WD on
    //    WD.ward_header_id= WH.hims_adm_ward_header_id
    //    left join hims_adm_ip_bed IB on WD.bed_id=IB.hims_adm_ip_bed_id
    //    left join hims_d_services S on IB.services_id= S.hims_d_services_id  where WH.ward_status='A' ${strQuery} `,
    //     printQuery: true,
    //   })
    //   .then((result) => {
    // _mysql.releaseConnection();
    let whereCondition = {};
    let whereConditionWardDetail = {};
    if (req.query.hims_adm_ward_header_id) {
      whereCondition = {
        hims_adm_ward_header_id: req.query.hims_adm_ward_header_id,
      };
    }
    console.log(
      "req.query.hims_adm_bed_status_id",
      req.query.hims_adm_bed_status_id
    );
    if (req.query.hims_adm_bed_status_id) {
      console.log(
        "req.query.hims_adm_bed_status_id",
        req.query.hims_adm_bed_status_id
      );
      whereConditionWardDetail = {
        bed_status: req.query.hims_adm_bed_status_id,
      };
    }
    const result = await hims_adm_ward_header.findAll({
      attributes: [
        "hims_adm_ward_header_id",
        "ward_short_name",
        "ward_desc",
        "ward_type",
      ],

      include: [
        {
          model: hims_adm_ward_detail,
          attributes: [
            "hims_adm_ward_detail_id",
            "ward_header_id",
            "bed_id",
            "bed_status",
            "bed_no",
            "status",
          ],
          as: "WD",
          where: {
            ...whereConditionWardDetail,
          },
          include: [
            {
              model: hims_adm_ip_bed,
              attributes: ["bed_desc", "bed_short_name", "services_id"],
              as: "IP",
              include: [
                {
                  model: hims_d_services,
                  attributes: ["service_name", "service_type_id"],
                  as: "S",
                },
              ],
            },
          ],
        },
      ],

      where: {
        ...whereCondition,
      },
      // nest: false,
      // raw: true,
      // group: ["hims_adm_ward_header_id"],
    });
    // req["records"] = result;

    let arrangedData = _.chain(result)
      .groupBy((g) => g.hims_adm_ward_header_id)
      .map((detail, key) => {
        const {
          ward_desc,
          hims_adm_ward_header_id,
          ward_type,
          ward_short_name,
          WD,
        } = _.head(detail);
        if (WD.length > 0) {
          const item: {
            // hims_adm_ward_header_id: number;
            bed_id: number;
            bed_no: number;
            status: string;
            bed_desc: string;
            bed_status: string;
            services_id: number;
            bed_short_name: string;
            service_name: string;
            service_type_id: number;
            hims_adm_ward_detail_id: number;
            isInserted: number;
          } = WD.map((item: any) => {
            // const { WD } = item;
            // return WD.map((wardDetails) => {
            const { bed_desc, bed_short_name, S, services_id } = item.IP;

            return {
              // hims_adm_ward_header_id: item.hims_adm_ward_header_id,
              bed_id: item.bed_id,
              bed_no: item.bed_no,
              status: item.status,
              bed_status: item.bed_status,
              service_name: S?.service_name ?? undefined,
              service_type_id: S?.service_type_id ?? undefined,
              bed_desc: bed_desc ? bed_desc : undefined,
              services_id: services_id ? services_id : undefined,
              bed_short_name: bed_short_name ? bed_short_name : undefined,
              hims_adm_ward_detail_id: item.hims_adm_ward_detail_id,
              isInserted: 1,
            };
            // });
          });

          return {
            groupType: key,
            hims_adm_ward_header_id: hims_adm_ward_header_id,
            ward_short_name: ward_short_name,
            ward_type: ward_type,
            ward_desc: ward_desc,

            groupDetail: item,
          };
        }
      })
      .value();

    console.log("arrangedData", arrangedData);
    req["records"] = arrangedData.filter(function (element) {
      return element !== undefined;
    });

    next();
    // })
    // .catch((e) => {
    //   throw e;
    // });
    // req["records"] = result;
    // next();
  } catch (e) {
    next(e);
    // _mysql.releaseConnection();

    // } finally {
    //   _mysql.releaseConnection();
    // }
  }
}

export async function getWardDataBedManagement(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let whereCondition = {};
    if (req.query.hims_adm_ward_header_id) {
      whereCondition = {
        hims_adm_ward_header_id: req.query.hims_adm_ward_header_id,
      };
    }
    const result = await hims_adm_ward_header.findAll({
      attributes: [
        "hims_adm_ward_header_id",
        "ward_short_name",
        "ward_desc",
        "ward_type",
      ],

      include: [
        {
          model: hims_adm_ward_detail,
          attributes: [
            "hims_adm_ward_detail_id",
            "ward_header_id",
            "bed_id",
            "bed_no",
            "status",
          ],
          as: "WD",

          include: [
            {
              model: hims_adm_ip_bed,
              attributes: ["bed_desc", "bed_short_name", "services_id"],
              as: "IP",
              include: [
                {
                  model: hims_d_services,
                  attributes: ["service_name", "service_type_id"],
                  as: "S",
                },
              ],
            },
          ],
        },
      ],

      where: {
        ...whereCondition,
      },
      // nest: false,
      // raw: true,
      // group: ["hims_adm_ward_header_id"],
    });
    // req["records"] = result;

    let arrangedData = _.chain(result)
      .groupBy((g) => g.hims_adm_ward_header_id)
      .map((detail, key) => {
        const {
          ward_desc,
          hims_adm_ward_header_id,
          ward_type,
          ward_short_name,
          WD,
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
        } = WD.map((item: any) => {
          // const { WD } = item;
          // return WD.map((wardDetails) => {
          const { bed_desc, bed_short_name, S } = item.IP;

          return {
            // hims_adm_ward_header_id: item.hims_adm_ward_header_id,
            bed_id: item.bed_id,
            bed_no: item.bed_no,
            status: item.status,
            service_name: S?.service_name ?? undefined,
            bed_desc: bed_desc ? bed_desc : undefined,
            bed_short_name: bed_short_name ? bed_short_name : undefined,
            hims_adm_ward_detail_id: item.hims_adm_ward_detail_id,
            isInserted: 1,
          };
          // });
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
    // console.log(result, "result");
    req["records"] = arrangedData;

    next();
  } catch (e) {
    next(e);
  }
}

export async function getWardHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let whereCondition = {};
    if (req.query.hims_adm_ward_header_id) {
      whereCondition = {
        hims_adm_ward_header_id: req.query.hims_adm_ward_header_id,
      };
    }
    const result = await hims_adm_ward_header.findAll({
      attributes: [
        "hims_adm_ward_header_id",
        "ward_short_name",
        "ward_desc",
        "ward_type",
      ],

      where: {
        ...whereCondition,
      },
    });

    req["records"] = result;

    next();
  } catch (e) {
    next(e);
  }
}
export async function addWardHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;

    // const result = await _mysql
    // .executeQuery({
    //   query: `insert into hims_adm_ward_header(
    //     ward_desc,ward_short_name,ward_type,created_by,created_date,updated_by,updated_date)values(
    //     ?,?,?,?,?,?,?)`,
    //   values: [
    //     input.ward_desc,
    //     input.ward_short_name,
    //     input.ward_type,

    //     req["userIdentity"].algaeh_d_app_user_id,
    //     new Date(),
    //     req["userIdentity"].algaeh_d_app_user_id,
    //     new Date(),
    //   ],
    //   printQuery: true,
    // })
    // // .then((result) => {
    // //   req["records"] = result;
    // //   next();
    // // })
    // .catch((e) => {
    //   throw e;
    // });
    // db.MainMenu.create(mainMenu, {
    //   include: [{
    //     model: db.MainMeal,
    //     as: 'Menu'
    //   }]
    // })
    //   .then( mainmenu => {
    //     if (!mainmenu) {
    //       return res.send('users/signup', {
    //         errors: 'Error al registrar el mainmenu.'
    //       });
    //     } else {
    //       return res.jsonp(mainmenu);
    //     }
    //   })
    //   .catch( err => {
    //     console.log(err);
    //     return res.status(400)
    //       .send({
    //         message: errorHandler.getErrorMessage(err)
    //       });
    // });
    const result = await hims_adm_ward_header.create({
      ward_desc: input.ward_desc,
      ward_short_name: input.ward_short_name,
      ward_type: input.ward_type,
      created_by: req["userIdentity"].algaeh_d_app_user_id,
      updated_by: req["userIdentity"].algaeh_d_app_user_id,
    });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
    // } finally {
    //   // _mysql.releaseConnection();
    // }
  }
}
export async function updateWardHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    // console.log("iam here");
    const input = req.body;

    // const result = await _mysql
    //   .executeQuery({
    //     query: `Update hims_adm_ward_header set ward_desc=?,ward_short_name=?,ward_type=?,updated_by=? ,updated_date=? where hims_adm_ward_header_id=?;`,
    //     values: [
    //       input.ward_desc,
    //       input.ward_short_name,
    //       // input.ward_status,
    //       input.ward_type,

    //       req["userIdentity"].algaeh_d_app_user_id,
    //       new Date(),
    //       input.hims_adm_ward_header_id,
    //     ],
    //     printQuery: true,
    //   })
    //   // .then((result) => {
    //   //   req["records"] = result;
    //   //   next();
    //   // })
    //   .catch((e) => {
    //     throw e;
    //   });
    const result = await hims_adm_ward_header.update(
      {
        ward_desc: input.ward_desc,
        ward_short_name: input.ward_short_name,
        ward_type: input.ward_type,

        updated_by: req["userIdentity"].algaeh_d_app_user_id,
      },
      {
        where: {
          hims_adm_ward_header_id: input.hims_adm_ward_header_id,
        },
      }
    );
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  //finally {
  //   _mysql.releaseConnection();
  // }
}
export async function onDeleteHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    // const result = await _mysql
    //   .executeQuery({
    //     query: `Update  hims_adm_ward_header set ward_status='I',updated_by=? ,updated_date=? where hims_adm_ward_header_id=?`,
    //     values: [
    //       req["userIdentity"].algaeh_d_app_user_id,
    //       new Date(),
    //       input.hims_adm_ward_header_id,
    //     ],
    //     printQuery: true,
    //   })
    //   // .then((result) => {
    //   //   req["records"] = result;
    //   //   next();
    //   // })
    //   .catch((e) => {
    //     throw e;
    //   });
    const result = await hims_adm_ward_header.update(
      {
        ward_status: "I",

        updated_by: req["userIdentity"].algaeh_d_app_user_id,
      },
      {
        where: {
          hims_adm_ward_header_id: input.hims_adm_ward_header_id,
        },
      }
    );
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }

  // finally {
  //   _mysql.releaseConnection();
  // }
}
export async function getWardDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    // const result = await _mysql
    //   .executeQuery({
    //     query: `select * from hims_adm_ward_detail `,
    //     printQuery: true,
    //   })
    //   // .then((result) => {
    //   //   req["records"] = result;
    //   //   next();
    //   // })
    //   .catch((e) => {
    //     throw e;
    //   });
    const result = await hims_adm_ward_detail.findAll();
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // finally {
  //   _mysql.releaseConnection();
  // }
}
export async function addWardDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;
    // console.log(input, "input");
    // const result = await _mysql
    //   .executeQuery({
    //     values: input.wardDetailsData,
    //     extraValues: {
    //       ward_header_id: input.insertId,
    //     },
    //     excludeValues: ["rIndex", "bed_desc"],
    //     // replcaeKeys: { status: "record_status" },
    //     query: "insert into hims_adm_ward_detail (??) values ?",
    //     printQuery: true,
    //     bulkInsertOrUpdate: true,
    //   })

    const result = await hims_adm_ward_detail.bulkCreate(input.wardDetails);
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
    // .catch((e) => {
    //   throw e;
    // });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // finally {
  //   _mysql.releaseConnection();
  // }
}
export async function updateWardDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;

    // const result = await _mysql
    //   .executeQuery({
    //     query: `Update hims_adm_ward_detail set bed_id=?,bed_no=?,updated_by=? ,updated_date=? where hims_adm_ward_detail_id=?`,
    //     values: [
    //       // input.ward_header_id,
    //       input.bed_id,
    //       input.bed_no,

    //       req["userIdentity"].algaeh_d_app_user_id,
    //       new Date(),
    //       input.hims_adm_ward_detail_id,
    //     ],
    //     printQuery: true,
    //   })
    //   // .then((result) => {
    //   //   req["records"] = result;
    //   //   next();
    //   // })
    //   .catch((e) => {
    //     throw e;
    //   });
    const result = await hims_adm_ward_detail.update(
      {
        bed_id: input.bed_id,
        bed_no: input.bed_no,

        updated_by: req["userIdentity"].algaeh_d_app_user_id,
      },
      {
        where: {
          hims_adm_ward_detail_id: input.hims_adm_ward_detail_id,
        },
      }
    );

    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // finally {
  //   _mysql.releaseConnection();
  // }
}
export async function updateBedReleasingDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;

    const result = await hims_adm_ward_detail.update(
      {
        bed_status: "Vacant",
      },
      {
        where: {
          hims_adm_ward_detail_id: input.hims_adm_ward_detail_id,
        },
      }
    );
    const update_adm_atd_bed_details = await hims_adm_atd_bed_details.update(
      {
        released_by: req["userIdentity"].algaeh_d_app_user_id,
        released_date: new Date(),
      },
      {
        where: {
          hims_adm_atd_bed_details_id: input.hims_adm_atd_bed_details_id,
        },
      }
    );

    req["records"] = result;

    next();
  } catch (e) {
    next(e);
  }
  // finally {
  //   _mysql.releaseConnection();
  // }
}
export async function updateBedStatusUnavailable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = req.body;

    const result = await hims_adm_ward_detail.update(
      {
        bed_status: "Unavailable",
      },
      {
        where: {
          hims_adm_ward_detail_id: input.hims_adm_ward_detail_id,
        },
      }
    );

    req["records"] = result;

    next();
  } catch (e) {
    next(e);
  }
}
export async function getPatBedAdmissionDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const result = await hims_adm_atd_bed_details.findOne({
      attributes: ["hims_adm_atd_bed_details_id", "bed_id", "patient_id"],

      nest: false,
      raw: true,
      where: {
        bed_id: req.query.bed_id,
        ward_detail_id: req.query.hims_adm_ward_detail_id,
      },
    });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // { attributes: { include: [[sequelize.fn('COUNT', sequelize.col('id')), 'total']] }
  // finally {
  //   _mysql.releaseConnection();
  // }
}

export async function onDeleteDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;
    // const result = await _mysql
    // .executeQuery({
    //   query: `delete from hims_adm_ward_detail where hims_adm_ward_detail_id=?;`,
    //   values: [input.hims_adm_ward_detail_id],
    //   printQuery: true,
    // })
    // .then((result) => {
    //   req["records"] = result;
    //   next();
    // })
    // .catch((e) => {
    //   throw e;
    // });
    const result = await hims_adm_ward_detail.destroy({
      where: {
        hims_adm_ward_detail_id: input.hims_adm_ward_detail_id,
      },
    });

    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  //  finally {
  //   _mysql.releaseConnection();
  // }
}

export async function getBedService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    // const result = await _mysql
    //   .executeQuery({
    //     query: `select hims_d_services_id, service_code, arabic_service_name, S.cpt_code, CPT.cpt_code as cpt_p_code,
    //      service_name, service_desc, sub_department_id, hospital_id, service_type_id, standard_fee , discount, vat_applicable, vat_percent,
    //      effective_start_date, effectice_end_date, procedure_type, physiotherapy_service, head_id, child_id from
    //       hims_d_services S left join hims_d_cpt_code CPT on CPT.hims_d_cpt_code_id = S.cpt_code
    //         WHERE S.record_status ='A' and service_type_id='9' order by hims_d_services_id desc `,
    //     printQuery: true,
    //   })
    //   // .then((result) => {
    //   //   req["records"] = result;
    //   //   _mysql.releaseConnection();
    //   //   next();
    //   // })
    //   .catch((e) => {
    //     throw e;
    //   });
    //
    const result = await hims_d_services.findAll({
      attributes: [
        "hims_d_services_id",
        "service_code",
        "arabic_service_name",
        "cpt_code",
        "service_name",
        "service_desc",
        "sub_department_id",
        "hospital_id",
        "service_type_id",
        "standard_fee",
        "discount",
        "vat_applicable",
        "vat_percent",
        "effective_start_date",
        "effectice_end_date",
        "procedure_type",
        "physiotherapy_service",
        "head_id",
        "child_id",
      ],
      include: [
        {
          model: hims_d_cpt_code,
          attributes: [["cpt_code", "cpt_p_code"]],
          as: "CPT",
        },
      ],
      nest: false,
      raw: true,
      where: {
        record_status: "A",
        service_type_id: 9,
      },
      order: [["hims_d_services_id", "DESC"]],
    });
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // { attributes: { include: [[sequelize.fn('COUNT', sequelize.col('id')), 'total']] }
  // finally {
  //   _mysql.releaseConnection();
  // }
}
export async function bedDataFromMaster(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    //   _mysql
    //     .executeQuery({
    //       query: `select bed_desc,hims_adm_ip_bed_id from hims_adm_ip_bed
    //           WHERE bed_status ='A';`,
    //       printQuery: true,
    //     })
    //     .then((result) => {

    const result = await hims_adm_ip_bed.findAll({
      attributes: ["bed_desc", "hims_adm_ip_bed_id"],
      where: { bed_status: "A" },
    });
    req["records"] = result;
    next();
    // _mysql.releaseConnection();
    //   next();
    // })
    // .catch((e) => {
    //   throw e;
    // });
  } catch (e) {
    next(e);
    // _mysql.releaseConnection();
  }
  // } finally {
  //   _mysql.releaseConnection();
  // }
}

export async function bedStatusSetUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    // _mysql
    //   .executeQuery({
    //     query: `select hims_adm_bed_status_id,bed_color,description,steps,record_status,LAST_INSERT_ID(steps) as last_inserted from hims_adm_bed_status order by steps desc ;`,
    //     printQuery: true,
    //   })
    //   .then((result) => {
    const result = await hims_adm_bed_status.findAll({
      attributes: {
        include: [
          "hims_adm_bed_status_id",
          "bed_color",
          "description",
          "steps",
          "record_status",
          // [fn("MAX", col("steps")), "last_inserted"],
        ],
      },
    });
    const lastInsert = _.maxBy(result, (f) => f.steps);
    req["records"] = { result, last_inserted: lastInsert?.steps };
    // _mysql.releaseConnection();
    next();

    // })
    // .catch((e) => {
    //   throw e;
    // });
  } catch (e) {
    next(e);
    // _mysql.releaseConnection();
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
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;
    // const result = await _mysql
    //   .executeQuery({
    //     query: `Update hims_adm_bed_status set record_status='I',updated_by=? ,updated_date=? where hims_adm_bed_status_id=?`,
    //     values: [
    //       req["userIdentity"].algaeh_d_app_user_id,
    //       new Date(),
    //       input.hims_adm_bed_status_id,
    //     ],
    //     printQuery: true,
    //   })
    //   // .then((result) => {
    //   //   req["records"] = result;
    //   //   next();
    //   // })
    //   .catch((e) => {
    //     throw e;
    //   });
    const result = await hims_adm_bed_status.update(
      {
        record_status: "I",
        updated_by: req["userIdentity"].algaeh_d_app_user_id,
      },
      {
        where: {
          hims_adm_bed_status_id: input.hims_adm_bed_status_id,
        },
      }
    );
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // finally {
  //   _mysql.releaseConnection();
  // }
}
export async function addBedStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;

    // const result = await _mysql
    //   .executeQuery({
    //     query: `insert into hims_adm_bed_status(
    //       bed_color,description,steps,created_by,created_date,updated_by,updated_date)values(
    //       ?,?,?,?,?,?,?)`,
    //     values: [
    //       input.bed_color,
    //       input.description,
    //       input.steps,

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
    // .catch((e) => {
    //   throw e;
    // });
    const result = await hims_adm_bed_status.create({
      bed_color: input.bed_color,
      description: input.description,
      steps: input.steps,
      created_by: req["userIdentity"].algaeh_d_app_user_id,
      updated_by: req["userIdentity"].algaeh_d_app_user_id,
    });

    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // finally {
  //   _mysql.releaseConnection();
  // }
}

export async function updateBedStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const _mysql = new algaehMysql();
  try {
    const input = req.body;
    // const result = await _mysql
    //   .executeQuery({
    //     query: `Update hims_adm_bed_status set bed_color=?,description=?,steps=?,updated_by=? ,updated_date=? where hims_adm_bed_status_id=?`,
    //     values: [
    //       input.bed_color,
    //       input.description,
    //       input.steps,

    //       req["userIdentity"].algaeh_d_app_user_id,
    //       new Date(),
    //       input.hims_adm_bed_status_id,
    //     ],
    //     printQuery: true,
    //   })
    //   // .then((result) => {
    //   //   req["records"] = result;
    //   //   _mysql.releaseConnection();
    //   //   next();
    //   // })
    //   .catch((e) => {
    //     throw e;
    //   });
    const result = await hims_adm_bed_status.update(
      {
        bed_color: input.bed_color,
        description: input.description,
        steps: input.steps,
        updated_by: req["userIdentity"].algaeh_d_app_user_id,
      },
      {
        where: {
          hims_adm_bed_status_id: input.hims_adm_bed_status_id,
        },
      }
    );
    req["records"] = result;
    next();
  } catch (e) {
    next(e);
  }
  // finally {
  //   _mysql.releaseConnection();
  // }
}
