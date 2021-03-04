import React from "react";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import moment from "moment";

function ExsistingDiagram({
  exittingDetails,
  onClickDeleteDiagram,
  onZoomImage,
}) {
  return (
    <div>
      {exittingDetails.map((item, index) => {
        return (
          <div className="col-12 eachDiagram" key={index}>
            <AlgaehFile
              name={"attach_" + index}
              accept="image/*"
              noImage={true}
              forceRefreshed={true}
              showActions={false}
              serviceParameters={{
                uniqueID: item.image,
                destinationName: item.image,
                fileType: "DepartmentImages",
              }}
            />
            <p>
              {item.remarks}
              <small>
                {moment(new Date(item.update_date)).format(
                  "DD:MM:YYYY | hh:mm A"
                )}
              </small>
            </p>{" "}
            <div className="diagramImgTool">
              <i
                className="fas fa-trash-alt"
                onClick={(e) => onClickDeleteDiagram(item, e)}
              />
              <i
                className="fas fa-search-plus"
                onClick={(e) => onZoomImage(e)}
              />

              {/* <input type="checkbox" id={"chk_compire_" + index} />
                  <label htmlFor={"chk_compire_" + index}>Compare</label> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExsistingDiagram;
