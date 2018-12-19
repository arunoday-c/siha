import React, { Component } from "react";

import "./equipment.css";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { AlagehFormGroup, AlgaehOptions } from "../../Wrapper/algaehWrapper";

class EquipmentType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipment_type_code: "",
      equipment_type_name: ""
    };
  }

  changeStatus(e) {
    this.setState({ equipment_type_status: e.target.value });
    if (e.target.value === "A")
      this.setState({ effective_end_date: "9999-12-31" });
    else if (e.target.value === "I") {
      this.setState({
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="equipment">
        <div className="container-fluid">
          <form>
            <div
              className="row"
              style={{
                padding: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <AlgaehOptions
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "status",
                  isImp: true
                }}
                optionsType="radio"
                group={{
                  name: "Status",

                  controls: [
                    { label: "Active", value: "A" },
                    { label: "Inactive", value: "I" }
                  ]
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "equipment_type_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "equipment_type_code",
                  value: this.state.equipment_type_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "equipment_type_name",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "equipment_type_name",
                  value: this.state.equipment_type_name,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <div className="col-lg-3 align-middle">
                <br />
                <Button variant="raised" color="primary">
                  ADD TO LIST
                </Button>
              </div>
            </div>
          </form>

          <div className="row form-details">
            <div className="col">
              {/* <label> EQUIPMENT TYPE LIST</label>
              <table className="table table-striped table-details table-hover">
                <thead style={{ background: "#A9E5E0" }}>
                  <tr>
                    <td scope="col">ACTION</td>
                    <td scope="col">#</td>
                    <td scope="col">EQUIPMENT TYPE CODE</td>
                    <td scope="col">EQUIPMENT TYPE NAME</td>
                    <td scope="col">ADDED DATE</td>
                    <td scope="col">MODIFIED DATE</td>
                    <td scope="col">STATUS</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span
                        onClick={this.handleDel}
                        className="fas fa-trash-alt"
                        style={{ paddingRight: "24px" }}
                      />
                      <span className="fas fa-pencil-alt" />
                    </td>
                    <td> 1</td>
                    <td> 0001</td>
                    <td> General</td>
                    <td> 06-04-2018</td>
                    <td> 06-04-2018</td>
                    <td> ACTIVE</td>
                  </tr>
                </tbody>
              </table> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EquipmentType;
