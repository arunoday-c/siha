import React, { Component } from "react";
import { Search } from "semantic-ui-react";
import _ from "lodash";
import { algaehApiCall, cancelRequest } from "../../utils/algaehApiCall";
import Label from "./label";
// const style = {
// 	clear: {
// 		position: 'absolute',
// 		top: 25,
// 		right: 45,
// 		color: ' #909090',
// 		borderRight: '1px solid #dededf',
// 		paddingLeft: 5,
// 		paddingRight: 5,
// 		background: '#fff'
// 	}
// };
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
    //  this.onResultSelectHandler = this.onResultSelectHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      value: this.props.value
    });
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (this.state.hasSecurity) return;
    if (props.value !== this.state.value) {
      this.setState({
        value: props.value
      });
    }
  }

  handleSearchChange = (e, { value }) => {
    try {
      this.setState(
        {
          isLoading: true,
          value
        },
        () => {
          const that = this;
          clearInterval(that.IntervalID);
          that.IntervalID = setInterval(() => {
            if (value.length < that.state.minCharacters) {
              that.setState({ isLoading: false });

              return;
            }
            let _process = true;
            const _data = that.generateInputParm();
            if (typeof that.props._validateBeforeServiceCall === "function") {
              _process = that.props._validateBeforeServiceCall(_data);
            }
            if (_process) {
              cancelRequest("autoSearch_" + that.props.searchName);
              that.serviceCall(_data);
            }
            clearInterval(that.IntervalID);
          }, 500);
        }
      );
    } catch (e) {
      this.setState({
        isLoading: false
      });
    }
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
    const {
      columns,
      extraParameters,
      searchName,
      directCondition
    } = this.props;
    const { pageSize, pageNo, value } = this.state;
    const _exParameters = extraParameters === undefined ? {} : extraParameters;
    let _arrayParam = columns.map(f => {
      if (f.exclude === undefined || f.exclude !== true)
        return { [f.fieldName]: value };
    });
    //  Array.prototype.push.apply(_arrayParam, _exParameters);

    // Object.keys(_exParameters).map((item, index) => {
    //   const obj = {};
    //   obj[item] = _exParameters[item];
    //
    //   _arrayParam.push(obj);
    // });
    const _directCondition =
      directCondition === undefined ? {} : { directCondition: directCondition };
    const exteraParam = Object.keys(_exParameters);
    for (let i = 0; i < exteraParam.length; i++) {
      const obj = {};
      obj[exteraParam[i]] = _exParameters[exteraParam[i]];
      _arrayParam.push(obj);
    }
    return {
      parameters: _arrayParam,
      searchName: searchName,
      pageSize: pageSize,
      pageNo: pageNo,
      ..._directCondition
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
      cancelRequestId: "autoSearch_" + this.props.searchName,
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
  onClearHandler(e) {
    this.setState(
      {
        value: "",
        isLoading: false
      },
      () => {
        if (typeof this.props.onClear === "function") {
          this.props.onClear();
        }
      }
    );
  }

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
          onResultSelect={this.onResultSelectHandler.bind(this)}
          value={value}
          name={this.props.name}
          resultRenderer={this.generateTemplate.bind(this)}
          {...this.props.others}
        />{" "}
        <span
          className="autoSearchClear"
          onClick={this.onClearHandler.bind(this)}
        >
          <i className="fas fa-times" />
        </span>
      </div>
    );
  }
}
