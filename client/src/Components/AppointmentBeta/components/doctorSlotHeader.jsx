import React, { memo, useContext } from "react";
import { MainContext, AlgaehLabel } from "algaeh-react-components";
export default memo(function DoctorSlotHeader(props) {
  const { userLanguage } = useContext(MainContext);
  return (
    <>
      <tr>
        <th className="tg-amwm" colSpan="2">
          <h6>
            {userLanguage === "ar" ? props.doctor_name_ar : props.doctor_name}
          </h6>
          <p>
            {props.room_name && props.room_name !== "" ? (
              <span>
                <AlgaehLabel
                  label={{
                    fieldName: "roomNo",
                  }}
                />
                : {userLanguage === "ar" ? props.room_name_ar : props.room_name}
              </span>
            ) : (
              <AlgaehLabel
                label={{
                  forceLabel: "",
                }}
              />
            )}
          </p>
        </th>
      </tr>
      <tr>
        <th className="tbl-subHdg">
          <AlgaehLabel
            label={{
              fieldName: "booked",
            }}
          />
        </th>
        <th className="tbl-subHdg">
          <AlgaehLabel
            label={{
              fieldName: "standBy",
            }}
          />
        </th>
      </tr>
    </>
  );
});
