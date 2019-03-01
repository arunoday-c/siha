import React, { Component } from "react";
import { Search } from "semantic-ui-react";
import _ from "lodash";
import { algaehApiCall } from "../../utils/algaehApiCall";
import Label from "./label";

export default class AlgaehAutoSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      isLoading: false,
      results: [],
      totalRecords: 0,
      minCharacters: 2,
      pageSize: 100,
      pageNo: 0
    };
    this.onResultSelectHandler = this.onResultSelectHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      value: this.props.value
    });
  }

  componentWillReceiveProps(props) {
    debugger;
    if (this.state.hasSecurity) return;
    if (props.value !== this.state.value) {
      this.setState({
        value: props.value
      });
    }
  }

  handleSearchChange = (e, { value }) => {
    this.setState(
      {
        isLoading: true,
        value
      },
      () => {
        if (value.length < this.state.minCharacters) {
          this.setState({ isLoading: false });
          return;
        }
        let _process = true;
        const _data = this.generateInputParm();
        if (typeof this.props._validateBeforeServiceCall === "function") {
          _process = this.props._validateBeforeServiceCall(_data);
        }
        if (_process) {
          this.serviceCall(_data);
        }
      }
    );
  };
  onResultSelectHandler(e, { result }) {
    this.setState(
      {
        value: result[this.props.displayField]
      },
      () => {
        if (typeof this.props.onClick === "function")
          this.props.onClick(result, this.props.name);
      }
    );
  }
  generateTemplate(details) {
    return this.props.template(details);
  }
  generateInputParm() {
    const { columns, extraParameters, searchName } = this.props;
    const { pageSize, pageNo, value } = this.state;
    const _exParameters = extraParameters === undefined ? {} : extraParameters;
    let _arrayParam = columns.map(f => {
      if (f.exclude === undefined || f.exclude !== true)
        return { [f.fieldName]: value };
    });
    Array.prototype.push.apply(_arrayParam, _exParameters);
    return {
      parameters: _arrayParam,
      searchName: searchName,
      pageSize: pageSize,
      pageNo: pageNo
    };
  }

  serviceCall(data) {
    const _uri =
      this.props.uri !== undefined
        ? this.props.uri
        : "/gloabelSearch/newSearch";
    algaehApiCall({
      uri: _uri,
      data: data,
      method: "POST",
      onSuccess: response => {
        if (response.data.success === true) {
          if (response.data.records !== undefined) {
            const _records = response.data.records;
            const _recordData = _records.data;
            this.setState({
              totalRecords: _records.totalPages,
              results: _recordData,
              isLoading: false
            });
          }
        }
      }
    });
  }
  onSelectionChangeHandler(event, data) {}
  renderLabel = () => {
    return <Label label={this.props.label} />;
  };
  render() {
    const { isLoading, results, value } = this.state;

    const _fluid =
      this.props.fullWidth !== undefined ? { fluid: this.props.fullWidth } : {};

    return (
      <div
        className={
          this.props.div !== undefined ? this.props.div.className : null
        }
      >
        {this.renderLabel()}
        <Search
          loading={isLoading}
          results={results}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true
          })}
          placeholder={this.props.title}
          {..._fluid}
          onResultSelect={this.onResultSelectHandler}
          value={value}
          name={this.props.name}
          resultRenderer={this.generateTemplate.bind(this)}
        />
      </div>
    );
  }
}
