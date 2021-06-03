import React, { memo, useContext } from "react";
import { Spin, MainContext, AlgaehLabel } from "algaeh-react-components";
export default memo(function Legends(props) {
  const { userLanguage } = useContext(MainContext);

  return (
    <div className="portlet-title" style={{ margin: "-10px -15px 0" }}>
      <div className="caption">
        <h3 className="caption-subject">
          <AlgaehLabel
            label={{
              fieldName: "doctorsAvailability",
            }}
          />
        </h3>
      </div>
      <div className="actions">
        <Spin spinning={props.appStatusLoading ?? true}>
          <ul className="ul-legend">
            {props.legends &&
              props.legends?.map((item, index) => (
                <li key={index}>
                  <span
                    style={{
                      backgroundColor: item.color_code,
                    }}
                  />
                  {userLanguage === "ar"
                    ? item.description_ar
                    : item.statusDesc}
                </li>
              ))}
          </ul>
        </Spin>
      </div>
    </div>
  );
});
