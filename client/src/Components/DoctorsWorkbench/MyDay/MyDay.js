import React, { Component } from "react";
import "./myday.css";
import Paper from "@material-ui/core/Paper";

class MyDay extends Component {
  render() {
    return (
      <div className="myday">
        <div className="row top-bar">
          <div className="my-calendar">
            <div className="row">
              <div className="col month">
                <ul style={{ listStyle: "none" }}>
                  {/* <li className="prev">&#10094;</li>
                      <li className="next">&#10095;</li> */}
                  <li>
                    July <br />
                    <span style={{ fontSize: "9px" }}>2018</span> <br />
                    <span style={{ fontSize: "12px" }}>22 Patients Today</span>
                  </li>
                </ul>
              </div>

              <div className="col">
                <ul className="weekdays">
                  <li>Mo</li>
                  <li>Tu</li>
                  <li>We</li>
                  <li>Th</li>
                  <li>Fr</li>
                  <li>Sa</li>
                  <li>Su</li>
                </ul>

                <ul className="days">
                  <li>1</li>
                  <li>2</li>
                  <li>3</li>
                  <li>4</li>
                  <li>5</li>
                  <li>6</li>
                  <li>7</li>
                  <li>8</li>
                  <li>9</li>
                  <li>10</li>
                  <li>11</li>
                  <li>12</li>
                  <li>13</li>
                  <li>14</li>
                  <li>15</li>
                  <li>16</li>
                  <li>17</li>
                  <li>18</li>
                  <li>19</li>
                  <li>20</li>
                  <li>
                    <span className="active">21</span>
                  </li>
                  <li>22</li>
                  <li>23</li>
                  <li>24</li>
                  <li>25</li>
                  <li>26</li>
                  <li>27</li>
                  <li>28</li>
                  <li>29</li>
                  <li>30</li>
                  <li>31</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Layout Starts */}
        <div className="row bottom-layout">
          {/* Appointment Panel Starts */}
          <div className="col-lg-4 appointment-panel">
            <Paper>
              <label className="grey-label"> Scheduled Appointments</label>
              {/* Timeline */}
            </Paper>
          </div>
          {/* Appointment Panel Ends */}

          <div className="col-lg-8 encounters-panel">
            <Paper>
              <label className="grey-label">Encounters</label>
              {/*  Grid  */}
            </Paper>

            <div className="right-bottom-panel row">
              <div className="col">
                <Paper>
                  <label className="grey-label">Walk In Patients</label>
                </Paper>
              </div>
              <div className="col">
                <Paper>
                  <label className="grey-label">In Patients</label>
                </Paper>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom layout Ends */}
      </div>
    );
  }
}

export default MyDay;
