import React, { PureComponent } from "react";

import RichTextEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";

import { texthandle, saveTemplate, rtehandle } from "./RadTemplateEvents";

import "./RadTemplate.css";
import "./../../../styles/site.css";
import { AlgaehModalPopUp } from "../../Wrapper/algaehWrapper";
import MyContext from "../../../utils/MyContext.js";

export default class RadTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      template_name: null,
      template_html: null,
      hims_d_rad_template_detail_id: null,
      dataEnter: false
    };
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(0);
  };

  componentWillReceiveProps(newProps) {
    if (
      newProps.radTempobj !== null &&
      this.state.hims_d_rad_template_detail_id === null &&
      this.state.dataEnter === false
    ) {
      let InputOutput = newProps.radTempobj;
      this.setState({ ...this.state, ...InputOutput });
    } else {
      if (this.state.dataEnter === false) {
        this.setState({
          value: "",
          template_name: null,
          template_html: null,
          hims_d_rad_template_detail_id: null
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Radiology Template Editor"
          openPopup={this.props.openTemplate}>
          {/* <div className="popupInner">
              <div className="col-12 popRightDiv"> */}
          <MyContext.Consumer>
            {context => (
              <div className="hptl-phase1-add-rad-tamplate-form">
                <div className="popupInner">
                  <div className="popRightDiv">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-lg-6" }}
                        label={{
                          fieldName: "template_name",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "template_name",
                          value: this.state.template_name,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />
                    </div>
                    <div className="row">
                      <div className="col-lg-12 editor">
                        <RichTextEditor
                          value={this.state.template_html}
                          onChange={rtehandle.bind(this, this, context)}
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, false] }],
                              [
                                "bold",
                                "italic",
                                "underline",
                                "strike",
                                "blockquote",
                                { list: "ordered" },
                                { list: "bullet" },
                                { indent: "-1" },
                                { indent: "+1" },
                                "image",
                                { color: [] },
                                { background: [] }
                              ]
                            ]
                          }}
                          style={{ minHeight: "40vh" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="popupFooter">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-4"> &nbsp;</div>

                      <div className="col-lg-8">
                        <button
                          className="btn btn-primary"
                          disabled={!this.state.template_name ? true : false}
                          onClick={saveTemplate.bind(this, this, context)}>
                          Save
                        </button>
                        <button
                          className="btn btn-default"
                          onClick={e => {
                            this.onClose(e);
                          }}>
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </MyContext.Consumer>
        </AlgaehModalPopUp>
      </React.Fragment>
    );
  }
}
