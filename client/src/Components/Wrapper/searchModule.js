import React, { Component } from "react";
import "../Wrapper/spotlight.css";
import { AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../utils/algaehApiCall";
var intervalId;
class SearchModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: "Algaeh Search",
      searchBy: "",
      searchName: "",
      contains: ""
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
          searchBy: _searchBy
        });
      }
    );
  }
  /*
    to get the previously stored value into UserPreferences
*/
  getUserSelectedValue(nextProps, callBack) {
    algaehApiCall({
      uri: "/userPreferences/get",
      data: {
        screenName: "frontDesk",
        identifier: nextProps.searchName,
        userId: 1
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
        searchBy: _searchBy
      });
    });
  }

  setUserSelectedValue(identifier, value, callBack) {
    algaehApiCall({
      uri: "/userPreferences/save",
      data: {
        screenName: "frontDesk",
        identifier: identifier,
        userId: 1,
        value: value
      },
      method: "POST",
      onSuccess: response => {
        if (typeof callBack === "function") callBack(response);
      }
    });
  }

  handleOnchnageSearchBy(e) {
    let $this = this;
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
    let $this = this;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (typeof $this.props.onContainsChange === "function") {
        $this.props.onContainsChange(contains, $this.state.searchBy, vlaue => {
          $this.setState({ contains: vlaue });
        });
      } else {
        $this.setState({ contains: contains });
      }
      clearInterval(intervalId);
    }, 500);
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
            onChange={this.handleSpotLightContains.bind(this)}
          />
          <div id="spotlightFilterBy">
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
