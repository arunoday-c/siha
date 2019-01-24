import React, { Component } from "react";
import "./AuthorizationSetup.css";
import { AlgaehLabel } from "../../../Wrapper/algaehWrapper";
export default class AuthorizationSetup extends Component {
  render() {
    return (
      <div className="AuthorizationSetupScreen">
        <div className="row">
          {/* row starts here*/}
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Enter Grid Name Here</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* row end here*/}
      </div>
    );
  }
}
