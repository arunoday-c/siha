import React, { PureComponent, PropTypes } from "react";
import { AlagehAutoComplete } from "./Wrapper/algaehWrapper";
import { GlobalVariables } from "../utils/GlobalVariables.json";

import RichTextEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

export default class RadTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  onChange = value => {
    debugger;

    this.setState({ value: value }, () => {
      debugger;
    });
  };

  render() {
    return (
      <React.Fragment>
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
          </div>
          <div className="col-lg-1">
            <span
              className="txt-fld"
              style={{ padding: "10px", margin: "auto" }}
            >
              0
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
