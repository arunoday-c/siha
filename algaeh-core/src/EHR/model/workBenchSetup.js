"use strict";
import extend from "extend";
import utils from "../../utils";

import algaehMysql from "algaeh-mysql";

const { whereCondition, jsonArrayToObject } = utils;

//created by irfan: to add vital header
let addVitalMasterHeader = (req, res, next) => {
  try {
    let input = extend({}, req.body);
    const _mysql = new algaehMysql();

    let $max = _mysql
      .executeQuery({
        query: `SELECT max(hims_d_vitals_header_id)+1 as vital FROM hims_d_vitals_header`,
      })
      .then((result) => {
        const vital_id = result.length === 0 ? 1 : result[0]["vital"];
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_d_vitals_header` (vitals_name, uom,general,display,record_status,created_date, created_by, updated_date, updated_by,hims_d_vitals_header_id)\
      VALUE(?,?,?,?,?,?,?,?,?,?)",
            values: [
              input.vitals_name,
              input.uom,
              input.general,
              input.display,
              input.record_status,
              new Date(),
              input.created_by,
              new Date(),
              input.updated_by,
              vital_id,
            ],
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
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};
let addExaminationType = (req, res, next) => {
  try {
    let input = extend({}, req.body);
    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_physical_examination_header` (examination_type, description,sub_department_id,assesment_type,mandatory,created_date, created_by, updated_date, updated_by)\
      VALUE(?,?,?,?,?,?,?,?,?)",
        values: [
          input.examination_type,
          input.description,
          input.sub_department_id,
          "NS",
          "N",

          new Date(),
          input.created_by,
          new Date(),
          input.updated_by,
        ],
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
    next(e);
  }
};
// let ExaminationType = (req, res, next) => {
//   let  = {
//     hims_d_vitals_header_id: "ALL",
//   };
//   try {
//     const _mysql = new algaehMysql();

//     let where = whereCondition(extend(selectWhere, req.query));

//     _mysql
//       .executeQuery({
//         query:
//           "select hims_d_vitals_header_id,uom, vitals_name,general,display,record_status FROM hims_d_vitals_header where " +
//           where.condition +
//           " order by hims_d_vitals_header_id desc",
//         values: [...where.values],
//       })
//       .then((result) => {
//         _mysql.releaseConnection();
//         req.records = result;
//         next();
//       })
//       .catch((error) => {
//         _mysql.releaseConnection();
//         next(error);
//       });
//   } catch (e) {
//     next(e);
//   }
// };
let updateExaminationType = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_physical_examination_header` SET examination_type=?,description=?,sub_department_id=?,assesment_type=?,mandatory=?,\
      updated_date=?, updated_by=?  WHERE  `hims_d_physical_examination_header_id`=?;",
        values: [
          input.examination_type,
          input.description,
          input.sub_department_id,
          "NS",
          "N",

          new Date(),
          input.updated_by,
          input.hims_d_physical_examination_header_id,
        ],
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
    next(e);
  }
};
let getExaminationType = (req, res, next) => {
  let input = req.body;
  try {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select hims_d_physical_examination_header_id, examination_type, description,sub_department_id,assesment_type,mandatory\
           FROM hims_d_physical_examination_header where  record_status='A'",

        // values: [input.hims_d_physical_examination_header_id],
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
    next(e);
  }
};
let getExaminationDescription = (req, res, next) => {
  let input = req.body;
  try {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select ED.hims_d_physical_examination_details_id, ED.physical_examination_header_id, ED.description as descr,ED.mandatory,PEH.hims_d_physical_examination_header_id,PEH.description\
           FROM hims_d_physical_examination_details ED inner join hims_d_physical_examination_header PEH\
            on ED.physical_examination_header_id=PEH.hims_d_physical_examination_header_id and  ED.record_status='A'and PEH.record_status='A'",
        printQuery: true,
        // values: [input.hims_d_physical_examination_header_id],
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
    next(e);
  }
};
let addExaminationDescription = (req, res, next) => {
  try {
    let input = extend({}, req.body);
    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_physical_examination_details` (physical_examination_header_id, description,mandatory,created_date, created_by, updated_date, updated_by)\
      VALUE(?,?,?,?,?,?,?)",
        values: [
          input.physical_examination_header_id,
          input.description,
          "N",

          new Date(),
          input.created_by,
          new Date(),
          input.updated_by,
        ],
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
    next(e);
  }
};
let updateExaminationDescription = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_physical_examination_details` SET physical_examination_header_id=?,description=?,mandatory=?,\
      updated_date=?, updated_by=?  WHERE  `hims_d_physical_examination_details_id`=?;",
        values: [
          input.physical_examination_header_id,
          input.description,
          "N",

          new Date(),
          input.updated_by,
          input.hims_d_physical_examination_details_id,
        ],
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
    next(e);
  }
};
let getExaminationCategory = (req, res, next) => {
  let input = req.body;
  try {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select EC.physical_examination_details_id, EC.hims_d_physical_examination_subdetails_id, EC.description as ecDescr,EC.mandatory,\
          ED.hims_d_physical_examination_details_id,ED.description FROM hims_d_physical_examination_subdetails EC inner join hims_d_physical_examination_details ED\
          on EC.physical_examination_details_id = ED.hims_d_physical_examination_details_id\
          and  EC.record_status='A' and ED.record_status='A'",

        // values: [input.hims_d_physical_examination_header_id],
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
    next(e);
  }
};
let addExaminationCategory = (req, res, next) => {
  try {
    let input = extend({}, req.body);
    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_physical_examination_subdetails` (physical_examination_details_id, description,mandatory,created_date, created_by, updated_date, updated_by)\
      VALUE(?,?,?,?,?,?,?)",
        values: [
          input.physical_examination_details_id,
          input.description,
          "N",

          new Date(),
          input.created_by,
          new Date(),
          input.updated_by,
        ],
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
    next(e);
  }
};
let updateExaminationCategory = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_physical_examination_subdetails` SET physical_examination_details_id=?,description=?,mandatory=?,\
      updated_date=?, updated_by=?  WHERE  `hims_d_physical_examination_subdetails_id`=?;",
        values: [
          input.physical_examination_details_id,
          input.description,
          "N",

          new Date(),
          input.updated_by,
          input.hims_d_physical_examination_subdetails_id,
        ],
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
    next(e);
  }
};

//created by irfan: to getVitalMasterHeader
let getVitalMasterHeader = (req, res, next) => {
  let selectWhere = {
    hims_d_vitals_header_id: "ALL",
  };
  try {
    const _mysql = new algaehMysql();

    let where = whereCondition(extend(selectWhere, req.query));

    _mysql
      .executeQuery({
        query:
          "select hims_d_vitals_header_id,uom, vitals_name,general,display,record_status,box_type FROM hims_d_vitals_header where " +
          where.condition +
          " order by hims_d_vitals_header_id desc",
        values: [...where.values],
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
    next(e);
  }
};

//created by irfan: to deleteVitalMasterHeader
// let deleteVitalMasterHeader = (req, res, next) => {
//   try {
//     const _mysql = new algaehMysql();

//     _mysql
//       .executeQuery({
//         query:
//           "UPDATE hims_d_vitals_header SET  record_status='I' WHERE hims_d_vitals_header_id=?",
//         values: [req.body.hims_d_vitals_header_id],
//       })
//       .then((result) => {
//         _mysql.releaseConnection();
//         req.records = result;
//         next();
//       })
//       .catch((error) => {
//         _mysql.releaseConnection();
//         next(error);
//       });
//   } catch (e) {
//     next(e);
//   }
// };

//created by irfan: to updateVitalMasterHeader
let updateVitalMasterHeader = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_vitals_header` SET vitals_name=?,uom=?,general=?,display=?,record_status=?,\
      updated_date=?, updated_by=?  WHERE  `hims_d_vitals_header_id`=?;",
        values: [
          input.vitals_name,
          input.uom,
          input.general,
          input.display,
          input.record_status,
          new Date(),
          input.updated_by,
          input.hims_d_vitals_header_id,
        ],
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
    next(e);
  }
};

//created by irfan: to add vital detail
let addVitalMasterDetail = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_vitals_details` (vitals_header_id, gender, min_age, max_age, min_value, max_value, created_date, created_by, updated_date, updated_by)\
      VALUE(?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.vitals_header_id,
          input.gender,
          input.min_age,
          input.max_age,
          input.min_value,
          input.max_value,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by,
        ],
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
    next(e);
  }
};

//created by irfan: to getVitalMasterHeader
let getVitalMasterDetail = (req, res, next) => {
  let selectWhere = {
    vitals_header_id: "ALL",
  };
  try {
    const _mysql = new algaehMysql();

    let where = whereCondition(extend(selectWhere, req.query));

    _mysql
      .executeQuery({
        query:
          "select hims_d_vitals_details_id, vitals_header_id, gender, min_age, max_age, min_value, max_value FROM hims_d_vitals_details where record_status='A' AND" +
          where.condition +
          " order by vitals_header_id desc",
        values: where.values,
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
    next(e);
  }
};

//created by irfan: to deleteVitalMasterDetail
let deleteVitalMasterDetail = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_vitals_details SET  record_status='I' WHERE hims_d_vitals_details_id=?",
        values: [req.body.hims_d_vitals_details_id],
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
    next(e);
  }
};

//created by irfan: to updateVitalMasterDetail
let updateVitalMasterDetail = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);
    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_vitals_details` SET  vitals_header_id=?, gender=?, min_age=?, max_age=?, min_value=?, max_value=?,\
      updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vitals_details_id`=?;",
        values: [
          input.vitals_header_id,
          input.gender,
          input.min_age,
          input.max_age,
          input.min_value,
          input.max_value,
          new Date(),
          input.updated_by,
          input.hims_d_vitals_details_id,
        ],
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
    next(e);
  }
};

//created by irfan: to add
let addDepartmentVitalMap = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);

    const insurtColumns = ["vital_header_id", "created_by", "updated_by"];

    _mysql
      .executeQuery({
        query:
          "INSERT INTO hims_m_department_vital_mapping(" +
          insurtColumns.join(",") +
          ",`department_id`,created_date,updated_date) VALUES ?",
        values: [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body.vitals,
            newFieldToInsert: [input.department_id, new Date(), new Date()],
            req: req,
          }),
        ],
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
    next(e);
  }
};

//created by irfan: to
let getDepartmentVitalMap = (req, res, next) => {
  let selectWhere = {
    hims_m_department_vital_mapping_id: "ALL",
  };
  try {
    const _mysql = new algaehMysql();
    let where = whereCondition(extend(selectWhere, req.query));
    _mysql
      .executeQuery({
        query:
          "select hims_m_department_vital_mapping_id,department_id,vital_header_id FROM hims_m_department_vital_mapping where record_status='A' AND" +
          where.condition +
          " order by hims_m_department_vital_mapping_id desc",
        values: where.values,
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
    next(e);
  }
};

export default {
  addVitalMasterHeader,
  addVitalMasterDetail,
  getVitalMasterHeader,
  getVitalMasterDetail,
  // deleteVitalMasterHeader,
  deleteVitalMasterDetail,
  updateVitalMasterHeader,
  updateVitalMasterDetail,
  addDepartmentVitalMap,
  getDepartmentVitalMap,
  addExaminationType,
  updateExaminationType,
  getExaminationType,
  getExaminationDescription,
  addExaminationDescription,
  updateExaminationDescription,
  getExaminationCategory,
  addExaminationCategory,
  updateExaminationCategory,
};
