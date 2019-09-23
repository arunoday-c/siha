import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./PackageList.scss";
import "./../../../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";

class PackageList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      packages: []
    };
  }

  componentWillReceiveProps(nextProps) {
    let InputOutput = nextProps.PackageIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (
      this.props.bilservices === undefined ||
      this.props.bilservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "bilservices"
        }
      });
    }
  }

  onClose = e => {
    this.setState(
      {
        packages: []
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-op-display-billing-form">
          <AlgaehModalPopUp
            title={this.props.HeaderCaption}
            openPopup={this.props.open}
            events={{
              onClose: this.onClose.bind(this)
            }}
          >
            <div className="col-lg-12">
              <hr />
              <div className="row">
                <div className="col-lg-12" id="package_list_grd">
                  <AlgaehDataGrid
                    id="package_list"
                    columns={[
                      {
                        fieldName: "service_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.bilservices === undefined
                              ? []
                              : this.props.bilservices.filter(
                                  f => f.hims_d_services_id === row.service_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].service_name
                                  : display[0].arabic_service_name
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "service_amount",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "service_amount" }}
                          />
                        )
                      }
                    ]}
                    keyId="package_list"
                    dataSource={{
                      data: this.state.packages
                    }}
                    paging={{ page: 0, rowsPerPage: 20 }}
                  />
                </div>
              </div>

              {/* Payables */}
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>
                  <div className="col-lg-8">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    bilservices: state.bilservices
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PackageList)
);
