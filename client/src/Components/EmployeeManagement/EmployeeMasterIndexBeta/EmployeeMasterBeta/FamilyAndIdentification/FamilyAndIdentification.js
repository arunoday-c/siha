import React, { useState, useContext } from "react";
import "./FamilyAndIdentification.scss";
import { swalMessage } from "../../../../../utils/algaehApiCall";
import { EmployeeMasterContextForEmployee } from "../../EmployeeMasterContextForEmployee";
import { EmployeeMasterContext } from "../../EmployeeMasterContext";
// import moment from "moment";
// import { AlgaehActions } from "../../../../../actions/algaehActions";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import {
//   texthandle,
//   isDoctorChange,
//   sameAsPresent,
// } from "./PersonalDetailsEvents.js";
import moment from "moment";
// import MyContext from "../../../../../utils/MyContext.js";
import hijri from "moment-hijri";
import variableJson from "../../../../../utils/GlobalVariables.json";
// import AlgaehFile from "../../../../Wrapper/algaehFileUpload";
// import { getCookie } from "../../../../../utils/algaehApiCall";
// import swal from "sweetalert2";
import {
  // MainContext,
  AlgaehMessagePop,
  // persistStorageOnRemove,
  AlgaehAutoComplete,
  AlgaehDateHandler,
  AlgaehFormGroup,
  AlgaehHijriDatePicker,
  // AlgaehLabel,
  AlgaehDataGrid,
  // AlgaehLabel,
} from "algaeh-react-components";
// import { algaehApiCall } from "../../../../../utils/algaehApiCall";
// import AlgaehLoader from "../../../../Wrapper/fullPageLoader";
// import { RawSecurityElement } from "algaeh-react-components";

import { useForm, Controller } from "react-hook-form";

import { newAlgaehApi } from "../../../../../hooks";
import { useQuery } from "react-query";
const getFamilyIdentification = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getFamilyIdentification",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};

export default function FamilyAndIdentification({ EmpMasterIOputs }) {
  // const { userToken } = useContext(MainContext);
  const { dropdownData, setDropDownData } = useContext(EmployeeMasterContext);
  const { setEmployeeUpdateDetails, output } = useContext(
    EmployeeMasterContextForEmployee
  );
  const [idDetails, setIdDetails] = useState([]);
  const [dependentDetails, setDependentDetails] = useState([]);
  console.log(dependentDetails, "dependentDetails");
  const {
    control,
    errors,
    // register,
    reset,
    handleSubmit,
    // setValue,
    getValues,
    // watch,
  } = useForm({});
  const {
    control: control2,
    getValues: getValues2,
    reset: reset2,
    setValue: setValue2,
    watch: watch2,
    // register: register2,
    errors: errors2,
    handleSubmit: handleSubmit2,
  } = useForm({});

  const { valid_upto } = watch2(["valid_upto"]);
  const { data: familyIdDetails } = useQuery(
    ["FAMILY_GET_DATA", { employee_id: EmpMasterIOputs }],
    getFamilyIdentification,
    {
      onSuccess: (data) => {
        setIdDetails(data[0]);
        setDependentDetails(data[1]);
        console.log("familyIdDetails", familyIdDetails);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const { data: idtypes } = useQuery("IDTYPE_GET_DATA", getIDTypes, {
    onSuccess: (data) => {
      setDropDownData({ idtypes: data });
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  async function getIDTypes(key) {
    if (
      dropdownData.idtypes === undefined ||
      dropdownData.idtypes.length === 0
    ) {
      const result = await newAlgaehApi({
        uri: "/identity/get",
        module: "masterSettings",
        method: "GET",
      });
      return result?.data?.records;
    } else {
      return dropdownData.idtypes;
    }
  }
  // const { data: banks } = useQuery("all-banks", getBanks, {
  //   enabled: !!officialDetails,

  //   retry: 0,
  //   initialStale: true,
  //   onSuccess: (data) => {
  //     debugger;
  //     let employeeBankAccFormat = data.find((item) => {
  //       debugger;
  //       return item.hims_d_bank_id === officialDetails[0].employee_bank_id;
  //     });
  //     setMasked_bank_account(employeeBankAccFormat.masked_bank_account);
  //   },
  //   onError: (err) => {
  //     AlgaehMessagePop({
  //       display: err?.message,
  //       type: "error",
  //     });
  //   },
  // });

  // const changeGridEditors = (row, e) => {
  //   let name = e.name || e.target.name;
  //   let value = e.value || e.target.value;
  //   row[name] = value;
  //   // row.update();

  const AddEmpId = (e) => {
    const {
      identity_documents_id,
      identity_number,
      valid_upto,
      issue_date,
    } = getValues2();
    let idDetail = [...idDetails];
    if (issue_date === null) {
      swalMessage({
        title: "Issue Date Cannot be Blank",
        type: "warning",
      });
      return;
    }
    if (valid_upto === null) {
      swalMessage({
        title: "Expiry Date Cannot be Blank",
        type: "warning",
      });
      return;
    }

    let insertIdDetails =
      output?.insertIdDetails === undefined ? [] : output?.insertIdDetails;

    let hijriConverted = hijri(valid_upto).format("iD-iM-iYYYY");

    let inpObj = {
      alert_date: null,
      alert_required: "N",
      employee_id: EmpMasterIOputs ? EmpMasterIOputs : "",
      identity_documents_id: parseInt(identity_documents_id),
      identity_number: identity_number,
      valid_upto: moment(valid_upto).format("YYYY-MM-DD"),
      hijri_valid_upto: hijriConverted,
      issue_date: null,
    };

    idDetail.push(inpObj);
    insertIdDetails.push(inpObj);

    setIdDetails(() => [...idDetail]);
    setEmployeeUpdateDetails({
      idDetails: idDetail,
      insertIdDetails: insertIdDetails,
    });
    reset2({
      identity_documents_id: null,
      identity_number: null,
      valid_upto: null,
      hijri_valid_upto: "",
      issue_date: null,
      alert_required: null,
      alert_date: null,
    });
  };
  const addDependentType = (e) => {
    let dependentDetail = dependentDetails;
    let insertDependentDetails =
      output?.insertDependentDetails === undefined
        ? []
        : output?.insertDependentDetails;

    const {
      hims_d_employee_id,
      dependent_type,
      dependent_name,
      dependent_identity_no,
      dependent_identity_type,
    } = getValues();
    let inpObj = {
      employee_id: hims_d_employee_id,
      dependent_type: dependent_type,
      dependent_name: dependent_name,
      dependent_identity_no: dependent_identity_no,
      dependent_identity_type: dependent_identity_type,
    };

    dependentDetail.push(inpObj);
    insertDependentDetails.push(inpObj);
    setEmployeeUpdateDetails({
      dependentDetails: dependentDetail,
      insertDependentDetails: insertDependentDetails,
    });
    setDependentDetails([...dependentDetail]);

    reset({
      dependent_type: null,
      dependent_name: null,
      dependent_identity_no: null,
      dependent_identity_type: null,
    });
  };

  const deleteIdentifications = (row) => {
    let idDetail = idDetails;
    let insertIdDetails =
      output?.insertIdDetails === undefined ? [] : output?.insertIdDetails;
    let deleteIdDetails =
      output?.deleteIdDetails === undefined ? [] : output?.deleteIdDetails;
    if (row.hims_d_employee_identification_id !== undefined) {
      deleteIdDetails.push(row);
      idDetail.splice(row.rowIdx, 1);
    } else {
      for (let x = 0; x < insertIdDetails.length; x++) {
        if (insertIdDetails[x].deductions_id === row.deductions_id) {
          insertIdDetails.splice(x, 1);
        }
      }
      debugger;
      idDetail.splice(row.rowIdx, 1);
    }
    setIdDetails([...idDetail]);
    setEmployeeUpdateDetails({
      idDetails: idDetail,
      deleteIdDetails: deleteIdDetails,
      insertIdDetails: insertIdDetails,
    });
  };

  const updateIdentifications = (row) => {
    let idDetail = idDetails;
    let insertIdDetails =
      output?.insertIdDetails === undefined ? [] : output?.insertIdDetails;
    let updateIdDetails =
      output?.updateIdDetails === undefined ? [] : output?.updateIdDetails;
    if (row.hims_d_employee_identification_id !== undefined) {
      let hijriConverted = hijri(row.valid_upto).format("iD-iM-iYYYY");

      let Updateobj = {
        hims_d_employee_identification_id:
          row.hims_d_employee_identification_id,
        identity_documents_id: row.identity_documents_id,
        identity_number: row.identity_number,
        issue_date: row.issue_date,
        valid_upto: row.valid_upto,
        hijri_valid_upto: hijriConverted,
      };
      updateIdDetails.push(Updateobj);
      idDetail[row.rowIdx] = Updateobj;
    } else {
      let hijriConverted = hijri(row.valid_upto).format("iD-iM-iYYYY");

      let Updateobj = {
        identity_documents_id: row.identity_documents_id,
        identity_number: row.identity_number,
        issue_date: row.issue_date,
        valid_upto: row.valid_upto,
        hijri_valid_upto: hijriConverted,
      };
      insertIdDetails[row.rowIdx] = Updateobj;
      idDetail[row.rowIdx] = Updateobj;
    }
    setIdDetails([...idDetail]);
    setEmployeeUpdateDetails({
      idDetails: idDetail,
      updateIdDetails: updateIdDetails,
      insertIdDetails: insertIdDetails,
    });
  };

  const deleteDependencies = (row) => {
    let dependentDetail = dependentDetails;
    let insertDependentDetails =
      output?.insertDependentDetails === undefined
        ? []
        : output?.insertDependentDetails;
    let deleteDependentDetails =
      output?.deleteDependentDetails === undefined
        ? []
        : output?.deleteDependentDetails;
    if (row.hims_d_employee_dependents_id !== undefined) {
      deleteDependentDetails.push(row);
      dependentDetail.splice(row.rowIdx, 1);
    } else {
      for (let x = 0; x < insertDependentDetails.length; x++) {
        if (insertDependentDetails[x].deductions_id === row.deductions_id) {
          insertDependentDetails.splice(x, 1);
        }
      }
      dependentDetail.splice(row.rowIdx, 1);
    }
    setDependentDetails([...dependentDetail]);
    setEmployeeUpdateDetails({
      dependentDetails: dependentDetail,
      deleteDependentDetails: deleteDependentDetails,
      insertDependentDetails: insertDependentDetails,
    });
    // $this.setState({
    //   dependentDetails: dependentDetails,

    // });
  };

  const updateDependencies = (row) => {
    let dependentDetail = dependentDetails;
    let insertDependentDetails =
      output?.insertDependentDetails === undefined
        ? []
        : output?.insertDependentDetails;
    let updateDependentDetails =
      output?.updateDependentDetails === undefined
        ? []
        : output?.updateDependentDetails;
    if (row.hims_d_employee_dependents_id !== undefined) {
      let Updateobj = {
        hims_d_employee_dependents_id: row.hims_d_employee_dependents_id,
        dependent_type: row.dependent_type,
        dependent_name: row.dependent_name,
        dependent_identity_type: row.dependent_identity_type,
        dependent_identity_no: row.dependent_identity_no,
      };
      updateDependentDetails.push(Updateobj);
      dependentDetail[row.rowIdx] = Updateobj;
    } else {
      let Updateobj = {
        dependent_type: row.dependent_type,
        dependent_name: row.dependent_name,
        dependent_identity_type: row.dependent_identity_type,
        dependent_identity_no: row.dependent_identity_no,
      };
      insertDependentDetails[row.rowIdx] = Updateobj;
      dependentDetail[row.rowIdx] = Updateobj;
    }
    setDependentDetails([...dependentDetail]);
    setEmployeeUpdateDetails({
      dependentDetails: dependentDetail,
      updateDependentDetails: updateDependentDetails,
      insertDependentDetails: insertDependentDetails,
    });
    // $this.setState({
    //   dependentDetails: dependentDetails,
    // });
  };

  const datehandlegrid = (row, e) => {
    row.valid_upto = e._d;

    if (e.target.gregorianDate !== undefined) {
      row.valid_upto = moment(e.target.gregorianDate, "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
    }
  };
  const onSubmit2 = (e) => {
    console.error(errors);
    AddEmpId(e);
  };
  const onSubmit = (e) => {
    console.error(errors);
    addDependentType(e);
  };
  const onchangegridcol = (row, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
  };
  return (
    <>
      <div className="hptl-phase1-add-employee-form popRightDiv">
        <div className="row">
          <div className="col-6" data-validate="empIdGrid">
            <h5>
              <span>Personal Identification Details</span>
            </h5>
            <div className="row paddin-bottom-5">
              <form key={1} onSubmit={handleSubmit2(onSubmit2)}>
                <Controller
                  name="identity_documents_id"
                  control={control2}
                  rules={{ required: "Required" }}
                  render={({ value, onChange, onBlur }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col mandatory" }}
                      error={errors2}
                      label={{
                        forceLabel: "Id Type",
                        isImp: true,
                      }}
                      selector={{
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);
                        },
                        onClear: () => {
                          onChange("");
                        },
                        name: "identity_documents_id",
                        dataSource: {
                          textField: "identity_document_name",
                          valueField: "hims_d_identity_document_id",
                          data: idtypes,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehAutoComplete
            div={{ className: "col-3 mandatory form-group" }}
            label={{
              forceLabel: "Id Type",
              isImp: true,
            }}
            selector={{
              name: "identity_documents_id",
              className: "select-fld",
              value: this.state.identity_documents_id,
              dataSource: {
                textField: "identity_document_name",
                valueField: "hims_d_identity_document_id",
                data: this.props.idtypes,
              },
              onChange: texthandle.bind(this, this),
              others: {
                tabIndex: "1",
              },
              onClear: () => {
                this.setState({
                  identity_documents_id: null,
                });
              },
            }}
          /> */}
                <Controller
                  name="identity_number"
                  control={control2}
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col mandatory" }}
                      error={errors2}
                      label={{
                        forceLabel: "Id Number",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "identity_number",
                        ...props,
                        others: {
                          tabIndex: "2",
                          placeholder: "",
                          // type: "number"
                        },
                      }}
                    />
                  )}
                />
                {/* < AlgaehFormGroup
            div={{ className: "col-3 mandatory" }}
            label={{
              forceLabel: "Id Number",
              isImp: true,
            }}
            textBox={{
              value: this.state.identity_number,
              className: "txt-fld",
              name: "identity_number",

              events: {
                onChange: texthandle.bind(this, this),
              },
              others: {
                tabIndex: "2",
                placeholder: "",
                // type: "number"
              },
            }}
          /> */}
                {/* <AlgaehDateHandler
            div={{ className: "col-3 mandatory" }}
            label={{
              forceLabel: "Issue Date",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "issue_date",
              others: {
                tabIndex: "3",
              },
            }}
            maxDate={new Date()}
            events={{
              onChange: datehandle.bind(this, this),
            }}
            value={this.state.issue_date}
          /> */}
                {/* <AlgaehHijriDatePicker
            div={{
              className: "col-lg-3",
              tabIndex: "6",
            }}
            label={{ forceLabel: "Hijiri Issue Date" }}
            textBox={{ className: "txt-fld" }}
            type="hijri"
            gregorianDate={this.state.hijri_issue_date}
            events={{
              onChange: hijriOnChange.bind(this, this),
            }}
          ></AlgaehHijriDatePicker> */}
                <Controller
                  control={control2}
                  name="valid_upto"
                  rules={{ required: "Please Select DOB" }}
                  render={({ onChange, value }) => (
                    <AlgaehDateHandler
                      div={{
                        className: "col mandatory",
                        tabIndex: "5",
                      }}
                      error={errors2}
                      label={{
                        forceLabel: "Expiry Date",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "valid_upto",
                        value,
                        others: {
                          tabIndex: "4",
                        },
                      }}
                      // others={{ disabled }}
                      // maxDate={new Date()}
                      events={{
                        onChange: (mdate) => {
                          if (mdate) {
                            onChange(mdate._d);
                          } else {
                            onChange(undefined);
                          }
                        },
                        onClear: () => {
                          onChange(undefined);
                        },
                      }}
                    />
                  )}
                />
                {/* <AlgaehDateHandler
            div={{ className: "col-3 mandatory" }}
            label={{
              forceLabel: "Expiry Date",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "valid_upto",
              others: {
                tabIndex: "4",
              },
            }}
            //maxDate={new Date()}
            events={{
              onChange: datehandle.bind(this, this),
            }}
            value={this.state.valid_upto}
          /> */}
                <AlgaehHijriDatePicker
                  div={{
                    className: "col mandatory HijriCalendar",
                    tabIndex: "6",
                  }}
                  gregorianDate={valid_upto || null}
                  label={{ forceLabel: "Hijiri Date" }}
                  textBox={{ className: "txt-fld" }}
                  type="hijri"
                  events={{
                    onChange: ({ target }) => {
                      setValue2(
                        "valid_upto",
                        moment(target?.gregorianDate, "DD-MM-YYYY")._d
                      );
                    },
                    onClear: () => {
                      setValue2("valid_upto", undefined);
                    },
                  }}
                />
                {/* <AlgaehHijriDatePicker
            div={{
              className: "col-3",
            }}
            label={{ forceLabel: "Hijiri Valid Date" }}
            textBox={{ className: "txt-fld" }}
            type="hijri"
            gregorianDate={this.state.valid_upto}
            events={{
              onChange: hijriOnChange.bind(this, this),
            }}
          ></AlgaehHijriDatePicker> */}
                <div
                  className="col-2"
                  style={{ textAlign: "right", marginTop: 21 }}
                >
                  <button
                    type="submit"
                    // onClick={AddEmpId}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 17 }}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>

            <div className="row">
              <div className="col-lg-12 " id="employeeId_DetailsGrid_Cntr">
                {console.log("idDetails", idDetails)}
                <AlgaehDataGrid
                  id="identity_documents_id"
                  columns={[
                    {
                      fieldName: "identity_documents_id",
                      label: "ID Type",
                      displayTemplate: (row) => {
                        let display =
                          idtypes === undefined
                            ? []
                            : idtypes.filter(
                                (f) =>
                                  f.hims_d_identity_document_id ===
                                  row.identity_documents_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].identity_document_name
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display =
                          idtypes === undefined
                            ? []
                            : idtypes.filter(
                                (f) =>
                                  f.hims_d_identity_document_id ===
                                  row.identity_documents_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].identity_document_name
                              : ""}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "identity_number",
                      label: "ID Number",
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{}}
                            textBox={{
                              defaultValue: row.identity_number,
                              className: "txt-fld",
                              name: "identity_number",
                            }}
                            events={{
                              onChange: (e) => {
                                console.log("Event reaised identity_number");
                                onchangegridcol(row, e);
                              },
                            }}
                          />
                        );
                      },
                    },

                    {
                      fieldName: "hijri_valid_upto",
                      label: "Hijri Valid Upto",
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {hijri(row.valid_upto).format("iD-iM-iYYYY")}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <AlgaehHijriDatePicker
                            div={{
                              className: "",
                              // tabIndex: "6",
                            }}
                            // textBox={{
                            //   className: "txt-fld ",
                            //   // name: "valid_upto",
                            // }}
                            // label={{ forceLabel: "Hijiri Date" }}
                            textBox={{
                              className: "txt-fld",
                              name: "hijri_date",
                            }}
                            type="hijri"
                            // minDate={new Date()}
                            gregorianDate={row.valid_upto}
                            updateInternally={true}
                            // gregorianDate={this.state.valid_upto}
                            events={{
                              onChange: (e) => {
                                datehandlegrid(row, e);
                              },
                            }}
                          ></AlgaehHijriDatePicker>
                        );
                      },
                    },
                    {
                      fieldName: "valid_upto",
                      label: "Valid Upto",
                      displayTemplate: (row) => {
                        return <span>{row.valid_upto}</span>;
                      },
                      editorTemplate: (row) => {
                        return (
                          <AlgaehDateHandler
                            label={{}}
                            // div={{ className: "" }}
                            textBox={{
                              className: "form-control",
                              name: "valid_upto",
                              value: moment(row.valid_upto),
                            }}
                            // minDate={new Date()}
                            events={{
                              onChange: (e) => {
                                debugger;
                                datehandlegrid(row, e);
                              },
                            }}
                            updateInternally={true}

                            // others={{ defaultValue: moment(row.valid_upto) }}
                          />
                        );
                      },
                    },
                  ]}
                  data={idDetails}
                  pagination={true}
                  isEditable={true}
                  events={{
                    onDelete: deleteIdentifications,
                    // onEdit: (row) => {},
                    onDone: updateIdentifications,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-6" data-validate="dependentGrid">
            <h5>
              <span>Family Details</span>
            </h5>
            <div className="row paddin-bottom-5">
              <form key={2} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  control={control}
                  name="dependent_type"
                  rules={{ required: "Please Select" }}
                  render={({ value, onChange, onBlur }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col mandatory " }}
                      error={errors}
                      label={{
                        forceLabel: "Dependent Type",
                        isImp: true,
                      }}
                      selector={{
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);
                        },
                        onClear: () => {
                          onChange("");
                        },
                        name: "dependent_type",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.DEPENDENT_TYPE,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehAutoComplete
            div={{ className: "col-3 mandatory  form-group" }}
            label={{
              forceLabel: "Dependent Type",
              isImp: true,
            }}
            selector={{
              name: "dependent_type",
              className: "select-fld",
              value: this.state.dependent_type,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: variableJson.DEPENDENT_TYPE,
              },
              onChange: texthandle.bind(this, this),
              onClear: () => {
                this.setState({
                  dependent_type: null,
                });
              },
            }}
          /> */}
                <Controller
                  name="dependent_name"
                  control={control}
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col mandatory" }}
                      error={errors}
                      label={{
                        forceLabel: "Dependent",
                        isImp: true,
                      }}
                      textBox={{
                        name: "dependent_name",
                        type: "text",
                        className: "form-control",
                        ...props,
                      }}
                    />
                  )}
                />
                {/* < AlgaehFormGroup
            div={{ className: "col-3 mandatory" }}
            label={{
              forceLabel: "Dependent Name",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "dependent_name",
              value: this.state.dependent_name,
              events: {
                onChange: texthandle.bind(this, this),
              },
            }}
          /> */}
                <Controller
                  control={control}
                  name="dependent_identity_type"
                  render={({ value, onChange, onBlur }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Id Type",
                        isImp: false,
                      }}
                      selector={{
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);
                        },
                        onClear: () => {
                          onChange("");
                        },
                        name: "dependent_identity_type",
                        dataSource: {
                          textField: "identity_document_name",
                          valueField: "hims_d_identity_document_id",
                          data: idtypes,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehAutoComplete
            div={{ className: "col-3 mandatory" }}
            label={{
              forceLabel: "Id Type",
              isImp: true,
            }}
            selector={{
              name: "dependent_identity_type",
              className: "select-fld",
              value: this.state.dependent_identity_type,
              dataSource: {
                textField: "identity_document_name",
                valueField: "hims_d_identity_document_id",
                data: this.props.idtypes,
              },
              onChange: texthandle.bind(this, this),
              onClear: () => {
                this.setState({
                  dependent_identity_type: null,
                });
              },
            }}
          /> */}
                <Controller
                  name="dependent_identity_no"
                  control={control}
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col" }}
                      error={errors}
                      label={{
                        forceLabel: "Id Number",
                        isImp: false,
                      }}
                      textBox={{
                        name: "dependent_identity_no",
                        type: "text",
                        className: "form-control",
                        ...props,
                      }}
                    />
                  )}
                />
                {/* < AlgaehFormGroup
            div={{ className: "col-3 mandatory" }}
            label={{
              forceLabel: "Id Number",
              isImp: true,
            }}
            textBox={{
              value: this.state.dependent_identity_no,
              className: "txt-fld",
              name: "dependent_identity_no",

              events: {
                onChange: texthandle.bind(this, this),
              },
            }}
          /> */}
                <div
                  className="col-2"
                  style={{ textAlign: "right", marginTop: 21 }}
                >
                  <button type="submit" className="btn btn-default">
                    Add
                  </button>
                </div>
              </form>
            </div>
            <div className="row">
              <div className="col-lg-12" id="employeeFamily_DetailsGrid_Cntr">
                <AlgaehDataGrid
                  columns={[
                    {
                      //   textField: "name",
                      // valueField: "value",
                      // data: variableJson.DEPENDENT_TYPE
                      fieldName: "dependent_type",
                      label: "Dependent Type",
                      displayTemplate: (row) => {
                        let display = variableJson.DEPENDENT_TYPE.filter(
                          (f) => f.value === row.dependent_type
                        );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].name
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display = variableJson.DEPENDENT_TYPE.filter(
                          (f) => f.value === row.dependent_type
                        );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].name
                              : ""}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "dependent_name",
                      label: "Dependent Name",
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{}}
                            textBox={{
                              value: row.dependent_name,
                              className: "txt-fld",
                              name: "dependent_name",

                              onChange: (e) => {
                                onchangegridcol(row, e);
                              },
                            }}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "dependent_identity_type",
                      label: "ID Card Type",
                      displayTemplate: (row) => {
                        let display =
                          idtypes === undefined
                            ? []
                            : idtypes.filter(
                                (f) =>
                                  f.hims_d_identity_document_id ===
                                  parseInt(row.dependent_identity_type)
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].identity_document_name
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display =
                          idtypes === undefined
                            ? []
                            : idtypes.filter(
                                (f) =>
                                  f.hims_d_identity_document_id ===
                                  parseInt(row.dependent_identity_type)
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].identity_document_name
                              : ""}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "dependent_identity_no",
                      label: "ID Number",
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{}}
                            textBox={{
                              value: row.dependent_identity_no,
                              className: "txt-fld",
                              name: "dependent_identity_no",
                              onChange: (e) => {
                                onchangegridcol(row, e);
                              },
                            }}
                          />
                        );
                      },
                    },
                  ]}
                  keyId="dependent_type"
                  data={dependentDetails}
                  pagination={true}
                  isEditable={true}
                  events={{
                    onDelete: deleteDependencies,
                    onEdit: (row) => {},
                    onDone: updateDependencies,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { Component } from "react";
// import "./FamilyAndIdentification.scss";
// import {
//   AlgaehDateHandler,
//    AlgaehFormGroup,
//   AlagehAutoComplete,
//   AlgaehDataGrid,
//   AlgaehLabel,
// } from "../../../../Wrapper/algaehWrapper";
// import variableJson from "../../../../../utils/GlobalVariables.json";
// // import { algaehApiCall } from "../../../../../utils/algaehApiCall";
// import { AlgaehHijriDatePicker } from "algaeh-react-components";

// import {
//   texthandle,
//   datehandlegrid,
//   AddEmpId,
//   addDependentType,
//   getFamilyIdentification,
//   onchangegridcol,
//   deleteIdentifications,
//   updateIdentifications,
//   deleteDependencies,
//   updateDependencies,
//   dateFormater,
//   datehandle,
//   hijriOnChange,
// } from "./FamilyAndIdentificationEvent";
// import { AlgaehActions } from "../../../../../actions/algaehActions";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import hijri from "moment-hijri";
// // import moment from "moment";

// class FamilyAndIdentification extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // issue_date: null,
//       valid_upto: null,

//       hijri_valid_upto: null,
//       // idDetails: [],
//       // deleteIdDetails: [],
//       // dependentDetails: []
//     };
//   }

//   componentDidMount() {
//     let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
//     this.setState({ ...this.state, ...InputOutput }, () => {
//       if (this.state.hims_d_employee_id !== null) {
//         getFamilyIdentification(this);
//       }
//     });

//     if (this.props.idtypes === undefined || this.props.idtypes.length === 0) {
//       this.props.getIDTypes({
//         uri: "/identity/get",
//         module: "masterSettings",
//         method: "GET",
//         redux: {
//           type: "IDTYPE_GET_DATA",
//           mappingName: "idtypes",
//         },
//       });
//     }
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <div className="hptl-phase1-add-employee-form popRightDiv">
//           <div className="row">
//             <div className="col-6" data-validate="empIdGrid">
//               <h5>
//                 <span>Personal Identification Details</span>
//               </h5>
//               <div className="row paddin-bottom-5">
//                 <AlagehAutoComplete
//                   div={{ className: "col-3 mandatory form-group" }}
//                   label={{
//                     forceLabel: "Id Type",
//                     isImp: true,
//                   }}
//                   selector={{
//                     name: "identity_documents_id",
//                     className: "select-fld",
//                     value: this.state.identity_documents_id,
//                     dataSource: {
//                       textField: "identity_document_name",
//                       valueField: "hims_d_identity_document_id",
//                       data: this.props.idtypes,
//                     },
//                     onChange: texthandle.bind(this, this),
//                     others: {
//                       tabIndex: "1",
//                     },
//                     onClear: () => {
//                       this.setState({
//                         identity_documents_id: null,
//                       });
//                     },
//                   }}
//                 />
//                 < AlgaehFormGroup
//                   div={{ className: "col-3 mandatory" }}
//                   label={{
//                     forceLabel: "Id Number",
//                     isImp: true,
//                   }}
//                   textBox={{
//                     value: this.state.identity_number,
//                     className: "txt-fld",
//                     name: "identity_number",

//                     events: {
//                       onChange: texthandle.bind(this, this),
//                     },
//                     others: {
//                       tabIndex: "2",
//                       placeholder: "",
//                       // type: "number"
//                     },
//                   }}
//                 />
//                 {/* <AlgaehDateHandler
//                   div={{ className: "col-3 mandatory" }}
//                   label={{
//                     forceLabel: "Issue Date",
//                     isImp: true,
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "issue_date",
//                     others: {
//                       tabIndex: "3",
//                     },
//                   }}
//                   maxDate={new Date()}
//                   events={{
//                     onChange: datehandle.bind(this, this),
//                   }}
//                   value={this.state.issue_date}
//                 /> */}
//                 {/* <AlgaehHijriDatePicker
//                   div={{
//                     className: "col-lg-3",
//                     tabIndex: "6",
//                   }}
//                   label={{ forceLabel: "Hijiri Issue Date" }}
//                   textBox={{ className: "txt-fld" }}
//                   type="hijri"
//                   gregorianDate={this.state.hijri_issue_date}
//                   events={{
//                     onChange: hijriOnChange.bind(this, this),
//                   }}
//                 ></AlgaehHijriDatePicker> */}
//                 <AlgaehDateHandler
//                   div={{ className: "col-3 mandatory" }}
//                   label={{
//                     forceLabel: "Expiry Date",
//                     isImp: true,
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "valid_upto",
//                     others: {
//                       tabIndex: "4",
//                     },
//                   }}
//                   //maxDate={new Date()}
//                   events={{
//                     onChange: datehandle.bind(this, this),
//                   }}
//                   value={this.state.valid_upto}
//                 />
//                 <AlgaehHijriDatePicker
//                   div={{
//                     className: "col-3",
//                   }}
//                   label={{ forceLabel: "Hijiri Valid Date" }}
//                   textBox={{ className: "txt-fld" }}
//                   type="hijri"
//                   gregorianDate={this.state.valid_upto}
//                   events={{
//                     onChange: hijriOnChange.bind(this, this),
//                   }}
//                 ></AlgaehHijriDatePicker>
//                 <div className="col" style={{ textAlign: "right" }}>
//                   <button
//                     type="button"
//                     className="btn btn-default"
//                     onClick={AddEmpId.bind(this, this)}
//                   >
//                     Add
//                   </button>
//                 </div>

//                 <div
//                   className="col-lg-12 margin-top-15"
//                   id="employeeId_DetailsGrid_Cntr"
//                 >
//                   <AlgaehDataGrid
//                     id="employeeId_DetailsGrid"
//                     columns={[
//                       {
//                         fieldName: "identity_documents_id",
//                         label: (
//                           <AlgaehLabel label={{ forceLabel: "ID Type" }} />
//                         ),
//                         displayTemplate: (row) => {
//                           let display =
//                             this.props.idtypes === undefined
//                               ? []
//                               : this.props.idtypes.filter(
//                                   (f) =>
//                                     f.hims_d_identity_document_id ===
//                                     row.identity_documents_id
//                                 );

//                           return (
//                             <span>
//                               {display !== undefined && display.length !== 0
//                                 ? display[0].identity_document_name
//                                 : ""}
//                             </span>
//                           );
//                         },
//                         editorTemplate: (row) => {
//                           let display =
//                             this.props.idtypes === undefined
//                               ? []
//                               : this.props.idtypes.filter(
//                                   (f) =>
//                                     f.hims_d_identity_document_id ===
//                                     row.identity_documents_id
//                                 );

//                           return (
//                             <span>
//                               {display !== undefined && display.length !== 0
//                                 ? display[0].identity_document_name
//                                 : ""}
//                             </span>
//                           );
//                         },
//                       },
//                       {
//                         fieldName: "identity_number",
//                         label: (
//                           <AlgaehLabel label={{ forceLabel: "ID Number" }} />
//                         ),
//                         editorTemplate: (row) => {
//                           return (
//                             < AlgaehFormGroup
//                               div={{}}
//                               textBox={{
//                                 value: row.identity_number,
//                                 className: "txt-fld",
//                                 name: "identity_number",
//                                 events: {
//                                   onChange: onchangegridcol.bind(
//                                     this,
//                                     this,
//                                     row
//                                   ),
//                                 },
//                               }}
//                             />
//                           );
//                         },
//                       },
//                       // {
//                       //   fieldName: "issue_date",
//                       //   label: (
//                       //     <AlgaehLabel label={{ forceLabel: "Issue Date" }} />
//                       //   ),
//                       //   displayTemplate: (row) => {
//                       //     return <span>{dateFormater(row.issue_date)}</span>;
//                       //   },
//                       //   editorTemplate: (row) => {
//                       //     return (
//                       //       <AlgaehDateHandler
//                       //         div={{ className: "" }}
//                       //         textBox={{
//                       //           className: "txt-fld hidden",
//                       //           name: "issue_date",
//                       //         }}
//                       //         minDate={new Date()}
//                       //         events={{
//                       //           onChange: datehandlegrid.bind(this, this, row),
//                       //         }}
//                       //         value={row.issue_date}
//                       //       />
//                       //     );
//                       //   },
//                       // },
//                       {
//                         fieldName: "hijri_valid_upto",
//                         label: (
//                           <AlgaehLabel
//                             label={{ forceLabel: "Hijri Valid Upto" }}
//                           />
//                         ),
//                         displayTemplate: (row) => {
//                           return (
//                             <span>
//                               {hijri(row.valid_upto).format("iD-iM-iYYYY")}
//                             </span>
//                           );
//                         },
//                         editorTemplate: (row) => {
//                           return (
//                             <AlgaehHijriDatePicker
//                               div={{
//                                 className: "",
//                                 // tabIndex: "6",
//                               }}
//                               // textBox={{
//                               //   className: "txt-fld ",
//                               //   // name: "valid_upto",
//                               // }}
//                               // label={{ forceLabel: "Hijiri Date" }}
//                               textBox={{ className: "txt-fld" }}
//                               type="hijri"
//                               // minDate={new Date()}
//                               gregorianDate={row.valid_upto}
//                               // gregorianDate={this.state.valid_upto}
//                               events={{
//                                 onChange: datehandlegrid.bind(this, this, row),
//                               }}
//                             ></AlgaehHijriDatePicker>
//                           );
//                         },
//                       },
//                       {
//                         fieldName: "valid_upto",
//                         label: (
//                           <AlgaehLabel label={{ forceLabel: "Valid Upto" }} />
//                         ),
//                         displayTemplate: (row) => {
//                           return <span>{dateFormater(row.valid_upto)}</span>;
//                         },
//                         editorTemplate: (row) => {
//                           return (
//                             <AlgaehDateHandler
//                               div={{ className: "" }}
//                               textBox={{
//                                 className: "txt-fld hidden",
//                                 name: "valid_upto",
//                               }}
//                               minDate={new Date()}
//                               events={{
//                                 onChange: datehandlegrid.bind(this, this, row),
//                               }}
//                               value={row.valid_upto}
//                             />
//                           );
//                         },
//                       },
//                     ]}
//                     keyId=""
//                     dataSource={{ data: this.state.idDetails }}
//                     isEditable={true}
//                     paging={{ page: 0, rowsPerPage: 10 }}
//                     events={{
//                       onDelete: deleteIdentifications.bind(this, this),
//                       onEdit: (row) => {},
//                       onDone: updateIdentifications.bind(this, this),
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="col-6" data-validate="dependentGrid">
//               <h5>
//                 <span>Family Details</span>
//               </h5>
//               <div className="row paddin-bottom-5">
//                 <AlagehAutoComplete
//                   div={{ className: "col-3 mandatory  form-group" }}
//                   label={{
//                     forceLabel: "Dependent Type",
//                     isImp: true,
//                   }}
//                   selector={{
//                     name: "dependent_type",
//                     className: "select-fld",
//                     value: this.state.dependent_type,
//                     dataSource: {
//                       textField: "name",
//                       valueField: "value",
//                       data: variableJson.DEPENDENT_TYPE,
//                     },
//                     onChange: texthandle.bind(this, this),
//                     onClear: () => {
//                       this.setState({
//                         dependent_type: null,
//                       });
//                     },
//                   }}
//                 />
//                 < AlgaehFormGroup
//                   div={{ className: "col-3 mandatory" }}
//                   label={{
//                     forceLabel: "Dependent Name",
//                     isImp: true,
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "dependent_name",
//                     value: this.state.dependent_name,
//                     events: {
//                       onChange: texthandle.bind(this, this),
//                     },
//                   }}
//                 />

//                 <AlagehAutoComplete
//                   div={{ className: "col-3 mandatory" }}
//                   label={{
//                     forceLabel: "Id Type",
//                     isImp: true,
//                   }}
//                   selector={{
//                     name: "dependent_identity_type",
//                     className: "select-fld",
//                     value: this.state.dependent_identity_type,
//                     dataSource: {
//                       textField: "identity_document_name",
//                       valueField: "hims_d_identity_document_id",
//                       data: this.props.idtypes,
//                     },
//                     onChange: texthandle.bind(this, this),
//                     onClear: () => {
//                       this.setState({
//                         dependent_identity_type: null,
//                       });
//                     },
//                   }}
//                 />
//                 < AlgaehFormGroup
//                   div={{ className: "col-3 mandatory" }}
//                   label={{
//                     forceLabel: "Id Number",
//                     isImp: true,
//                   }}
//                   textBox={{
//                     value: this.state.dependent_identity_no,
//                     className: "txt-fld",
//                     name: "dependent_identity_no",

//                     events: {
//                       onChange: texthandle.bind(this, this),
//                     },
//                   }}
//                 />
//                 <div className="col" style={{ textAlign: "right" }}>
//                   <button
//                     type="button"
//                     className="btn btn-default"
//                     onClick={addDependentType.bind(this, this)}
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div
//                   className="col-lg-12 margin-top-15"
//                   id="employeeFamily_DetailsGrid_Cntr"
//                 >
//                   <AlgaehDataGrid
//                     id="employeeFamily_DetailsGrid"
//                     columns={[
//                       {
//                         //   textField: "name",
//                         // valueField: "value",
//                         // data: variableJson.DEPENDENT_TYPE
//                         fieldName: "dependent_type",
//                         label: (
//                           <AlgaehLabel
//                             label={{ forceLabel: "Dependent Type" }}
//                           />
//                         ),
//                         displayTemplate: (row) => {
//                           let display = variableJson.DEPENDENT_TYPE.filter(
//                             (f) => f.value === row.dependent_type
//                           );

//                           return (
//                             <span>
//                               {display !== undefined && display.length !== 0
//                                 ? display[0].name
//                                 : ""}
//                             </span>
//                           );
//                         },
//                         editorTemplate: (row) => {
//                           let display = variableJson.DEPENDENT_TYPE.filter(
//                             (f) => f.value === row.dependent_type
//                           );

//                           return (
//                             <span>
//                               {display !== undefined && display.length !== 0
//                                 ? display[0].name
//                                 : ""}
//                             </span>
//                           );
//                         },
//                       },
//                       {
//                         fieldName: "dependent_name",
//                         label: (
//                           <AlgaehLabel
//                             label={{ forceLabel: "Dependent Name" }}
//                           />
//                         ),
//                         editorTemplate: (row) => {
//                           return (
//                             < AlgaehFormGroup
//                               div={{}}
//                               textBox={{
//                                 value: row.dependent_name,
//                                 className: "txt-fld",
//                                 name: "dependent_name",
//                                 events: {
//                                   onChange: onchangegridcol.bind(
//                                     this,
//                                     this,
//                                     row
//                                   ),
//                                 },
//                               }}
//                             />
//                           );
//                         },
//                       },
//                       {
//                         fieldName: "dependent_identity_type",
//                         label: (
//                           <AlgaehLabel label={{ forceLabel: "ID Card Type" }} />
//                         ),
//                         displayTemplate: (row) => {
//                           let display =
//                             this.props.idtypes === undefined
//                               ? []
//                               : this.props.idtypes.filter(
//                                   (f) =>
//                                     f.hims_d_identity_document_id ===
//                                     row.dependent_identity_type
//                                 );

//                           return (
//                             <span>
//                               {display !== undefined && display.length !== 0
//                                 ? display[0].identity_document_name
//                                 : ""}
//                             </span>
//                           );
//                         },
//                         editorTemplate: (row) => {
//                           let display =
//                             this.props.idtypes === undefined
//                               ? []
//                               : this.props.idtypes.filter(
//                                   (f) =>
//                                     f.hims_d_identity_document_id ===
//                                     row.dependent_identity_type
//                                 );

//                           return (
//                             <span>
//                               {display !== undefined && display.length !== 0
//                                 ? display[0].identity_document_name
//                                 : ""}
//                             </span>
//                           );
//                         },
//                       },
//                       {
//                         fieldName: "dependent_identity_no",
//                         label: (
//                           <AlgaehLabel label={{ forceLabel: "ID Number" }} />
//                         ),
//                         editorTemplate: (row) => {
//                           return (
//                             < AlgaehFormGroup
//                               div={{}}
//                               textBox={{
//                                 value: row.dependent_identity_no,
//                                 className: "txt-fld",
//                                 name: "dependent_identity_no",
//                                 events: {
//                                   onChange: onchangegridcol.bind(
//                                     this,
//                                     this,
//                                     row
//                                   ),
//                                 },
//                               }}
//                             />
//                           );
//                         },
//                       },
//                     ]}
//                     keyId="dependent_type"
//                     dataSource={{ data: this.state.dependentDetails }}
//                     isEditable={true}
//                     paging={{ page: 0, rowsPerPage: 10 }}
//                     events={{
//                       onDelete: deleteDependencies.bind(this, this),
//                       onEdit: (row) => {},
//                       onDone: updateDependencies.bind(this, this),
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </React.Fragment>
//     );
//   }
// }
// function mapStateToProps(state) {
//   return {
//     idtypes: state.idtypes,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getIDTypes: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(FamilyAndIdentification)
// );
