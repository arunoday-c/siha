import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";

import moment from "moment";
import Options from "../../../../Options.json";
import {
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import "./DietAdvice.css";
import "../../../../styles/site.css";

import {
  texthandle,
  datehandle,
  addDiet,
  getDietList,
  deleteDietAdvice
} from "./DietAdviceEvents";

class DietAdvice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      till_date: new Date(),
      diet_id: null,
      addIcon: false
    };
  }

  componentDidMount() {
    this.props.getDietMaster({
      uri: "/dietmaster/selectDiet",
      method: "GET",
      redux: {
        type: "DIET_GET_DATA",
        mappingName: "dietmaster"
      }
    });

    getDietList(this, this);
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    return (
      <div className="hptl-diet-advice-form">
        <div className="row" style={{ paddingBottom: "10px" }}>
          <AlgaehDateHandler
            div={{ className: "col-5" }}
            label={{ forceLabel: "Till Date" }}
            textBox={{ className: "txt-fld", name: "till_date" }}
            minDate={new Date()}
            events={{
              onChange: datehandle.bind(this, this)
            }}
            value={this.state.till_date}
          />
          <AlagehAutoComplete
            div={{ className: "col-5" }}
            label={{ forceLabel: "Diet" }}
            selector={{
              name: "diet_id",
              className: "select-fld",
              value: this.state.diet_id,
              dataSource: {
                textField: "hims_d_diet_description",
                valueField: "hims_d_diet_master_id",
                data: this.props.dietmaster
              },
              onChange: texthandle.bind(this, this)
            }}
          />

          <div className="col-2 actions" style={{ paddingTop: "3.5vh" }}>
            <a
              // href="javascript"
              className="btn btn-primary btn-circle active"
              onClick={addDiet.bind(this, this)}
            >
              <i className="fas fa-plus" />
            </a>
          </div>
        </div>

        <div className="row" style={{ paddingBottom: "10px" }}>
          <div className="col-lg-12">
            <AlgaehDataGrid
              id="Lab_Result_grid"
              columns={[
                {
                  fieldName: "action",
                  label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        <i
                          className="fas fa-trash-alt"
                          aria-hidden="true"
                          onClick={deleteDietAdvice.bind(this, this, row)}
                        />
                      </span>
                    );
                  }
                },
                {
                  fieldName: "created_date",
                  label: <AlgaehLabel label={{ forceLabel: "From Date" }} />,
                  displayTemplate: row => {
                    return (
                      <span>{this.changeDateFormat(row.created_date)}</span>
                    );
                  },
                  others: {
                    maxWidth: 100,
                    resizable: false,
                    style: { textAlign: "center" }
                  }
                },
                {
                  fieldName: "till_date",
                  label: <AlgaehLabel label={{ forceLabel: "Till Date" }} />,
                  displayTemplate: row => {
                    return <span>{this.changeDateFormat(row.till_date)}</span>;
                  },
                  others: {
                    maxWidth: 100,
                    resizable: false,
                    style: { textAlign: "center" }
                  }
                },
                {
                  fieldName: "diet_id",
                  label: <AlgaehLabel label={{ forceLabel: "Diet" }} />,
                  displayTemplate: row => {
                    let display =
                      this.props.dietmaster === undefined
                        ? []
                        : this.props.dietmaster.filter(
                            f => f.hims_d_diet_master_id === row.diet_id
                          );

                    return (
                      <span>
                        {display !== null && display.length !== 0
                          ? display[0].hims_d_diet_description
                          : ""}
                      </span>
                    );
                  },
                  others: { style: { textAlign: "center" } }
                }
              ]}
              keyId="patient_code"
              dataSource={{
                data:
                  this.props.dietList === undefined ? [] : this.props.dietList
              }}
              paging={{ page: 0, rowsPerPage: 5 }}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dietmaster: state.dietmaster,
    dietList: state.dietList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDietMaster: AlgaehActions,
      getDietList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DietAdvice)
);
