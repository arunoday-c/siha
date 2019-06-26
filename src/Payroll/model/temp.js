if (options.result.length > 0) {
  input["sub_department_name"] = options.result[0]["sub_department_name"];
  input["hospital_name"] = options.result[0]["hospital_name"];
  MONTHS.forEach(month => {
    if (month.value == input.month) input["month"] = month.name;
  });
} else {
  input = {};
}
