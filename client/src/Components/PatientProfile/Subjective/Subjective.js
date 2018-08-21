import React, { Component } from "react";
import "./subjective.css";
import "react-rangeslider/lib/index.css";
import Button from "@material-ui/core/Button";
import { AlgaehDataGrid, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import Slider from "react-rangeslider";
import Modal from "@material-ui/core/Modal";
import {
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

class Subjective extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openComplain: false,
      pain: 0
    };

    this.addChiefComplain = this.addChiefComplain.bind(this);
    this.addAllergies = this.addAllergies.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChangeStart = () => {
    console.log("Change event started");
  };

  handleChange = pain => {
    this.setState({
      pain: pain
    });
  };

  handleChangeComplete = () => {
    console.log("Change event completed");
  };

  setPainScale(pain_number, e) {
    var element = document.querySelectorAll("[paintab]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    this.setState({ pain: pain_number });
  }

  addChiefComplain() {
    this.setState({ openComplain: true });
  }
  addAllergies() {
    alert("Add Allergies");
  }

  handleClose() {
    this.setState({ openComplain: false });
  }

  render() {
    return (
      <div className="subjective">
        {/* Chief Complain Modal Start */}
        <Modal
          style={{
            margin: "auto"
          }}
          open={this.state.openComplain}
        >
          <div className="algaeh-modal">
            <div className="row popupHeader">
              <h4>Add Chief Complaint</h4>
            </div>
            <div className="col-lg-12 popupInner">
              <div className="row">
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-body box-shadow-normal">
                      <h6 className="card-subtitle mb-2 text-muted">
                        Doctor Chief Complaints
                      </h6>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="row">
                    <AlgaehDateHandler
                      div={{ className: "col-lg-3" }}
                      label={{ fieldName: "onset_date", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "onset_date"
                      }}
                      disabled={false}
                      maxDate={new Date()}
                      events={
                        {
                          //  onChange: datehandle.bind(this, this)
                        }
                      }
                      //value={this.state.receipt_date}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-1" }}
                      label={{
                        fieldName: "duration",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "duration",
                        others: {
                          type: "number"
                        },
                        //value: this.state.department_name,
                        events: {
                          //  onChange: this.changeDeptName.bind(this)
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-3 mrgn-tp-auto" }}
                      label={{
                        fieldName: ""
                      }}
                      selector={{
                        name: "duration_time",
                        className: "select-fld",
                        // value: this.state.pay_cash,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.PAIN_DURATION
                        }

                        // onChange: texthandle.bind(this, this)
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-3 mrgn-tp-auto" }}
                      label={{
                        fieldName: "pain_severity"
                      }}
                      selector={{
                        name: "pain_severity",
                        className: "select-fld",
                        // value: this.state.pay_cash,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.PAIN_SEVERITY
                        }

                        // onChange: texthandle.bind(this, this)
                      }}
                    />
                  </div>
                  <div className="row" style={{ marginTop: "10px" }}>
                    <div className="pain_slider col-lg-5">
                      <Slider
                        step={2}
                        min={0}
                        max={10}
                        value={this.state.pain}
                        onChangeStart={this.handleChangeStart}
                        onChange={this.handleChange}
                        onChangeComplete={this.handleChangeComplete}
                      />
                    </div>
                    <div className="col-lg-2" style={{ marginTop: "25px" }}>
                      <AlagehFormGroup
                        div={{ className: "" }}
                        label={{
                          fieldName: "fffffff",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "duration",
                          others: {
                            type: "number",
                            disabled: true
                          },
                          value: this.state.pain,
                          events: {}
                        }}
                      />
                    </div>
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        fieldName: "pain",
                        forceLabel: "Pain",
                        isImp: true
                      }}
                      selector={{
                        name: "pain",
                        className: "select-fld",
                        value: this.state.pain,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.PAIN_SCALE
                        },
                        onChange: () => {}
                        // onChange: texthandle.bind(this, this)
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <div>
                        <ul className="pain-scale-ul">
                          <li
                            className="pain-1"
                            paintab="1"
                            onClick={this.setPainScale.bind(this, 0)}
                          />
                          <li
                            className="pain-2"
                            paintab="2"
                            onClick={this.setPainScale.bind(this, 2)}
                          />
                          <li
                            className="pain-3"
                            paintab="3"
                            onClick={this.setPainScale.bind(this, 4)}
                          />
                          <li
                            className="pain-4"
                            paintab="4"
                            onClick={this.setPainScale.bind(this, 6)}
                          />
                          <li
                            className="pain-5"
                            paintab="5"
                            onClick={this.setPainScale.bind(this, 8)}
                          />
                          <li
                            className="pain-6"
                            paintab="6"
                            onClick={this.setPainScale.bind(this, 10)}
                          />
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row popupFooter">
              <div className="col-lg-12">
                <Button
                  variant="raised"
                  color="secondary"
                  style={{ backgroundColor: "#24B256" }}
                  // onClick={        }
                  size="small"
                >
                  Save
                </Button>
                <Button
                  variant="raised"
                  onClick={this.handleClose}
                  style={{ backgroundColor: "#D5D5D5" }}
                  size="small"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Chief Complain Modal End */}

        <div className="col-lg-12" style={{ marginTop: "15px" }}>
          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body box-shadow-normal">
                  <h6 className="card-subtitle mb-2 text-muted">
                    Chief Complaint
                    <span className="float-right">
                      <Button
                        mini
                        variant="fab"
                        color="primary"
                        onClick={this.addChiefComplain}
                      >
                        <i className="fas fa-plus" />
                      </Button>
                    </span>
                  </h6>
                </div>
                <AlgaehDataGrid
                  id="complaint-grid"
                  columns={[
                    {
                      fieldName: "status",
                      label: <AlgaehLabel label={{ fieldName: "status" }} />
                    }
                  ]}
                  keyId="patient_id"
                  dataSource={{
                    data:
                      this.props.mydaylist === undefined
                        ? []
                        : this.props.mydaylist
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 5 }}
                  events={{
                    onDelete: row => {},
                    onEdit: row => {},
                    onDone: row => {}
                  }}
                />
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-body box-shadow-normal">
                  <h6 className="card-subtitle mb-2 text-muted">
                    Allergies
                    <span className="float-right">
                      <Button
                        mini
                        variant="fab"
                        color="primary"
                        onClick={this.addChiefComplain}
                      >
                        <i className="fas fa-plus" />
                      </Button>
                    </span>
                  </h6>
                </div>

                <AlgaehDataGrid
                  id="patient_chart_grd"
                  columns={[
                    {
                      fieldName: "food",
                      label: "Food",
                      disabled: true
                    },
                    {
                      fieldName: "date",
                      label: "On Set Date"
                    },
                    {
                      fieldName: "first_name",
                      label: "Comment"
                    },
                    {
                      fieldName: "active",
                      label: "Active"
                    }
                  ]}
                  keyId="code"
                  dataSource={{
                    data: AllergyData
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 3 }}
                  events={
                    {
                      // onDelete: this.deleteVisaType.bind(this),
                      // onEdit: row => {},
                      // onDone: row => {
                      //   alert(JSON.stringify(row));
                      // }
                      // onDone: this.updateVisaTypes.bind(this)
                    }
                  }
                />
              </div>

              <div className="card">
                <div className="card-body box-shadow-normal">
                  <h6 className="card-subtitle mb-2 text-muted">
                    Review of Systems
                    <span className="float-right">
                      <Button
                        mini
                        variant="fab"
                        color="primary"
                        onClick={this.addChiefComplain}
                      >
                        <i className="fas fa-plus" />
                      </Button>
                    </span>
                  </h6>
                </div>

                <AlgaehDataGrid
                  id="patient_chart_grd"
                  columns={[
                    {
                      fieldName: "food",
                      label: "Food",
                      disabled: true
                    },
                    {
                      fieldName: "date",
                      label: "On Set Date"
                    },
                    {
                      fieldName: "first_name",
                      label: "Comment"
                    },
                    {
                      fieldName: "active",
                      label: "Active"
                    }
                  ]}
                  keyId="code"
                  dataSource={{
                    data: AllergyData
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 3 }}
                  events={
                    {
                      // onDelete: this.deleteVisaType.bind(this),
                      // onEdit: row => {},
                      // onDone: row => {
                      //   alert(JSON.stringify(row));
                      // }
                      // onDone: this.updateVisaTypes.bind(this)
                    }
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Subjective;
