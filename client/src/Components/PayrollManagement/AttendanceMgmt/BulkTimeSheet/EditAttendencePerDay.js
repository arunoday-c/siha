import React, { useState, useEffect } from "react";
import AlgaehModalPopUp from "../../../Wrapper/modulePopUp";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
} from "../../../Wrapper/algaehWrapper";
import ButtonType from "../../../Wrapper/algaehButton";
import { AlgaehSecurityElement } from "algaeh-react-components";

import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
export default function EditAttendencePerDay(props) {
  const { onClose, project_state } = props;
  const [projectId, setProjectId] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [loadingProcess, setLoadingProcess] = useState(false);

  useEffect(() => {
    if (project_state.showPopup) {
      setProjectId(project_state.project_id || "");
      setWorkingHours(project_state.worked_hours || "");
    } else {
      setProjectId("");
      setWorkingHours("");
    }
  }, [project_state]);

  function SaveAttendanceAndProject(options) {
    const { projectId, workingHours } = options;

    algaehApiCall({
      uri: "/attendance/SaveAttendanceAndProject",
      module: "hrManagement",
      method: "POST",
      data: {
        hims_f_project_roster_id: project_state.hims_f_project_roster_id,
        hims_f_daily_time_sheet_id: project_state.hims_f_daily_time_sheet_id,
        project_id: projectId,
        worked_hours: workingHours,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          setLoadingProcess(false);
          if (response.data.result[0] === undefined) {
            const split_hr_min = workingHours.toString().split(".");
            let mins = "00";
            if (split_hr_min.length > 1) {
              mins =
                split_hr_min[1].length === 1
                  ? split_hr_min[1] + "0"
                  : split_hr_min[1];
            }
            const hr_min = `${split_hr_min[0].substring(0, 2)}.${mins}`;
            onClose({ project_id: projectId, worked_hours: hr_min });
          } else {
            onClose(response.data.result[0]);
          }
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  return (
    <AlgaehModalPopUp
      class="editBulkCellPopup"
      openPopup={project_state.showPopup}
      title="Edit Time or Project"
      events={{
        onClose: () => {
          onClose();
        },
      }}
    >
      <div className="popupInner" data-validate="editBulkCell">
        <div className="col-12">
          <div className="row margin-top-15">
            <div className="col-8 form-group">
              <AlgaehLabel
                label={{
                  forceLabel: "Employee Name",
                }}
              />
              <h6>
                {project_state.employee_name
                  ? project_state.employee_name
                  : "--------"}
              </h6>
            </div>
            <div className="col-4 form-group">
              <AlgaehLabel
                label={{
                  forceLabel: "Selected Date",
                }}
              />
              <h6>
                {project_state.attendance_date
                  ? project_state.attendance_date
                  : "--------"}
              </h6>
            </div>
            <AlagehAutoComplete
              div={{ className: "col-7 form-group mandatory" }}
              label={{
                forceLabel: "Assigned Project",
                isImp: true,
              }}
              selector={{
                name: "project_id",
                className: "select-fld",
                value: projectId || undefined,
                dataSource: {
                  textField: "project_desc",
                  valueField: "hims_d_project_id",
                  data: project_state.projects,
                },
                onChange: (e) => {
                  let value = e.value;
                  setProjectId(value);
                },
                onClear: () => {
                  setProjectId("");
                  setWorkingHours("");
                },
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-5 form-group mandatory" }}
              label={{
                forceLabel: "Worked Hours",
                isImp: true,
              }}
              textBox={{
                decimal: { allowNegative: false },
                className: "txt-fld",
                name: "worked_hours",
                value: workingHours,
                events: {
                  onChange: (e) => {
                    let value = e.target.value;
                    setWorkingHours(value);
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="popupFooter">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-4"> &nbsp;</div>

            <div className="col-lg-8">
              <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                <ButtonType
                  classname="btn-primary"
                  loading={loadingProcess}
                  onClick={() => {
                    setLoadingProcess(true);
                    SaveAttendanceAndProject({ workingHours, projectId });
                  }}
                  label={{
                    forceLabel: "SAVE",
                    returnText: true,
                  }}
                />{" "}
              </AlgaehSecurityElement>

              <button
                onClick={() => {
                  onClose();
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
  );
}
