import React, { memo } from "react";

export default memo(function SingleDoctorCard({ data }) {
  return (
    <div className="row">
      {data.detailsOfDoc.map((item, index) => (
        <div className="col-3">
          <div
            className="card animated fadeInUp faster"
            key={index}
            style={{ backgroundColor: "white" }}
          >
            <div className="content">
              <div className="row">
                <div className="col-12">
                  <p style={{ margin: "0" }}>{item.full_name}</p>
                  <small>{item.sub_department_name}</small>
                </div>
              </div>{" "}
              <div className="footer">
                <hr />
                <div className="row">
                  <div className="col-7 stats">
                    <p style={{ margin: "5px 0" }}>
                      New Visit -{" "}
                      <span>
                        {item.newVisitDetails[0]?.totalPat
                          ? item.newVisitDetails[0]?.totalPat
                          : 0}
                      </span>
                    </p>

                    <p style={{ margin: "5px 0" }}>
                      Follow Up -{" "}
                      <span>
                        {item.newVisitDetails[1]?.totalPat
                          ? item.newVisitDetails[1]?.totalPat
                          : 0}
                      </span>
                    </p>
                  </div>
                  <div className="col-5">
                    <div className="numbers">
                      {/* <p>No. of Patients</p> */}
                      <h1 style={{ marginTop: "5px" }}>{item.totalLength}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      ))}
    </div>
  );
});
