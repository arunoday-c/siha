import utils from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";

const { debugLog } = logUtils;
const {
  whereCondition,
  releaseDBConnection,
  selectStatement,
  deleteRecord
} = utils;

//Section
let selectSection = (req, res, next) => {
  let labSection = {
    hims_d_lab_section_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    let condition = whereCondition(extend(labSection, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_d_lab_section` WHERE `record_status`='A' AND " +
          condition.condition +
          "order by hims_d_lab_section_id desc",
        values: condition.values
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

let insertSection = (req, res, next) => {
  let labSection = {
    hims_d_lab_section_id: null,
    description: null,
    section_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(labSection, req.body);
    connection.query(
      "INSERT INTO `hims_d_lab_section` (`description`, \
        `created_by` ,`created_date`,`section_status`) \
     VALUES ( ?, ?, ?, ?)",
      [
        inputParam.description,
        inputParam.created_by,
        new Date(),
        inputParam.section_status
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};

let updateSection = (req, res, next) => {
  let labSection = {
    hims_d_lab_section_id: null,
    description: null,
    section_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(labSection, req.body);
    connection.query(
      "UPDATE `hims_d_lab_section` \
       SET `description`=?, `updated_by`=?, `updated_date`=?,section_status=? \
       WHERE `record_status`='A' and `hims_d_lab_section_id`=?",
      [
        inputParam.description,
        inputParam.updated_by,
        new Date(),
        inputParam.section_status,
        inputParam.hims_d_lab_section_id
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};
let deleteSection = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_lab_section",
        id: req.body.hims_d_lab_section_id,
        query:
          "UPDATE hims_d_lab_section SET  record_status='I', \
           updated_by=?,updated_date=? WHERE hims_d_lab_section_id=?",
        values: [
          req.body.updated_by,
          new Date(),
          req.body.hims_d_lab_section_id
        ]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//Container
let selectContainer = (req, res, next) => {
  let labSection = {
    hims_d_lab_container_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    let condition = whereCondition(extend(labSection, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_d_lab_container` WHERE `record_status`='A' AND " +
          condition.condition +
          "order by hims_d_lab_container_id desc",
        values: condition.values
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

let insertContainer = (req, res, next) => {
  let labContainer = {
    hims_d_lab_container_id: null,
    description: null,
    container_id: null,
    container_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(labContainer, req.body);
    connection.query(
      "INSERT INTO `hims_d_lab_container` (`description`, `container_id`, \
          `created_by` ,`created_date`,`container_status`) \
       VALUES ( ?, ?, ?, ?, ?)",
      [
        inputParam.description,
        inputParam.container_id,
        inputParam.created_by,
        new Date(),
        inputParam.container_status
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};

let updateContainer = (req, res, next) => {
  let labSection = {
    hims_d_lab_container_id: null,
    container_id: null,
    description: null,
    container_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(labSection, req.body);
    connection.query(
      "UPDATE `hims_d_lab_container` \
         SET `description`=?, `container_id`=?,`updated_by`=?, `updated_date`=?,container_status=? \
         WHERE `record_status`='A' and `hims_d_lab_container_id`=?",
      [
        inputParam.description,
        inputParam.container_id,
        inputParam.updated_by,
        new Date(),
        inputParam.container_status,
        inputParam.hims_d_lab_container_id
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};
let deleteContainer = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_lab_container",
        id: req.body.hims_d_lab_container_id,
        query:
          "UPDATE hims_d_lab_container SET  record_status='I', \
             updated_by=?,updated_date=? WHERE hims_d_lab_container_id=?",
        values: [
          req.body.updated_by,
          new Date(),
          req.body.hims_d_lab_container_id
        ]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//Specimen
let selectSpecimen = (req, res, next) => {
  let labSpecimen = {
    hims_d_lab_specimen_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    let condition = whereCondition(extend(labSpecimen, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_d_lab_specimen` WHERE `record_status`='A' AND " +
          condition.condition +
          "order by hims_d_lab_specimen_id desc",
        values: condition.values
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

let insertSpecimen = (req, res, next) => {
  let labSpecimen = {
    hims_d_lab_specimen_id: null,
    description: null,
    storage_type: null,
    specimen_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    debugLog("Body: ", req.body);
    let inputParam = extend(labSpecimen, req.body);
    debugLog("Input: ", inputParam);
    connection.query(
      "INSERT INTO `hims_d_lab_specimen` (`description`, `storage_type`,\
          `created_by` ,`created_date`,`specimen_status`) \
       VALUES ( ?, ?, ?, ?, ?)",
      [
        inputParam.description,
        inputParam.storage_type,
        inputParam.created_by,
        new Date(),
        inputParam.specimen_status
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};

let updateSpecimen = (req, res, next) => {
  let labSpecimen = {
    hims_d_lab_specimen_id: null,
    description: null,
    specimen_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(labSpecimen, req.body);
    connection.query(
      "UPDATE `hims_d_lab_specimen` \
         SET `description`=?, `storage_type` = ?,`updated_by`=?, `updated_date`=?,`specimen_status`=? \
         WHERE `record_status`='A' and `hims_d_lab_specimen_id`=?",
      [
        inputParam.description,
        inputParam.storage_type,
        inputParam.updated_by,
        new Date(),
        inputParam.specimen_status,
        inputParam.hims_d_lab_specimen_id
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};
let deleteSpecimen = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_lab_specimen",
        id: req.body.hims_d_lab_specimen_id,
        query:
          "UPDATE hims_d_lab_specimen SET  record_status='I', \
             updated_by=?,updated_date=? WHERE hims_d_lab_specimen_id=?",
        values: [
          req.body.updated_by,
          new Date(),
          req.body.hims_d_lab_specimen_id
        ]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//Analytes
let selectAnalytes = (req, res, next) => {
  let labAnalytes = {
    hims_d_lab_analytes_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    let condition = whereCondition(extend(labAnalytes, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_d_lab_analytes` WHERE `record_status`='A' AND " +
          condition.condition +
          "order by hims_d_lab_analytes_id desc",
        values: condition.values
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

let insertAnalytes = (req, res, next) => {
  let labAnalytes = {
    hims_d_lab_analytes_id: null,
    description: null,
    analyte_type: null,
    analyte_status: "A",
    result_unit: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    debugLog("Body: ", req.body);
    let inputParam = extend(labAnalytes, req.body);
    debugLog("Input: ", inputParam);
    connection.query(
      "INSERT INTO `hims_d_lab_analytes` (`description`, `analyte_type`,`result_unit`,\
            `created_by` ,`created_date`,`analyte_status`) \
         VALUES ( ?, ?, ?, ?, ?, ?)",
      [
        inputParam.description,
        inputParam.analyte_type,
        inputParam.result_unit,
        inputParam.created_by,
        new Date(),
        inputParam.analyte_status
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};

let updateAnalytes = (req, res, next) => {
  let labAnalytes = {
    hims_d_lab_analytes_id: null,
    description: null,
    analyte_status: "A",
    analyte_type: null,
    result_unit: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(labAnalytes, req.body);
    connection.query(
      "UPDATE `hims_d_lab_analytes` \
           SET `description`=?, `analyte_type` = ?, `result_unit` = ?,`updated_by`=?, `updated_date`=?,`analyte_status`=? \
           WHERE `record_status`='A' and `hims_d_lab_analytes_id`=?",
      [
        inputParam.description,
        inputParam.analyte_type,
        inputParam.result_unit,
        inputParam.updated_by,
        new Date(),
        inputParam.analyte_status,
        inputParam.hims_d_lab_analytes_id
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};
let deleteAnalytes = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_lab_analytes",
        id: req.body.hims_d_lab_analytes_id,
        query:
          "UPDATE hims_d_lab_analytes SET  record_status='I', \
               updated_by=?,updated_date=? WHERE hims_d_lab_analytes_id=?",
        values: [
          req.body.updated_by,
          new Date(),
          req.body.hims_d_lab_analytes_id
        ]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//TestCategory
let selectTestCategory = (req, res, next) => {
  let labTestCategory = {
    hims_d_test_category_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    let condition = whereCondition(extend(labTestCategory, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_d_test_category` WHERE `record_status`='A' AND " +
          condition.condition +
          "order by hims_d_test_category_id desc",
        values: condition.values
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

let insertTestCategory = (req, res, next) => {
  let labTestCategory = {
    hims_d_test_category_id: null,
    category_name: null,
    category_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  debugLog("Catey: ");
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    debugLog("Body: ", req.body);
    let inputParam = extend(labTestCategory, req.body);
    debugLog("Input: ", inputParam);
    connection.query(
      "INSERT INTO `hims_d_test_category` (`category_name`,\
            `created_by` ,`created_date`,`category_status`) \
         VALUES ( ?, ?, ?, ?)",
      [
        inputParam.category_name,
        inputParam.created_by,
        new Date(),
        inputParam.category_status
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};

let updateTestCategory = (req, res, next) => {
  let labTestCategory = {
    hims_d_test_category_id: null,
    category_name: null,
    category_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(labTestCategory, req.body);
    connection.query(
      "UPDATE `hims_d_test_category` \
           SET `category_name`=?, `updated_by`=?, `updated_date`=?,`category_status`=? \
           WHERE `record_status`='A' and `hims_d_test_category_id`=?",
      [
        inputParam.category_name,
        inputParam.updated_by,
        new Date(),
        inputParam.category_status,
        inputParam.hims_d_test_category_id
      ],
      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      }
    );
  });
};
let deleteTestCategory = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_test_category",
        id: req.body.hims_d_test_category_id,
        query:
          "UPDATE hims_d_test_category SET  record_status='I', \
               updated_by=?,updated_date=? WHERE hims_d_test_category_id=?",
        values: [
          req.body.updated_by,
          new Date(),
          req.body.hims_d_test_category_id
        ]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

export default {
  selectSection,
  insertSection,
  updateSection,
  deleteSection,
  selectContainer,
  insertContainer,
  updateContainer,
  deleteContainer,
  selectSpecimen,
  insertSpecimen,
  updateSpecimen,
  deleteSpecimen,
  selectAnalytes,
  insertAnalytes,
  updateAnalytes,
  deleteAnalytes,
  selectTestCategory,
  insertTestCategory,
  updateTestCategory,
  deleteTestCategory
};
