import React, { memo, useState } from "react";
import BookAppointment from "./bookAppointment";
export default memo(function AddPatient(props) {
  const [showEditPopup, setShowEditPopup] = useState(false);
  return (
    <>
      <i className="fas fa-plus" onClick={() => setShowEditPopup(true)} />
      <BookAppointment
        {...props}
        showEditPopup={showEditPopup}
        setShowEditPopup={setShowEditPopup}
      />
    </>
  );
});
