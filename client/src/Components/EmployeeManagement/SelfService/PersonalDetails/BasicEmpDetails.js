import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

export default function BasicEmpDetails({
  show = false,
  data = {},
  onCancel = () => {},
  onSubmit = () => {},
}) {
  const [details, setDetails] = useState({});

  useEffect(() => {
    const {
      full_name,
      arabic_name,
      date_of_birth,
      sex,
      present_address,
      permanent_address,
      primary_contact_no,
      email,
      hims_d_employee_id,
    } = data;
    setDetails({
      full_name,
      arabic_name,
      date_of_birth,
      sex,
      present_address,
      permanent_address,
      primary_contact_no,
      email,
      hims_d_employee_id,
    });
  }, [show]);

  function changeTexts(e) {
    const { name, value } = e.target;
    setDetails((state) => ({
      ...state,
      [name]: value,
    }));
  }

  function dropDownHandle(value) {
    setDetails((state) => ({
      ...state,
      [value.name]: value.value,
    }));
  }

  function handleUpdate() {
    onSubmit(details);
  }

  if (show) {
    return (
      <div
        className={
          "col-12 editFloatCntr animated  " +
          (show ? "slideInUp" : "slideOutDown") +
          " faster"
        }
        data-validate="emp-basic-div"
      >
        <h5>Edit Basic Details</h5>
        <div className="row">
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Full Name",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "full_name",
              value: details.full_name,
              events: {
                onChange: changeTexts,
              },
              others: {
                tabIndex: "1",
              },
            }}
          />
          <AlagehFormGroup
            div={{ className: "col arabic-txt-fld" }}
            label={{
              forceLabel: "Arabic Name",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "arabic_name",
              value: details.arabic_name,
              events: {
                onChange: changeTexts,
              },
              others: {
                tabIndex: "2",
              },
            }}
          />
          <AlgaehDateHandler
            div={{ className: "col margin-bottom-15" }}
            label={{
              forceLabel: "Date of Birth",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "date_of_birth",
              others: {
                tabIndex: "3",
              },
            }}
            events={{
              onChange: (selDate) => {
                setDetails((state) => ({
                  ...state,
                  date_of_birth: selDate,
                }));
              },
            }}
            value={details.date_of_birth}
            maxDate={new Date()}
          />
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Gender",
              isImp: true,
            }}
            selector={{
              name: "sex",
              className: "select-fld",
              value: details.sex,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.EMP_FORMAT_GENDER,
              },
              onChange: dropDownHandle,
            }}
          />
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Mobile No.",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "primary_contact_no",
              value: details.primary_contact_no,
              events: {
                onChange: changeTexts,
              },
              others: {
                type: "number",
              },
            }}
          />
        </div>

        <div className="row">
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Email Address",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "email",
              value: details.email,
              events: {
                onChange: changeTexts,
              },
            }}
          />
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Present Address",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "present_address",
              value: details.present_address,
              events: {
                onChange: changeTexts,
              },
            }}
          />
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Permanent Address",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "permanent_address",
              value: details.permanent_address,
              events: {
                onChange: changeTexts,
              },
            }}
          />
        </div>
        <div className="row">
          <div className="col">
            <button
              onClick={handleUpdate}
              type="button"
              className="btn btn-primary"
            >
              Update
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
