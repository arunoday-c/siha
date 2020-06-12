import React, { PureComponent } from "react";
//import PropTypes from "prop-types";
//import { readFiles } from "../Wrapper/languageIndexDB";
import { getCookie } from "../../utils/algaehApiCall.js";
//import jQuery from "node-jquery";

//import { connct } from "react-redux";
class Label extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      languageBind: "",
      Language: ""
    };
  }
  getTargetLanguage = (fieldName, callBack) => {
    if (fieldName !== undefined && fieldName !== "") {
      let langua = getCookie("Language");
      let screenName = getCookie("ScreenName") + "_";
      let fileName =
        screenName + (langua === undefined || langua === "" ? "en" : langua);
      let fileImport = "./languages/" + fileName + ".json";
      let savePage = window.localStorage.getItem(fileName);
      if (savePage !== null && savePage !== "") {
        let getLanguageLables = JSON.parse(savePage);
        callBack(getLanguageLables[fieldName]);
        return;
      } else {
        this.loadJSON(fileImport, data => {
          window.localStorage.removeItem(fileName);
          window.localStorage.setItem(fileName, JSON.stringify(data));
          callBack(data[fieldName]);
        });
      }
    } else {
      callBack("");
      //console.error("Label is missing with 'fieldName'");
    }
  };
  loadJSON = (file, callback) => {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", file, true);
    xobj.onreadystatechange = function() {
      if (xobj.readyState === 4 && xobj.status === 200) {
        callback(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);
  };

  important = () => {
    if (
      this.props.label.isImp !== undefined &&
      this.props.label.isImp === true
    ) {
      return <span className="imp">&nbsp;*</span>;
    } else {
      return null;
    }
  };

  labelRender = () => {
    if (this.props.label !== undefined) {
      if (this.props.label.returnText !== undefined) {
        return this.state.languageBind;
      }
      if (this.state.languageBind !== "&nbsp;") {
        const lClassName = this.props.label.className
          ? this.props.label.className
          : "";
        return (
          <label
            className={
              this.props.label.align === undefined
                ? this.state.Language === "ar"
                  ? "text-arabic style_Label " + lClassName
                  : this.props.label.align === "rtl"
                  ? "text-arabic style_Label " + lClassName
                  : this.props.label.align === "ltl"
                  ? "float-left style_Label " + lClassName
                  : "style_Label " + lClassName
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
  UNSAFE_componentWillMount() {
    if (this.props.label !== undefined) {
      if (
        this.props.label.language !== undefined &&
        this.props.label.fieldName !== undefined
      ) {
        this.setState({ Language: this.props.label.language.fileName });
      } else {
        this.setState({ Language: getCookie("Language") });
      }

      // if (this.props.label.forceLabel === undefined) {
      //   this.getTargetLanguage(this.props.label.fieldName, data => {
      //     this.setState({ languageBind: data });
      //   });
      // } else {
      //   this.setState({ languageBind: this.props.label.forceLabel });
      // }
      this.getTargetLanguage(this.props.label.fieldName, data => {
        const _bindTo =
          data !== undefined && data !== null && data !== ""
            ? data
            : this.props.label.forceLabel !== undefined
            ? this.props.label.forceLabel
            : data;
        this.setState({ languageBind: _bindTo });
      });
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps !== undefined) {
      if (this.currentPageCanRender()) {
        if (nextProps.label !== undefined) {
          // if (
          //   this.props.label.forceLabel === undefined &&
          //   this.props.label.fieldName !== undefined
          // ) {
          //   this.getTargetLanguage(this.props.label.fieldName, data => {
          //     this.setState({ languageBind: data });
          //   });
          // } else {
          //   this.setState({ languageBind: this.props.label.forceLabel });
          // }
          this.getTargetLanguage(nextProps.label.fieldName, data => {
            const _bindTo =
              data !== undefined && data !== null && data !== ""
                ? data
                : nextProps.label.forceLabel !== undefined
                ? nextProps.label.forceLabel
                : data;
            this.setState({ languageBind: _bindTo });
          });
        }
      }

      this.setState({ Language: getCookie("Language") });
    }
  }

  currentPageCanRender = () => {
    let currLang = getCookie("Language");
    let prevLang = getCookie("prevLanguage");
    if (currLang !== prevLang) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    return <React.Fragment>{this.labelRender()}</React.Fragment>;
  }
}

export default Label;
