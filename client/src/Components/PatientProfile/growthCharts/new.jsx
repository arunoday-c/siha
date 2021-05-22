import React from "react";
import "./growthCharts.scss";
// import UnderweightGirl from "../../../assets/images/pview/weights/Female 4-12yrs UNDERWEIGHT.png";

export default function GrowthChartsNew() {
  return (
    <div className="row" style={{ marginTop: "25px" }}>
      <div
        className="col-6"
        style={{ textAlign: "center", background: "#fff", padding: "15px" }}
      >
        <div className="row">
          <div className="col-3">
            <p>
              {" "}
              <i class="fas  fa-ruler-vertical"></i>
            </p>
            <h3>Length</h3>
            <small>
              as of <span>21 May 2021</span>
            </small>
          </div>
          <div className="col-3">
            <p>
              {" "}
              <i class="fas fa-weight-hanging"></i>
            </p>
            <h3>Weight</h3>
            <small>
              as of <span>21 May 2021</span>
            </small>
          </div>
          <div className="col-3">
            <p>
              <i class="fas fa-brain"></i>
            </p>
            <h3>Head circumference</h3>
            <small>
              as of <span>21 May 2021</span>
            </small>
          </div>
          <div className="col-3">
            <p>
              {" "}
              <i class="fas fa-weight"></i>
            </p>
            <h3>BMI</h3>
            <small>
              as of <span>21 May 2021</span>
            </small>
          </div>
        </div>
        <hr></hr>
        <div className="row">
          <div className="col-3">
            <p>
              <span>50.1cm</span> | <span>0%</span>
            </p>
            <small>1'8"</small>
          </div>
          <div className="col-3">
            <p>
              <span>50.1cm</span> | <span>0%</span>
            </p>
            <small>1'8"</small>
          </div>
          <div className="col-3">
            <p>
              <span>50.1cm</span> | <span>0%</span>
            </p>
            <small>1'8"</small>
          </div>
          <div className="col-3">
            <p>
              <span>50.1cm</span> | <span>0%</span>
            </p>
            <small>1'8"</small>
          </div>
        </div>{" "}
        <hr></hr>
        <div className="row">
          <div className="col-3">
            <img
              src={require("../../../assets/images/pview/weights/Female 4-12yrs UNDERWEIGHT.png")}
            ></img>
            <h4>Underweight</h4>
          </div>
          <div className="col-3">
            <img
              src={require("../../../assets/images/pview/weights/Female 4-12yrs HEALTHY.png")}
            ></img>
            <h4>Healthy</h4>
          </div>
          <div className="col-3">
            <img
              src={require("../../../assets/images/pview/weights/Female 4-12yrs OVERWEIGHT.png")}
            ></img>
            <h4>Overweight</h4>
          </div>
          <div className="col-3">
            <img
              src={require("../../../assets/images/pview/weights/Female 4-12yrs OBESE.png")}
            ></img>
            <h4>Obese</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-3">3.37Kg (8lb 3oz)</div>
          <div className="col-3">3.37Kg (8lb 3oz)</div>
          <div className="col-3">3.37Kg (8lb 3oz)</div>
          <div className="col-3">3.37Kg (8lb 3oz)</div>
        </div>
        <div className="row" style={{ textAlign: "left" }}>
          <div className="col-12">
            <p>
              Wonder Women is <b>Underweight</b> at <b>3.7kg</b>
              <span>(8lb 3oz).</span>
            </p>
            <p>
              Compared to her last weight assesment, she is improving (good).
            </p>
            <small>
              The healthy weight for her age and height is 5.9kg - 8kg (12lb
              15oz - 17lb 12oz)
            </small>
          </div>
        </div>
      </div>
      <div className="col-6">Parents</div>
    </div>
  );
}
