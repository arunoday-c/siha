import React, { useContext, useState, useEffect } from "react";

import {
  AlgaehModal,
  //   Button,
  Select,
  AlgaehLabel,
  AlgaehDataGrid,
  MainContext,
  Spin,
  Input,
  AlgaehFormGroup,
} from "algaeh-react-components";
import { swalMessage } from "../../utils/algaehApiCall";
import { useQuery } from "react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { newAlgaehApi } from "../../hooks";
function AddDoctorDetails({ onClose, visible, activeRow }) {
  const { countries = [], userToken } = useContext(MainContext);
  const [currentCountry] = countries?.filter(
    (item) => item.hims_d_country_id === userToken?.default_country
  );
  const { control, errors, reset, getValues, handleSubmit } = useForm({
    shouldFocusError: true,
    defaultValues: { employee_tel_code: currentCountry?.tel_code },
  });
  const { employee_tel_code } = useWatch({
    control,
    name: ["employee_tel_code"],
  });
  async function getCustomerEmployees() {
    const result = await newAlgaehApi({
      uri: "/customer/getCustomerEmployees",
      method: "GET",
      module: "masterSettings",
      data: { hims_d_customer_id: activeRow.hims_d_customer_id },
    });

    return result.data.records;
  }
  const [maxLength, setMaxLength] = useState(null);

  useEffect(() => {
    const telCode = getValues().employee_tel_code;
    if (telCode) {
      const maxlength = countries.filter((f) => f.tel_code === telCode)[0]
        .max_phone_digits;
      setMaxLength(maxlength);
    } else {
      const country_id = getValues().country_id;
      const maxlength = countries.filter(
        (f) => f.hims_d_country_id === country_id
      )[0]?.max_phone_digits;
      setMaxLength(maxlength);
    }
  }, [employee_tel_code]);
  const {
    data: customerEmployees,
    refetch,
    isLoading: customerEmployeesLoading,
  } = useQuery("customer-employee", getCustomerEmployees, {
    // initialStale: true,
    onSuccess: (data) => {},
    onError: (err) => {
      swalMessage({
        title: err?.message,

        type: "error",
      });
    },
  });

  const addDocDetails = (data) => {
    newAlgaehApi({
      uri: "/customer/addCustomerEmployee",
      method: "POST",
      module: "masterSettings",
      data: { hims_d_customer_id: activeRow.hims_d_customer_id, ...data },
    })
      .then((response) => {
        if (response.data.success) {
          swalMessage({
            display: "Successfully Added.....",
            type: "success",
          });
          refetch();
        }
      })
      .catch((err) => {
        swalMessage({
          display: err.message,
          type: "error",
        });
      });
  };
  const updateCustomerEmployees = (row) => {
    newAlgaehApi({
      uri: "/customer/updateCustomerEmployees",
      module: "masterSettings",
      method: "PUT",
      data: { ...row },
    })
      .then((response) => {
        if (response.data.success) {
          swalMessage({
            title: "Successfully Update....",
            type: "success",
          });
          refetch();
        }
      })
      .catch((err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      });
  };

  const deleteCustomerEmployee = (row) => {
    newAlgaehApi({
      uri: "/customer/deleteCustomerEmployee",
      module: "masterSettings",
      method: "DELETE",
      data: { hims_d_customer_employee_id: row.hims_d_customer_employee_id },
    })
      .then((response) => {
        if (response.data.success) {
          swalMessage({
            title: "Successfully Update....",
            type: "success",
          });
          refetch();
        }
      })
      .catch((err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      });
  };

  return (
    <>
      <AlgaehModal
        title="Add Customer Employee"
        visible={visible}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        footer={[
          <button onClick={onClose} className="btn btn-default">
            Close
          </button>,
        ]}
        // className={`row algaehNewModal SelectBedModal`}
      >
        <Spin spinning={customerEmployeesLoading}>
          <form onSubmit={handleSubmit(addDocDetails)}>
            <div className="col popupInner">
              <div className="row inner-top-search margin-bottom-15">
                <Controller
                  name="employee_name"
                  control={control}
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col-2 mandatory form-group" }}
                      error={errors}
                      label={{
                        forceLabel: "Doctor Name",
                        isImp: true,
                      }}
                      textBox={{
                        ...props,
                        className: "txt-fld",
                        name: "employee_name",
                      }}
                    />
                  )}
                />

                <Controller
                  name="employee_email"
                  control={control}
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col-2 mandatory form-group" }}
                      error={errors}
                      label={{
                        forceLabel: "Doctor Email",
                        isImp: true,
                      }}
                      textBox={{
                        ...props,
                        className: "txt-fld",
                        name: "employee_email",
                      }}
                    />
                  )}
                />

                <div className="col-lg-4 algaehInputGroup mandatory">
                  <AlgaehLabel
                    label={{
                      fieldName: "contact_number",
                      isImp: true,
                    }}
                  />

                  <Input.Group compact>
                    <Controller
                      control={control}
                      name="employee_tel_code"
                      rules={{
                        required: "Select Tel Code",
                      }}
                      render={({ value, onChange }) => (
                        <>
                          <Select
                            value={value}
                            onChange={(_, selected) => {
                              onChange(_, selected);
                              setMaxLength(
                                selected.max_phone_digits
                                  ? selected.max_phone_digits
                                  : null
                              );
                            }}
                            virtual={true}
                            //   disabled={disabled}
                            showSearch
                            filterOption={(input, option) => {
                              return (
                                option.value
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            options={countries
                              ?.map((item) => ({
                                tel_code: item.tel_code,
                                max_phone_digits: item.max_phone_digits,
                              }))
                              .filter((v, i, a) => a.indexOf(v) === i)
                              .map((item) => {
                                return {
                                  label: item.tel_code,
                                  value: item.tel_code,

                                  max_phone_digits: item.max_phone_digits,
                                };
                              })}
                          ></Select>
                        </>
                      )}
                    />
                    <span className="errorMsg">
                      {errors.employee_tel_code?.message}
                    </span>
                    <Controller
                      control={control}
                      name="employee_contact_number"
                      rules={{
                        required: "Please Enter Contact Number",
                        minLength: {
                          message: "Please Enter Valid Number",
                          value: 6,
                        },
                      }}
                      render={(props) => (
                        <>
                          <Input
                            {...props}
                            maxLength={maxLength}
                            placeholder={maxLength ? `${maxLength} digits` : ""}
                          />
                        </>
                      )}
                    />
                  </Input.Group>
                  <span className="errorMsg">
                    {errors.employee_contact_number?.message}
                  </span>
                </div>

                <div className="col-2">
                  <button
                    type="submit"
                    style={{ marginTop: 20 }}
                    className="btn btn-primary"
                    // onClick={() => refetch()}
                  >
                    Add to List
                  </button>
                </div>
                <div className="col-1">
                  <button
                    type="button"
                    style={{ marginTop: 20 }}
                    className="btn btn-default"
                    onClick={() => {
                      reset({
                        employee_email: "",
                        employee_name: "",
                      });
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Employee Details</h3>
                      </div>
                      <div className="actions"></div>
                    </div>
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-12">
                          <div id="">
                            <AlgaehDataGrid
                              className="offerPriceList"
                              columns={[
                                {
                                  fieldName: "employee_name",
                                  label: "Employee Name",
                                  //   displayTemplate: (row) => {

                                  //   },
                                },

                                {
                                  fieldName: "employee_email",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Employee Email" }}
                                    />
                                  ),
                                },
                                {
                                  fieldName: "contact_number",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Contact Number" }}
                                    />
                                  ),
                                  displayTemplate: (row) =>
                                    `${row.employee_tel_code} ${row.employee_contact_number}`,

                                  editorTemplate: (row) => {
                                    return (
                                      <Input.Group compact>
                                        <Select
                                          defaultValue={row.employee_tel_code}
                                          onChange={(_, selected) => {
                                            row.employee_tel_code = _;
                                          }}
                                          virtual={true}
                                          //   disabled={disabled}
                                          showSearch
                                          filterOption={(input, option) => {
                                            return (
                                              option.value
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                              0
                                            );
                                          }}
                                          options={countries
                                            ?.map((item) => ({
                                              tel_code: item.tel_code,
                                              max_phone_digits:
                                                item.max_phone_digits,
                                            }))
                                            .filter(
                                              (v, i, a) => a.indexOf(v) === i
                                            )
                                            .map((item) => {
                                              row.maxDigits =
                                                item.max_phone_digits;
                                              return {
                                                label: item.tel_code,
                                                value: item.tel_code,

                                                max_phone_digits:
                                                  item.max_phone_digits,
                                              };
                                            })}
                                        ></Select>

                                        <Input
                                          defaultValue={
                                            row.employee_contact_number
                                          }
                                          onChange={(e) => {
                                            row.employee_contact_number =
                                              e.target.value;
                                          }}
                                          maxLength={
                                            row.maxDigits
                                              ? row.maxDigits
                                              : row.employee_contact_number
                                                  .length
                                          }
                                          placeholder={
                                            row.maxDigits
                                              ? `${row.maxDigits} digits`
                                              : `${row.employee_contact_number.length} digits`
                                          }
                                        />
                                      </Input.Group>
                                    );
                                  },
                                },
                              ]}
                              rowUniqueId="hims_d_patient_id"
                              data={customerEmployees ?? []}
                              pagination={true}
                              isEditable={true}
                              events={{
                                onSave: (row) => {
                                  if (
                                    row?.employee_contact_number &&
                                    row?.employee_tel_code &&
                                    row?.employee_name &&
                                    row?.employee_email
                                  ) {
                                    updateCustomerEmployees(row);
                                  } else {
                                    swalMessage({
                                      title: "Please enter all the fields",
                                      type: "error",
                                    });
                                  }
                                },
                                onDelete: (row) => deleteCustomerEmployee(row),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Spin>
      </AlgaehModal>
    </>
  );
}

export default AddDoctorDetails;
