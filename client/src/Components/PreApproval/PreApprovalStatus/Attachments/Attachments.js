import React, { Component } from "react";
import Dropzone from "react-dropzone";
import "./Attachments.scss";
import "./../../../../styles/site.scss";
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
      <div>
        <h6 className="popSubHdg">Attachments Details</h6>

        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-3">
                <label>Attach Documents</label>
                <div className="ins-attach-area refactor-design algaehUploadFile">
                  <Dropzone
                    onDrop={this.onDrop.bind(this)}
                    className="dropzone"
                  >
                    <div>
                      <button
                        className="btn btn-primary"
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

              <div className="col-lg-3">
                <label>Available Insurance</label>

                <div className="image-drop-area">
                  <img
                    src={this.state.frontSide}
                    style={{ width: "100%", height: "101px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
