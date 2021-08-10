import React from "react";
import "./dashboard.scss";

export default function EncounterDashboard() {
  return (
    <div className="dashboard front-dash">
      {/* <Spin> */}
      <div className="row card-deck">
        <div className="card animated fadeInUp faster">
          <div className="content">
            <div className="row">
              {/* <div className="col-4">
                <div className="icon-big text-center">
                  <i className="fas fa-calendar-check" />
                </div>
              </div> */}
              <div className="col-12">
                <div className="numbers">
                  <p>Total Patients</p>
                  0.00
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card animated fadeInUp faster">
          <div className="content">
            <div className="row">
              {/* <div className="col-4">
                <div className="icon-big text-center">
                  <i className="fas fa-walking" />
                </div>
              </div> */}
              <div className="col-12">
                <div className="numbers">
                  <p>Total New Patients</p>
                  0.00
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card animated fadeInUp faster">
          <div className="content">
            <div className="row">
              {/* <div className="col-4">
                <div className="icon-big text-center">
                  <i className="fas fa-credit-card" />
                </div>
              </div> */}
              <div className="col-12">
                <div className="numbers">
                  <p>Total Follow Up Patients</p>
                  0.00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete section starting from below row */}
      <div className="row">
        <div className="col-12">
          <h4>
            Sub Department Name - <b>0.00</b>
          </h4>
          <hr style={{ paddingBottom: 5 }} />
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Complete section starting from below row */}
      <div className="row">
        <div className="col-12">
          <h4>
            Sub Department Name - <b>0.00</b>
          </h4>
          <hr style={{ paddingBottom: 5 }} />
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-7">
                  <div className="">
                    <p>Dr. NORHAN MOHAMED AHMED ABORAIA</p>
                  </div>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    <p>No. of Patients</p>
                    34
                  </div>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-6 stats">
                    New Visit - <span>28</span>
                  </div>
                  <div className="col-6 stats" style={{ textAlign: "right" }}>
                    Follow Up - <span>6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </Spin> */}
    </div>
  );
}
