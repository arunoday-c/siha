import React from "react";
import AlgaehModalPopUp from "../Wrapper/modulePopUp";

export default function AddDoctorModal(props) {
  return (
    <AlgaehModalPopUp
      events={{
        onClose: props.handleClose
      }}
      title={props.title}
      class="addDoctorSchedule"
      openPopup={props.isOpen}
    >
      <div className="popupInner">
        <div className="col-12 popRightDiv">
          <div className="physicianList">
            <ul>
              {props.availDoctors.map((data, index) => {
                return (
                  <li
                    key={index}
                    onClick={e =>
                      e.currentTarget.firstElementChild.firstElementChild.click()
                    }
                  >
                    <span className="checkBoxPhy">
                      <input
                        checked={data.isDocChecked || false}
                        value={data.isDocChecked || false}
                        onChange={() => props.checkHandle(data, index)}
                        type="checkbox"
                      />
                      <i className="fas fa-check" />
                    </span>
                    <span className="physicianListName">{data.full_name}</span>
                    {/* <span className="physicianListSlot"></span> */}
                  </li>
                );
              })}
              {props.availDoctors.length === 0 ? (
                <li className="noResultLi">
                  No doctors available for schedule
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>

      <div className="popupFooter">
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={props.addDoctorsToSchedule}
              >
                <label className="style_Label ">Add to Schedule</label>
              </button>

              {/* <button type="button" className="btn btn-default">
                <label className="style_Label ">Cancel</label>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </AlgaehModalPopUp>
  );
}
