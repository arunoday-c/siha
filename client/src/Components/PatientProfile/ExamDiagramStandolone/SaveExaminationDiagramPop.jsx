import React from "react";

import {
  AlagehAutoComplete,
  AlagehFormGroup,
} from "../../Wrapper/algaehWrapper";

export default function SaveExaminationDiagramPop(props) {
  return (
    <div>
      <div id="savePopUP" className="saveWrapper">
        <div className="col saveWindow">
          <div className="row saveHeader">
            <div className="col">
              <h5>Save</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-6 form-group">
              <label>Save As</label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="new"
                    name="diagramSaveAs"
                    checked={props.state.saveAsChecked === "new" ? true : false}
                    onChange={props.onChangeSaveAsHandler}
                  />
                  <span>New</span>
                </label>

                <label className="radio inline" style={{ marginRight: 5 }}>
                  <input
                    type="radio"
                    onChange={props.onChangeSaveAsHandler}
                    value="existing"
                    name="diagramSaveAs"
                    {...props._disable}
                    checked={
                      props.state.saveAsChecked === "existing" ? true : false
                    }
                  />
                  <span>Existing</span>
                </label>
              </div>
            </div>
            {props.state.saveAsChecked === "new" ? (
              <AlagehFormGroup
                div={{ className: "col-6 form-group" }}
                label={{
                  forceLabel: "Enter Treatment Name",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "diagram_desc",
                  value: props.state.diagram_desc,
                  events: {
                    onChange: props.onChangeTextBoxHandler,
                  },
                }}
              />
            ) : (
              <AlagehAutoComplete
                div={{ className: "col-6 form-group" }}
                label={{
                  forceLabel: "Select Existing Treatment",
                  isImp: true,
                }}
                selector={{
                  name: "hims_f_examination_diagram_header_id",
                  className: "select-fld",
                  dataSource: {
                    data: props.state.existingDiagram,
                    textField: "diagram_desc",
                    valueField: "hims_f_examination_diagram_header_id",
                  },
                  value: props.state.hims_f_examination_diagram_header_id,
                  onChange: props.onChangeExistingDiagramHandler,
                }}
              />
            )}

            <div className="col form-group">
              <label>Enter Remarks</label>
              <textarea
                className="textAreaRemarks"
                name="remarks"
                value={props.state.remarks}
                onChange={props.onChangeTextBoxHandler}
              />
            </div>
          </div>

          <div className="row saveFooter">
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={props.onChangeSaveDiagram}
              >
                Save
              </button>
              <button
                className="btn btn-default"
                onClick={props.closeSavePopUp}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
