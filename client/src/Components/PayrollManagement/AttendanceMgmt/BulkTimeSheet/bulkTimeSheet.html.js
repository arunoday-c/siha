import React, { useState, memo } from "react";
import moment from "moment";
import "./bulkTimeSheet.html.scss";
import Filter from "./Filter/filter.html";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../../utils/algaehApiCall";
import { downloadExcel, processDetails } from "./bulkTimeSheet.events";
function BulkTimeSheet(props) {
  const [filter, setFilter] = useState({});
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([]);
  const [message, setMessage] = useState("");
  const [process, setProcess] = useState(true);
  const [loadingProcess, setLoadingProcess] = useState(false);
  return (
    <div id="bulkManualTimeSheet">
      <Filter
        downloadExcel={data => {
          downloadExcel(data, () => {
            setProcess(false);
          });
        }}
        uploadExcel={result => {
          const {
            allDates,
            data,
            department_id,
            employee_id,
            from_date,
            hospital_id,
            month,
            project_id,
            sub_department_id,
            to_date,
            year
          } = result;
          setDates(allDates);
          setFilter({
            department_id,
            employee_id,
            from_date,
            hospital_id,
            month: parseInt(month),
            project_id,
            sub_department_id,
            to_date,
            year
          });
          setData(data);
          setProcess(false);
        }}
        uploadErrors={message => {
          setMessage(message);
          setProcess(true);
        }}
        preview={result => {
          const {
            allDates,
            data,
            department_id,
            employee_id,
            from_date,
            hospital_id,
            month,
            project_id,
            sub_department_id,
            to_date,
            year
          } = result;
          setDates(allDates);
          setFilter({
            department_id,
            employee_id,
            from_date,
            hospital_id,
            month: parseInt(month),
            project_id,
            sub_department_id,
            to_date,
            year
          });
          setData(data);
          setProcess(false);
        }}
      />

      <div className="portlet portlet-bordered margin-top-15">
        <div className="portlet-title">
          <div className="caption">
            <label className="label">Total Employees : {data.length}</label>
          </div>
          <div className="actions" />
        </div>
        <div className="portlet-body bulkTimeSheetPreviewCntr">
          {message !== "" ? (
            <p>{message}</p>
          ) : (
            <table id="bulkTimeSheetPreview">
              <thead>
                <tr>
                  <th>Emp Name & Code</th>
                  {dates.map((item, index) => (
                    <th key={item}>
                      <span>{moment(item, "YYYY-MM-DD").format("ddd")}</span>
                      <br />
                      <span>{moment(item, "YYYY-MM-DD").format("DD/MMM")}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.employee_id}>
                    <td>
                      <span>{item.employee_name}</span>
                      <small>{item.employee_code}</small>
                    </td>
                    {item.roster.map((itm, indx) => {
                      return (
                        <TableCells
                          itm={itm}
                          indx={indx}
                          key={`${item.employee_id}_${itm.attendance_date}`}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              disabled={process}
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setLoadingProcess(true);
                processDetails(
                  filter,
                  errorMessage => {
                    setProcess(true);
                    setLoadingProcess(false);
                    swalMessage({
                      type: "error",
                      title: errorMessage
                    });
                  },
                  result => {
                    setLoadingProcess(false);
                    setProcess(true);
                    swalMessage({
                      type: "success",
                      title: "Posted Successfully"
                    });
                  }
                );
              }}
            >
              {!loadingProcess ? (
                <AlgaehLabel
                  label={{ forceLabel: "Process", returnText: true }}
                />
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(BulkTimeSheet);

function TableCells(props) {
  const { itm, indx } = props;
  const [enable, setEnable] = useState(false);
  return (
    <td onDoubleClick={() => setEnable(state => !state)}>
      <small>{itm.status}</small>

      <span>{itm.worked_hours}</span>
    </td>
  );
}
