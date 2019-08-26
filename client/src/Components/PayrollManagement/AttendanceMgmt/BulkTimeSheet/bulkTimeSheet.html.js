import React, { useState, memo } from "react";
import "./bulkTimeSheet.html.css";
import Filter from "./Filter/filter.html";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import { downloadExcel } from "./bulkTimeSheet.events";
function BulkTimeSheet(props) {
  const [filter, setFilter] = useState({});
  const [data, setData] = useState([]);
  return (
    <div id="bulkManualTimeSheet">
      <Filter
        downloadExcel={data => {
          downloadExcel(data);
        }}
        uploadExcel={data => {
          debugger;
          const internalData = data.data;
          const findFilter = Object.delete(data.data);
          setFilter(findFilter);
          setData(internalData);
        }}
      />

      <div className="portlet portlet-bordered margin-top-15">
        <div className="portlet-title">
          <div className="caption">
            <label className="label">Timesheet</label>
          </div>
          <div className="actions" />
        </div>
        <div className="portlet-body bulkTimeSheetPreviewCntr">
          <table id="bulkTimeSheetPreview">
            <thead>
              <tr>
                <th>Emp Name & Code</th>
                {data.length > 0
                  ? data[0].map((item, index) => (
                      <th key={index}> {item.attendance_date} </th>
                    ))
                  : null}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr>
                  {item.map((itm, indx) => (
                    <React.Fragment>
                      {indx === 0 ? (
                        <td key={indx + "_emp"}>
                          <small>{itm.employee_code}</small>
                          <span>{itm.employee_name}</span>
                        </td>
                      ) : null}
                      <td key={indx + "_day"}>
                        <small>{itm.status}</small>
                        <span>{itm.worked_hours}</span>
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              //disabled={this.state.time_sheet.length === 0}
              type="button"
              className="btn btn-primary"
              //onClick={this.postTimeSheet.bind(this)}
            >
              <AlgaehLabel
                label={{ forceLabel: "Process", returnText: true }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(BulkTimeSheet);
