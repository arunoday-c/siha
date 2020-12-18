import React, { useState } from "react";
import {
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehButton,
  AlgaehTable,
} from "algaeh-react-components";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../hooks";
const triggerActions = [
  // {
  //   value: "I",
  //   text: "Insert",
  // },
  {
    value: "U",
    text: "Update",
  },
  // {
  //   value: "D",
  //   text: "Delete",
  // },
];
export default function EnableAudit() {
  const [tables, setTables] = useState([]);
  const [friendlyName, setFriendlyName] = useState("");
  const [action, setAction] = useState(undefined);
  const [loading, setLoading] = useState(false);

  async function getTableData() {
    const result = await newAlgaehApi({
      uri: "/apiAuth/getTables",
      method: "GET",
    });

    return result.data.result;
  }
  async function getMonitorList() {
    const result = await newAlgaehApi({
      uri: "/apiAuth/getMonitorList",
      method: "GET",
    });
    console.log("esult.data.result", result.data.result);
    return result.data.result;
  }
  const { data: tableList, isLoading } = useQuery("audit_tables", getTableData);
  const { data: result, isLoading: auditLoading } = useQuery(
    "monitor_list",
    getMonitorList
  );
  function onChangeHandler(values) {
    setTables(
      values.map((item) => {
        return item.value;
      })
    );
  }
  function onClearHandler() {
    setTables([]);
  }
  async function onClickLoading() {
    setLoading(true);
    try {
      await newAlgaehApi({
        uri: "/apiAuth/generateTrigger",
        method: "GET",
        data: {
          trigger_action: action,
          table_name: tables,
          friendly_name: friendlyName,
        },
      });
      setLoading(false);
      getMonitorList();
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }
  return (
    <div className="AuditLogScreen">
      <div className="row inner-top-search">
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Select Tables",
            isImp: true,
          }}
          selector={{
            multiselect: "multiple",
            name: "table_name",
            className: "select-fld",
            value: tables,
            dataSource: {
              textField: "TABLE_NAME",
              valueField: "TABLE_NAME",
              data: isLoading ? [] : tableList,
            },
            onChange: onChangeHandler,
            onClear: onClearHandler,
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Trigger Action",
            isImp: true,
          }}
          selector={{
            name: "trigger_action",
            className: "select-fld",
            value: action,
            dataSource: {
              textField: "text",
              valueField: "value",
              data: triggerActions,
            },
            onChange: ({ value }) => {
              console.log("value", value);
              setAction(value);
            },
            onClear: () => {
              setAction(undefined);
            },
          }}
        />
        <AlgaehFormGroup
          div={{ className: "col-6 form-group" }}
          label={{
            forceLabel: "Friendly Name",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "friendly_name",
            onChange: (e) => {
              debugger;
              const { value } = e.target;
              setFriendlyName(value);
            },
          }}
        />
        <AlgaehButton loading={loading} onClick={onClickLoading}>
          {" "}
          Generate{" "}
        </AlgaehButton>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Monitoring List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-lg-12" id="auditLogGrid_Cntr">
                  <AlgaehTable
                    columns={[
                      {
                        fieldName: "EVENT_OBJECT_TABLE",
                        label: "Schema",
                        filterable: true,
                      },
                      {
                        fieldName: "EVENT_MANIPULATION",
                        label: "Monitor Action",
                        filterable: true,
                      },
                      {
                        fieldName: "TRIGGER_NAME",
                        label: "Monitor Name",
                        filterable: true,
                      },
                    ]}
                    data={!auditLoading ? result : []}
                    isFilterable={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
