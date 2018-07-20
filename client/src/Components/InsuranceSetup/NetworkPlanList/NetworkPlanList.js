import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./NetworkPlanList.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehDataGrid,
  Button
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";

import { setGlobal } from "../../../utils/GlobalFunctions";
import { getCookie } from "../../../utils/algaehApiCall";

class SubInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-insurance-form">
          <div className="container-fluid">
            {/* Services Details */}

            <div className="row">
              <AlgaehDataGrid
                id="sub_insurance_grid"
                columns={[
                  {
                    fieldName: "insurance_sub_code",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "insurance_sub_code" }}
                      />
                    )
                  },
                  {
                    fieldName: "insurance_sub_name",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "insurance_sub_name" }}
                      />
                    )
                  },
                  {
                    fieldName: "transaction_number",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "transaction_number" }}
                      />
                    )
                  },
                  {
                    fieldName: "card_format",
                    label: <AlgaehLabel label={{ fieldName: "card_format" }} />
                  },
                  {
                    fieldName: "effective_start_date",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "effective_start_date" }}
                      />
                    )
                  },
                  {
                    fieldName: "effective_end_date",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "effective_end_date" }}
                      />
                    )
                  }
                ]}
                keyId="identity_document_code"
                dataSource={{
                  data:
                    this.props.insProviders === undefined
                      ? []
                      : this.props.insProviders
                }}
                // isEditable={true}
                paging={{ page: 0, rowsPerPage: 5 }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    services: state.services
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubInsurance)
);
