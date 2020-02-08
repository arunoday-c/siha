import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./reports.scss";
// import { AlagehAutoComplete } from "../Wrapper/algaehWrapper";
import loadActiveReports from "./reports_data";
import AlgaehReport from "../Wrapper/printReports";
import { MainContext } from "algaeh-react-components/context";
class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
      module: "",
      showSelector: false,
      excel: "false"
    };
  }
  static contextType = MainContext;
  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
      itemList: value.selected.submenu,
      excel: value.selected.excel
    });
  }

  handleClose() {
    this.setState({ showSelector: false });
  }
  componentDidMount() {
    const { userToken, selectedMenu } = this.context;
    // console.log("useParams", this.props.match);
    const { match } = this.props;
    loadActiveReports(userToken, selectedMenu, match.params.name).then(
      result => {
        this.setState({
          // [value.name]: value.value,
          itemList: result.submenu,
          excel: result.excel
        });
      }
    );
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (prevProps.match.params.name !== match.params.name) {
      const { userToken, selectedMenu } = this.context;
      loadActiveReports(userToken, selectedMenu, match.params.name).then(
        result => {
          this.setState({
            // [value.name]: value.value,
            itemList: result.submenu,
            excel: result.excel
          });
        }
      );
    }
  }

  render() {
    const { userToken, selectedMenu } = this.context;
    return (
      <div className="reports margin-top-15">
        {/* <div className="row inner-top-search">
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
                    data: loadActiveReports(userToken).data()
                  },
                  others: {},
                  onChange: this.dropDownHandler.bind(this)
                }}
              />
            </div>
          </form>
        </div> */}

        <div className="portlet portlet-bordered ">
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
                      pageProperies["excel"] = this.state.excel;
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

export default withRouter(Reports);
