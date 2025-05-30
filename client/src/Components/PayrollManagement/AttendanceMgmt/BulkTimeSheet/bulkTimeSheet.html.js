import React, { useState, useEffect } from "react";
import moment from "moment";
import "./bulkTimeSheet.html.scss";
import Filter from "./Filter/filter.html";
import {
  // AlagehAutoComplete,
  AlgaehLabel,
  AlgaehModalPopUp,
  // AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../../utils/algaehApiCall";
import {
  downloadExcel,
  processDetails,
  getProjects,
} from "./bulkTimeSheet.events";
import EditAttendencePerDay from "./EditAttendencePerDay";
import { AlgaehSecurityElement } from "algaeh-react-components";

function BulkTimeSheet(props) {
  const [filter, setFilter] = useState({});
  const [data, setData] = useState([]);
  const [pending_leave, setPendigLeave] = useState([]);
  const [employee_encash, setLeaveEncash] = useState([]);
  const [employee_loan, setLeaveLoan] = useState([]);
  const [dates, setDates] = useState([]);
  const [message, setMessage] = useState("");
  const [process, setProcess] = useState(true);
  const [errorHtml, setErrorHtml] = useState("");
  const [loadingProcess, setLoadingProcess] = useState(false);
  const base_state = {
    project_id: null,
    worked_hours: null,
    attendance_date: null,
    hims_f_daily_time_sheet_id: null,
    hims_f_project_roster_id: null,
    showPopup: false,
    projects: [],
    employee_name: null,
  };
  const [project_state, setProjectState] = useState(base_state);
  const [selectedTD, setSelectedTD] = useState({});
  const [openModal, setOpenModal] = useState(false);

  function editingProjectRoster(e, employee_name) {
    const projectObj = {
      project_id: e.project_id,
      worked_hours: e.worked_hours,
      attendance_date: e.attendance_date,
      hims_f_daily_time_sheet_id: e.hims_f_daily_time_sheet_id,
      hims_f_project_roster_id: e.hims_f_project_roster_id,
      showPopup: true,
      employee_name: employee_name,
      project_desc: e.project_desc + " / " + e.hospital_name,
    };

    if (project_state.projects.length === 0) {
      getProjects()
        .then((result) => {
          setProjectState({
            ...projectObj,
            projects: result,
          });
        })
        .catch((error) => {
          setProjectState(base_state);
        });
    } else {
      setProjectState((state) => ({
        ...state,
        ...projectObj,
      }));
    }
  }

  function selectedITD(value) {
    setSelectedTD(value);
  }

  return (
    <div id="bulkManualTimeSheet">
      <Filter
        downloadExcel={(data) => {
          downloadExcel(data, () => {
            setProcess(false);
          });
        }}
        uploadExcel={(result) => {
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
            year,
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
            year,
          });
          setData(data);
          setProcess(false);
          setErrorHtml("");
        }}
        uploadErrors={(message) => {
          setMessage(message);
          setProcess(true);
        }}
        preview={(result) => {
          const {
            allDates,
            data,
            pending_leave,
            employee_encash,
            employee_loan,
            department_id,
            employee_id,
            from_date,
            hospital_id,
            month,
            project_id,
            sub_department_id,
            to_date,
            year,
            invalid_input,
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
            year,
          });
          if (invalid_input === false) {
            setData(data);
          }
          setPendigLeave(pending_leave);
          setLeaveEncash(employee_encash);
          setLeaveLoan(employee_loan);
          if (
            pending_leave.length > 0 ||
            employee_encash.length > 0 ||
            employee_loan.length > 0
          ) {
            setOpenModal(true);
          }
          setProcess(false);
          setErrorHtml("");
        }}
        clear={() => {
          setErrorHtml("");
        }}
      />

      <AlgaehModalPopUp
        title="Pending Requests"
        events={{
          onClose: () => {
            setOpenModal(false);
          },
        }}
        openPopup={openModal}
      >
        <div className="popupInner">
          <div className="col">
            <div className="row">
              <div className="col alert alert-warning">
                <strong>Warning!</strong> Please take actions for below requests
                for selected branch, then upload time-sheet to avoid multiple
                alteration.
              </div>
            </div>
            <div className="row">
              {pending_leave.length > 0 ? (
                <div className="col">
                  <h6>
                    <b>Pending Leave Requests</b>
                  </h6>
                  <small>Leave Management/ Leave Authorization</small>
                  <ul className="requestList">
                    {pending_leave.map((item, index) => (
                      <li>
                        <span>{item.employee_code}</span>
                        <span>{item.full_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {employee_encash.length > 0 ? (
                <div className="col">
                  <h6>
                    <b>Pending Encashment Requests</b>
                  </h6>
                  <small>Leave Management/ Encashment Authorization</small>

                  <ul className="requestList">
                    {employee_encash.map((item, index) => (
                      <li>
                        <span>{item.employee_code}</span>
                        <span>{item.full_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {employee_loan.length > 0 ? (
                <div className="col">
                  <h6>
                    <b>Pending Loan Requests</b>
                  </h6>
                  <small>Loan Management/ Loan Authorization</small>
                  <ul className="requestList">
                    {employee_loan.map((item, index) => (
                      <li>
                        <span>{item.employee_code}</span>
                        <span>{item.full_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* <div className="col-4">
                {employee_loan.length > 0 ? (
                  <h6>Employee Loan Pending</h6>
                ) : null}

                {employee_loan.map((item, index) => (
                  <>
                    <div className="col-2 form-group">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Employee Code",
                        }}
                      />
                      <h6>{item.employee_code}</h6>
                    </div>
                    <div className="col form-group">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Employee Name",
                        }}
                      />
                      <h6>{item.full_name}</h6>
                    </div>
                  </>
                ))}
              </div> */}
            </div>
          </div>
        </div>

        <div className="popupFooter">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-4"> &nbsp;</div>

              <div className="col-lg-8">
                <button
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  type="button"
                  className="btn btn-default"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>

      <EditAttendencePerDay
        project_state={project_state}
        setProjectState={setProjectState}
        onClose={(e) => {
          if (e !== undefined) {
            const { project_id, worked_hours, abbreviation } = e;
            const { rowID, cellID } = selectedTD;
            data[rowID]["roster"][cellID - 1]["project_id"] = project_id;
            data[rowID]["roster"][cellID - 1]["worked_hours"] = worked_hours;
            if (abbreviation !== undefined) {
              data[rowID]["roster"][cellID - 1]["abbreviation"] = abbreviation;
            }

            setSelectedTD({});
            setData(data);
          }

          setProjectState({
            project_id: null,
            worked_hours: null,
            attendance_date: null,
            showPopup: false,
            hims_f_daily_time_sheet_id: null,
            // projects: []
          });
        }}
      />
      <div className="row">
        <div className={errorHtml !== "" ? "col-9" : "col"}>
          <div
            className="portlet portlet-bordered"
            style={{ marginBottom: 60 }}
          >
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  Total Employees : {data.length}
                </h3>
              </div>
              <div className="actions" />
            </div>
            <div className="portlet-body bulkTimeSheetPreviewCntr">
              {message !== "" ? (
                <div className="bulkUploadErrorMessage">
                  <h5>Please validate below details in excel template</h5>
                  <ol dangerouslySetInnerHTML={{ __html: message }} />
                </div>
              ) : (
                <div className="bulkTimeScroll">
                  <table id="bulkTimeSheetPreview">
                    <thead>
                      <tr>
                        <th className="fixed freeze">Emp Name & Code</th>
                        {dates.map((item, index) => (
                          <th key={item} className="fixed freeze_vertical">
                            <span>
                              {moment(item, "YYYY-MM-DD").format("ddd")}
                            </span>
                            <br />
                            <span>
                              {moment(item, "YYYY-MM-DD").format("DD/MMM")}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={item.employee_id}>
                          <td className="fixed freeze">
                            <span>{item.employee_name}</span>
                            <small>{item.employee_code}</small>
                          </td>
                          {item.roster.map((itm, indx) => {
                            return (
                              <TableCells
                                itm={{ ...itm, project_id: itm.project_id }}
                                indx={indx}
                                key={`${item.employee_id}_${itm.attendance_date}`}
                                employee_name={item.employee_name}
                                editingProjectRoster={editingProjectRoster}
                                setSelectedTD={selectedITD}
                              />
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        {errorHtml !== "" ? (
          <div className="col-3 errorCntrDiv">
            <div className="portlet portlet-bordered ">
              <div className="portlet-body">
                <h6>Attention!</h6>
                <p>
                  Project not assigned or attendance not uploaded. Please
                  resolve the error and then Process Attendance.
                </p>
                <ul
                  className="errorListUI"
                  dangerouslySetInnerHTML={{ __html: errorHtml }}
                ></ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
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
                    data,
                    (errorMessage) => {
                      setProcess(true);
                      setLoadingProcess(false);

                      if (
                        errorMessage.response !== undefined &&
                        typeof errorMessage.response.data.message === "string"
                      ) {
                        const hasLi =
                          errorMessage.response.data.message.includes("<li>");
                        if (hasLi) {
                          setErrorHtml(errorMessage.response.data.message);
                        } else {
                          swalMessage({
                            type: "error",
                            title: errorMessage,
                          });
                        }
                      } else {
                        swalMessage({
                          type: "error",
                          title: errorMessage.response.data.message.sqlMessage,
                        });
                      }
                    },
                    (result) => {
                      setLoadingProcess(false);
                      setProcess(true);
                      swalMessage({
                        type: "success",
                        title: "Posted Successfully",
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
              </button>{" "}
            </div>
          </div>
        </div>
      </AlgaehSecurityElement>
    </div>
  );
}
export default BulkTimeSheet;

function TableCells(props) {
  const { itm, editingProjectRoster, setSelectedTD, employee_name } = props;
  const [editable, setEditable] = useState({});
  const { status, worked_hours, abbreviation, attendance_date } = itm;
  useEffect(() => {
    const editableTD =
      status !== "N"
        ? {
            style: { cursor: "pointer" },
            onDoubleClick: (e) => {
              const element = e.target.offsetParent;
              const rowID = element.parentElement.sectionRowIndex;
              const cellID = element.cellIndex;

              setSelectedTD({
                attendance_date: attendance_date,
                cellID,
                rowID,
              });
              editingProjectRoster(itm, employee_name);
            },
          }
        : {};
    setEditable(editableTD);
  }, []); // eslint-disable-line

  return (
    <td {...editable} className={status}>
      <small>{status}</small>
      <span>{worked_hours}</span>
      <small>{abbreviation}</small>
    </td>
  );
}
