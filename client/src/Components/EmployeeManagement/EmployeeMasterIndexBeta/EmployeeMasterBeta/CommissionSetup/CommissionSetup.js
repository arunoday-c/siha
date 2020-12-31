import React, { useContext, useState, useEffect } from "react";
import "./CommissionSetup.scss";
import { swalMessage } from "../../../../../utils/algaehApiCall";
// EmployeeMasterContextForEmployee
import { EmployeeMasterContext } from "../../EmployeeMasterContext";
import { EmployeeMasterContextForEmployee } from "../../EmployeeMasterContextForEmployee";
import { getCookie } from "../../../../../utils/algaehApiCall";
import {
  // MainContext,

  // persistStorageOnRemove,
  AlgaehAutoComplete,
  // AlgaehDateHandler,
  AlgaehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
} from "algaeh-react-components";
// import { algaehApiCall } from "../../../../../utils/algaehApiCall";
// import AlgaehLoader from "../../../../Wrapper/fullPageLoader";

import { useForm, Controller } from "react-hook-form";
import { newAlgaehApi } from "../../../../../hooks";
import { useQuery } from "react-query";
// import { EmployeeMasterContext } from "../../EmployeeMasterContext";
// import Enumerable from "linq";
const getServiceTypeDepartments = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getDoctorServiceTypeCommission",
    module: "hrManagement",
    method: "GET",
    data: { provider_id: employee_id },
  });
  return result?.data?.records;
};
const getServiceDepartments = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getDoctorServiceCommission",
    module: "hrManagement",
    method: "GET",
    data: { provider_id: employee_id },
  });
  return result?.data?.records;
};
const getServices = async (key) => {
  const result = await newAlgaehApi({
    uri: "/serviceType/getService",
    module: "masterSettings",
    method: "GET",
  });

  return result?.data?.records;
};

export default function CommissionSetup({ employee_id }) {
  // const {
  //   userToken,

  //   countries = [],
  // } = useContext(MainContext);

  // console.log("FldEditable", FldEditable);
  const { setEmployeeUpdateDetails, output } = useContext(
    EmployeeMasterContextForEmployee
  );
  // const contextprovider = useContext(EmployeeMasterContextForEmployee);
  const [empservices, setempservices] = useState([]);
  const [serviceComm, setServiceComm] = useState([
    {
      service_type_id: 12,
      services_id: 12,
      op_cash_commission_percent: 0,
      op_credit_commission_percent: 0,
      ip_cash_commission_percent: 0,
      ip_credit_commission_percent: 0,
    },
  ]);
  const [servTypeCommission, setServTypeCommission] = useState([]);
  const [selectedLang, setSelectedLang] = useState("en");
  const { dropdownData, setDropDownData } = useContext(EmployeeMasterContext);
  const { control, errors, reset, getValues, handleSubmit } = useForm({});
  const {
    control: control2,
    getValues: getValues2,
    reset: reset2,
    // setValue: setValue2,
    // watch: watch2,
    // register: register2,
    errors: errors2,
    handleSubmit: handleSubmit2,
  } = useForm({});

  const { data: servTypeCommissionData } = useQuery(
    ["servTypeCommission", { employee_id: employee_id }],
    getServiceTypeDepartments,
    {
      onSuccess: (data) => {
        setServTypeCommission(data);
        setEmployeeUpdateDetails({ servTypeCommission: data });
        console.log("servTypeCommissionData", servTypeCommissionData);
      },
      onError: (err) => {
        swalMessage({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  useEffect(() => {
    // console.log("output", contextprovider);
    let prevLang = getCookie("Language");
    return setSelectedLang(prevLang);
  }, []);
  // const { data: empservices } = useQuery(
  //   ["empservices", { employee_id: EmpMasterIOputs }],
  //   getServiceType,
  //   {
  //     onSuccess: (data) => {},
  //     onError: (err) => {
  //       swalMessage({
  //         display: err?.message,
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  const {} = useQuery(
    ["serviceComm", { employee_id: employee_id }],
    getServiceDepartments,
    {
      onSuccess: (data) => {
        setServiceComm(data);
        setEmployeeUpdateDetails({ serviceComm: data });
      },
      onError: (err) => {
        swalMessage({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const {} = useQuery(["SERVICES_GET_DATA"], getServices, {
    onSuccess: (data) => {
      setempservices(data);
    },
    onError: (err) => {
      swalMessage({
        display: err?.message,
        type: "error",
      });
    },
  });
  async function serviceServTypeHandeler(service_type_id) {
    try {
      await newAlgaehApi({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        data: { service_type_id: service_type_id },
      })
        .then((response) => {
          const { records, success, message } = response.data;
          if (success === true) {
            setempservices(records);
          } else {
            swalMessage({
              display: message,
              type: "error",
            });
          }
        })
        .catch((error) => {
          swalMessage({
            type: "error",
            display: error,
          });
        });
    } catch (e) {
      console.error(e);
    }
  }

  const { data: dropdownDataCommission } = useQuery(
    ["dropdown-data-commission", {}],
    getDropDownDataForCommission,
    {
      initialData: {
        empservicetype: [],
      },

      refetchOnMount: false,
      // refetchOnReconnect: false,
      // keepPreviousData: true,
      refetchOnWindowFocus: false,
      initialStale: true,
      cacheTime: Infinity,
      onSuccess: (data) => {
        setDropDownData({ ...data });
      },
      onError: (err) => {
        swalMessage({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getDropDownDataForCommission(key) {
    if (
      dropdownData.empservicetype === undefined ||
      dropdownData.empservicetype.length === 0
    ) {
      const result = await Promise.all([
        newAlgaehApi({
          uri: "/serviceType",
          module: "masterSettings",
          method: "GET",
        }),
      ]);
      return {
        empservicetype: result[0]?.data?.records,
      };
    } else {
      return {
        empservicetype: dropdownData.empservicetype,
      };
    }
  }
  const AddSeviceTypeComm = (e) => {
    let intExists = false;

    const {
      service_type_typ_id,
      op_cash_servtyp_percent,
      op_credit_servtyp_percent,
      ip_cash_servtyp_percent,
      ip_credit_servtyp_percent,
    } = getValues();

    let servTypeCommissiondata =
      output?.servTypeCommission.length > 0
        ? output?.servTypeCommission
        : [...servTypeCommission];
    debugger;
    let insertservTypeCommission =
      output?.insertservTypeCommission === undefined
        ? []
        : output?.insertservTypeCommission;

    for (let x = 0; x < servTypeCommission.length; x++) {
      if (servTypeCommission[x].service_type_id === service_type_typ_id) {
        intExists = true;
      }
    }

    if (intExists === false) {
      let inpObj = {
        service_type_id: service_type_typ_id,
        op_cash_comission_percent: op_cash_servtyp_percent,
        op_credit_comission_percent: op_credit_servtyp_percent,
        ip_cash_commission_percent: ip_cash_servtyp_percent,
        ip_credit_commission_percent: ip_credit_servtyp_percent,
      };

      if (employee_id !== null) {
        inpObj.provider_id = employee_id;
        insertservTypeCommission.push(inpObj);
      }

      servTypeCommissiondata.push(inpObj);
      setServTypeCommission([...servTypeCommissiondata]);
      setEmployeeUpdateDetails({
        servTypeCommission: servTypeCommissiondata,
        insertservTypeCommission: insertservTypeCommission,
      });
      reset({
        service_type_typ_id: null,
        op_cash_servtyp_percent: 0,
        op_credit_servtyp_percent: 0,
        ip_cash_servtyp_percent: 0,
        ip_credit_servtyp_percent: 0,
      });
    } else {
      swalMessage({
        display: "Selected Service Type already defined.",
        type: "error",
      });
    }
  };
  const AddServiceComm = () => {
    let serviceCommData =
      output?.serviceComm.length > 0 ? output?.serviceComm : [...serviceComm];
    let insertserviceComm =
      output?.insertserviceComm === undefined ? [] : output?.insertserviceComm;
    let intServiceExists = false;
    const {
      services_id,
      service_type_id,
      op_cash_commission_percent,
      op_credit_commission_percent,
      ip_cash_commission_percent,
      ip_credit_commission_percent,
    } = getValues2();
    for (let x = 0; x < serviceComm.length; x++) {
      if (serviceComm[x].services_id === services_id) {
        intServiceExists = true;
      }
    }

    if (intServiceExists === false) {
      let inpObj = {
        service_type_id: service_type_id,
        services_id: services_id,
        op_cash_commission_percent: op_cash_commission_percent,
        op_credit_commission_percent: op_credit_commission_percent,
        ip_cash_commission_percent: ip_cash_commission_percent,
        ip_credit_commission_percent: ip_credit_commission_percent,
      };

      if (employee_id !== null) {
        inpObj.provider_id = employee_id;
        insertserviceComm.push(inpObj);
      }
      serviceCommData.push(inpObj);

      setServiceComm([...serviceCommData]);
      setEmployeeUpdateDetails({
        serviceComm: serviceCommData,
        insertserviceComm: insertserviceComm,
      });
      reset2({
        services_id: null,
        service_type_id: null,
        op_cash_commission_percent: 0,
        op_credit_commission_percent: 0,
        ip_cash_commission_percent: 0,
        ip_credit_commission_percent: 0,
      });
    } else {
      swalMessage({
        display: "Selected Service Type already defined.",
        type: "error",
      });
    }
  };
  const deleteServiceComm = (row) => {
    let updateserviceComm =
      output?.updateserviceComm === undefined ? [] : output?.updateserviceComm;
    let insertserviceComm =
      output?.insertserviceComm === undefined ? [] : output?.insertserviceComm;
    setServiceComm((prev) => {
      if (employee_id) {
        if (row.hims_m_doctor_service_commission_id !== undefined) {
          updateserviceComm.push({
            hims_m_doctor_service_commission_id:
              row.hims_m_doctor_service_commission_id,
            provider_id: row.provider_id,
            services_id: row.services_id,
            service_type_id: row.service_type_id,
            op_cash_commission_percent: row.op_cash_commission_percent,
            op_credit_commission_percent: row.op_credit_commission_percent,
            ip_cash_commission_percent: row.ip_cash_commission_percent,
            ip_credit_commission_percent: row.ip_credit_commission_percent,

            record_status: "I",
          });
        } else {
          const existingInsert = [...insertserviceComm];
          const insertData = existingInsert.filter(
            (f) => f.services_id !== row.services_id
          );
          insertserviceComm = insertData;
        }
      }
      const deletedList = prev.filter((f) => f.services_id !== row.services_id);
      return [...deletedList];
    });
  };

  //TODO : need to uncomment
  const deleteSeviceTypeComm = (row) => {
    let servTypeCommissionData = [...servTypeCommission];
    let updateservTypeCommission =
      output?.updateservTypeCommission === undefined
        ? []
        : output?.updateservTypeCommission;
    let insertservTypeCommission =
      output?.insertservTypeCommission === undefined
        ? []
        : output?.insertservTypeCommission;
    if (employee_id !== null) {
      if (row.hims_m_doctor_service_type_commission_id !== undefined) {
        let Updateobj = {
          hims_m_doctor_service_type_commission_id:
            row.hims_m_doctor_service_type_commission_id,
          provider_id: row.provider_id,
          service_type_id: row.service_type_id,
          op_cash_commission_percent: row.op_cash_commission_percent,
          op_credit_commission_percent: row.op_credit_commission_percent,
          ip_cash_commission_percent: row.ip_cash_commission_percent,
          ip_credit_commission_percent: row.ip_credit_commission_percent,

          record_status: "I",
        };
        updateservTypeCommission.push(Updateobj);
      } else {
        for (let k = 0; k < insertservTypeCommission.length; k++) {
          if (
            insertservTypeCommission[k].service_type_id === row.service_type_id
          ) {
            insertservTypeCommission.splice(k, 1);
          }
        }
      }
    }
    for (let x = 0; x < servTypeCommissionData.length; x++) {
      if (servTypeCommissionData[x].service_type_id === row.service_type_id) {
        servTypeCommissionData.splice(x, 1);
      }
    }
    setServTypeCommission([...servTypeCommissionData]);
    setEmployeeUpdateDetails({
      servTypeCommission: servTypeCommissionData,
      insertservTypeCommission: insertservTypeCommission,
      serviceComm: servTypeCommissionData,
      updateservTypeCommission: updateservTypeCommission,
    });
  };
  const onSubmit = (e) => {
    console.error(errors);
    AddSeviceTypeComm();
  };
  const onSubmit2 = (e) => {
    console.error(errors2);
    AddServiceComm(e);
  };
  const { empservicetype } = dropdownDataCommission;
  const _serviceslist = empservices;
  return (
    <>
      <div className="hptl-phase1-commissiom-setup-form">
        <div className="col-lg-12">
          <div className="row">
            {/* Patient code */}
            <div
              className="col-lg-6"
              style={{
                borderRight: "1px solid #d3d3d3",
                paddingBottom: 10,
              }}
            >
              <h6
                style={{
                  borderBottom: "1px solid #ccc",
                  paddingBottom: 5,
                  paddingTop: 10,
                  fontSize: "0.9rem",
                }}
              >
                Service Commission
              </h6>
              <div className="row">
                <form key={1} onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    control={control}
                    name="service_type_typ_id"
                    rules={{ required: "Required" }}
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col mandatory form-group" }}
                        error={errors}
                        label={{
                          fieldName: "service_type_id",
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
                          name: "service_type_typ_id",
                          dataSource: {
                            textField: "service_type",
                            valueField: "hims_d_service_type_id",
                            data: empservicetype,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehAutoComplete
                    div={{ className: "col mandatory form-group" }}
                    label={{
                      fieldName: "service_type_id",
                      isImp: true,
                    }}
                    selector={{
                      name: "service_type_typ_id",
                      className: "select-fld",
                      value: this.state.service_type_typ_id,
                      dataSource: {
                        textField: "service_type",
                        valueField: "hims_d_service_type_id",
                        data: this.props.empservicetype,
                      },
                      others: { disabled: this.state.Billexists },
                      onChange: serviceTypeHandeler.bind(this, this),
                      onClear: () => {
                        this.setState({
                          service_type_typ_id: null,
                        });
                      },
                    }}
                  /> */}
                  <Controller
                    name="op_cash_servtyp_percent"
                    control={control}
                    // rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col form-group" }}
                        // error={errors}
                        label={{
                          fieldName: "op_cash_comission_percent",
                          // isImp: earn_calculation_method === "FO" ? false : true,
                        }}
                        textBox={{
                          name: "op_cash_servtyp_percent",
                          decimal: { allowNegative: false },
                          className: "txt-fld",

                          ...props,
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      fieldName: "op_cash_comission_percent",
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "op_cash_servtyp_percent",
                      value: this.state.op_cash_servtyp_percent,
                      events: {
                        onChange: numberSet.bind(this, this),
                      },
                    }}
                  /> */}

                  <Controller
                    name="op_credit_servtyp_percent"
                    control={control}
                    // rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col form-group" }}
                        // error={errors}
                        label={{
                          fieldName: "op_credit_comission_percent",
                          // isImp: earn_calculation_method === "FO" ? false : true,
                        }}
                        textBox={{
                          name: "op_credit_servtyp_percent",
                          decimal: { allowNegative: false },
                          className: "txt-fld",

                          ...props,
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      fieldName: "op_credit_comission_percent",
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "op_credit_servtyp_percent",
                      value: this.state.op_credit_servtyp_percent,
                      events: {
                        onChange: numberSet.bind(this, this),
                      },
                    }}
                  /> */}
                </form>
              </div>
              <div className="row">
                <Controller
                  name="ip_cash_servtyp_percent"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group" }}
                      // error={errors}
                      label={{
                        fieldName: "ip_cash_commission_percent",
                        // isImp: earn_calculation_method === "FO" ? false : true,
                      }}
                      textBox={{
                        name: "ip_cash_servtyp_percent",
                        decimal: { allowNegative: false },
                        className: "txt-fld",

                        ...props,
                      }}
                    />
                  )}
                />
                {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      fieldName: "ip_cash_commission_percent",
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "ip_cash_servtyp_percent",
                      value: this.state.ip_cash_servtyp_percent,
                      events: {
                        onChange: numberSet.bind(this, this),
                      },
                    }}
                  /> */}
                <Controller
                  name="ip_credit_servtyp_percent"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group" }}
                      // error={errors}
                      label={{
                        fieldName: "ip_credit_commission_percent",
                        // isImp: earn_calculation_method === "FO" ? false : true,
                      }}
                      textBox={{
                        name: "ip_credit_servtyp_percent",
                        decimal: { allowNegative: false },
                        className: "txt-fld",

                        ...props,
                      }}
                    />
                  )}
                />
                {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      fieldName: "ip_credit_commission_percent",
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "ip_credit_servtyp_percent",
                      value: this.state.ip_credit_servtyp_percent,
                      events: {
                        onChange: numberSet.bind(this, this),
                      },
                    }}
                  /> */}

                <div className="col">
                  <button
                    type="submit"
                    className="btn btn-default"
                    style={{ marginTop: 20 }}
                    // onClick={() => {
                    //   AddSeviceTypeComm();
                    // }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-12" id="serviceCommissionGrid_Cntr">
                  <AlgaehDataGrid
                    // id="serv_commission"
                    columns={[
                      // {
                      //   fieldName: "action",
                      //   label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      //   displayTemplate: (row) => {
                      //     return (
                      //       <span>
                      //         <i
                      //           className="fas fa-trash-alt"
                      //           aria-hidden="true"
                      //           onClick={() => {
                      //             deleteSeviceTypeComm(row);
                      //           }}
                      //         />
                      //       </span>
                      //     );
                      //   },
                      //   others: {
                      //     maxWidth: 50,
                      //   },
                      // },
                      {
                        fieldName: "service_type_id",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "service_type_id" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          let display =
                            empservicetype === undefined
                              ? []
                              : empservicetype.filter(
                                  (f) =>
                                    f.hims_d_service_type_id ===
                                    row.service_type_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? selectedLang === "ar"
                                  ? display[0].arabic_service_type
                                  : display[0].service_type
                                : ""}
                            </span>
                          );
                        },
                      },

                      {
                        fieldName: "op_cash_comission_percent",
                        label: (
                          <AlgaehLabel
                            label={{
                              fieldName: "op_cash_comission_percent",
                            }}
                          />
                        ),
                      },
                      {
                        fieldName: "op_credit_comission_percent",
                        label: (
                          <AlgaehLabel
                            label={{
                              fieldName: "op_credit_comission_percent",
                            }}
                          />
                        ),
                      },

                      {
                        fieldName: "ip_cash_commission_percent",
                        label: (
                          <AlgaehLabel
                            label={{
                              fieldName: "ip_cash_commission_percent",
                            }}
                          />
                        ),
                      },

                      {
                        fieldName: "ip_credit_commission_percent",
                        label: (
                          <AlgaehLabel
                            label={{
                              fieldName: "ip_credit_commission_percent",
                            }}
                          />
                        ),
                      },
                    ]}
                    keyId="service_type_id"
                    data={servTypeCommission}
                    pagination={true}
                    isEditable={"deleteOnly"}
                    events={{
                      onDelete: (row) => {
                        debugger;
                        // console.log("row", row);
                        deleteSeviceTypeComm(row);
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h6
                style={{
                  borderBottom: "1px solid #ccc",
                  paddingBottom: 5,
                  paddingTop: 10,
                  fontSize: "0.9rem",
                }}
              >
                Service Type Commission
              </h6>
              <div className="row">
                <form key={2} onSubmit={handleSubmit2(onSubmit2)}>
                  <Controller
                    control={control2}
                    name="service_type_id"
                    rules={{ required: "Required" }}
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col mandatory form-group" }}
                        error={errors2}
                        label={{
                          fieldName: "service_type_id",
                          isImp: true,
                        }}
                        selector={{
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);

                            serviceServTypeHandeler(_.hims_d_service_type_id);
                          },
                          onClear: () => {
                            onChange("");
                          },
                          name: "service_type_id",
                          dataSource: {
                            textField: "service_type",
                            valueField: "hims_d_service_type_id",
                            data: empservicetype,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehAutoComplete
                    div={{ className: "col mandatory form-group" }}
                    label={{
                      fieldName: "service_type_id",
                      isImp: true,
                    }}
                    selector={{
                      name: "service_type_id",
                      className: "select-fld",
                      value: this.state.service_type_id,
                      dataSource: {
                        textField: "service_type",
                        valueField: "hims_d_service_type_id",
                        data: this.props.empservicetype,
                      },

                      onChange: serviceServTypeHandeler.bind(this, this),
                      onClear: () => {
                        this.setState({
                          service_type_id: null,
                        });
                      },
                    }}
                  /> */}
                  <Controller
                    control={control2}
                    name="services_id"
                    rules={{ required: "Required" }}
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-5 mandatory form-group" }}
                        error={errors2}
                        label={{
                          forceLabel: "Select Service Type",
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
                          name: "services_id",
                          dataSource: {
                            textField: "service_name",
                            valueField: "hims_d_services_id",
                            data: empservices,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehAutoComplete
                    div={{ className: "col-5 mandatory form-group" }}
                    label={{
                      forceLabel: "Select Service Type",
                      isImp: true,
                    }}
                    selector={{
                      name: "services_id",
                      className: "select-fld",
                      value: this.state.services_id,
                      dataSource: {
                        textField: "service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.empservices,
                      },
                      onChange: texthandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          services_id: null,
                        });
                      },
                    }}
                  /> */}
                  <Controller
                    name="op_cash_commission_percent"
                    control={control2}
                    // rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col form-group" }}
                        // error={errors}
                        label={{
                          fieldName: "op_cash_comission_percent",
                          // isImp: earn_calculation_method === "FO" ? false : true,
                        }}
                        textBox={{
                          name: "op_cash_commission_percent",
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          ...props,
                          others: {
                            // disabled:
                            // earn_calculation_method === "FO" ? true : false,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      fieldName: "op_cash_comission_percent",
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "op_cash_commission_percent",
                      value: this.state.op_cash_commission_percent,
                      events: {
                        onChange: numberSet.bind(this, this),
                      },
                    }}
                  /> */}
                </form>
              </div>
              <div className="row">
                <Controller
                  name="op_credit_commission_percent"
                  control={control2}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group" }}
                      // error={errors}
                      label={{
                        fieldName: "op_credit_comission_percent",
                        // isImp: earn_calculation_method === "FO" ? false : true,
                      }}
                      textBox={{
                        name: "op_credit_commission_percent",
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        ...props,
                        others: {
                          // disabled:
                          // earn_calculation_method === "FO" ? true : false,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      fieldName: "op_credit_comission_percent",
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "op_credit_commission_percent",
                      value: this.state.op_credit_commission_percent,
                      events: {
                        onChange: numberSet.bind(this, this),
                      },
                    }}
                  /> */}
                <Controller
                  name="ip_cash_commission_percent"
                  control={control2}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group" }}
                      // error={errors}
                      label={{
                        fieldName: "ip_cash_commission_percent",
                        // isImp: earn_calculation_method === "FO" ? false : true,
                      }}
                      textBox={{
                        name: "ip_cash_commission_percent",
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        ...props,
                        others: {
                          // disabled:
                          // earn_calculation_method === "FO" ? true : false,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      fieldName: "ip_cash_commission_percent",
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "ip_cash_commission_percent",
                      value: this.state.ip_cash_commission_percent,
                      events: {
                        onChange: numberSet.bind(this, this),
                      },
                    }}
                  /> */}
                <Controller
                  name="ip_credit_commission_percent"
                  control={control2}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group" }}
                      // error={errors}
                      label={{
                        fieldName: "ip_credit_commission_percent",
                        // isImp: earn_calculation_method === "FO" ? false : true,
                      }}
                      textBox={{
                        name: "ip_credit_commission_percent",
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        ...props,
                        others: {
                          // disabled:
                          // earn_calculation_method === "FO" ? true : false,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      fieldName: "ip_credit_commission_percent",
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "ip_credit_commission_percent",
                      value: this.state.ip_credit_commission_percent,
                      events: {
                        onChange: numberSet.bind(this, this),
                      },
                    }}
                  /> */}

                <div className="col">
                  <button
                    type="submit"
                    className="btn btn-default"
                    style={{ marginTop: 20 }}
                    // onClick={() => {
                    //   AddServiceComm();
                    // }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-12" id="serviceTypeCommissionGrid_Cntr">
                  <AlgaehDataGrid
                    // id="service_commission"
                    columns={[
                      {
                        fieldName: "action",
                        label: "action",
                        displayTemplate: (row) => {
                          return (
                            <span>
                              <i
                                className="fas fa-trash-alt"
                                aria-hidden="true"
                                onClick={() => {
                                  deleteServiceComm(row);
                                }}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 50,
                        },
                      },
                      {
                        fieldName: "service_type_id",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "service_type_id" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          let display =
                            _serviceslist === undefined
                              ? []
                              : _serviceslist.filter(
                                  (f) =>
                                    f.hims_d_service_type_id ===
                                    row.service_type_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? selectedLang === "ar"
                                  ? display[0].arabic_service_type
                                  : display[0].service_type
                                : ""}
                            </span>
                          );
                        },
                      },

                      {
                        fieldName: "services_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
                        displayTemplate: (row) => {
                          let display =
                            _serviceslist === undefined
                              ? []
                              : _serviceslist.filter(
                                  (f) =>
                                    f.hims_d_services_id === row.services_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? selectedLang === "ar"
                                  ? display[0].arabic_service_name
                                  : display[0].service_name
                                : ""}
                            </span>
                          );
                        },
                      },

                      {
                        fieldName: "op_cash_commission_percent",
                        label: (
                          <AlgaehLabel
                            label={{
                              fieldName: "op_cash_comission_percent",
                            }}
                          />
                        ),
                      },
                      {
                        fieldName: "op_credit_commission_percent",
                        label: (
                          <AlgaehLabel
                            label={{
                              fieldName: "op_credit_comission_percent",
                            }}
                          />
                        ),
                      },

                      {
                        fieldName: "ip_cash_commission_percent",
                        label: (
                          <AlgaehLabel
                            label={{
                              fieldName: "ip_cash_commission_percent",
                            }}
                          />
                        ),
                      },

                      {
                        fieldName: "ip_credit_commission_percent",
                        label: (
                          <AlgaehLabel
                            label={{
                              fieldName: "ip_credit_commission_percent",
                            }}
                          />
                        ),
                      },
                    ]}
                    // keyId="service_type_id"
                    data={serviceComm}
                    pagination={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";

// import { AlgaehActions } from "../../../../../actions/algaehActions";
// import "./CommissionSetup.scss";
// import {
//   AlagehFormGroup,
//   AlagehAutoComplete,
//   AlgaehDataGrid,
//   AlgaehLabel,
// } from "../../../../Wrapper/algaehWrapper";

// import {
//   texthandle,
//   AddSeviceTypeComm,
//   AddServiceComm,
//   deleteSeviceTypeComm,
//   serviceTypeHandeler,
//   serviceServTypeHandeler,
//   numberSet,
//   deleteServiceComm,
//   getServiceTypeDepartments,
//   getServiceDepartments,
// } from "./CommissionSetupEvents";

// import AlgaehLoader from "../../../../Wrapper/fullPageLoader";

// class CommissionSetup extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       op_cash_servtyp_percent: 0,
//       op_credit_servtyp_percent: 0,
//       ip_cash_servtyp_percent: 0,
//       ip_credit_servtyp_percent: 0,

//       services_id: null,
//       service_type_id: null,
//       op_cash_commission_percent: 0,
//       op_credit_commission_percent: 0,
//       ip_cash_commission_percent: 0,
//       ip_credit_commission_percent: 0,
//       service_type_typ_id: null,
//     };
//     // AlgaehLoader({ show: true });
//   }

//   componentDidMount() {
//     let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
//     this.setState({ ...this.state, ...InputOutput }, () => {
//       if (this.state.hims_d_employee_id !== null) {
//         if (this.state.servTypeCommission.length === 0) {
//           getServiceTypeDepartments(this);
//         }

//         if (this.state.serviceComm.length === 0) {
//           getServiceDepartments(this);
//         } else {
//           AlgaehLoader({ show: false });
//         }
//       } else {
//         AlgaehLoader({ show: false });
//       }
//     });
//   }

//   render() {
//     const empservices = this.props.empservices;
//     const empservicetype = this.props.empservicetype;
//     return (
//       <React.Fragment>
//         {/* <MyContext.Consumer>
//           {context => ( */}
//         <div className="hptl-phase1-commissiom-setup-form">
//           <div className="col-lg-12">
//             <div className="row">
//               {/* Patient code */}
//               <div
//                 className="col-lg-6"
//                 style={{
//                   borderRight: "1px solid #d3d3d3",
//                   paddingBottom: 10,
//                 }}
//               >
//                 <h6
//                   style={{
//                     borderBottom: "1px solid #ccc",
//                     paddingBottom: 5,
//                     paddingTop: 10,
//                     fontSize: "0.9rem",
//                   }}
//                 >
//                   Service Commission
//                 </h6>
//                 <div className="row">
//                   <AlagehAutoComplete
//                     div={{ className: "col mandatory form-group" }}
//                     label={{
//                       fieldName: "service_type_id",
//                       isImp: true,
//                     }}
//                     selector={{
//                       name: "service_type_typ_id",
//                       className: "select-fld",
//                       value: this.state.service_type_typ_id,
//                       dataSource: {
//                         textField: "service_type",
//                         valueField: "hims_d_service_type_id",
//                         data: this.props.empservicetype,
//                       },
//                       others: { disabled: this.state.Billexists },
//                       onChange: serviceTypeHandeler.bind(this, this),
//                       onClear: () => {
//                         this.setState({
//                           service_type_typ_id: null,
//                         });
//                       },
//                     }}
//                   />

//                   <AlagehFormGroup
//                     div={{ className: "col form-group" }}
//                     label={{
//                       fieldName: "op_cash_comission_percent",
//                     }}
//                     textBox={{
//                       decimal: { allowNegative: false },
//                       className: "txt-fld",
//                       name: "op_cash_servtyp_percent",
//                       value: this.state.op_cash_servtyp_percent,
//                       events: {
//                         onChange: numberSet.bind(this, this),
//                       },
//                     }}
//                   />

//                   <AlagehFormGroup
//                     div={{ className: "col form-group" }}
//                     label={{
//                       fieldName: "op_credit_comission_percent",
//                     }}
//                     textBox={{
//                       decimal: { allowNegative: false },
//                       className: "txt-fld",
//                       name: "op_credit_servtyp_percent",
//                       value: this.state.op_credit_servtyp_percent,
//                       events: {
//                         onChange: numberSet.bind(this, this),
//                       },
//                     }}
//                   />
//                 </div>
//                 <div className="row">
//                   <AlagehFormGroup
//                     div={{ className: "col form-group" }}
//                     label={{
//                       fieldName: "ip_cash_commission_percent",
//                     }}
//                     textBox={{
//                       decimal: { allowNegative: false },
//                       className: "txt-fld",
//                       name: "ip_cash_servtyp_percent",
//                       value: this.state.ip_cash_servtyp_percent,
//                       events: {
//                         onChange: numberSet.bind(this, this),
//                       },
//                     }}
//                   />
//                   <AlagehFormGroup
//                     div={{ className: "col form-group" }}
//                     label={{
//                       fieldName: "ip_credit_commission_percent",
//                     }}
//                     textBox={{
//                       decimal: { allowNegative: false },
//                       className: "txt-fld",
//                       name: "ip_credit_servtyp_percent",
//                       value: this.state.ip_credit_servtyp_percent,
//                       events: {
//                         onChange: numberSet.bind(this, this),
//                       },
//                     }}
//                   />

//                   <div className="col">
//                     <button
//                       type="button"
//                       className="btn btn-default"
//                       style={{ marginTop: 20 }}
//                       onClick={AddSeviceTypeComm.bind(this, this)}
//                     >
//                       Add
//                     </button>
//                   </div>
//                 </div>

//                 <div className="row" style={{ marginTop: "10px" }}>
//                   <div className="col-12" id="serviceCommissionGrid_Cntr">
//                     <AlgaehDataGrid
//                       // id="serv_commission"
//                       columns={[
//                         {
//                           fieldName: "action",
//                           label: (
//                             <AlgaehLabel label={{ fieldName: "action" }} />
//                           ),
//                           displayTemplate: (row) => {
//                             return (
//                               <span>
//                                 <i
//                                   className="fas fa-trash-alt"
//                                   aria-hidden="true"
//                                   onClick={deleteSeviceTypeComm.bind(
//                                     this,
//                                     this,

//                                     row
//                                   )}
//                                 />
//                               </span>
//                             );
//                           },
//                           others: {
//                             maxWidth: 50,
//                           },
//                         },
//                         {
//                           fieldName: "service_type_id",
//                           label: (
//                             <AlgaehLabel
//                               label={{ fieldName: "service_type_id" }}
//                             />
//                           ),
//                           displayTemplate: (row) => {
//                             let display =
//                               empservicetype === undefined
//                                 ? []
//                                 : empservicetype.filter(
//                                     (f) =>
//                                       f.hims_d_service_type_id ===
//                                       row.service_type_id
//                                   );

//                             return (
//                               <span>
//                                 {display !== undefined && display.length !== 0
//                                   ? this.state.selectedLang === "ar"
//                                     ? display[0].arabic_service_type
//                                     : display[0].service_type
//                                   : ""}
//                               </span>
//                             );
//                           },
//                         },

//                         {
//                           fieldName: "op_cash_comission_percent",
//                           label: (
//                             <AlgaehLabel
//                               label={{
//                                 fieldName: "op_cash_comission_percent",
//                               }}
//                             />
//                           ),
//                         },
//                         {
//                           fieldName: "op_credit_comission_percent",
//                           label: (
//                             <AlgaehLabel
//                               label={{
//                                 fieldName: "op_credit_comission_percent",
//                               }}
//                             />
//                           ),
//                         },

//                         {
//                           fieldName: "ip_cash_commission_percent",
//                           label: (
//                             <AlgaehLabel
//                               label={{
//                                 fieldName: "ip_cash_commission_percent",
//                               }}
//                             />
//                           ),
//                         },

//                         {
//                           fieldName: "ip_credit_commission_percent",
//                           label: (
//                             <AlgaehLabel
//                               label={{
//                                 fieldName: "ip_credit_commission_percent",
//                               }}
//                             />
//                           ),
//                         },
//                       ]}
//                       keyId="service_type_id"
//                       dataSource={{
//                         data:
//                           this.state.servTypeCommission === undefined
//                             ? []
//                             : this.state.servTypeCommission,
//                       }}
//                      pagination={true}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="col-lg-6">
//                 <h6
//                   style={{
//                     borderBottom: "1px solid #ccc",
//                     paddingBottom: 5,
//                     paddingTop: 10,
//                     fontSize: "0.9rem",
//                   }}
//                 >
//                   Service Type Commission
//                 </h6>
//                 <div className="row">
//                   <AlagehAutoComplete
//                     div={{ className: "col mandatory form-group" }}
//                     label={{
//                       fieldName: "service_type_id",
//                       isImp: true,
//                     }}
//                     selector={{
//                       name: "service_type_id",
//                       className: "select-fld",
//                       value: this.state.service_type_id,
//                       dataSource: {
//                         textField: "service_type",
//                         valueField: "hims_d_service_type_id",
//                         data: this.props.empservicetype,
//                       },

//                       onChange: serviceServTypeHandeler.bind(this, this),
//                       onClear: () => {
//                         this.setState({
//                           service_type_id: null,
//                         });
//                       },
//                     }}
//                   />

//                   <AlagehAutoComplete
//                     div={{ className: "col-5 mandatory form-group" }}
//                     label={{
//                       forceLabel: "Select Service Type",
//                       isImp: true,
//                     }}
//                     selector={{
//                       name: "services_id",
//                       className: "select-fld",
//                       value: this.state.services_id,
//                       dataSource: {
//                         textField: "service_name",
//                         valueField: "hims_d_services_id",
//                         data: this.props.empservices,
//                       },
//                       onChange: texthandle.bind(this, this),
//                       onClear: () => {
//                         this.setState({
//                           services_id: null,
//                         });
//                       },
//                     }}
//                   />

//                   <AlagehFormGroup
//                     div={{ className: "col form-group" }}
//                     label={{
//                       fieldName: "op_cash_comission_percent",
//                     }}
//                     textBox={{
//                       decimal: { allowNegative: false },
//                       className: "txt-fld",
//                       name: "op_cash_commission_percent",
//                       value: this.state.op_cash_commission_percent,
//                       events: {
//                         onChange: numberSet.bind(this, this),
//                       },
//                     }}
//                   />
//                 </div>
//                 <div className="row">
//                   <AlagehFormGroup
//                     div={{ className: "col form-group" }}
//                     label={{
//                       fieldName: "op_credit_comission_percent",
//                     }}
//                     textBox={{
//                       decimal: { allowNegative: false },
//                       className: "txt-fld",
//                       name: "op_credit_commission_percent",
//                       value: this.state.op_credit_commission_percent,
//                       events: {
//                         onChange: numberSet.bind(this, this),
//                       },
//                     }}
//                   />
//                   <AlagehFormGroup
//                     div={{ className: "col form-group" }}
//                     label={{
//                       fieldName: "ip_cash_commission_percent",
//                     }}
//                     textBox={{
//                       decimal: { allowNegative: false },
//                       className: "txt-fld",
//                       name: "ip_cash_commission_percent",
//                       value: this.state.ip_cash_commission_percent,
//                       events: {
//                         onChange: numberSet.bind(this, this),
//                       },
//                     }}
//                   />
//                   <AlagehFormGroup
//                     div={{ className: "col form-group" }}
//                     label={{
//                       fieldName: "ip_credit_commission_percent",
//                     }}
//                     textBox={{
//                       decimal: { allowNegative: false },
//                       className: "txt-fld",
//                       name: "ip_credit_commission_percent",
//                       value: this.state.ip_credit_commission_percent,
//                       events: {
//                         onChange: numberSet.bind(this, this),
//                       },
//                     }}
//                   />

//                   <div className="col">
//                     <button
//                       type="button"
//                       className="btn btn-default"
//                       style={{ marginTop: 20 }}
//                       onClick={AddServiceComm.bind(this, this)}
//                     >
//                       Add
//                     </button>
//                   </div>
//                 </div>

//                 <div className="row" style={{ marginTop: "10px" }}>
//                   <div className="col-12" id="serviceTypeCommissionGrid_Cntr">
//                     <AlgaehDataGrid
//                       // id="service_commission"
//                       columns={[
//                         {
//                           fieldName: "action",
//                           label: (
//                             <AlgaehLabel label={{ fieldName: "action" }} />
//                           ),
//                           displayTemplate: (row) => {
//                             return (
//                               <span>
//                                 <i
//                                   className="fas fa-trash-alt"
//                                   aria-hidden="true"
//                                   onClick={deleteServiceComm.bind(
//                                     this,
//                                     this,

//                                     row
//                                   )}
//                                 />
//                               </span>
//                             );
//                           },
//                           others: {
//                             maxWidth: 50,
//                           },
//                         },
//                         {
//                           fieldName: "service_type_id",
//                           label: (
//                             <AlgaehLabel
//                               label={{ fieldName: "service_type_id" }}
//                             />
//                           ),
//                           displayTemplate: (row) => {
//                             let display =
//                               empservicetype === undefined
//                                 ? []
//                                 : empservicetype.filter(
//                                     (f) =>
//                                       f.hims_d_service_type_id ===
//                                       row.service_type_id
//                                   );

//                             return (
//                               <span>
//                                 {display !== undefined && display.length !== 0
//                                   ? this.state.selectedLang === "ar"
//                                     ? display[0].arabic_service_type
//                                     : display[0].service_type
//                                   : ""}
//                               </span>
//                             );
//                           },
//                         },

//                         {
//                           fieldName: "services_id",
//                           label: (
//                             <AlgaehLabel label={{ fieldName: "services_id" }} />
//                           ),
//                           displayTemplate: (row) => {
//                             let display =
//                               empservices === undefined
//                                 ? []
//                                 : empservices.filter(
//                                     (f) =>
//                                       f.hims_d_services_id === row.services_id
//                                   );

//                             return (
//                               <span>
//                                 {display !== null && display.length !== 0
//                                   ? this.state.selectedLang === "ar"
//                                     ? display[0].arabic_service_name
//                                     : display[0].service_name
//                                   : ""}
//                               </span>
//                             );
//                           },
//                         },

//                         {
//                           fieldName: "op_cash_commission_percent",
//                           label: (
//                             <AlgaehLabel
//                               label={{
//                                 fieldName: "op_cash_comission_percent",
//                               }}
//                             />
//                           ),
//                         },
//                         {
//                           fieldName: "op_credit_commission_percent",
//                           label: (
//                             <AlgaehLabel
//                               label={{
//                                 fieldName: "op_credit_comission_percent",
//                               }}
//                             />
//                           ),
//                         },

//                         {
//                           fieldName: "ip_cash_commission_percent",
//                           label: (
//                             <AlgaehLabel
//                               label={{
//                                 fieldName: "ip_cash_commission_percent",
//                               }}
//                             />
//                           ),
//                         },

//                         {
//                           fieldName: "ip_credit_commission_percent",
//                           label: (
//                             <AlgaehLabel
//                               label={{
//                                 fieldName: "ip_credit_commission_percent",
//                               }}
//                             />
//                           ),
//                         },
//                       ]}
//                       keyId="service_type_id"
//                       dataSource={{
//                         data:
//                           this.state.serviceComm === undefined
//                             ? []
//                             : this.state.serviceComm,
//                       }}
//                      pagination={true}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* )}
//         </MyContext.Consumer> */}
//       </React.Fragment>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     empservices: state.empservices,
//     empservicetype: state.empservicetype,

//     servTypeCommission: state.servTypeCommission,
//     serviceComm: state.serviceComm,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getServices: AlgaehActions,
//       getDoctorServiceTypeCommission: AlgaehActions,
//       getDoctorServiceCommission: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(CommissionSetup)
// );
