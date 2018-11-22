import React, { Component } from "react";
import "./concurrent-test.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../Components/Wrapper/algaehWrapper";

class ConcurrentTest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="concurrentTest">
        <div className="col-lg-12">
          <div className="portlet portlet-bordered box-shadow-normal margin-top-15">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{ forceLabel: "Method Type" }}
                selector={{
                  name: "methodType",
                  className: "select-fld",
                  value: this.state.modules,
                  dataSource: {
                    textField: "text",
                    valueField: "value",
                    data: [
                      { value: "GET", text: "GET" },
                      { value: "GET", text: "GET" },
                      { value: "GET", text: "GET" }
                    ]
                  },
                  onChange: null,
                  onClear: null
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
                  //value: this.state.batchno,
                  events: {
                    onChange: null
                  },
                  others: {
                    // disabled: true
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
                  //value: this.state.batchno,
                  events: {
                    onChange: null
                  },
                  others: {
                    // disabled: true
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
                  //value: this.state.batchno,
                  events: {
                    onChange: null
                  },
                  others: {
                    // disabled: true
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
                  //value: this.state.batchno,
                  events: {
                    onChange: null
                  },
                  others: {
                    // disabled: true
                  }
                }}
              />
              <div className="col">
                <button className="btn btn-primary" style={{ marginTop: 21 }}>
                  FIRE
                </button>
              </div>
            </div>
          </div>

          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 margin-top-15 console-log-Cntr">
            <div className="row">
              <div className="col console-log-div">
                <p>
                  127.0.0.1 - devteam [22/Nov/2018:05:08:45 +0000] "GET
                  /api/v1/apiAuth HTTP/1.1" 200 511 "http://localhost:1313/"
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1)
                  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102
                  Safari/537.36"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConcurrentTest;
