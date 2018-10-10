import React, { PureComponent } from "react";

import RichTextEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";

import { texthandle, saveTemplate, rtehandle } from "./RadTemplateEvents";

import "./RadTemplate.css";
import "./../../../styles/site.css";
import { Modal } from "../../Wrapper/algaehWrapper";
import MyContext from "../../../utils/MyContext.js";

export default class RadTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      template_name: null,
      template_html: null,
      hims_d_rad_template_detail_id: null,
      edited: false
    };
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(0);
  };

  componentWillReceiveProps(newProps) {
    if (
      newProps.radTempobj !== null &&
      this.state.hims_d_rad_template_detail_id === null
    ) {
      let InputOutput = newProps.radTempobj;
      this.setState({ ...this.state, ...InputOutput });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          style={{
            margin: "0 auto",
            width: "100vh"
          }}
          open={this.props.openTemplate}
        >
          <MyContext.Consumer>
            {context => (
              <div className="hptl-phase1-add-rad-tamplate-form">
                <div className="container-fluid">
                  <div className="row form-details">
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
                  <div className="row form-details">
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

                  <div className="row form-details" position="fixed">
                    <div className="col-lg-12">
                      <span className="float-left">
                        <button
                          className="htpl1-phase1-btn-secondary"
                          onClick={e => {
                            this.onClose(e);
                          }}
                        >
                          Close
                        </button>
                      </span>

                      <span className="float-right">
                        <button
                          className="htpl1-phase1-btn-primary"
                          style={{ float: "right" }}
                          onClick={saveTemplate.bind(this, this, context)}
                        >
                          Save
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </MyContext.Consumer>
        </Modal>
      </React.Fragment>
    );
  }
}
