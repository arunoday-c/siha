import React, { Component } from "react";
import { Paper, TextField } from "material-ui";
import "./numbering.css";
import { MuiThemeProvider, createMuiTheme } from "material-ui";
import { Button } from "material-ui";
import { algaehApiCall } from "../../../../utils/algaehApiCall.js";
import {getOptions} from '../../../../actions/BusinessSetup/Options.js'
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";


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


class Numbering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnTxt: "ADD TO LIST",
      hims_f_app_numgen_id: null,
      numgen_code: "",
      module_desc: "",
      prefix: "",
      intermediate_series: "",
      postfix: "",
      length: "",
      increment_by: "",
      numgen_seperator: "",
      postfix_start: "",
      postfix_end: "",
      current_num: "",
      created_by: "1",
      updated_by: "1",
      errorTxt: "",
      numgen_code_error: false,
      module_desc_error: false,
      prefix_error: false,
      intermediate_series_error: false,
      postfix_error: false,
      length_error: false,
      increment_by_error: false,
      numgen_seperator_error: false,
      postfix_start_error: false,
      postfix_end_error: false,
      current_num_error: false
    };
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  add(e) {
    debugger;
    e.preventDefault();
    console.log("State", this.state);

    if (this.state.numgen_code.length === 0) {
      this.setState({ numgen_code_error: true });
    } else if (this.state.module_desc.length === 0) {
      this.setState({ module_desc_error: true });
    } else if (this.state.prefix.length === 0) {
      this.setState({ prefix_error: true });
    } else if (this.state.intermediate_series.length === 0) {
      this.setState({ intermediate_series_error: true });
    } else if (this.state.postfix.length === 0) {
      this.setState({ postfix_error: true });
    } else if (this.state.length.length === 0) {
      this.setState({ length_error: true });
    } else if (this.state.increment_by.length === 0) {
      this.setState({ increment_by_error: true });
    } else if (this.state.numgen_seperator.length === 0) {
      this.setState({ numgen_seperator_error: true });
    } else if (this.state.postfix_start.length === 0) {
      this.setState({ postfix_start_error: true });
    } else if (this.state.postfix_end.length === 0) {
      this.setState({ postfix_end_error: true });
    } else if (this.state.current_num.length === 0) {
      this.setState({ current_num_error: true });
    } 
      algaehApiCall({
        uri: "/masters/set/autogen",        
        data: this.state,

        onSuccess: response => {
          console.log("Res", response.data.success);
          console.log("Res Data", response.data);

          if (response.data.success === true) {
            window.location.reload();

          } else {
            //Handle unsuccessful Login here.
          }
        },
        onFailure: error => {
          console.log(error);

          // Handle network error here.
        }
      });
    
  }

  componentDidMount () {
    this.props.getOptions();
  }



  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="numbering">
          <Paper className="container-fluid">
            <form>
              <div
                className="row"
                style={{
                  paddingTop: 20,
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <div className="col-lg-3">
                  <label>
                    OPTIONS CODE <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.numgen_code_error}
                    helperText={this.state.errorTxt}
                    name="numgen_code"
                    value={this.state.numgen_code}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>

                <div className="col-lg-3">
                  <label>
                    MODULE NAME <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.module_desc_error}
                    helperText={this.state.errorTxt}
                    name="module_desc"
                    value={this.state.module_desc}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
              </div>
              <br />
              <div
                className="row"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <div className="col-lg-3">
                  <label>
                    PREFIX <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.prefix_error}
                    helperText={this.state.errorTxt}
                    name="prefix"
                    value={this.state.prefix}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    INTERMEDIATE SERIES <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.intermediate_series_error}
                    helperText={this.state.errorTxt}
                    name="intermediate_series"
                    value={this.state.intermediate_series}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    POSTFIX <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.postfix_error}
                    helperText={this.state.errorTxt}
                    name="postfix"
                    value={this.state.postfix}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
              </div>
              <br />
              <div
                className="row"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <div className="col-lg-3">
                  <label>
                    LENGTH <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.length_error}
                    helperText={this.state.errorTxt}
                    name="length"
                    value={this.state.length}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    INCREMENT BY <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.increment_by_error}
                    helperText={this.state.errorTxt}
                    name="increment_by"
                    value={this.state.increment_by}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    SEPERATOR <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.numgen_seperator_error}
                    helperText={this.state.errorTxt}
                    name="numgen_seperator"
                    value={this.state.numgen_seperator}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
              </div>
              <br />
              <div
                className="row"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <div className="col-lg-3">
                  <label>
                    POSTFIX START <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.postfix_start_error}
                    helperText={this.state.errorTxt}
                    name="postfix_start"
                    value={this.state.postfix_start}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    POSTFIX END <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.postfix_end_error}
                    helperText={this.state.errorTxt}
                    name="postfix_end"
                    value={this.state.postfix_end}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    CURRENT NUMBER <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.current_num_error}
                    helperText={this.state.errorTxt}
                    name="current_num"
                    value={this.state.current_num}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div>
                <div className="col-lg-3 align-middle">
                  <br />
                  <Button
                    onClick={this.add.bind(this)}
                    color="primary"
                    variant="raised"
                  >
                    {this.state.btnTxt}
                  </Button>
                </div>
              </div>
              <br />
            </form>

            <div className="row form-details">
              <div className="col">
                <label> OPTIONS LIST</label>
                <table className="table table-striped table-details table-hover">
                  <thead style={{ background: "#A9E5E0" }}>
                    <tr>
                      <td scope="col">ACTION</td>
                      <td scope="col">#</td>
                      <td scope="col">OPTIONS CODE</td>
                      <td scope="col">OPTIONS NAME</td>
                      <td scope="col">PREFIX</td>
                      <td scope="col">INTERMEDIATE SERIES</td>
                      <td scope="col">POSTFIX</td>
                      <td scope="col">LENGTH</td>
                      <td scope="col">INCREMENT BY</td>
                      <td scope="col">SEPERATOR</td>
                      <td scope="col">POSTFIX START</td>
                      <td scope="col">POSTFIX END</td>
                      <td scope="col">CURRENT NUMBER</td>
            
                    </tr>
                  </thead>
                  <tbody>



{this.props.options.map((row, index) => (
  <tr key={index}>
                      <td>
                        <span
                          onClick={this.handleDel}
                          className="fas fa-trash-alt"
                          style={{ paddingRight: "24px" }}
                        />
                        <span className="fas fa-pencil-alt" />
                      </td>
                      <td> {index+1}</td>
                      <td> {row.numgen_code}</td>
                      <td> {row.module_desc}</td>
                      <td> {row.prefix}</td>
                      <td> {row.intermediate_series}</td>
                      <td> {row.postfix}</td>
                      <td> {row.length}</td>
                      <td> {row.increment_by}</td>
                      <td> {row.numgen_seperator}</td>
                      <td> {row.postfix_start}</td>
                      <td> {row.postfix_end}</td>
                      <td> {row.current_num}</td>
                    
                    </tr>


))}

                  
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

function mapStateToProps(state) {
  debugger;
  return {
    options: state.options.options
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOptions: getOptions,

    
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Numbering)
);
