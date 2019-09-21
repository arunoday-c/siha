import React, { Component } from "react";
import "./concurrent-test.scss";

import {
  AlagehFormGroup,
  AlagehAutoComplete
} from "../Components/Wrapper/algaehWrapper";
import { algaehApiCall } from "../utils/algaehApiCall";

class ConcurrentTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      methodType: null,
      enterURL: "",
      enterHeader: "",
      enterInput: "",
      enterConcurrent: 1,
      maxLines: 1000,
      appendComponent: [],
      FireDisabled: false,
      spinner: ""
    };
  }

  clearTerminal() {
    this.setState({ spinner: "fa-spin", appendComponent: [] }, () => {
      this.setState({ spinner: "" });
    });
  }

  HandleMethodTypes(selector) {
    this.setState({ methodType: selector.value });
  }
  HandleMethodTypesClear(name) {
    this.setState({ methodType: null });
  }
  TextHandler(e) {
    const _name = e.target.name;
    const _value = e.target.value;
    if (_name !== undefined) {
      this.setState({ [_name]: _value });
    }
  }

  checkArrayToClear(callback) {
    let _componentAppend = this.state.appendComponent;

    if (this.state.appendComponent.length >= this.state.maxLines) {
      _componentAppend = [];
    }

    _componentAppend.push(
      "Server Request Started for '" +
        this.state.enterConcurrent +
        "' \
    Concurrent Service Calls  \n  \
    URI : '" +
        this.state.enterURL +
        " ' \
    \n  INPUT : '" +
        this.state.enterInput +
        "' \n  .......... Started Time.........." +
        new Date().toLocaleTimeString()
    );
    this.setState(
      {
        FireDisabled: true,
        appendComponent: _componentAppend,
        spinner: "fa-spin"
      },
      () => {
        callback();
      }
    );
  }

  runApiCalls(e) {
    if (this.state.enterURL === "") return;
    this.checkArrayToClear(() => {
      const _concorrent = parseInt(this.state.enterConcurrent, 10);
      const _data =
        this.state.enterInput !== "" ? JSON.parse(this.state.enterInput) : {};
      const _that = this;
      for (let i = 1; i <= _concorrent; i++) {
        algaehApiCall({
          timerNotRequired: true,
          uri: _that.state.enterURL,
          method:
            _that.state.methodType === null ? "GET" : _that.state.methodType,
          data: _data,
          onSuccess: response => {
            let _componentAppend = _that.state.appendComponent;

            if (_that.state.appendComponent.length >= _that.state.maxLines) {
              _componentAppend = [];
            }
            _componentAppend.push(
              "Status '" +
                response.status +
                "' (" +
                response.statusText +
                ") \n  \
            INTERNAL STATUS : " +
                response.data.success +
                " ................ : " +
                i +
                " : ....... Elapsed time  : " +
                new Date().toLocaleTimeString()
            );
            _that.setState({
              FireDisabled: false,
              appendComponent: _componentAppend,
              spinner: ""
            });
          },
          onFailure: error => {
            let _componentAppend = _that.state.appendComponent;

            if (_that.state.appendComponent.length >= _that.state.maxLines) {
              _componentAppend = [];
            }
            _componentAppend.push("Error  Details : " + JSON.stringify(error));
            _that.setState({
              FireDisabled: false,
              appendComponent: _componentAppend,
              spinner: ""
            });
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="concurrentTest">
        <div className="col-lg-12">
          <div className="portlet portlet-bordered margin-top-15">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{ forceLabel: "Method Type" }}
                selector={{
                  name: "methodType",
                  className: "select-fld",
                  value: this.state.methodType,
                  dataSource: {
                    textField: "text",
                    valueField: "value",
                    data: [
                      { value: "GET", text: "GET" },
                      { value: "POST", text: "POST" },
                      { value: "PUT", text: "PUT" },
                      { value: "DELETE", text: "DELETE" }
                    ]
                  },
                  onChange: this.HandleMethodTypes.bind(this),
                  onClear: this.HandleMethodTypesClear.bind(this)
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-3" }}
                label={{
                  forceLabel: "Enter URL"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "enterURL",
                  value: this.state.enterURL,
                  events: {
                    onChange: this.TextHandler.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Enter Header"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "enterHeader",
                  value: this.state.enterHeader,
                  events: {
                    onChange: this.TextHandler.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Enter Input"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "enterInput",
                  value: this.state.enterInput,
                  events: {
                    onChange: this.TextHandler.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "No. of Concurrent"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "enterConcurrent",
                  value: this.state.enterConcurrent,
                  events: {
                    onChange: this.TextHandler.bind(this)
                  }
                }}
              />
              <div className="col">
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 21 }}
                  disabled={this.state.FireDisabled}
                  onClick={this.runApiCalls.bind(this)}
                >
                  FIRE
                </button>
              </div>
            </div>
          </div>

          <div className="portlet portlet-bordered margin-bottom-15 margin-top-15 console-log-Cntr">
            <div className="row">
              <div className="col console-log-div">
                {this.state.appendComponent.map((component, index) => (
                  <p key={index}>{component}</p>
                ))}
                <i
                  className={"fas fa-sync-alt " + this.state.spinner}
                  onClick={this.clearTerminal.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConcurrentTest;
