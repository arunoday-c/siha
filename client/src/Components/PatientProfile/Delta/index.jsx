import React from "react";
import {
  AlgaehModal,
  AlgaehDateHandler,
  AlgaehAutoComplete,
} from "algaeh-react-components";
import "./DeltaCheckModal.scss";
export default function Delta({ visible, onCancel }) {
  return (
    <AlgaehModal
      title="Delta Check"
      visible={visible}
      maskClosable={false}
      width={540}
      closable={true}
      cancelButtonProps={{
        className: "btn btn-default",
      }}
      onCancel={onCancel}
      // onOk={handleSubmit(onSubmit)}
      className={`algaehNewModal DeltaCheckModal`}
    >
      <div className="row popupInner">
        <div className="col-5">
          <div className="popLeftDiv">
            {/* <h6
                style={{
                  borderBottom: "1px solid #ccc",
                  paddingBottom: 5,
                  paddingTop: 10,
                  fontSize: "0.9rem",
                }}
              >
                Select Filter
              </h6> */}
            <div className="row">
              <div className="col-12 form-group">
                <label>View By</label>
                <div className="customRadio">
                  <label className="radio inline">
                    <input type="radio" value="" name="" />
                    <span>Vital/Analytes</span>
                  </label>

                  <label className="radio inline">
                    <input type="radio" value="" name="" checked />
                    <span>Investigation</span>
                  </label>
                </div>
              </div>
              <AlgaehDateHandler
                div={{ className: "col-6 form-group" }}
                label={{ forceLabel: "From Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "recorded_date",
                }}
                maxDate={new Date()}
                events={{}}
                value=""
              />{" "}
              <AlgaehDateHandler
                div={{ className: "col-6 form-group" }}
                label={{ forceLabel: "To Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "recorded_date",
                }}
                maxDate={new Date()}
                events={{}}
                value=""
              />
              <AlgaehAutoComplete
                div={{ className: "col-12 form-group  " }}
                label={{ forceLabel: "Select Test", isImp: true }}
                selector={{
                  dataSource: {
                    data: [],
                    valueField: "",
                    textField: "",
                  },
                  value: "",
                }}
              />
              <div className="col-12 ">
                <ul className="dimensionList">
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">
                      Vital/Analyte Names
                    </span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">
                      Vital/Analyte Names
                    </span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">
                      Vital/Analyte Names
                    </span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">
                      Vital/Analyte Names
                    </span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">
                      Vital/Analyte Names
                    </span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">
                      Vital/Analyte Names
                    </span>
                  </li>
                </ul>
              </div>
              <div className="col-12" style={{ textAlign: "right" }}>
                <button className="btn btn-default">Clear</button>
                <button className="btn btn-primary" style={{ marginLeft: 10 }}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-7 chartCntr">
          <div className="popRightDiv">
            <div className="row">
              <div className="col">Apply filter to view chart</div>
            </div>
          </div>
        </div>
      </div>
    </AlgaehModal>
  );
}
