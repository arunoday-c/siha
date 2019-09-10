import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";

import "./ExpiringItemList.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../../Options.json";

class ExpiringItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item_list: [],
      location_id: null
    };
  }

  componentDidMount() {
    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "locations"
      }
    });
  }

  getExpiringItemList() {
    debugger;
    algaehApiCall({
      uri: "/pharmacyGlobal/getExpiringItemList",
      method: "GET",
      module: "pharmacy",
      data: { location_id: this.state.location_id },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({ item_list: res.data.records });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  changeTexts(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({ [name]: value }, () => {
      this.getExpiringItemList();
    });
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-item-enquiry-form">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Expiring Item List", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Home",
                      align: "ltr"
                    }}
                  />
                )
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ forceLabel: "Expiring Item List", align: "ltr" }}
                  />
                )
              }
            ]}
          />

          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
                    },
                    onChange: this.changeTexts.bind(this),
                    onClear: () => {
                      this.setState({
                        location_id: null,
                        item_list: []
                      });
                    },
                    autoComplete: "off"
                  }}
                />
              </div>
            </div>
          </div>

          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body" id="precriptionList_Cntr">
              <AlgaehDataGrid
                id="expiring_item_stock"
                columns={[
                  {
                    fieldName: "item_description",
                    label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                  },

                  {
                    fieldName: "expiry_date",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.expirydt)}</span>;
                    }
                  },
                  {
                    fieldName: "batchno",
                    label: <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                  }
                ]}
                keyId="item_id"
                dataSource={{
                  data: this.state.item_list
                }}
                noDataText="No Expiry Items available for selected Location"
                isEditable={false}
                filter={false}
                paging={{ page: 0, rowsPerPage: 20 }}
                events={{
                  // onDelete: deleteStock.bind(this, this),
                  onEdit: row => {}
                  // onDone: updateStockDetils.bind(this, this)
                }}
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
    locations: state.locations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ExpiringItemList)
);
