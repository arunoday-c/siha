"use strict";

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectDiet = function selectDiet(req, res, next) {
  var Diet = {
    hims_d_diet_master_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(Diet, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT * FROM `hims_d_diet_master` WHERE `record_status`='A' AND " + condition.condition + " " + pagePaging,
      values: condition.values
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  selectDiet: selectDiet
};
//# sourceMappingURL=dietmaster.js.map