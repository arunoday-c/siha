import React, { Component } from "react";
import { Paper, TextField } from "material-ui";
import "./equipment.css";
import { MuiThemeProvider, createMuiTheme } from "material-ui";
import { Button } from "material-ui";
import SelectField from "../../common/Inputs/SelectField.js";
import moment from "moment";
import { algaehApiCall } from "../../../utils/algaehApiCall";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#00BCB0",
      main: "#00BCB0",
      dark: "#00BFC2",
      contrastText: "#fff"
    }
  }
});

class EquipmentType extends Component {
  changeStatus(e) {
    this.setState({ equipment_type_status: e.target.value });

    if (e.target.value == "A")
      this.setState({ effective_end_date: "9999-12-31" });
    else if (e.target.value == "I") {
      this.setState({
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="equipment">
          <Paper className="container-fluid">
            <form>
              <div
                className="row"
                style={{
                  padding: 20,
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <div className="col-lg-3">
                  <label>
                    Status <span className="imp">*</span>
                  </label>
                  <br />
                  <input
                    onChange={this.changeStatus.bind(this)}
                    style={{
                      padding: 8,
                      margin: 8
                    }}
                    type="radio"
                    name="status"
                    value="A"
                  />
                  <label className="center">Active </label>

                  <input
                    onChange={this.changeStatus.bind(this)}
                    style={{
                      padding: 8,
                      margin: 8
                    }}
                    type="radio"
                    name="status"
                    value="I"
                  />
                  <label className="center">Inactive </label>
                </div>

                <div className="col-lg-3">
                  <label>
                    EQUIPMENT TYPE CODE <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField className="txt-fld" />
                </div>

                <div className="col-lg-3">
                  <label>
                    EQUIPMENT TYPE NAME <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField className="txt-fld" />
                </div>

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
                <label> EQUIPMENT TYPE LIST</label>
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
                </table>
              </div>
            </div>
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default EquipmentType;
