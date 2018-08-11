import React, { Component } from "react";
import Dropzone from "react-dropzone";
import "./Attachments.css";
import "./../../../../styles/site.css";
import { AlgaehLabel } from "../../../Wrapper/algaehWrapper";

export default class Attachments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePreview: ""
    };
  }

  onDrop(file) {
    this.setState({
      filePreview: file[0].name
    });
  }

  render() {
    return (
      <div className="hptl-phase1-pre-approval-attachment-form">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li className={"nav-item tab-button active"}>
              Attachments/Insurance Card
            </li>
          </ul>
        </div>
        <div className="attachment-section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3">
                <div
                  className="ins-attach-area refactor-design"
                  style={{ marginTop: "38px" }}
                >
                  <Dropzone
                    onDrop={this.onDrop.bind(this)}
                    className="dropzone"
                  >
                    <div>
                      <button
                        className="htpl1-phase1-btn-primary"
                        style={{ float: "right" }}
                      >
                        <AlgaehLabel
                          label={{
                            fieldName: "btnchoose_file"
                          }}
                        />
                      </button>
                    </div>
                  </Dropzone>
                  <label className="file-name-upload">
                    {this.state.filePreview}
                  </label>
                </div>
              </div>

              <div className="col-lg-6">&nbsp;</div>

              <div className="col-lg-3">
                <div className="image-drop-area">
                  {/* <Dropzone
                    id="attach-primary-id"
                    className="dropzone"
                    accept="image/*"
                    multiple={false}
                    name="image"
                  > */}
                  <img
                    // className="preview-image"
                    src={this.state.frontSide}
                    style={{ width: "100%", height: "101px" }}
                  />
                  {/* </Dropzone> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
