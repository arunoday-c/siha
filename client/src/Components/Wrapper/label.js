import React, { Component } from "react";
import PropTypes from "prop-types";
import $ from "jquery";
import { getCookie } from "../../utils/algaehApiCall.js";
export default class Label extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageBind: ""
    };
  }
  getTargetLanguage = (fieldName, callBack) => {
    if (fieldName != null && fieldName != "") {
      let Language = getCookie("Language");
      if (this.props.label.language != null) {
        Language = this.props.label.language.fileName;
      }

      let fileImport = "./languages/" + Language + ".json";

      $.getJSON(fileImport, data => {
        callBack(data[fieldName]);
        return;
      });
    } else {
      console.error("Label is missing with 'fieldName'");
    }
  };
  important = () => {
    if (this.props.label.isImp != null && this.props.label.isImp == true) {
      return <span className="imp">&nbsp;*</span>;
    } else {
      return null;
    }
  };
  labelRender = () => {
    if (this.props.label != null) {
      if (this.state.languageBind != "&nbsp;") {
        return (
          <label>
            {this.state.languageBind}
            {this.important()}
          </label>
        );
      } else {
        return <label>&nbsp;</label>;
      }
    } else {
      return null;
    }
  };
  componentWillMount() {
    if (this.props.label != null) {
      if (this.props.label.forceLabel == null) {
        this.getTargetLanguage(this.props.label.fieldName, data => {
          this.setState({ languageBind: data });
        });
      } else {
        this.setState({ languageBind: this.props.label.forceLabel });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps != null && nextProps != "") {
      if (this.props.label != null) {
        if (this.props.label.forceLabel == null) {
          this.getTargetLanguage(this.props.label.fieldName, data => {
            this.setState({ languageBind: data });
          });
        } else {
          this.setState({ languageBind: this.props.label.forceLabel });
        }
      }
    }
  }
  render() {
    return <React.Fragment>{this.labelRender()}</React.Fragment>;
  }
}
Label.propTypes = {
  label: PropTypes.object.isRequired
};
