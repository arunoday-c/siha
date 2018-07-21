import React, { Component } from "react";
import "./physical_examination.css";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {
  AlgaehOptions,
  AlagehFormGroup,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";

class PhysicalExamination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pe_type: "A",
      code: "",
      codeError: false,
      codeErrorText: "",
      name: "",
      nameError: false,
      nameErrorText: ""
    };
  }

  changeStatus(row, status) {
    this.setState({ pe_type: status.value });
  }

  texthandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  add(e) {
    e.preventDefault();

    if (this.state.code.length === 0) {
      this.setState({ codeError: true, codeErrorText: "Code cannot be empty" });
    } else if (this.state.name.length === 0) {
      this.setState({ nameError: true, nameErrorText: "Code cannot be empty" });
    } else {
      console.log("Added");
      //Do the Api Call here
    }
  }

  render() {
    return (
      <div className="physical_examination" style={{ overflow: "scroll" }}>
        <Paper className="container-fluid">
          <div
            className="row"
            style={{
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <AlgaehOptions
              div={{ className: "col" }}
              optionsType="radio"
              group={{
                name: "pe_type",
                value: this.state.pe_type,
                controls: [
                  { label: "Speciality Specific Examination", value: "A" },
                  { label: "General Systematic Examination", value: "I" }
                ]
                //events: { onChange: this.changeStatus.bind(this) }
              }}
            />
          </div>

          {/* Header Grid Start */}
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "code",
                value: this.state.code,
                events: {
                  onChange: this.texthandle.bind(this)
                },
                error: this.state.codeError,
                helperText: this.state.codeErrorText
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "name",
                value: this.state.name,
                events: {
                  onChange: this.texthandle.bind(this)
                },
                error: this.state.nameError,
                helperText: this.state.nameErrorText
              }}
            />
            <div className="col-lg-3">
              <br />
              <Button
                variant="raised"
                color="primary"
                onClick={this.add.bind(this)}
              >
                Add
              </Button>
            </div>
          </div>
          <div style={{ paddingTop: "10px" }}>
            <AlgaehDataGrid
              id="speciality_grd"
              columns={[
                {
                  fieldName: "code",
                  label: "Code",
                  disabled: true
                },
                {
                  fieldName: "name",
                  label: "Name"
                }
              ]}
              keyId="code"
              dataSource={{
                data:
                  this.props.visatypes === undefined ? [] : this.props.visatypes
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
          {/* Header Grid End */}

          {/* Detail Grid Add */}
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "code",
                value: this.state.code,
                events: {
                  onChange: this.texthandle.bind(this)
                },
                error: this.state.codeError,
                helperText: this.state.codeErrorText
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "name",
                value: this.state.name,
                events: {
                  onChange: this.texthandle.bind(this)
                },
                error: this.state.nameError,
                helperText: this.state.nameErrorText
              }}
            />
            <div className="col-lg-3">
              <br />
              <Button
                variant="raised"
                color="primary"
                onClick={this.add.bind(this)}
              >
                Add
              </Button>
            </div>
          </div>
          <div style={{ paddingTop: "10px" }}>
            <AlgaehDataGrid
              id="speciality_grd"
              columns={[
                {
                  fieldName: "code",
                  label: "Code",
                  disabled: true
                },
                {
                  fieldName: "name",
                  label: "Name"
                }
              ]}
              keyId="code"
              dataSource={{
                data:
                  this.props.visatypes === undefined ? [] : this.props.visatypes
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

          {/* Detail Grid End */}
          {/* Detail Grid2 Start  */}
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "code",
                value: this.state.code,
                events: {
                  onChange: this.texthandle.bind(this)
                },
                error: this.state.codeError,
                helperText: this.state.codeErrorText
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "name",
                value: this.state.name,
                events: {
                  onChange: this.texthandle.bind(this)
                },
                error: this.state.nameError,
                helperText: this.state.nameErrorText
              }}
            />
            <div className="col-lg-3">
              <br />
              <Button
                variant="raised"
                color="primary"
                onClick={this.add.bind(this)}
              >
                Add
              </Button>
            </div>
          </div>
          <div style={{ paddingTop: "10px" }}>
            <AlgaehDataGrid
              id="speciality_grd"
              columns={[
                {
                  fieldName: "code",
                  label: "Code",
                  disabled: true
                },
                {
                  fieldName: "name",
                  label: "Name"
                }
              ]}
              keyId="code"
              dataSource={{
                data:
                  this.props.visatypes === undefined ? [] : this.props.visatypes
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
          {/* Detail Grid2 End */}
        </Paper>
      </div>
    );
  }
}

export default PhysicalExamination;
