import React from "react";
import { AlgaehModal, AlgaehDateHandler } from "algaeh-react-components";
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
      <div className="col">
        <div className="row">
          <div className="col-5">
            <h3>Select Filter</h3>
            <div className="row">
              <div className="col-12">
                <label>View By</label>
                <div className="customRadio">
                  <label className="radio inline">
                    <input type="radio" value="" name="" />
                    <span>Vitals</span>
                  </label>

                  <label className="radio inline">
                    <input type="radio" value="" name="" />
                    <span>Investigation</span>
                  </label>
                </div>
              </div>
              <AlgaehDateHandler
                div={{ className: "col-6" }}
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
                div={{ className: "col-6" }}
                label={{ forceLabel: "To Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "recorded_date",
                }}
                maxDate={new Date()}
                events={{}}
                value=""
              />
              <div className="col-12 dimensionList">
                <ul className="">
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">Vital Names</span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">Vital Names</span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">Vital Names</span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">Vital Names</span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">Vital Names</span>
                  </li>
                  <li>
                    <span className="checkBoxPhy">
                      <input checked="" value="" type="checkbox" />
                      <i className="fas fa-check" />
                    </span>
                    <span className="dimensionListName">Vital Names</span>
                  </li>
                </ul>
              </div>
              <div className="col-12">
                <button className="btn btn-primary">Check</button>
              </div>
            </div>
          </div>
          <div className="col-7">
            <h3>View Chart</h3>
            <div className="row">chart here</div>
          </div>
        </div>
      </div>
    </AlgaehModal>
  );
}
