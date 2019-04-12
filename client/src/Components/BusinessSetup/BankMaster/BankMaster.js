import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./BankMaster.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";

class BankMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bank_name: null,
      bank_code: null,
      bank_short_name: null,
      address1: null,
      contact_person: null,
      contact_number: null
    };
  }

  componentDidMount() {
    if (this.props.banks === undefined || this.props.banks.length === 0) {
      this.props.getBanks({
        uri: "/masters/getBank",
        method: "GET",
        redux: {
          type: "BANK_GET_DATA",
          mappingName: "banks"
        }
      });
    }
  }

  texthandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <div className="BankMasterScreen">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Bank Full Name",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "bank_name",
                value: this.state.bank_name,
                events: { onChange: this.texthandle.bind(this) },
                option: {
                  type: "text"
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Bank Short Name",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "bank_short_name",
                value: this.state.bank_short_name,
                events: { onChange: this.texthandle.bind(this) },
                option: {
                  type: "text"
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "BIC (SWIFT) Code",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "bank_code",
                value: this.state.bank_code,
                events: { onChange: this.texthandle.bind(this) },
                option: {
                  type: "text"
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Address",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "address1",
                value: this.state.address1,
                events: { onChange: this.texthandle.bind(this) },
                option: {
                  type: "text"
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Contact Person",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "contact_person",
                value: this.state.contact_person,
                events: { onChange: this.texthandle.bind(this) },
                option: {
                  type: "text"
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                forceLabel: "Contact Number"
              }}
              textBox={{
                value: this.state.contact_number,
                className: "txt-fld",
                name: "contact_number",

                events: {
                  onChange: this.texthandle.bind(this)
                },
                others: {
                  placeholder: "(+01)123-456-7890",
                  type: "number"
                }
              }}
            />

            <div className="col">
              <button style={{ marginTop: 21 }} className="btn btn-primary">
                Add to List
              </button>
            </div>
          </div>
          <div className="" id="BankMasterGrid_Cntr">
            <AlgaehDataGrid
              id="BankMasterGrid"
              datavalidate="BankMasterGrid"
              columns={[
                {
                  fieldName: "bank_name",
                  label: <AlgaehLabel label={{ forceLabel: "Bank Name" }} />
                },
                {
                  fieldName: "bank_short_name",
                  label: <AlgaehLabel label={{ forceLabel: "Short Name" }} />
                },
                {
                  fieldName: "bank_code",
                  label: <AlgaehLabel label={{ forceLabel: "BIC ( SWIFT)" }} />
                },
                {
                  fieldName: "address1",
                  label: <AlgaehLabel label={{ forceLabel: "Address" }} />
                },
                {
                  fieldName: "contact_person",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Contact Person" }} />
                  )
                },
                {
                  fieldName: "contact_number",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Contact Number" }} />
                  )
                },
                {
                  fieldName: "active_status",
                  label: <AlgaehLabel label={{ forceLabel: "Status" }} />
                }
              ]}
              keyId="BankMasterGrid"
              dataSource={{
                data: this.props.banks === undefined ? [] : this.props.banks
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{}}
              others={{}}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    banks: state.banks
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBanks: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BankMaster)
);
