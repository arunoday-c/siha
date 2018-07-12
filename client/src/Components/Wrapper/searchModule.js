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
      loadedData: [],
      gridData: [],
      searchName: ""
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    document.addEventListener("keyup", function(e) {
      if (e.keyCode == 27) {
        document.getElementById("closeSearch").click();
      }
    });
    this.setState({
      open: this.props.model.open,
      searchName: this.props.searchName
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.model.open,
      searchName: nextProps.searchName
    });
  }
  apiCallingFunction = (contains, $this) => {
    algaehApiCall({
      uri: "/gloabelSearch/get",
      data: {
        fieldName: $this.state.searchBy,
        fieldContains: contains,
        searchName: $this.state.searchName
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          $this.setState({
            loadedData: response.data.records,
            gridData: response.data.records
          });
        } else {
          console.error(response);
          alert(response.data.message);
        }
      },
      onFailure: data => {
        console.error(data);
        alert(data);
      }
    });
  };

  handleOnchnageSearchBy(e) {
    this.setState({ searchBy: e.target.value });
  }
  handleSpotLightContains(e) {
    let filterData = this.state.loadedData.filter(f => {
      if (f[this.state.searchBy].indexOf(e.target.value) > -1) {
        return f;
      }
    });
    if (filterData.length === 0) {
      let $this = this;
      let contains = e.target.value;
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        $this.apiCallingFunction(contains, $this);
        clearInterval(intervalId);
      }, 500);
    } else this.setState({ gridData: filterData });
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
        <div className="row">
          <input
            id="spotlight"
            type="text"
            placeholder={this.state.title}
            onChange={this.handleSpotLightContains.bind(this)}
          />
          <div id="filterBy">
            <select
              onChange={this.handleOnchnageSearchBy.bind(this)}
              value={this.state.searchBy}
            >
              {this.props.selector.dataSource.data.map((row, index) => (
                <option
                  key={index}
                  datafieldtype={row.fieldType}
                  value={row[this.props.selector.dataSource.valueField]}
                >
                  {row[this.props.selector.dataSource.textField]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div id="contentArea" className="animated  zoomInUp">
          <AlgaehDataGrid
            columns={this.props.searchGrid.columns}
            dataSource={{
              data: this.state.gridData
            }}
            paging={{ page: 0, rowsPerPage: 5 }}
            others={{ style: { backgroundColor: "#f9f5f4" } }}
          />
        </div>
      </div>
    );
  }
}
export default SearchModule;
