import React, { Component } from "react";
import "../Wrapper/spotlight.css";
import { AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import { algaehApiCall, getCookie } from "../../utils/algaehApiCall";
import ReactDOM from "react-dom";
var intervalId;
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;
class SearchModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: "Search by ",
      searchBy: "",
      searchName: "",
      contains: "",
      isSpeakEnable: false,
      stop: false,
      start: false
    };
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById("searchWindow"));
  };
  handleKeyUp(event) {
    if (!this.spotlight.contains(event.target)) {
      if (event.keyCode === 27) {
        document.getElementById("closeSearch").click();
      }
    }
  }
  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp, false);
  }
  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp, false);

    this.getUserSelectedValue(
      { searchName: this.props.searchName },
      response => {
        let _searchBy = this.props.searchGrid.columns[0]["fieldName"];
        let _name = this.props.searchGrid.columns[0]["label"];
        if (response.data.success === true) {
          if (response.data.records !== undefined) {
            _searchBy = response.data.records.selectedValue;
            _name = response.data.records.name;
          }
        }
        this.handleOnchnageSearchBy({
          target: {
            value: _searchBy,
            title: _name
          }
        });
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
      let _title = nextProps.searchGrid.columns[0]["label"];
      if (response.data.success === true) {
        if (response.data.records !== undefined) {
          _searchBy = response.data.records.selectedValue;
          _title = response.data.records.name;
        }
      }
      this.setState({
        open: nextProps.model.open,
        searchName: nextProps.searchName,
        searchBy: _searchBy,
        isSpeakEnable: false,
        stop: false,
        contains: "",
        title: _title
      });
    });
  }

  setUserSelectedValue(jsonObj, callBack) {
    let _screenName = getCookie("ScreenName").replace("/", "");
    algaehApiCall({
      uri: "/userPreferences/save",
      data: {
        screenName: _screenName,
        ...jsonObj
      },
      method: "POST",
      onSuccess: response => {
        if (typeof callBack === "function") callBack(response);
      }
    });
  }

  handleOnchnageSearchBy(e) {
    let _value = e.target.value;
    let _name =
      e.target.children !== undefined
        ? e.target.children[e.target.selectedIndex].text
        : e.target.title;
    const _title = "Search by " + _name;
    this.setUserSelectedValue(
      { identifier: this.props.searchName, value: _value, name: _name },
      response => {
        this.setState({ searchBy: _value, title: _title });
      }
    );
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
      <div className="col-12">
        <div className="row">
          <div id="spotlightResultArea" className="col-12">
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
                    $this.props.dataSource.inputParam.searchName ===
                      undefined ||
                    $this.props.dataSource.inputParam.searchName === ""
                  ) {
                    return false;
                  } else return true;
                }
              }}
              paging={{
                page: 0,
                rowsPerPage:
                  this.props.rowsPerPage !== undefined
                    ? this.props.rowsPerPage
                    : 10
              }}
              algaehSearch={true}
              onRowSelect={row => {
                this.props.onRowSelect(row);
                //   this.setState({ open: false });
                this.handleClose();
              }}
            />
          </div>
        </div>
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
    // recognizer.lang = "ar-AE";
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
        ref={spotlight => (this.spotlight = spotlight)}
      >
        <div className="helpText">
          <span className="helpTextEsc">press [esc] to close window</span>
          <span
            id="closeSearch"
            className="globalSearch-Close"
            onClick={this.handleClose.bind()}
          >
            <i className="fas fa-times" />
          </span>
        </div>

        <div className="spotlightContainer">
          <div className="col-12">
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="col">
                    <div className="label">Filter by</div>
                    <select className="filterBySelect">
                      <option>Starts with</option>
                      <option>contains</option>
                    </select>
                  </div>
                  <div className="col">
                    <div className="label">Search by</div>
                    <select
                      className="searchBySelect"
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
                </div>
              </div>
              <div className="col-8" id="spotlightFilterBy">
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      id="spotlightInput"
                      tabIndex="1"
                      placeholder={this.state.title}
                      value={this.state.contains}
                      onChange={this.handleSpotLightContains.bind(this)}
                    />
                  </div>
                  <div
                    className="col-1 speckCntr"
                    title="Speak"
                    onClick={this.speakInput.bind(this)}
                  >
                    {this.state.isSpeakEnable ? (
                      <React.Fragment>
                        <i className="fas fa-microphone animated flash" />
                      </React.Fragment>
                    ) : (
                      <i className="fas fa-microphone" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">{this.loadContentDivision()}</div>
        </div>
      </div>
    );
  }
}
export default SearchModule;
