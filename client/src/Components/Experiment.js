import React, { PureComponent, PropTypes } from "react";
import { AlagehAutoComplete } from "./Wrapper/algaehWrapper";
import { GlobalVariables } from "../utils/GlobalVariables.json";
import { getPatientDetails } from "../utils/indexer";
import RichTextEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

export default class RadTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      loader: false,
      chiefComplainList: []
    };
  }

  onChange = value => {
    debugger;

    this.setState({ value: value }, () => {
      debugger;
    });
  };

  getIndexPatientDetails = e => {
    getPatientDetails(null);
  };

  dropDownHandle(e) {
    this.setState({ [e.name]: e.value });
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this.getIndexPatientDetails.bind(this)}>
          {" "}
          Index db Get POC{" "}
        </button>
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
          <div className="col">
            <AlagehAutoComplete
              div={{ className: "col-lg-10 displayInlineBlock" }}
              label={{
                forceLabel: "Chief Complaint",
                fieldName: "sample"
              }}
              selector={{
                name: "chief_complaint_id",
                className: "select-fld",
                value: this.state.chief_complaint_id,
                dataSource: {
                  textField: "hpi_description",
                  valueField: "hims_d_hpi_header_id",
                  data:
                    this.state.chiefComplainList.length !== 0
                      ? this.state.chiefComplainList
                      : null
                },
                onChange: this.dropDownHandle.bind(this),
                userList: list => {
                  //TODO need to change with appropriate service call --noor
                  debugger;
                  alert(JSON.stringify(list));
                }
              }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
