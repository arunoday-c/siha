import React, { memo, useState, useEffect } from "react";
import "./CreateBatch.scss";
import { Checkbox, AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";
// import DisplayComponent from "./DisplayComponent";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};

export default memo(function BatchDetails({ batch_list, updateState }) {
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  const [currentPage, setCurrentPage] = useState(1);

  const selectAll = (e) => {
    const stats = e.target.checked === true ? "Y" : "N";
    let myState = [];

    debugger;
    myState = batch_list.map((f) => {
      return { ...f, checked: stats, isDirty: f.id ? true : undefined };
    });
    setCheckAll(stats === "Y" ? STATUS.CHECK : STATUS.UNCHECK);
    updateState(myState);
  };

  return (
    <div className="col-12">
      <div className="portlet portlet-bordered margin-bottom-15">
        {/* <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Portal Lab List</h3>
                </div>
              </div> */}
        <div className="portlet-body" id="batchGenerationGrid">
          <AlgaehDataGrid
            columns={[
              {
                label: (
                  <Checkbox
                    indeterminate={checkAll === STATUS.INDETERMINATE}
                    checked={checkAll === STATUS.CHECK}
                    onChange={selectAll}
                  ></Checkbox>
                ),
                fieldName: "select",
                displayTemplate: (row) => {
                  return (
                    <CheckBoxPlot
                      row={row}
                      fullData={batch_list}
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
              // {
              //   label: "Action",
              //   fieldName: "",
              //   displayTemplate: (row) => {
              //     return (
              //       <i
              //         className="fas fa-sync-alt"
              //         style={{
              //           pointerEvents:
              //             portalState?.portal_exists === "N" ? "none" : "",
              //         }}
              //         onClick={() => {
              //           addOrUpdatePortalSetup(
              //             { filteredArray: [row] },
              //             refetch
              //           );
              //         }}
              //       ></i>
              //     );
              //   },
              // },
              {
                fieldName: "full_name",
                label: <AlgaehLabel label={{ fieldName: "Patient Name" }} />,
                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
              {
                fieldName: "primary_id_no",
                label: <AlgaehLabel label={{ forceLabel: "Patient ID" }} />,

                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
              {
                fieldName: "lab_id_number",

                label: <AlgaehLabel label={{ forceLabel: "Lab ID Number" }} />,

                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
              {
                fieldName: "test_name",
                label: <AlgaehLabel label={{ fieldName: "Test Name" }} />,
                others: {
                  // filterable: true,
                  // sortable: true,
                },
                filterable: true,
                sortable: true,
              },
            ]}
            data={batch_list}
            pagination={true}
            pageOptions={{ rows: 50, page: currentPage }}
            pageEvent={(page) => {
              setCurrentPage(page);
            }}
            isFilterable={true}
            noDataText="No data available for selected period"
          />
        </div>
      </div>

      {/* <div className="CreateBatchList">
        <ul>
          <li>
            <p className="actionSec">
              
            </p>
            <p class="valueSec">
              <span>
                <small>Patient Full Name</small>
              </span>
              <span>
                <small>Test Name</small>
              </span>
              <span>
                <small>Lab ID No.</small>
              </span>
              <span>
                <small>Primary ID No.</small>
              </span>
            </p>
          </li>
          {batch_list.map((item) => {
            return (
              <DisplayComponent
                key={item.id_number}
                item={item}
                deleteState={deleteState}
              />
            );
          })}
        </ul>
      </div> */}
      {/* <div className="portlet">
        <div className="portlet-body">
          <div className="row">
            <div className="col-12" style={{ textAlign: "right" }}>
              <div className="row">
                <div className="col-9"></div>

                <div className="col-3">
                  <label className="style_Label ">No.of Test Added</label>
                  <h6>{batch_list.length}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
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
function CheckBoxPlot({ row, fullData, setCheckAll }) {
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
    />
  );
}
React.memo(CheckBoxPlot);
