import React, { useState, useContext, useEffect } from "react";

import { Select, Checkbox } from "algaeh-react-components";
import { PortalSetupContext } from "./PortalSetupContext";
import "./PortalSetup.scss";
import { AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";
import { addOrUpdatePortalSetup } from "./events";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};
export default React.memo(function PortalGrid({
  gridData,
  //   setGridData,
  refetch,
  serviceTypes,
  portal_exists,
}) {
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  //   const [currentPage, setCurrentPage] = useState(1);

  const { portalState, setPortalState } = useContext(PortalSetupContext);
  // let allChecked = useRef(undefined);
  const selectAll = (e) => {
    const stats = e.target.checked === true ? "Y" : "N";
    let myState = [];

    myState = portalState.gridData.map((f) => {
      return { ...f, checked: stats, isDirty: f.id ? true : undefined };
    });
    setCheckAll(stats === "Y" ? STATUS.CHECK : STATUS.UNCHECK);
    setPortalState({ ...portalState, gridData: [...myState] });
    // const myState = portalState.gridData.map((f) => {
    //   return { ...f, checked: stats, isDirty: stats === "Y" ? true : false };
    // });

    // const hasUncheck = myState.filter((f) => {
    //   return f.checked === undefined || f.checked === "N";
    // });

    // const totalRecords = myState.length;
    // setCheckAll(
    //   totalRecords === hasUncheck.length
    //     ? "UNCHECK"
    //     : hasUncheck.length === 0
    //     ? "CHECK"
    //     : "INDETERMINATE"
    // );
    // setPortalState({ ...portalState, gridData: [...myState] });
  };
  // const selectToProcess = (row, e) => {
  //   const status = e.target.checked;
  //   row.checked = status;
  //   row["isDirty"] = status ? true : false;
  //   const records = portalState.gridData;
  //   const hasUncheck = records.filter((f) => {
  //     return f.checked === undefined || f.checked === false;
  //   });

  //   const totalRecords = records.length;
  //   let ckStatus =
  //     totalRecords === hasUncheck.length
  //       ? "UNCHECK"
  //       : hasUncheck.length === 0
  //       ? "CHECK"
  //       : "INDETERMINATE";
  //   if (ckStatus === "INDETERMINATE") {
  //     allChecked.indeterminate = true;
  //   } else {
  //     allChecked.indeterminate = false;
  //   }
  //   setCheckAll(ckStatus);
  //   setPortalState({ ...portalState, gridData: [...records] });
  //   // setGridData([...records]);
  // };

  return (
    <div className="portlet portlet-bordered margin-bottom-15">
      <div className="portlet-title">
        <div className="caption">
          <h3 className="caption-subject">Portal Corporate Lists</h3>
        </div>
        <div className="actions"></div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-12">
            <div id="CardMasterGrid_Cntr">
              <AlgaehDataGrid
                id="CardMasterGrid"
                datavalidate="data-validate='cardDiv'"
                columns={[
                  {
                    label: (
                      <Checkbox
                        indeterminate={checkAll === STATUS.INDETERMINATE}
                        checked={checkAll === STATUS.CHECK}
                        onChange={selectAll}
                        disabled={portalState?.portal_exists === "N"}
                      ></Checkbox>
                    ),
                    fieldName: "select",
                    displayTemplate: (row) => {
                      return (
                        <CheckBoxPlot
                          row={row}
                          portalState={portalState}
                          fullData={portalState?.gridData ?? []}
                          setCheckAll={setCheckAll}
                        />
                      );
                    },
                    others: {
                      maxWidth: 50,
                      filterable: false,
                      sortable: false,
                    },
                  },
                  {
                    label: "Action",
                    fieldName: "",
                    displayTemplate: (row) => {
                      return (
                        <i
                          className="fas fa-sync-alt"
                          style={{
                            pointerEvents:
                              portalState?.portal_exists === "N" ? "none" : "",
                          }}
                          onClick={() => {
                            addOrUpdatePortalSetup(
                              { filteredArray: [row] },
                              refetch
                            );
                          }}
                        ></i>
                      );
                    },
                  },
                  {
                    fieldName: "insurance_sub_code",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Corporate Code" }} />
                    ),
                  },
                  {
                    fieldName: "insurance_sub_name",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Corporate Company Name" }}
                      />
                    ),
                    filterable: true,
                  },
                  {
                    fieldName: "user_id",
                    label: <AlgaehLabel label={{ forceLabel: "Username" }} />,
                  },
                  {
                    fieldName: "effective_end_date",
                    label: <AlgaehLabel label={{ forceLabel: "Valid Upto" }} />,
                  },
                  {
                    fieldName: "last_sync",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Last Sync Date" }} />
                    ),
                  },
                  {
                    fieldName: "service_type",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Service Type" }} />
                    ),

                    displayTemplate: (row) => {
                      let array = JSON.parse(row.service_types);
                      return (
                        <Select
                          {...{
                            mode: "multiple",
                            style: {
                              width: "100%",
                            },
                            data_role: "multipleSelectList",
                            name: "service_type",
                            value: array ? array : undefined,
                            options: serviceTypes,
                            onChange: (e) => {
                              row["isDirtyUpdate"] = true;
                              row.service_type = e;
                            },
                            optionFilterProp: "children",
                            // onSearch: onSearch,
                            disabled: portal_exists === "N",
                            filterOption: (input, option) => {
                              return (
                                option.label
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            },

                            placeholder: "Select Service...",
                            // maxTagCount: "responsive",
                          }}
                        />
                      );
                    },
                  },
                ]}
                rowUniqueId="hims_d_promotion_id"
                data={portalState?.gridData ?? []}
                pagination={true}
                isFilterable={true}
                // pageOptions={{ rows: 10, page: currentPage }}
                // pageEvent={(page) => {
                //   setCurrentPage(page);
                // }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
/**
 * For checkboxes
 * @param {row} Object
 * @param {portalState} Object
 * @param {fullData} Array
 * @returns Component
 */
function CheckBoxPlot({ row, portalState, fullData, setCheckAll }) {
  const [checked, setChecked] = useState("N");
  useEffect(() => {
    setChecked(row.checked);
  }, [row.checked]);
  return (
    <input
      type="checkbox"
      checked={checked === "Y" ? true : false}
      onChange={(e) => {
        const check = e.target.checked === true ? "Y" : "N";

        if (row.id) {
          row.isDirty = true;
        }
        row.checked = check;

        const hasUncheck = fullData.filter((f) => {
          return f.checked === undefined || f.checked === "N";
        });
        const hasChecks = fullData.filter((f) => f.checked === "Y");
        setCheckAll(
          fullData.length === hasChecks.length
            ? STATUS.CHECK
            : fullData.length === hasUncheck.length
            ? STATUS.UNCHECK
            : STATUS.INDETERMINATE
        );
        setChecked(check);
      }}
      disabled={portalState?.portal_exists === "N"}
    />
  );
}
React.memo(CheckBoxPlot);
