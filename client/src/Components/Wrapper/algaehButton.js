import React, { PureComponent } from "react";
import AlgaehLabel from "./label";

import { algaehApiCall } from "../../utils/algaehApiCall"; //"./algaehApiCall.js"
export default class ButtonType extends PureComponent {
  constructor(props) {
    super(props);
    this.containerEl = document.createElement("div");
    this.externalWindow = null;
    this.state = {
      loading: false,
      classname: "",
      showReport: false
    };
  }
  componentDidMount() {
    let loading = this.props.loading === undefined ? false : this.props.loading;
    if (this.props.isReport === true) {
      loading = true;
    }
    const classname =
      this.props.classname === undefined ? "btn-default" : this.props.classname;
    this.setState({
      loading: loading,
      classname: classname
    });
  }
  componentWillReceiveProps(props) {
    let loading = props.loading === undefined ? false : props.loading;
    if (props.isReport === true) {
      loading = true;
    }
    const classname =
      props.classname === undefined ? "btn-default" : props.classname;
    this.setState({
      loading: loading,
      classname: classname,
      report: ""
    });
  }

  launchReport(data) {
    // return (
    //   <AlgaehViewer reportparam={this.props.reportparam}>
    //     <iframe
    //       src={this.state.report + "#zoom=100"}
    //       width="100%"
    //       height="100%"
    //     />
    //   </AlgaehViewer>
    // );
    let myWindow = window.open("", "", "width=800,height=500,left=200,top=200");

    myWindow.document.write(
      "<iframe src= '" + data + "' width='100%' height='100%' />"
    );
    myWindow.document.title = this.props.displayName;
    myWindow.document.body.style.overflow = "hidden";
  }
  componentWillUnmount() {
    if (this.externalWindow !== null) this.externalWindow.close();
  }

  onClickHandler(e) {
    try {
      const that = this;
      that.setState(
        {
          loading: true
        },
        () => {
          algaehApiCall({
            uri: "/report",
            method: "GET",
            module: "reports",
            headers: {
              Accept: "blob"
            },
            others: { responseType: "blob" },
            data: { report: that.props.report },
            onSuccess: res => {
              const url = URL.createObjectURL(res.data);
              that.launchReport(url);
              that.setState({
                loading: false
              });
            }
          });
        }
      );
    } catch (e) {
      this.setState({
        loading: false,
        showReport: false
      });
    }
  }
  render() {
    const { loading, classname } = this.state;
    return (
      <React.Fragment>
        <button
          type="button"
          className={
            "btn " + classname + (loading === true ? " btn-loader" : "")
          }
          onClick={this.onClickHandler.bind(this)}
          {...this.props.others}
        >
          {loading === true ? (
            <span className="showBtnLoader">
              <i className="fas fa-spinner fa-spin" />
            </span>
          ) : null}

          <AlgaehLabel label={this.props.label} />
        </button>
      </React.Fragment>
    );
  }
}
