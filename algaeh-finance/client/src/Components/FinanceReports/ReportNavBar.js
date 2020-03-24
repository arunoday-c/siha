import React from "react";

export default function ReportNavBar({ setSelected, selected }) {
  function selectedClass(report) {
    return report === selected ? "active" : "";
  }

  const REPORT_LIST = [
    {
      key: "BS",
      title: "Balance Sheet"
    },
    {
      key: "PL",
      title: "Profit and Loss"
    },
    {
      key: "TB",
      title: "Trail Balance"
    },
    {
      key: "AR",
      title: "AR Aging"
    },
    {
      key: "AP",
      title: "AP Aging"
    }
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
        {REPORT_LIST.map(item => (
          <li
            className={selectedClass(item.key)}
            onClick={() => setSelected(item.key)}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
