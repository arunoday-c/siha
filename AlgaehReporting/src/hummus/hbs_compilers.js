import path from "path";
import hbs from "handlebars";
import fs from "fs-extra";
import _ from "lodash";
export async function compile(templateName, data) {
  try {
    const file = path.join(
      process.cwd(),
      "algaeh_report_tool/templates",
      `${templateName}.hbs`
    );
    const html = await fs.readFile(file, "utf-8");
    return await hbs.compile(html)(data);
  } catch (error) {
    return `<center>${JSON.stringify(error)}</center>`;
  }
}
hbs.registerHelper("sumOf", function(data, sumby, callBack) {
  data = Array.isArray(data) ? data : [];
  const sumof = _.sumBy(data, function(s) {
    return s[sumby];
  });
  if (typeof callBack == "function") callBack(sumof);
  else {
    return sumof;
  }
});
hbs.registerHelper("countOf", function(data) {
  data = Array.isArray(data) ? data : [];
  return data.length;
});
hbs.registerHelper("if", function(value1, value2, options) {
  if (value1 == value2) return options.fn(this);
  else return options.inverse(this);
});
hbs.registerHelper("ifCond", function(v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

hbs.registerHelper("dateTime", function(value, type) {
  type = type || "date";

  if (value == null) {
    return "";
  }
  if (value != "") {
    const dt = value instanceof Date && !isNaN(value);
    if (!dt) {
      return value;
    }
    if (type == "date") {
      return moment(value).format("DD-MM-YYYY");
    } else {
      return moment(value).format("hh:mm A");
    }
  } else {
    return value;
  }
});

hbs.registerHelper("capitalization", function(value) {
  return _.startCase(_.toLower(value));
});
//created by irfan
hbs.registerHelper("inc", function(value, options) {
  return parseInt(value) + 1;
});

//created by irfan:to check array has elements
hbs.registerHelper("hasElement", function(conditional, options) {
  if (conditional.length > 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
//created by irfan:
hbs.registerHelper("dynamicSalary", function(searchKey, inputArray, comp_type) {
  if (comp_type == "E") {
    const obj = inputArray.find(item => {
      return item.earnings_id == searchKey;
    });
    return obj ? obj.amount : "BBB";
  } else if (comp_type == "D") {
    const obj = inputArray.find(item => {
      return item.deductions_id == searchKey;
    });
    return obj ? obj.amount : "BBB";
  } else if (comp_type == "C") {
    const obj = inputArray.find(item => {
      return item.contributions_id == searchKey;
    });
    return obj ? obj.amount : "BBB";
  }
});

hbs.registerHelper("importStyle", function(styleSheetName) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${styleSheetName}`
  );
  const style = fs.readFileSync(fullPath, "utf-8");
  return "<style type='text/css'>" + style + "</style>";
});

hbs.registerHelper("loadPage", function(filePath, data) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${filePath}`
  );
  const html = fs.readFileSync(fullPath, "utf-8");
  return hbs.compile(html)(data);
});

hbs.registerHelper("imageSource", function(filePath) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${filePath}`
  );
  const _extention = path.extname(fullPath).replace(".", "");
  const img = fs.readFileSync(fullPath, "base64");
  return "data:image/" + _extention + ";base64," + img;
});

hbs.registerHelper("groupBy", function(data, groupby) {
  const groupBy = _.chain(data)
    .groupBy(groupby)
    .map(function(detail, key) {
      return {
        [groupby]: key,
        groupDetail: detail
      };
    })
    .value();

  return groupBy;
});
hbs.registerHelper("currentDateTime", function(type) {
  if (type == null || type == "") {
    return moment().format("DD-MM-YYYY");
  } else if (type == "time") {
    return moment().format("hh:mm A");
  } else {
    return moment().format("DD-MM-YYYY");
  }
});
hbs.registerHelper("firstElement", function(array, index, fieldName) {
  array = array || [];
  index = index || 0;
  if (array.length > 0) {
    return array[index][fieldName];
  } else {
    return null;
  }
});
hbs.registerHelper("consoleLog", function(data) {
  if (typeof data == "string") {
    return data;
  } else {
    return JSON.stringify(data);
  }
});

hbs.registerHelper("imageUrl", function(
  filename,
  index,
  name,
  stringToappend,
  filetype,
  reqHeader
) {
  const host = reqHeader["host"].split(":")[0];

  if (Array.isArray(filename)) {
    if (filename.length > 0) {
      stringToappend = stringToappend || "";
      const imageLocation =
        "http://" +
        host +
        ":3006/api/v1/Document/get?destinationName=" +
        filename[index][name] +
        stringToappend +
        "&fileType=" +
        filetype;

      return imageLocation;
    } else {
      return "";
    }
  } else {
    return (
      "http://" +
      host +
      ":3006/api/v1/Document/get?destinationName=" +
      filename +
      "&fileType=" +
      filetype
    );
  }
});

hbs.registerHelper("barcode", function(type, text, includetext) {
  type = type || "code128";
  includetext = includetext === undefined ? `&includetext` : ``;
  return `http://localhost:3018/barcode?bcid=${type}&text=${text}${includetext}&guardwhitespace`;
});

hbs.registerHelper("commentBreakUp", function(comment_data) {
  if (comment_data === "" || comment_data === null) {
    return [];
  } else {
    return comment_data.split("<br/>");
  }
});
