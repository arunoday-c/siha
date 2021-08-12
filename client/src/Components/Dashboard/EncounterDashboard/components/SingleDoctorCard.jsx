import React, { memo } from "react";

export default memo(function SingleDoctorCard({ data }) {
  return (
    <>
      {data.detailsOfDoc.map((item, index) => (
        <div className="card animated fadeInUp faster" key={index}>
          <div className="content">
            <div className="row">
              <div className="col-7">
                <div className="">
                  <p>{item.full_name}</p>
                </div>
              </div>
              <div className="col-5">
                <div className="numbers">
                  <p>No. of Patients</p>
                  {item.totalLength}
                </div>
              </div>
            </div>{" "}
            <div className="footer">
              <hr />
              <div className="row">
                <div className="col-6 stats">
                  New Visit -{" "}
                  <span>
                    {item.newVisitDetails[0]?.totalPat
                      ? item.newVisitDetails[0]?.totalPat
                      : 0}
                  </span>
                </div>
                <div className="col-6 stats" style={{ textAlign: "right" }}>
                  Follow Up -{" "}
                  <span>
                    {item.newVisitDetails[1]?.totalPat
                      ? item.newVisitDetails[1]?.totalPat
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
});
