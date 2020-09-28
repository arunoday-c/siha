import moment from "moment";

const PERIOD = {
  dataSource: {
    data: [
      {
        name: "This Month till Date",
        value: "TMTD",
        depend: {
          type: "RANGE",
          format: "YYYY-MM",
          mode: ["month", "month"],
          value: [moment().startOf("month"), moment()],
        },
      },
      {
        name: "Last month",
        value: "LM",
        depend: {
          type: "RANGE",
          mode: ["month", "month"],
          format: "YYYY-MM",
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
      {
        name: "Month",
        value: "by_month",
      },
    ],
    valueField: "value",
    textField: "name",
  },
};
const LEVELS = {
  dataSource: {
    data: [
      {
        name: "All",
        value: "999",
      },
      {
        name: "One",
        value: "1",
      },
      {
        name: "Two",
        value: "2",
      },
      {
        name: "Three",
        value: "3",
      },
      {
        name: "Four",
        value: "4",
      },
      {
        name: "Five",
        value: "5",
      },
    ],
    valueField: "value",
    textField: "name",
  },
};
const ACCOUNTS = {
  dataSource: {
    data: [
      { name: "ALL", value: "ALL" },
      {
        name: "ASSETS",
        value: "1",
      },
      {
        name: "LIABILITIES",
        value: "2",
      },
      {
        name: "INCOME",
        value: "4",
      },
      {
        name: "CAPITAL",
        value: "3",
      },
      {
        name: "EXPENSE",
        value: "5",
      },
    ],
    valueField: "value",
    textField: "name",
  },
};
export default { PERIOD, BASEDON, LEVELS, ACCOUNTS };
