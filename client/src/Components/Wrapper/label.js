import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { readFiles } from "../Wrapper/languageIndexDB";
import { getCookie, setCookie } from "../../utils/algaehApiCall.js";
import $ from "jquery";
import { connct } from "react-redux";

class Label extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      languageBind: "",
      Language: ""
    };
  }
  getTargetLanguage = (fieldName, callBack) => {
    if (fieldName != null && fieldName != "") {
      let langua = getCookie("Language");
      let screenName = getCookie("ScreenName") + "_";
      let fileName =
        screenName + ((langua == null || langua) == "" ? "en" : langua);
      let fileImport = "./languages/" + fileName + ".json";

      let savePage = window.localStorage.getItem(fileName);
      if (savePage != null && savePage != "") {
        let getLanguageLables = JSON.parse(savePage);
        callBack(getLanguageLables[fieldName]);
        return;
      } else {
        $.getJSON(fileImport, data => {
          window.localStorage.removeItem(fileName);
          window.localStorage.setItem(fileName, JSON.stringify(data));
          callBack(data[fieldName]);
          return;
        });
      }
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
          <label
            className={
              this.props.label.align == null
                ? this.state.Language == "ar"
                  ? "float-right style_Label"
                  : this.props.label.align == "rtl"
                    ? "float-right style_Label"
                    : this.props.label.align == "ltl"
                      ? "float-left style_Label"
                      : "style_Label"
                : null
            }
            {...this.props.label.others}
          >
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
      if (this.props.label.language != null) {
        this.setState({ Language: this.props.label.language.fileName });
      } else {
        this.setState({ Language: getCookie("Language") });
      }

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
      if (this.currentPageCanRender()) {
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
      this.setState({ Language: getCookie("Language") });
    }
  }

  currentPageCanRender = () => {
    let currLang = getCookie("Language");
    let prevLang = getCookie("prevLanguage");
    if (currLang != prevLang) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    return <React.Fragment>{this.labelRender()}</React.Fragment>;
  }
}

Label.propTypes = {
  label: PropTypes.object.isRequired
};

export default Label;
