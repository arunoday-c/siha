import React, { useState, memo } from "react";
import "./bulkTimeSheet.html.css";
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
        uploadExcel={data => {
          const internalData = data.data;
          delete data.data;
          const findFilter = data;
          setFilter(findFilter);
          setData(internalData);
          if (internalData.length > 0) {
            setProcess(false);
          }
        }}
        uploadErrors={message => {
          setMessage(message);
          setProcess(true);
        }}
        preview={data => {
          const internalData = data.data;
          delete data.data;
          const findFilter = data;
          findFilter.month = parseInt(findFilter.month);
          setFilter(findFilter);
          setData(internalData);
          if (internalData.length > 0) {
            setProcess(false);
          }
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
          {message !== "" ? (
            <p>{message}</p>
          ) : (
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
                  <tr key={index}>
                    {item.map((itm, indx) => (
                      <React.Fragment key={indx + "_frag"}>
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
