import React, { Component } from "react";
import PropTypes from "prop-types";
import $ from "jquery";
export default class Label extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageBind: ""
    };
  }
  getTargetLanguage = (fieldName, callBack) => {
    if (fieldName != null && fieldName != "") {
      let fileImport =
        "./languages/" + this.props.label.language.fileName + ".json";

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
      return (
        <label>
          {this.state.languageBind}
          {this.important()}
        </label>
      );
    } else {
      return null;
    }
  };
  componentWillMount() {
    if (this.props.label != null) {
      this.getTargetLanguage(this.props.label.fieldName, data => {
        this.setState({ languageBind: data });
      });
    }
  }
  render() {
    return (
      <React.Fragment>
        {this.labelRender()}
        {this.important()}
      </React.Fragment>
    );
  }
}
Label.propTypes = {
  label: PropTypes.object.isRequired
};
