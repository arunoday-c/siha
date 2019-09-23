import React, { Component } from "react";
import "./numbering.scss";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../../utils/algaehApiCall.js";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export default class Numbering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnTxt: "ADD TO LIST",
      hims_f_app_numgen_id: null,
      numgen_code: "",
      module_desc: "",
      prefix: "",
      intermediate_series: "",
      postfix: "",
      length: "",
      increment_by: "",
      numgen_seperator: "",
      postfix_start: "",
      postfix_end: "",
      current_num: "",
      errorTxt: "",
      numgen_code_error: false,
      module_desc_error: false,
      prefix_error: false,
      intermediate_series_error: false,
      postfix_error: false,
      length_error: false,
      increment_by_error: false,
      numgen_seperator_error: false,
      postfix_start_error: false,
      postfix_end_error: false,
      current_num_error: false
    };
  }
  // changeTexts(e) {
  //   this.setState({ [e.target.name]: e.target.value });
  // }

  add(e) {
    e.preventDefault();

    if (this.state.numgen_code.length === 0) {
      this.setState({ numgen_code_error: true });
    } else if (this.state.module_desc.length === 0) {
      this.setState({ module_desc_error: true });
    } else if (this.state.prefix.length === 0) {
      this.setState({ prefix_error: true });
    } else if (this.state.intermediate_series.length === 0) {
      this.setState({ intermediate_series_error: true });
    } else if (this.state.postfix.length === 0) {
      this.setState({ postfix_error: true });
    } else if (this.state.length.length === 0) {
      this.setState({ length_error: true });
    } else if (this.state.increment_by.length === 0) {
      this.setState({ increment_by_error: true });
    } else if (this.state.numgen_seperator.length === 0) {
      this.setState({ numgen_seperator_error: true });
    } else if (this.state.postfix_start.length === 0) {
      this.setState({ postfix_start_error: true });
    } else if (this.state.postfix_end.length === 0) {
      this.setState({ postfix_end_error: true });
    } else if (this.state.current_num.length === 0) {
      this.setState({ current_num_error: true });
    }
    algaehApiCall({
      uri: "/masters/set/autogen",
      data: this.state,

      onSuccess: response => {
        if (response.data.success === true) {
          window.location.reload();
        } else {
          //Handle unsuccessful Login here.
        }
      },
      onFailure: error => {
        // Handle network error here.
      }
    });
  }

  // componentDidMount() {
  //   this.props.getOptions();
  // }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="numbering">
        <div className="container-fluid">
          <form>
            <div
              className="row"
              style={{
                paddingTop: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "numgen_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "numgen_code",
                  value: this.state.numgen_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "module_desc",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "module_desc",
                  value: this.state.module_desc,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />
            </div>

            <br />
            <div
              className="row"
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "prefix",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "prefix",
                  value: this.state.prefix,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "intermediate_series",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "intermediate_series",
                  value: this.state.intermediate_series,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "postfix",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "postfix",
                  value: this.state.postfix,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />
            </div>
            <br />
            <div
              className="row"
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "length",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "length",
                  value: this.state.length,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "increment_by",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "increment_by",
                  value: this.state.increment_by,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "numgen_seperator",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "numgen_seperator",
                  value: this.state.numgen_seperator,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />
            </div>
            <br />
            <div
              className="row"
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "postfix_start",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "postfix_start",
                  value: this.state.postfix_start,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "postfix_end",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "postfix_end",
                  value: this.state.postfix_end,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "current_num",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "current_num",
                  value: this.state.current_num,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <div className="col-lg-3 align-middle">
                <br />
                <button
                  onClick={this.add.bind(this)}
                  className="btn btn-primary"
                >
                  {this.state.btnTxt}
                </button>
              </div>
            </div>
            <br />
          </form>

          <div className="row form-details">
            <div className="col" />
          </div>
        </div>
      </div>
    );
  }
}
