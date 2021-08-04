import React, { memo, useRef, useState } from "react";
import { swalMessage } from "../../../utils/algaehApiCall";
import ActionControles from "./ActionControles";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehAutoComplete,
  DatePicker,
} from "algaeh-react-components";
import variableJson from "../../../utils/GlobalVariables.json";
import moment from "moment";

const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};

export default memo(function SampleCollectionList({
  hospital_id,
  portal_exists,
  updateState,
  test_details,
  showCheckBoxColumn,
  updateTestDetails,
  labspecimen,
  labcontainer,
  userdrtails,
  forceUpdate,
}) {
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  let allChecked = useRef(undefined);

  const selectAll = (e) => {
    const staus = e.target.checked;
    const myState = test_details.map((f) => {
      return { ...f, checked: staus };
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
    updateTestDetails([...myState]);
  };

  const selectToGenerateBarcode = (row, e) => {
    const status = e.target.checked;
    row.checked = status;
    const records = test_details;
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
    updateTestDetails([...records]);
  };

  const manualColumns = showCheckBoxColumn
    ? {
        label: (
          <input
            type="checkbox"
            defaultChecked={checkAll === "CHECK" ? true : false}
            ref={(input) => {
              allChecked = input;
            }}
            onChange={selectAll}
          />
        ),
        fieldName: "select",
        displayTemplate: (row) => {
          return (
            <input
              type="checkbox"
              checked={row.checked}
              onChange={(e) => selectToGenerateBarcode(row, e)}
            />
          );
        },
        others: {
          maxWidth: 50,
          filterable: false,
          sortable: false,
        },
      }
    : null;

  return (
    <AlgaehDataGrid
      columns={[
        manualColumns,
        {
          fieldName: "action",
          label: <AlgaehLabel label={{ fieldName: "action" }} />,
          displayTemplate: (row) => {
            return (
              <ActionControles
                row={row}
                hospital_id={hospital_id}
                portal_exists={portal_exists}
                updateState={updateState}
                test_details={test_details}
              />
            );
          },

          others: {
            maxWidth: 100,
            // resizable: false,
            style: { textAlign: "center" },
          },
        },

        {
          fieldName: "billed",
          label: <AlgaehLabel label={{ fieldName: "billed" }} />,

          displayTemplate: (row) => {
            return row.billed === "Y" ? (
              <span className="badge badge-success">Billed</span>
            ) : (
              <span className="badge badge-danger">Not Billed</span>
            );
          },

          // displayTemplate: (row) => {
          //   return row.billed === "N"
          //     ? "Not Billed"
          //     : "Billed";
          // },
          editorTemplate: (row) => {
            return row.billed === "N" ? "Not Billed" : "Billed";
          },
          filterable: true,
          filterType: "choices",
          choices: [
            {
              name: "Not Billed",
              value: "N",
            },
            {
              name: "Billed",
              value: "Y",
            },
          ],
          others: {
            // resizable: false,
            style: { textAlign: "center" },
          },
        },
        {
          fieldName: "collected",
          label: <AlgaehLabel label={{ fieldName: "collected" }} />,
          filterable: true,
          filterType: "choices",
          choices: [
            {
              name: "No",
              value: "N",
            },
            {
              name: "Yes",
              value: "Y",
            },
          ],
          displayTemplate: (row) => {
            return row.collected === "Y" ? (
              <span className="badge badge-success">Yes</span>
            ) : (
              <span className="badge badge-danger">No</span>
            );
          },
          editorTemplate: (row) => {
            return row.collected === "Y" ? (
              <span className="badge badge-success">Yes</span>
            ) : (
              <span className="badge badge-danger">No</span>
            );
          },
        },
        {
          fieldName: "test_type",
          label: <AlgaehLabel label={{ fieldName: "proiorty" }} />,
          displayTemplate: (row) => {
            return <span>{row.test_type === "S" ? "Stat" : "Routine"}</span>;
          },
          editorTemplate: (row) => {
            return <span>{row.test_type === "S" ? "Stat" : "Routine"}</span>;
          },
          disabled: true,
          filterable: true,
          filterType: "choices",
          choices: [
            {
              name: "Stat",
              value: "S",
            },
            {
              name: "Routine",
              value: "R",
            },
          ],
          others: {
            // resizable: false,
            style: { textAlign: "center" },
          },
        },
        {
          fieldName: "service_code",
          label: <AlgaehLabel label={{ forceLabel: "Test Code" }} />,
          editorTemplate: (row) => {
            return row.service_code;
          },
          filterable: true,
          others: {
            style: { textAlign: "center" },
          },
        },
        {
          fieldName: "service_name",
          label: <AlgaehLabel label={{ forceLabel: "Test Name" }} />,
          editorTemplate: (row) => {
            return row.service_name;
          },
          filterable: true,
          others: {
            minWidth: 250,

            style: { textAlign: "left" },
          },
        },
        {
          fieldName: "sample_id",
          label: <AlgaehLabel label={{ fieldName: "specimen_name" }} />,
          displayTemplate: (row) => {
            let display =
              labspecimen === undefined
                ? []
                : labspecimen.filter(
                    (f) => f.hims_d_lab_specimen_id === row.sample_id
                  );
            return row.collected === "Y" || row.billed === "N" ? (
              <span>
                {display !== null && display.length !== 0
                  ? display[0].SpeDescription
                  : ""}
              </span>
            ) : (
              <AlgaehAutoComplete
                div={{ className: "noLabel" }}
                selector={{
                  name: "sample_id",
                  className: "select-fld",
                  value: row.sample_id,
                  dataSource: {
                    textField: "SpeDescription",
                    valueField: "hims_d_lab_specimen_id",
                    data: labspecimen,
                  },
                  updateInternally: true,
                  onChange: (e, value) => {
                    row.sample_id = value;
                    forceUpdate(row);

                    // onchangegridcol(row, e);
                  },
                  onClear: (e) => {
                    row.sample_id = null;
                    forceUpdate(row);
                  },
                }}
              />
            );
          },
          editorTemplate: (row) => {
            let display =
              labspecimen === undefined
                ? []
                : labspecimen.filter(
                    (f) => f.hims_d_lab_specimen_id === row.sample_id
                  );
            return row.collected === "Y" || row.billed === "N" ? (
              <span>
                {display !== null && display.length !== 0
                  ? display[0].SpeDescription
                  : ""}
              </span>
            ) : (
              <AlgaehAutoComplete
                div={{ className: "noLabel" }}
                selector={{
                  name: "sample_id",
                  className: "select-fld",
                  value: row.sample_id,
                  dataSource: {
                    textField: "SpeDescription",
                    valueField: "hims_d_lab_specimen_id",
                    data: labspecimen,
                  },
                  updateInternally: true,
                  onChange: (e, value) => {
                    row.sample_id = value;
                    forceUpdate(row);

                    // onchangegridcol(row, e);
                  },
                  onClear: (e) => {
                    row.sample_id = null;
                    forceUpdate(row);
                  },
                }}
              />
            );
          },
          others: {
            maxWidth: 200,
            // resizable: false,
            style: { textAlign: "center" },
          },
        },
        {
          fieldName: "container_id",
          label: <AlgaehLabel label={{ fieldName: "Container" }} />,
          displayTemplate: (row) => {
            let display =
              labcontainer === undefined
                ? []
                : labcontainer.filter(
                    (f) => f.hims_d_lab_container_id === row.container_id
                  );
            return row.collected === "Y" || row.billed === "N" ? (
              <span>
                {display !== null && display.length !== 0
                  ? display[0].ConDescription
                  : ""}
              </span>
            ) : (
              <AlgaehAutoComplete
                div={{ className: "noLabel" }}
                selector={{
                  name: "container_id",
                  className: "select-fld",
                  value: row.container_id,
                  dataSource: {
                    textField: "ConDescription",
                    valueField: "hims_d_lab_container_id",
                    data: labcontainer,
                  },
                  updateInternally: true,
                  onChange: (e, value) => {
                    row.container_id = value;
                    forceUpdate(row);

                    // onchangegridcol(row, e);
                  },
                  onClear: (e) => {
                    row.container_id = null;
                    forceUpdate(row);
                  },
                }}
              />
            );
          },
          editorTemplate: (row) => {
            let display =
              labcontainer === undefined
                ? []
                : labcontainer.filter(
                    (f) => f.hims_d_lab_container_id === row.container_id
                  );
            return row.collected === "Y" || row.billed === "N" ? (
              <span>
                {display !== null && display.length !== 0
                  ? display[0].ConDescription
                  : ""}
              </span>
            ) : (
              <AlgaehAutoComplete
                div={{ className: "noLabel" }}
                selector={{
                  name: "container_id",
                  className: "select-fld",
                  value: row.container_id,
                  dataSource: {
                    textField: "ConDescription",
                    valueField: "hims_d_lab_container_id",
                    data: labcontainer,
                  },
                  updateInternally: true,
                  onChange: (e, value) => {
                    row.container_code = value;
                    forceUpdate(row);

                    // onchangegridcol(row, e);
                  },
                  onClear: (e) => {
                    row.container_code = null;
                    forceUpdate(row);
                  },
                }}
              />
            );
          },
          others: {
            maxWidth: 200,
            // resizable: false,
            style: { textAlign: "center" },
          },
        },
        {
          fieldName: "send_out_test",
          label: <AlgaehLabel label={{ forceLabel: "Send Out" }} />,
          displayTemplate: (row) => {
            return row.collected === "Y" || row.billed === "N" ? (
              row.send_out_test === "Y" ? (
                <span className="badge badge-success">Yes</span>
              ) : (
                <span className="badge badge-danger">No</span>
              )
            ) : (
              <AlgaehAutoComplete
                div={{ className: "noLabel" }}
                selector={{
                  name: "send_out_test",
                  className: "select-fld",
                  value: row.send_out_test,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: variableJson.FORMAT_YESNO,
                  },
                  updateInternally: true,
                  onChange: (e, value) => {
                    row.send_out_test = value;
                    forceUpdate(row);

                    // onchangegridcol(row, e);
                  },
                  onClear: (e) => {
                    row.send_out_test = "N";
                    forceUpdate(row);
                  },
                }}
              />
            );
          },
          editorTemplate: (row) => {
            return row.collected === "Y" || row.billed === "N" ? (
              row.send_out_test === "Y" ? (
                <span className="badge badge-success">Yes</span>
              ) : (
                <span className="badge badge-danger">No</span>
              )
            ) : (
              <AlgaehAutoComplete
                div={{ className: "noLabel" }}
                selector={{
                  name: "send_out_test",
                  className: "select-fld",
                  value: row.send_out_test,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: variableJson.FORMAT_YESNO,
                  },
                  updateInternally: true,
                  onChange: (e, value) => {
                    row.send_out_test = value;
                    forceUpdate(row);

                    // onchangegridcol(row, e);
                  },
                  onClear: (e) => {
                    row.send_out_test = "N";
                    forceUpdate(row);
                  },
                }}
              />
            );
          },
          others: {
            maxWidth: 150,
            // resizable: false,
            style: { textAlign: "center" },
          },
        },
        {
          fieldName: "send_in_test",
          label: <AlgaehLabel label={{ forceLabel: "Send In" }} />,
          displayTemplate: (row) => {
            return row.collected === "Y" || row.billed === "N" ? (
              row.send_in_test === "Y" ? (
                <span className="badge badge-success">Yes</span>
              ) : (
                <span className="badge badge-danger">No</span>
              )
            ) : (
              <AlgaehAutoComplete
                div={{ className: "noLabel" }}
                selector={{
                  name: "send_in_test",
                  className: "select-fld",
                  value: row.send_in_test,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: variableJson.FORMAT_YESNO,
                  },
                  updateInternally: true,
                  onChange: (e, value) => {
                    row.send_in_test = value;
                    forceUpdate(row);

                    // onchangegridcol(row, e);
                  },
                  onClear: (e) => {
                    row.send_in_test = "N";
                    forceUpdate(row);
                  },
                }}
              />
            );
          },
          editorTemplate: (row) => {
            return row.collected === "Y" || row.billed === "N" ? (
              row.send_in_test === "Y" ? (
                <span className="badge badge-success">Yes</span>
              ) : (
                <span className="badge badge-danger">No</span>
              )
            ) : (
              <AlgaehAutoComplete
                div={{ className: "noLabel" }}
                selector={{
                  name: "send_in_test",
                  className: "select-fld",
                  value: row.send_in_test,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: variableJson.FORMAT_YESNO,
                  },
                  updateInternally: true,
                  onChange: (e, value) => {
                    row.send_in_test = value;
                    forceUpdate(row);

                    // onchangegridcol(row, e);
                  },
                  onClear: (e) => {
                    row.send_in_test = "N";
                    forceUpdate(row);
                  },
                }}
              />
            );
          },
          others: {
            maxWidth: 150,
            // show: false,
            style: { textAlign: "center" },
          },
        },
        {
          fieldName: "collected_date",
          label: <AlgaehLabel label={{ fieldName: "collected_date" }} />,
          displayTemplate: (row) => {
            if (row.send_in_test === "Y" && row.collected === "N") {
              return (
                <DatePicker
                  name="collected_date"
                  disabledDate={(d) =>
                    !d ||
                    d.isAfter(moment().add(1, "days").format("YYYY-MM-DD"))
                  }
                  format="YYYY-MM-DD HH:mm:ss"
                  // minDate={new Date()}
                  showTime
                  onChange={(e) => {}}
                  onOk={(ctrl) => {
                    if (Date.parse(moment(ctrl)._d) > Date.parse(new Date())) {
                      swalMessage({
                        title: "Collected date cannot be future Date.",
                        type: "warning",
                      });
                    } else {
                      row["collected_date"] = moment(ctrl)._d;
                      forceUpdate(row);
                    }
                  }}
                />
              );
            } else {
              return (
                <span>
                  {moment(row.collected_date).isValid()
                    ? moment(row.collected_date).format("DD-MM-YYYY hh:mm")
                    : "------"}
                </span>
              );
            }
          },
          editorTemplate: (row) => {
            return (
              <span>
                {moment(row.collected_date).isValid()
                  ? moment(row.collected_date).format("DD-MM-YYYY hh:mm")
                  : "------"}
              </span>
            );
          },

          others: {
            minWidth: 200,
            // show: false,
            style: { textAlign: "left" },
          },
        },
        {
          fieldName: "status",
          label: <AlgaehLabel label={{ fieldName: "Status" }} />,
          displayTemplate: (row) => {
            return row.status === "O"
              ? "Ordered"
              : row.status === "CL"
              ? "Collected"
              : row.status === "CN"
              ? "Test Canceled"
              : row.status === "CF"
              ? "Result Confirmed"
              : "Result Validated";
          },
          editorTemplate: (row) => {
            return (
              <AlgaehAutoComplete
                // error={errors2}
                div={{ className: "col " }}
                selector={{
                  className: "select-fld",
                  name: "status",
                  value: row.status,
                  onChange: (e, value) => {
                    row.status = value;
                  },
                  // others: { defaultValue: row.bed_id },
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: [
                      {
                        name: "Ordered",
                        value: "O",
                      },
                      {
                        name: "Collected",
                        value: "CL",
                      },
                      {
                        name: "Canceled",
                        value: "CN",
                      },
                      {
                        name: "Result Confirmed",
                        value: "CF",
                      },
                    ],
                  },
                  updateInternally: true,
                  // others: {
                  //   disabled:
                  //     current.request_status === "APR" &&
                  //     current.work_status === "COM",
                  //   tabIndex: "4",
                  // },
                }}
              />
            );
          },
          // others: {
          //   // resizable: false,
          //   style: { textAlign: "center" }
          // }
        },

        {
          fieldName: "collected_by",
          label: <AlgaehLabel label={{ fieldName: "collected_by" }} />,
          displayTemplate: (row) => {
            let display =
              userdrtails === undefined
                ? []
                : userdrtails.filter(
                    (f) => f.algaeh_d_app_user_id === row.collected_by
                  );

            return (
              <span>
                {display !== null && display.length !== 0
                  ? display[0].username
                  : ""}
              </span>
            );
          },
          editorTemplate: (row) => {
            let display =
              userdrtails === undefined
                ? []
                : userdrtails.filter(
                    (f) => f.algaeh_d_app_user_id === row.collected_by
                  );

            return (
              <span>
                {display !== null && display.length !== 0
                  ? display[0].username
                  : ""}
              </span>
            );
          },
          others: {
            minWidth: 200,
            // show: false,
            style: { textAlign: "left" },
          },
        },

        {
          fieldName: "barcode_gen",
          label: <AlgaehLabel label={{ forceLabel: "Barcode Gen Date" }} />,
          displayTemplate: (row) => {
            return (
              <span>
                {moment(row.barcode_gen).isValid()
                  ? moment(row.barcode_gen).format("DD-MM-YYYY hh:mm")
                  : "------"}
              </span>
            );
          },
          editorTemplate: (row) => {
            return (
              <span>
                {moment(row.barcode_gen).isValid()
                  ? moment(row.barcode_gen).format("DD-MM-YYYY hh:mm")
                  : "------"}
              </span>
            );
          },
          others: {
            minWidth: 200,
            // show: false,
            style: { textAlign: "left" },
          },
        },
        {
          fieldName: "remarks",
          label: <AlgaehLabel label={{ forceLabel: "Rejection Remarks" }} />,
          editorTemplate: (row) => {
            return row.remarks;
          },
          others: {
            minWidth: 200,
            // resizable: false,
            style: { textAlign: "center" },
          },
        },
      ]}
      keyId="patient_code"
      data={test_details}
      filter={true}
      noDataText="No data available for selected period"
      pageOptions={{ rows: 100, page: 1 }}
      isFilterable={true}
      pagination={true}
    />
  );
});
