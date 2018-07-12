import React, { Component } from "react";
import Dropzone from "react-dropzone";
import "./SecondaryInsuranceDetails.css";
import "./../../../../styles/site.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import MyContext from "../../../../utils/MyContext.js";

export default class DisplaySecondaryInsurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePreview: ""
    };
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="htpl-phase1-primary-secinsurancedis-form">
              <div className="container-fluid">
                <div className="row form-details">
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      forceLabel: "Insurance Company"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "full_name",
                      value: this.state.full_name,
                      events: {
                        onChange: null
                      },
                      disabled: true
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      forceLabel: "Plan Description"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "full_name",
                      value: this.state.full_name,
                      events: {
                        onChange: null
                      },
                      disabled: true
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      forceLabel: "Policy Group"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "full_name",
                      value: this.state.full_name,
                      events: {
                        onChange: null
                      },
                      disabled: true
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      forceLabel: "Policy No"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "full_name",
                      value: this.state.full_name,
                      events: {
                        onChange: null
                      },
                      disabled: true
                    }}
                  />

                  <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                    <div className="ins-Dis-image-drop-area">
                      <Dropzone className="dropzone">
                        <div className="text-center">Front</div>
                      </Dropzone>
                    </div>
                  </div>

                  <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                    <div className="ins-Dis-image-drop-area">
                      <Dropzone className="dropzone">
                        <div className="text-center">Back</div>
                      </Dropzone>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}
