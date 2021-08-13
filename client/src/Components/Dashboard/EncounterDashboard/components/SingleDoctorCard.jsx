import React, { memo } from "react";

export default memo(function SingleDoctorCard({ data, index }) {
  return (
    <div className="row">
      {/* {data.map((item, index) => ( */}
      <div className="col-3">
        <div
          className="card animated fadeInUp faster"
          key={index}
          style={{ backgroundColor: "white" }}
        >
          <div className="content">
            <div className="row">
              <div className="col-12">
                <p style={{ margin: "0" }}>{data.full_name}</p>
                <small>{data.sub_department_name}</small>
              </div>
            </div>{" "}
            <div className="footer">
              <hr />
              <div className="row">
                <div className="col-7 stats">
                  <p style={{ margin: "5px 0" }}>
                    New Visit -{" "}
                    <span>
                      {data.newVisitDetails[0]?.totalPat
                        ? data.newVisitDetails[0]?.totalPat
                        : 0}
                    </span>
                  </p>

                  <p style={{ margin: "5px 0" }}>
                    Follow Up -{" "}
                    <span>
                      {data.newVisitDetails[1]?.totalPat
                        ? data.newVisitDetails[1]?.totalPat
                        : 0}
                    </span>
                  </p>
                </div>
                <div className="col-5">
                  <div className="numbers">
                    {/* <p>No. of Patients</p> */}
                    <h1 style={{ marginTop: "5px" }}>{data.totalLength}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
      {/* ))} */}
    </div>
  );
});
