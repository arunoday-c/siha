import React, { useState, useRef, useContext } from "react";

import { Select } from "algaeh-react-components";
import { PortalSetupContext } from "./PortalSetupContext";
import "./PortalSetup.scss";
import { AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};
export default function PortalGrid({
  gridData,
  //   setGridData,
  serviceTypes,
  portal_exists,
}) {
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  //   const [currentPage, setCurrentPage] = useState(1);
  const { portalState, setPortalState } = useContext(PortalSetupContext);
  let allChecked = useRef(undefined);
  const selectAll = (e) => {
    const staus = e.target.checked;

    const myState = portalState.gridData.map((f) => {
      return { ...f, checked: staus, isDirty: staus ? true : false };
    });

    const hasUncheck = myState.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });

    const totalRecords = myState.length;
    setCheckAll(
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE"
    );
    setPortalState({ ...portalState, gridData: [...myState] });
  };
  const selectToProcess = (row, e) => {
    const status = e.target.checked;
    row.checked = status;
    row["isDirty"] = status ? true : false;
    const records = portalState.gridData;
    const hasUncheck = records.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });

    const totalRecords = records.length;
    let ckStatus =
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE";
    if (ckStatus === "INDETERMINATE") {
      allChecked.indeterminate = true;
    } else {
      allChecked.indeterminate = false;
    }
    setCheckAll(ckStatus);
    setPortalState({ ...portalState, gridData: [...records] });
    // setGridData([...records]);
  };
  const checkBoxPlot = (row) => {
    return (
      <input
        type="checkbox"
        //   checked={row.checked}
        defaultChecked={row.id === null ? false : true}
        onChange={(e) => selectToProcess(row, e)}
        disabled={portalState?.portal_exists === "N"}
      />
    );
  };
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
                      <input
                        type="checkbox"
                        defaultChecked={checkAll === "CHECK" ? true : false}
                        ref={(input) => {
                          allChecked = input;
                        }}
                        onChange={selectAll}
                        disabled={portalState?.portal_exists === "N"}
                      />
                    ),
                    fieldName: "select",
                    displayTemplate: (row) => {
                      return (
                        // <input
                        //   type="checkbox"
                        //   //   checked={row.checked}
                        //   defaultChecked={row.id === null ? false : true}
                        //   onChange={(e) => selectToProcess(row, e)}
                        //   disabled={portalState?.portal_exists === "N"}
                        // />
                        checkBoxPlot(row)
                      );
                    },
                    others: {
                      maxWidth: 50,
                      filterable: false,
                      sortable: false,
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
}
