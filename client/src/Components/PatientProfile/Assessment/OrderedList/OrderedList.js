import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import OrderingServices from "../OrderingServices/OrderingServices";
import "./OrderedList.css";
import "../../../../styles/site.css";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getCookie } from "../../../../utils/algaehApiCall";
import Options from "../../../../Options.json";

class OrderedList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen
      },
      () => {
        this.props.getOrderList({
          uri: "/orderAndPreApproval/selectOrderServicesbyDoctor",
          method: "GET",
          data: {
            visit_id: Window.global["visit_id"]
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "orderedList"
          },
          afterSuccess: data => {}
        });
      }
    );
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.servicetype === undefined ||
      this.props.servicetype.length === 0
    ) {
      this.props.getServiceTypes({
        uri: "/serviceType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "servicetype"
        }
      });
    }

    if (
      this.props.serviceslist === undefined ||
      this.props.serviceslist.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "serviceslist"
        }
      });
    }

    this.props.getOrderList({
      uri: "/orderAndPreApproval/selectOrderServicesbyDoctor",
      method: "GET",
      data: {
        visit_id: Window.global["visit_id"]
      },
      redux: {
        type: "ORDER_SERVICES_GET_DATA",
        mappingName: "orderedList"
      },
      afterSuccess: data => {}
    });
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <div className="hptl-phase1-ordering-services-form form-details margin-bottom-15">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-10 col-lg-12" id="doctorOrder">
              <AlgaehDataGrid
                id="Orderd_list"
                columns={[
                  {
                    fieldName: "actions",
                    label: <AlgaehLabel label={{ forceLabel: "Details" }} />,
                    displayTemplate: row => {
                      debugger;
                      return (
                        <i
                          style={{
                            pointerEvents:
                              row.service_type_id === 2 ||
                              row.service_type_id === 14 ||
                              row.service_type_id === "2" ||
                              row.service_type_id === "14"
                                ? ""
                                : "none",
                            opacity:
                              row.service_type_id === 2 ||
                              row.service_type_id === 14 ||
                              row.service_type_id === "2" ||
                              row.service_type_id === "14"
                                ? ""
                                : "0.1"
                          }}
                          className="fas fa-eye"
                        />
                      );
                    },
                    others: {
                      fixed: "left"
                    }
                  },
                  {
                    fieldName: "created_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "created_date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    }
                  },
                  {
                    fieldName: "test_type",
                    label: <AlgaehLabel label={{ fieldName: "test_type" }} />,
                    displayTemplate: row => {
                      return row.test_type === "S" ? "Stat" : "Routine";
                    },

                    disabled: true
                  },
                  {
                    fieldName: "service_type_id",
                    label: (
                      <AlgaehLabel label={{ fieldName: "service_type_id" }} />
                    ),
                    displayTemplate: row => {
                      let display =
                        this.props.servicetype === undefined
                          ? []
                          : this.props.servicetype.filter(
                              f =>
                                f.hims_d_service_type_id === row.service_type_id
                            );

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].service_type
                            : ""}
                        </span>
                      );
                    },

                    disabled: true
                  },
                  {
                    fieldName: "services_id",
                    label: <AlgaehLabel label={{ fieldName: "services_id" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.serviceslist === undefined
                          ? []
                          : this.props.serviceslist.filter(
                              f => f.hims_d_services_id === row.services_id
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].service_name
                            : ""}
                        </span>
                      );
                    },

                    disabled: true
                  },
                  {
                    fieldName: "insurance_yesno",
                    label: <AlgaehLabel label={{ fieldName: "insurance" }} />,
                    displayTemplate: row => {
                      return row.insurance_yesno === "Y"
                        ? "Covered"
                        : "Not Covered";
                    },
                    disabled: true
                  },
                  {
                    fieldName: "pre_approval",
                    label: (
                      <AlgaehLabel label={{ fieldName: "pre_approval" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.pre_approval === "Y"
                            ? "Required"
                            : "Not Required"}
                        </span>
                      );
                    },
                    disabled: true
                  },
                  {
                    fieldName: "patient_payable",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_payable" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "company_payble",
                    label: (
                      <AlgaehLabel label={{ fieldName: "company_payble" }} />
                    ),
                    disabled: true
                  }
                ]}
                keyId="list_type_id"
                dataSource={{
                  data:
                    this.props.orderedList === undefined
                      ? []
                      : this.props.orderedList
                }}
                paging={{ page: 0, rowsPerPage: 10 }}
              />
            </div>
          </div>
        </div>
        <div
          className="col-lg-12"
          style={{
            textAlign: "right",
            paddingTop: 10
          }}
        >
          <button
            className="btn btn-primary  margin-bottom-15 margin-top-15"
            onClick={this.ShowModel.bind(this)}
          >
            Order Investigation
          </button>
        </div>
        <OrderingServices
          open={this.state.isOpen}
          onClose={this.CloseModel.bind(this)}
          vat_applicable={this.props.vat_applicable}
          addNew={true}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    serviceslist: state.serviceslist,
    orderedList: state.orderedList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      getOrderList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderedList)
);
