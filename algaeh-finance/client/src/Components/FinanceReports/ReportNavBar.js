import React, { useEffect, useState } from "react";
import { getItem, tokenDecode } from "algaeh-react-components";
export default function ReportNavBar({
  REPORT_LIST,
  setSelected,
  selected,
  setSelectedFilter,
  selectedFilter,
}) {
  const [enableCashFlow, setEnableCashFlow] = useState(false);
  useEffect(() => {
    (async () => {
      debugger;
      const tokenString = await getItem("token");
      const token = tokenDecode(tokenString);
      if (token.role_type === "SU") {
        setEnableCashFlow(true);
      } else {
        if (token.secure_modules) {
          const hasRecord = token.secure_modules
            .split(",")
            .find((f) => String(f).toUpperCase() === "CASHFLOW");
          if (hasRecord) {
            setEnableCashFlow(true);
          } else {
            setEnableCashFlow(false);
          }
        }
      }
    })();
  }, []);
  function selectedClass(report) {
    return report === selected ? "active" : "";
  }

  return (
    <div className="col reportMenuSecLeft">
      <h6>Favourite Reports</h6>
      <ul className="menuListUl">
        {REPORT_LIST.map((item, index) => {
          if (item.secureModule === "CASHFLOW" && enableCashFlow === false) {
            return null;
          }
          return (
            <li key={index}>
              <span
                className={selectedClass(item.key)}
                onClick={() => {
                  setSelected(item.key);
                  setSelectedFilter({});
                }}
              >
                {item.title}
              </span>
              {RenderChildren(
                item.children,
                (selected) => {
                  setSelected(item.key);
                  setSelectedFilter({ filterKey: selected.key });
                },
                selectedFilter
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
function RenderChildren(children, callBack, selectedFilter) {
  if (children === undefined) {
    return null;
  } else {
    return (
      <ul>
        {children.map((item, index) => {
          return (
            <li
              key={index}
              className={passClassToActive(selectedFilter, item.key)}
            >
              <span onClick={() => callBack(item)}>{item.title}</span>
            </li>
          );
        })}
      </ul>
    );
  }
}
function passClassToActive(selectedFilter, key) {
  const { filterKey } = selectedFilter;
  if (filterKey === undefined) {
    return "";
  }
  return filterKey === key ? "active-sub-menu" : "";
}
