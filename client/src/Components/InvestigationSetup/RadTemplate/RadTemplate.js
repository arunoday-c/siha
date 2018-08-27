import React, { PureComponent, PropTypes } from "react";

import RichTextEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./RadTemplate.css";
import "./../../../styles/site.css";
import { Modal } from "../../Wrapper/algaehWrapper";

export default class RadTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  onChange = value => {
    this.setState({ value });
  };

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
          <div className="hptl-phase1-add-rad-tamplate-form">
            {/* <div className="hptl-phase1-add-advance-form"> */}
            <div className="container-fluid">
              <div className="row form-details">
                <div className="col-lg-12 editor">
                  <RichTextEditor
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
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
                      //   onClick={handleNext.bind(this, this)}
                    >
                      Save
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="fixed-bottom investigation-footer">
            <div className="float-right">
              <button
                onClick={e => {
                  this.onClose(e);
                }}
                className=" htpl1-phase1-btn-secondary"
              >
                Close
              </button>

              <button
                className="htpl1-phase1-btn-primary"
                style={{ margin: "10px" }}
                // onClick={this.ShowModel.bind(this)}
              >
                Save
              </button>
            </div>
          </div> */}
        </Modal>
      </React.Fragment>
    );
  }
}
