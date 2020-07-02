import React from "react";

export default function ReportNavBar({
  setSelected,
  selected,
  setSelectedFilter,
}) {
  function selectedClass(report) {
    return report === selected ? "active" : "";
  }

  const REPORT_LIST = [
    {
      key: "BS",
      title: "Balance Sheet",
    },
    {
      key: "PL",
      title: "Profit and Loss",
      children: [
        { key: "by_year", title: "Period" },
        { key: "by_center", title: "Cost Center" },
        { key: "total", title: "Total" },
      ],
    },
    {
      key: "TB",
      title: "Trail Balance",
    },
    {
      key: "AR",
      title: "AR Aging",
    },
    {
      key: "AP",
      title: "AP Aging",
    },
    {
      key: "CF",
      title: "Cashflow",
    },
    // {
    //   key: "PLCost",
    //   title: "Profit & Loss by Cost Center"
    // },
    // {
    //   key: "PLYear",
    //   title: "Profit & Loss by Month"
    // }
  ];

  return (
    <div className="col reportMenuSecLeft">
      <h6>Favourite Reports</h6>
      <ul className="menuListUl">
        {REPORT_LIST.map((item) => (
          <li className={selectedClass(item.key)}>
            <span onClick={() => setSelected(item.key)}>{item.title}</span>
            {RenderChildren(item.children, (selected) => {
              setSelected(item.key);
              setSelectedFilter({ filterKey: selected.key });
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
function RenderChildren(children, callBack) {
  if (children === undefined) {
    return null;
  } else {
    return (
      <ul>
        {children.map((item, index) => {
          return (
            <li key={index} onClick={() => callBack(item)}>
              {item.title}
            </li>
          );
        })}
      </ul>
    );
  }
}
