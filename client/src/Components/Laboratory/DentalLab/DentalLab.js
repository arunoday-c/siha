import React, { Component } from "react";

import "./DentalLab.css";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import DentelForm from "./DentalForm";

export default class DentalLab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OpenForm: false
    };
  }

  OpenDentalForm() {
    this.setState({
      OpenForm: !this.state.OpenForm
    });
  }

  render() {
    return (
      <div className="DentalLabScreen">
        <div className="row">
          <div className="col-12 margin-top-15">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Dental Form Requests List</h3>
                </div>
                {/* <div className="actions">
                  <a
                    className="btn btn-primary btn-circle active"
                    onClick={this.OpenDentalForm.bind(this)}
                  >
                    <i className="fas fa-plus" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="DentalFormGrid_Cntr">
                    <AlgaehDataGrid
                      id="DentalFormGrid"
                      datavalidate="DentalFormGrid"
                      columns={[
                        {
                          fieldName: "action",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Actions" }} />
                          ),
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "mr_no",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "MRN Number" }} />
                          )
                        },
                        {
                          fieldName: "patName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Patient Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "docName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Doctor Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "procedureName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Procedure Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "expDate",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Expected Date" }}
                            />
                          )
                        },
                        {
                          fieldName: "status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{ data: [] }}
                      isEditable={false}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DentelForm
          show={this.state.OpenForm}
          onClose={this.OpenDentalForm.bind(this)}
          HeaderCaption={
            <AlgaehLabel
              label={{
                forceLabel: "Dental Form",
                align: "ltr"
              }}
            />
          }
        />
      </div>
    );
  }
}
