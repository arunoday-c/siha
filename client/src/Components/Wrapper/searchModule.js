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
      page: 0,
      searchName: "",
      contentDivVisibility: false,
      contains: ""
    };
  }

  handleOpen = () => {
    this.setState({ open: true, contentDivVisibility: false });
  };

  handleClose = () => {
    this.setState({
      open: false,
      contentDivVisibility: false
    });
  };

  componentDidMount() {
    document.addEventListener("keyup", function(e) {
      if (e.keyCode == 27) {
        document.getElementById("closeSearch").click();
      }
    });
    this.setState({
      open: this.props.model.open,
      searchName: this.props.searchName,
      searchBy: this.props.searchGrid.columns[0]["fieldName"]
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.model.open,
      searchName: nextProps.searchName,
      searchBy: nextProps.searchGrid.columns[0]["fieldName"]
    });
  }

  handleOnchnageSearchBy(e) {
    this.setState({ searchBy: e.target.value });
  }
  handleSpotLightContains(e) {
    let contains = e.target.value;
    let $this = this;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (typeof $this.props.onContainsChange === "function") {
        $this.props.onContainsChange(contains, $this.state.searchBy, () => {
          $this.setState({ contains: contains, contentDivVisibility: true });
        });
      } else {
        $this.setState({ contains: contains, contentDivVisibility: true });
      }
      clearInterval(intervalId);
    }, 500);
  }

  loadContentDivision = () => {
    if (this.state.contentDivVisibility) {
      return (
        <div id="spotlightResultArea" className="animated  fadeIn">
          <AlgaehDataGrid
            columns={this.props.searchGrid.columns}
            dataSource={{
              uri: this.props.uri,
              inputParam: {
                fieldName: this.state.searchBy,
                fieldContains: this.state.contains,
                searchName: this.state.searchName
              },
              method: "GET",
              responseSchema: {
                data: "records.data",
                totalPages: "records.totalPages"
              }
            }}
            paging={{
              page: 0,
              rowsPerPage:
                this.props.rowsPerPage !== undefined
                  ? this.props.rowsPerPage
                  : 5
            }}
            algaehSearch={true}
            onRowSelect={row => {
              this.props.onRowSelect(row);
              this.setState({ open: false });
            }}
          />
        </div>
      );
    }
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
