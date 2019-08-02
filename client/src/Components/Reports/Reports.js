import React, { Component } from "react";
import "./reports.css";
import { AlagehAutoComplete } from "../Wrapper/algaehWrapper";
import loadActiveReports from "./reports_data";
import AlgaehReport from "../Wrapper/printReports";
class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
      module: "",
      showSelector: false
    };
  }

  // loadItemList(e) {
  //   e.preventDefault();

  //   if (this.state.module.length === 0) {
  //     swalMessage({
  //       title: "Please Select a Category",
  //       type: "warning "
  //     });
  //   } else {
  //   }
  // }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
      itemList: value.selected.submenu
    });
  }

  handleClose() {
    this.setState({ showSelector: false });
  }

  render() {
    return (
      <div className="reports">
        <div className="row inner-top-search">
          <form action="none" style={{ width: "100%" }}>
            <div className="row padding-10">
              <AlagehAutoComplete
                compireoldprops={true}
                div={{ className: "col-3 form-group" }}
                label={{ forceLabel: "Report Category", isImp: false }}
                selector={{
                  name: "module",
                  autoComplete: "off",
                  className: "select-fld",
                  value: this.state.module,
                  dataSource: {
                    textField: "name",
                    valueField: "name",
                    data: loadActiveReports().data()
                  },
                  others: {},
                  onChange: this.dropDownHandler.bind(this)
                }}
              />

              {/* <AlagehAutoComplete
                div={{ className: "col form-group" }}
                label={{ forceLabel: "Report Category", isImp: false }}
                selector={{
                  name: "module",
                  className: "select-fld",
                  value: this.state.module,
                  dataSource: {
                    textField: "name",
                    valueField: "name",
                    data: data
                  },
                  others: {},
                  onChange: this.dropDownHandler.bind(this)
                }}
              /> */}

              {/* <AlagehFormGroup
                div={{ className: "col form-group" }}
                label={{
                  forceLabel: "Filter by Reports",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "",
                  value: "",
                  events: {},
                  others: {
                    type: "text",
                    placeholder: "Search for reports"
                  },
                  events: {
                    onChange: () => {}
                  }
                }}
              /> */}

              {/* <AlagehFormGroup
                div={{ className: "col" }}
                textBox={{
                  className: "txt-fld",
                  name: "",
                  value: "",
                  others: {
                    style: { padding: 10 },
                    placeholder: "Search for reports"
                  },
                  events: {
                    onChange: () => {}
                  }
                }}
              /> */}
            </div>
          </form>
        </div>

        <div className="portlet portlet-bordered ">
          {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Report List</h3>
            </div>
          </div> */}
          <div
            className="portlet-body"
            style={{ height: "75vh", overflow: "auto" }}
          >
            <div className="col-lg-12">
              <div className="row">
                {this.state.itemList.map((item, index) => (
                  <div
                    key={index}
                    className="col-lg-2 reportList"
                    onClick={() => {
                      let pageProperies = {
                        displayName: item.subitem,
                        reportName: item.reportName,
                        template_name: item.template_name,
                        reportQuery: item.reportQuery,
                        requireIframe: item.requireIframe,
                        fileName: item.template_name
                      };
                      if (item.pageSize !== undefined && item.pageSize !== "") {
                        pageProperies["pageSize"] = item.pageSize;
                      }
                      if (
                        item.pageOrentation !== undefined &&
                        item.pageOrentation !== ""
                      ) {
                        pageProperies["pageOrentation"] = item.pageOrentation;
                      }
                      AlgaehReport({
                        report: pageProperies,
                        plotUI: {
                          paramters: item.reportParameters
                        }
                      });
                    }}
                  >
                    <div>
                      <i className="fas fa-file-medical-alt" />
                      <p>{item.subitem}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
