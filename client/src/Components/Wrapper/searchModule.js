import React, { Component } from "react";
import "../Wrapper/spotlight.css";
import { AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import { algaehApiCall, getCookie } from "../../utils/algaehApiCall";
import IconButton from "@material-ui/core/IconButton";
import MicOff from "@material-ui/icons/MicOff";
import Mic from "@material-ui/icons/Mic";

var intervalId;
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;
class SearchModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: "Algaeh Search",
      searchBy: "",
      searchName: "",
      contains: "",
      isSpeakEnable: false,
      stop: false,
      start: false
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  componentDidMount() {
    document.addEventListener("keyup", function(e) {
      if (e.keyCode == 27) {
        document.getElementById("closeSearch").click();
      }
    });

    this.getUserSelectedValue(
      { searchName: this.props.searchName },
      response => {
        let _searchBy = this.props.searchGrid.columns[0]["fieldName"];
        if (response.data.success === true) {
          if (response.data.records !== undefined) {
            _searchBy = response.data.records.selectedValue;
          }
        }
        this.setState({
          open: this.props.model.open,
          searchName: this.props.searchName,
          searchBy: _searchBy,
          isSpeakEnable: false,
          stop: false,
          contains: ""
        });
      }
    );
  }
  /*
    to get the previously stored value into UserPreferences
*/
  getUserSelectedValue(nextProps, callBack) {
    let _screenName = getCookie("ScreenName").replace("/", "");
    algaehApiCall({
      uri: "/userPreferences/get",
      data: {
        screenName: _screenName,
        identifier: nextProps.searchName
      },
      method: "GET",
      onSuccess: response => {
        if (typeof callBack === "function") callBack(response);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.getUserSelectedValue(nextProps, response => {
      let _searchBy = nextProps.searchGrid.columns[0]["fieldName"];
      if (response.data.success === true) {
        if (response.data.records !== undefined) {
          _searchBy = response.data.records.selectedValue;
        }
      }
      this.setState({
        open: nextProps.model.open,
        searchName: nextProps.searchName,
        searchBy: _searchBy,
        isSpeakEnable: false,
        stop: false,
        contains: ""
      });
    });
  }

  setUserSelectedValue(identifier, value, callBack) {
    let _screenName = getCookie("ScreenName").replace("/", "");
    algaehApiCall({
      uri: "/userPreferences/save",
      data: {
        screenName: _screenName,
        identifier: identifier,
        value: value
      },
      method: "POST",
      onSuccess: response => {
        if (typeof callBack === "function") callBack(response);
      }
    });
  }

  handleOnchnageSearchBy(e) {
    let _value = e.target.value;
    this.setUserSelectedValue(this.props.searchName, _value, response => {
      this.setState({ searchBy: _value });
    });
  }
  /*
       function handle onchange when user start typing a interval starts and
       ends when it continue in typing if not service call in 500 ms
   */
  handleSpotLightContains(e) {
    let contains = e.target.value;
    this.setState({ contains: contains });

    let $this = this;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (typeof $this.props.onContainsChange === "function") {
        $this.props.onContainsChange(contains, $this.state.searchBy, value => {
          return value;
        });
      }
      clearInterval(intervalId);
    }, 1000);
  }

  /*
    soptlight content loaded area where grid is going to load with data
 */
  loadContentDivision = () => {
    return (
      <div id="spotlightResultArea" className="animated  fadeIn">
        <AlgaehDataGrid
          columns={this.props.searchGrid.columns}
          dataSource={{
            uri: this.props.uri,
            inputParam: {
              inputs: this.props.inputs,
              fieldName: this.state.searchBy,
              fieldContains: this.state.contains,
              searchName: this.state.searchName
            },
            method: "GET",
            responseSchema: {
              data: "records.data",
              totalPages: "records.totalPages"
            },
            validateBeforeServiceCall: $this => {
              if (
                $this.props.dataSource.inputParam.searchName === undefined ||
                $this.props.dataSource.inputParam.searchName === ""
              ) {
                return false;
              } else return true;
            }
          }}
          paging={{
            page: 0,
            rowsPerPage:
              this.props.rowsPerPage !== undefined ? this.props.rowsPerPage : 5
          }}
          algaehSearch={true}
          onRowSelect={row => {
            this.props.onRowSelect(row);
            this.setState({ open: false });
          }}
        />
      </div>
    );
  };
  speakInput(e) {
    if (window.SpeechRecognition === null) {
      alert(
        "your browser not support this feature, please install latest version of chrome."
      );
    } else {
      var recognizer = new window.SpeechRecognition();
      const isSpeak = !this.state.isSpeakEnable;
      this.setState({ isSpeakEnable: isSpeak });
      if (isSpeak) this.startSpeaking(recognizer);
      else recognizer.stop();
    }
  }
  startSpeaking(recognizer) {
    let $this = this;
    recognizer.start();
    // true =Recogniser doesn't stop listening even if the user pauses
    recognizer.continuous = false;
    recognizer.onresult = event => {
      for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          $this.setState({
            isSpeakEnable: false,
            contains: event.results[i][0].transcript
          });
        }
      }
    };
    recognizer.onerror = error => {
      recognizer.stop();
      $this.setState({ isSpeakEnable: false, contains: "" });
      console.error("speach error : ", error);
    };
  }

  render() {
    return (
      <div
        id="spotlight_wrapper"
        className={this.state.open === true ? "d-block" : "d-none"}
      >
        <button
          id="closeSearch"
          className="d-none"
          onClick={this.handleClose.bind()}
        />
        <div className="row spotlightContainer">
          <input
            id="spotlightInput"
            type="text"
            placeholder={this.state.title}
            value={this.state.contains}
            onChange={this.handleSpotLightContains.bind(this)}
          />
          <div id="spotlightFilterBy">
            <IconButton title="Speak" onClick={this.speakInput.bind(this)}>
              {this.state.isSpeakEnable ? (
                <React.Fragment>
                  <Mic color="secondary" className="animated  flash" />
                </React.Fragment>
              ) : (
                <MicOff />
              )}
            </IconButton>

            <select
              onChange={this.handleOnchnageSearchBy.bind(this)}
              value={this.state.searchBy}
            >
              {this.props.searchGrid.columns.map((row, index) => (
                <option
                  key={index}
                  datafieldtype={row.fieldType}
                  value={row["fieldName"]}
                >
                  {row["label"]}
                </option>
              ))}
            </select>
          </div>
          {this.loadContentDivision()}
        </div>
      </div>
    );
  }
}
export default SearchModule;
