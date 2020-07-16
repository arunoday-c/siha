import moment from "moment";

const PERIOD = {
  dataSource: {
    data: [
      {
        name: "This Month till Date",
        value: "TMTD",
        depend: {
          type: "RANGE",
          value: [moment().startOf("month"), moment()],
        },
      },
      {
        name: "Last month",
        value: "LM",
        depend: {
          type: "RANGE",
          value: [
            moment().subtract(1, "months").startOf("month"),
            moment().subtract(1, "months").endOf("month"),
          ],
          title: "RANGE",
        },
      },
      {
        name: "Week till Date",
        value: "WTD",
        depend: {
          type: "RANGE",
          value: [moment().startOf("week"), moment()],
          title: "RANGE",
        },
      },
      {
        name: "Current Year",
        value: "CY",
        depend: {
          type: "YEAR",
          value: moment().year(moment().year()).startOf("year"),
          title: "Year",
        },
      },
      {
        name: "Current Year till Date",
        value: "CYTD",
        depend: {
          type: "RANGE",
          value: [moment().year(moment().year()).startOf("year"), moment()],
          title: "RANGE",
        },
      },

      {
        name: "Custom",
        value: "CU",
        depend: {
          type: "Range",
          value: [],
          title: "Custom Range",
        },
      },
    ],
    valueField: "value",
    textField: "name",
  },
};
const BASEDON = {
  dataSource: {
    data: [
      {
        name: "Period",
        value: "by_year",
      },
      {
        name: "Cost Center",
        value: "by_center",
      },
      {
        name: "Total",
        value: "total",
      },
    ],
    valueField: "value",
    textField: "name",
  },
};

export default { PERIOD, BASEDON };
