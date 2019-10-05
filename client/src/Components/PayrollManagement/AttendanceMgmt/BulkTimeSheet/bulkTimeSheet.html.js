import React, { useState, useEffect } from "react";
import moment from "moment";
import "./bulkTimeSheet.html.scss";
import Filter from "./Filter/filter.html";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../../utils/algaehApiCall";
import {
  downloadExcel,
  processDetails,
  getProjects
} from "./bulkTimeSheet.events";
import EditAttendencePerDay from "./EditAttendencePerDay";

function BulkTimeSheet(props) {
  const [filter, setFilter] = useState({});
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([]);
  const [message, setMessage] = useState("");
  const [process, setProcess] = useState(true);
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [project_state, setProjectState] = useState({
    project_id: null,
    worked_hours: null,
    attendance_date: null,
    hims_f_daily_time_sheet_id: null,
    hims_f_project_roster_id: null,
    showPopup: false,
    projects: []
  });
  const [selectedTD, setSelectedTD] = useState({});
  function editingProjectRoster(e) {
    if (project_state.projects.length === 0) {
      getProjects()
        .then(result => {
          // setProjects(result);
          setProjectState({
            project_id: e.project_id,
            worked_hours: e.worked_hours,
            attendance_date: e.attendance_date,
            hims_f_daily_time_sheet_id: e.hims_f_daily_time_sheet_id,
            hims_f_project_roster_id: e.hims_f_project_roster_id,
            showPopup: true,
            projects: result
          });
        })
        .catch(error => {
          setProjectState({
            project_id: null,
            worked_hours: null,
            attendance_date: null,
            hims_f_daily_time_sheet_id: null,
            hims_f_project_roster_id: null,
            showPopup: false,
            projects: []
          });
        });
    } else {
      setProjectState({
        project_id: e.project_id,
        worked_hours: e.worked_hours,
        attendance_date: e.attendance_date,
        hims_f_daily_time_sheet_id: e.hims_f_daily_time_sheet_id,
        hims_f_project_roster_id: e.hims_f_project_roster_id,
        showPopup: true
      });
    }
  }
  function selectedITD(value) {
    setSelectedTD(value);
  }
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

      <EditAttendencePerDay
        project_state={project_state}
        setProjectState={setProjectState}
        onClose={e => {
          if (e !== undefined) {
            const { project_id, worked_hours, abbreviation } = e;
            const { rowID, cellID } = selectedTD;
            data[rowID]["roster"][cellID - 1]["project_id"] = project_id;
            data[rowID]["roster"][cellID - 1]["worked_hours"] = worked_hours;
            data[rowID]["roster"][cellID - 1]["abbreviation"] = abbreviation;
            setSelectedTD({});
            setData(data);
          }

          setProjectState({
            project_id: null,
            worked_hours: null,
            attendance_date: null,
            showPopup: false,
            hims_f_daily_time_sheet_id: null
            // projects: []
          });
        }}
      />
      <div className="portlet portlet-bordered margin-top-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Total Employees : {data.length}</h3>
          </div>
          <div className="actions" />
        </div>
        <div className="portlet-body bulkTimeSheetPreviewCntr">
          {message !== "" ? (
            <div className="bulkUploadErrorMessage">
              <h5>Please validate below details in excel template</h5>
              <ol dangerouslySetInnerHTML={{ __html: message }}></ol>
            </div>
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
                          editingProjectRoster={editingProjectRoster}
                          setSelectedTD={selectedITD}
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
export default BulkTimeSheet;

function TableCells(props) {
  const { itm, indx, editingProjectRoster, setSelectedTD } = props;
  const [editable, setEditable] = useState({});
  const { status, worked_hours, abbreviation, attendance_date } = itm;
  useEffect(() => {
    const editableTD =
      status !== "N"
        ? {
            style: { cursor: "pointer" },
            onDoubleClick: e => {
              const element = e.target.offsetParent;
              const rowID = element.parentElement.sectionRowIndex;
              const cellID = element.cellIndex;

              setSelectedTD({
                attendance_date: attendance_date,
                cellID,
                rowID
              });
              editingProjectRoster(itm);
            }
          }
        : {};
    setEditable(editableTD);
  }, []);

  return (
    <td {...editable}>
      <small>{status}</small>
      <span>{worked_hours}</span>
      <small>{abbreviation}</small>
    </td>
  );
}
