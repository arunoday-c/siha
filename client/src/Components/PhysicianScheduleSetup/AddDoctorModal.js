import React from "react";
import AlgaehModalPopUp from "../Wrapper/modulePopUp";

export default function AddDoctorModal(props) {
  return (
    <AlgaehModalPopUp
      events={{
        onClose: props.handleClose
      }}
      title={props.title}
      openPopup={props.isOpen}
    >
      <div className="popupInner">
        <div className="col-lg-12 divInner">
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
                    <span className="physicianListSlot">
                      {/* <AlagehAutoComplete
                                  div={{ className: "col-12" }}
                                  selector={{
                                    name: "slot",
                                    className: "select-fld",
                                    value: "",
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: ""
                                    },
                                    onChange: ""
                                  }}
                                /> */}
                    </span>
                  </li>
                );
              })}
            </ul>
            <button
              className="btn btn-primary"
              onClick={props.addDoctorsToSchedule}
            >
              Add to Schdule
            </button>
          </div>
        </div>
      </div>
    </AlgaehModalPopUp>
  );
}
