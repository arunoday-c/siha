import React, { useState, useContext } from "react";
import "./PayRollDetails.scss";
import { swalMessage } from "../../../../../utils/algaehApiCall";
import { GetAmountFormart } from "../../../../../utils/GlobalFunctions";
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
// import moment from "moment";
// import MyContext from "../../../../../utils/MyContext.js";
// import hijri from "moment-hijri";

// import AlgaehFile from "../../../../Wrapper/algaehFileUpload";
// import { getCookie } from "../../../../../utils/algaehApiCall";
// import swal from "sweetalert2";
import {
  // MainContext,
  AlgaehMessagePop,
  // persistStorageOnRemove,
  AlgaehAutoComplete,
  // AlgaehDateHandler,
  AlgaehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid,
} from "algaeh-react-components";
// import { algaehApiCall } from "../../../../../utils/algaehApiCall";
// import AlgaehLoader from "../../../../Wrapper/fullPageLoader";
// import { RawSecurityElement } from "algaeh-react-components";
import _ from "lodash";
import { useForm, Controller } from "react-hook-form";
// import { EmployeeMasterContext } from "../../EmployeeMasterContext";
import { EmployeeMasterContextForEmployee } from "../../EmployeeMasterContextForEmployee";

import { newAlgaehApi } from "../../../../../hooks";
import { useQuery } from "react-query";
import Enumerable from "linq";
const getEmployeePayrollDetails = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmployeePayrollDetails",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};
const getEarningDeduction = async (key) => {
  const result = await newAlgaehApi({
    uri: "/payrollsettings/getEarningDeduction",
    module: "hrManagement",
    method: "GET",
    data: { miscellaneous_component: "N" },
  });
  return result?.data?.records;
};
const getEmpEarningComponents = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmpEarningComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};
const getEmpContibuteComponents = async (key, { employee_id }) => {
  debugger;
  const result = await newAlgaehApi({
    uri: "/employee/getEmpContibuteComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};
const getEmpDeductionComponents = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmpDeductionComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};
const getOptions = async (key) => {
  const result = await newAlgaehApi({
    uri: "/payrollOptions/getHrmsOptions",
    method: "GET",
    module: "hrManagement",
  });
  return result?.data?.result[0].basic_earning_component;
};
export default function PayRollDetails({ employee_id }) {
  // const { userToken } = useContext(MainContext);
  // earning_id: null,
  //       deducation_id: null,
  //       contribution_id: null,
  //       earn_disable: false,

  //       allocate: "N",
  //       earn_calculation_method: null,
  //       deduct_calculation_method: null,
  //       contribut_calculation_method: null,
  //       earn_calculation_type: null,
  //       deduct_calculation_type: null,
  //       contribut_calculation_type: null,
  //       dataExists: false,
  //       earn_limit_applicable: null,
  //       earn_limit_amount: null,
  //       contribut_limit_applicable: null,
  //       contribut_limit_amount: null,
  //       deduct_limit_applicable: null,
  //       deduct_limit_amount: null,
  //       basic_earning_component: null,
  //       deduct_min_limit_applicable: null,
  //       deduct_min_limit_amount: null,
  //       earn_min_limit_applicable: null,
  //       earn_min_limit_amount: null,
  //       contribut_min_limit_applicable: null,
  //       contribut_min_limit_amount: null,
  const { setEmployeeUpdateDetails, output } = useContext(
    EmployeeMasterContextForEmployee
  );
  const [gross_salary, setGross_salary] = useState(null);
  const [yearly_gross_salary, setyearly_gross_salary] = useState(null);
  const [total_earnings, settotal_earnings] = useState(null);
  const [total_deductions, setTotal_deductions] = useState(null);
  const [total_contributions, setTotal_contributions] = useState(null);
  const [net_salary, setNet_salary] = useState(null);
  const [cost_to_company, setCost_to_company] = useState(null);
  // const [basic_earning_component, setBasic_earning_component] = useState(undefined)
  const [earningComponents, setEarningComponents] = useState([]);
  const [deductioncomponents, setDeductioncomponents] = useState([]);
  const [contributioncomponents, setContributioncomponents] = useState([]);
  const [baseStateForCalc, setBaseStateForCalc] = useState({
    earning_id: null,
    deducation_id: null,
    contribution_id: null,
    earn_disable: false,

    allocate: "N",
    earn_calculation_method: null,
    deduct_calculation_method: null,
    contribut_calculation_method: null,
    earn_calculation_type: null,
    deduct_calculation_type: null,
    contribut_calculation_type: null,
    dataExists: false,
    earn_limit_applicable: null,
    earn_limit_amount: null,
    contribut_limit_applicable: null,
    contribut_limit_amount: null,
    deduct_limit_applicable: null,
    deduct_limit_amount: null,
    basic_earning_component: null,
    deduct_min_limit_applicable: null,
    deduct_min_limit_amount: null,
    earn_min_limit_applicable: null,
    earn_min_limit_amount: null,
    contribut_min_limit_applicable: null,
    contribut_min_limit_amount: null,
  });

  const CalculateBasedonFormula = (parameter, from, callBack) => {
    debugger;
    let earningComponent =
      parameter?.earningComponents === undefined
        ? []
        : parameter?.earningComponents;
    let deductioncomponent =
      parameter?.deductioncomponents === undefined
        ? []
        : parameter?.deductioncomponents;
    let contributioncomponent =
      parameter?.contributioncomponents === undefined
        ? []
        : parameter?.contributioncomponents;

    let updateearnComp =
      parameter?.updateearnComp === undefined ? [] : parameter?.updateearnComp;
    let insertearnComp =
      parameter?.insertearnComp === undefined ? [] : parameter?.insertearnComp;
    let updateDeductionComp =
      parameter?.updateDeductionComp === undefined
        ? []
        : parameter?.updateDeductionComp;
    let insertDeductionComp =
      parameter?.insertDeductionComp === undefined
        ? []
        : parameter?.insertDeductionComp;
    let insertContributeComp =
      parameter?.insertContributeComp === undefined
        ? []
        : parameter?.insertContributeComp;
    let updateContributeComp =
      parameter?.updateContributeComp === undefined
        ? []
        : parameter?.updateContributeComp;

    const earn_comp = _.filter(earningComponent, (f) => {
      return f.component_category === "E";
    });

    const deduct_comp = _.filter(
      deductioncomponent,
      (w) => w.calculation_method === "FO"
    );
    const contribute_comp = _.filter(
      contributioncomponent,
      (w) => w.calculation_method === "FO"
    );

    // let $this = this;

    if (earn_comp.length > 0) {
      for (let x = 0; x < earn_comp.length; x++) {
        let formulaCal = earn_comp[x].formula;

        // let strFormula = earn_comp[x].formula;
        const _index = earningComponent.indexOf(earn_comp[x]);

        earningComponent.forEach((menu) => {
          if (formulaCal.indexOf(menu.short_desc) > -1) {
            let earn_short_desc = menu.short_desc;
            const expression = new RegExp(earn_short_desc, "g");
            formulaCal = formulaCal.replace(expression, menu.amount);
          }
        });
        const expression = new RegExp("Gross Salary", "g");
        formulaCal = formulaCal.replace(expression, gross_salary);
        const perexpression = new RegExp("%", "g");
        formulaCal = formulaCal.replace(perexpression, "/100");

        formulaCal = eval(formulaCal); // eslint-disable-line
        // limit_applicable: _.contribut_limit_applicable,
        //   limit_amount: _.contribut_limit_amount
        if (
          earn_comp[x].limit_applicable === "Y" &&
          parseFloat(formulaCal) > parseFloat(earn_comp[x].limit_amount)
        ) {
          earn_comp[x].amount = earn_comp[x].limit_amount;
        } else if (
          earn_comp[x].min_limit_applicable === "Y" &&
          parseFloat(formulaCal) < parseFloat(earn_comp[x].min_limit_amount)
        ) {
          earn_comp[x].amount = earn_comp[x].min_limit_amount;
        } else {
          earn_comp[x].amount = formulaCal;
        }
        earningComponent[_index] = earn_comp[x];

        updateearnComp.push(earn_comp[x]);
        if (insertearnComp.length > 0) {
          for (let b = 0; b < insertearnComp.length; b++) {
            if (insertearnComp[b].earnings_id === earn_comp[x].earnings_id) {
              insertearnComp[b] = earn_comp[x];
            }
          }
        }
      }
    }
    if (deduct_comp.length > 0) {
      for (let y = 0; y < deduct_comp.length; y++) {
        let formulaCal = deduct_comp[y].formula;

        const _index = deductioncomponent.indexOf(deduct_comp[y]);

        earningComponent.forEach((menu) => {
          if (formulaCal.indexOf(menu.short_desc) > -1) {
            let ded_short_desc = menu.short_desc;
            const expression = new RegExp(ded_short_desc, "g");
            formulaCal = formulaCal.replace(expression, menu.amount);
          }
        });

        const expression = new RegExp("Gross Salary", "g");
        formulaCal = formulaCal.replace(expression, gross_salary);
        const perexpression = new RegExp("%", "g");
        formulaCal = formulaCal.replace(perexpression, "/100");

        const dependentCompoennt = /([a-zA-Z])/.test(formulaCal);
        // const checkAnyCharacter = formulaCal.match(/[a-zA-Z]+/g);
        // checkAnyCharacter.forEach((element) => {
        //   formulaCal = formulaCal.replace(element, "0");
        // });
        //
        if (dependentCompoennt === true) {
          if (typeof callBack === "function") {
            swalMessage({
              title: "Component is dependent on formula can not delete",
              type: "warning",
            });

            callBack(false);
            return;
          } else {
            const checkAnyCharacter = formulaCal.match(/[a-zA-Z]+/g);
            checkAnyCharacter.forEach((element) => {
              formulaCal = formulaCal.replace(element, "0");
            });
          }
        }

        formulaCal = eval(formulaCal); // eslint-disable-line

        if (
          deduct_comp[y].limit_applicable === "Y" &&
          parseFloat(formulaCal) > parseFloat(deduct_comp[y].limit_amount)
        ) {
          deduct_comp[y].amount = deduct_comp[y].limit_amount;
        } else if (
          deduct_comp[y].min_limit_applicable === "Y" &&
          parseFloat(formulaCal) < parseFloat(deduct_comp[y].min_limit_amount)
        ) {
          deduct_comp[y].amount = deduct_comp[y].min_limit_amount;
        } else {
          deduct_comp[y].amount = formulaCal;
        }
        // deduct_comp[y].amount = formulaCal;
        deductioncomponent[_index] = deduct_comp[y];

        updateDeductionComp.push(deduct_comp[y]);
        if (insertDeductionComp.length > 0) {
          for (let d = 0; d < insertDeductionComp.length; d++) {
            if (
              insertDeductionComp[d].deductions_id ===
              deduct_comp[y].deductions_id
            ) {
              insertDeductionComp[d] = deduct_comp[y];
            }
          }
        }
      }
      if (typeof callBack === "function") {
        callBack(true);
      }
    }

    if (contribute_comp.length > 0) {
      for (let z = 0; z < contribute_comp.length; z++) {
        let formulaCal = contribute_comp[z].formula;

        // let strFormula = contribute_comp[z].formula;
        const _index = contributioncomponent.indexOf(contribute_comp[z]);

        earningComponent.forEach((menu) => {
          if (formulaCal.indexOf(menu.short_desc) > -1) {
            let con_short_desc = menu.short_desc;
            const expression = new RegExp(con_short_desc, "g");
            formulaCal = formulaCal.replace(expression, menu.amount);

            // const expression = new RegExp(menu.short_desc, "g");
            // formulaCal = formulaCal.replace(expression, menu.amount);
          }
        });

        const expression = new RegExp("Gross Salary", "g");
        formulaCal = formulaCal.replace(expression, gross_salary);
        const perexpression = new RegExp("%", "g");
        formulaCal = formulaCal.replace(perexpression, "/100");

        const dependentCompoennt = /([a-zA-Z])/.test(formulaCal);
        if (dependentCompoennt === true) {
          if (typeof callBack === "function") {
            swalMessage({
              title: "Component is dependent on formula can not delete",
              type: "warning",
            });

            callBack(false);
            return;
          } else {
            const checkAnyCharacter = formulaCal.match(/[a-zA-Z]+/g);
            checkAnyCharacter.forEach((element) => {
              formulaCal = formulaCal.replace(element, "0");
            });
          }
        }

        formulaCal = eval(formulaCal); // eslint-disable-line

        if (
          contribute_comp[z].limit_applicable === "Y" &&
          parseFloat(formulaCal) > parseFloat(contribute_comp[z].limit_amount)
        ) {
          contribute_comp[z].amount = contribute_comp[z].limit_amount;
        } else if (
          contribute_comp[z].min_limit_applicable === "Y" &&
          parseFloat(formulaCal) <
            parseFloat(contribute_comp[z].min_limit_amount)
        ) {
          contribute_comp[z].amount = contribute_comp[z].min_limit_amount;
        } else {
          contribute_comp[z].amount = formulaCal;
        }

        // contribute_comp[z].amount = formulaCal;
        contributioncomponent[_index] = contribute_comp[z];

        updateContributeComp.push(contribute_comp[z]);
        if (insertContributeComp.length > 0) {
          for (let f = 0; f < insertContributeComp.length; f++) {
            if (
              insertContributeComp[f].contributions_id ===
              contribute_comp[z].contributions_id
            ) {
              insertContributeComp[f] = contribute_comp[z];
            }
          }
        }
      }
    }
    // setEarningComponents(earningComponent);
    // setDeductioncomponents(deductioncomponent);
    // setContributioncomponents(contributioncomponent);
    debugger;
    // $this.setState(
    //   {
    //     deductioncomponents: deductioncomponents,
    //     contributioncomponents: contributioncomponents,
    //     earningComponents: earningComponents,
    setEmployeeUpdateDetails(
      {
        insertearnComp: insertearnComp,
        updateearnComp: updateearnComp,
        updateDeductionComp: updateDeductionComp,
        insertDeductionComp: insertDeductionComp,
        insertContributeComp: insertContributeComp,
        updateContributeComp: updateContributeComp,
      }
      // () => {
    );
    if (from !== "after") {
      calculationTotals(
        {
          earningComponents: earningComponent,
          deductioncomponents: deductioncomponent,
          contributioncomponents: contributioncomponent,
          insertearnComp: insertearnComp,
          insertDeductionComp: insertDeductionComp,
          insertContributeComp: insertContributeComp,
        },
        "afterCal"
      );
    }
  };
  // const [dependentDetails, setDependentDetails] = useState([]);
  // console.log(dependentDetails, "dependentDetails");
  const {
    control,
    errors,
    // register,
    reset,
    // setValue,
    getValues,
    // watch,
    handleSubmit,
  } = useForm({});
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
  const {
    control: control3,
    getValues: getValues3,
    reset: reset3,
    // setValue: setValue3,
    // watch: watch3,
    // register: register2,
    errors: errors3,
    handleSubmit: handleSubmit3,
  } = useForm({});
  // const { valid_upto } = watch(["valid_upto"]);
  const { data: payrollDetails } = useQuery(
    ["PAYROLL_DETAILS_DATA", { employee_id: employee_id }],
    getEmployeePayrollDetails,
    {
      enabled: employee_id === undefined || employee_id === null,
      // refetchOnMount: false,
      // refetchOnReconnect: false,
      // keepPreviousData: true,
      // refetchOnWindowFocus: false,
      initialStale: true,
      cacheTime: Infinity,
      onSuccess: (data) => {
        setGross_salary(data[0].gross_salary);
        setyearly_gross_salary(data[0].yearly_gross_salary);
        settotal_earnings(data[0].total_earnings);
        setTotal_deductions(data[0].total_deductions);
        setTotal_contributions(data[0].total_contributions);
        setNet_salary(data[0].net_salary);
        setCost_to_company(data[0].cost_to_company);
        console.log(yearly_gross_salary, payrollDetails);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const AddEarnComponent = (e) => {
    if (
      baseStateForCalc.earn_calculation_method === "FO" &&
      baseStateForCalc.earn_formula === null
    ) {
      swalMessage({
        title:
          "Selected component is Formula based, but in master Formula not defined, Please contact ADMIN.",
        type: "warning",
      });
      return;
    }
    let earningComponent = earningComponents;
    let insertearnComp =
      output?.insertearnComp === undefined ? [] : output?.insertearnComp;

    const _earnComponent = Enumerable.from(earningComponent)
      .where((w) => w.earnings_id === baseStateForCalc.earning_id)
      .any();
    if (_earnComponent) {
      swalMessage({
        title: "Selected component already exists.",
        type: "warning",
      });
      return;
    }

    // let formulaCal = $this.state.earn_formula;
    // if ($this.state.earn_calculation_method === "FO") {
    //   const expression = new RegExp("Gross Salary", "g");
    //   formulaCal = formulaCal.replace(expression, "GrossSalary");

    //   let earn_comp = extend([], earningComponents);
    //   earn_comp = earn_comp.concat([{ short_desc: "GrossSalary" }]);

    //   var notExists = [];
    //   const x = formulaCal.match(/[a-zA-Z]+/g);
    //   notExists = x
    //     .map(function (item) {
    //       const rtn = earn_comp.find(
    //         (f) => String(f.short_desc).toLowerCase() === item.toLowerCase()
    //       );
    //       if (rtn === undefined) {
    //         return item;
    //       } else {
    //         return null;
    //       }
    //     })
    //     .filter((f) => f !== null);

    //   if (notExists.length > 0) {
    //     swalMessage({
    //       title:
    //         "Selected Component is Fomula based component missing some component related to formula .",
    //       type: "warning",
    //     });
    //     return;
    //   }
    // }
    earningComponent.push({
      employee_id: employee_id,
      earnings_id: baseStateForCalc.earning_id,
      amount: getValues().earn_amount,
      allocate: baseStateForCalc.allocate,
      calculation_method: baseStateForCalc.earn_calculation_method,
      calculation_type: baseStateForCalc.earn_calculation_type,
      formula: baseStateForCalc.earn_formula,
      short_desc: baseStateForCalc.earn_short_desc,
      limit_applicable: baseStateForCalc.earn_limit_applicable,
      limit_amount: baseStateForCalc.earn_limit_amount,
      // min_limit_applicable: _.earn_min_limit_applicable,
      // min_limit_amount: _.earn_min_limit_amount,
      min_limit_applicable: baseStateForCalc.earn_min_limit_applicable,
      min_limit_amount: baseStateForCalc.earn_min_limit_amount,
    });

    insertearnComp.push({
      employee_id: employee_id,
      earnings_id: baseStateForCalc.earning_id,
      amount: getValues().earn_amount,
      allocate: baseStateForCalc.allocate,
      calculation_method: baseStateForCalc.earn_calculation_method,
      calculation_type: baseStateForCalc.earn_calculation_type,
      formula: baseStateForCalc.earn_formula,
      short_desc: baseStateForCalc.earn_short_desc,
    });
    setEarningComponents([...earningComponent]);
    setEmployeeUpdateDetails({
      insertearnComp: insertearnComp,
    });
    CalculateBasedonFormula({
      earningComponents: earningComponent,
      insertearnComp: insertearnComp,
      contributioncomponents: contributioncomponents,
      insertContributeComp: output?.insertContributeComp,
      deductioncomponents: deductioncomponents,
      insertDeductionComp: output?.insertDeductionComp,
    });
    reset({
      earning_id: null,
      earn_amount: null,
    });
    // $this.setState(
    //   {
    //     earningComponents: earningComponents,
    //     insertearnComp: insertearnComp,
    //     earning_id: null,
    //     earn_amount: null,
    //   },
    //   () => {
    // CalculateBasedonFormula($this);
  };
  // async function getDropDownDataOfPayroll(
  //   key,
  //   { employee_id: employee_id }
  // ) {
  //   if (dropdownData === undefined || dropdownData.countries.length === 0) {
  //     const result = await Promise.all([
  //       newAlgaehApi({
  //         uri: "/init/",
  //         method: "GET",
  //         data: {
  //           fields: fields,
  //           tableName: tableName,
  //           keyFieldName: keyFieldName,
  //         },
  //       }),
  //       newAlgaehApi({
  //         uri: "/masters/get/relegion",
  //         method: "GET",
  //       }),
  //       // newAlgaehApi({
  //       //   uri: "/masters/get/nationality",
  //       //   method: "GET",
  //       // }),
  //       newAlgaehApi({
  //         uri: "/identity/get",
  //         module: "masterSettings",
  //         method: "GET",
  //         data: { identity_status: "A" },
  //       }),
  //     ]);
  //     return {
  //       employee_code_placeHolder: result[0]?.data?.records,
  //       relegions: result[1]?.data?.records,
  //       // nationalities: result[1]?.data?.records,
  //       idtypes: result[2]?.data?.records,
  //     };
  //   } else {
  //     return {
  //       employee_code_placeHolder: dropdownData.employee_code_placeHolder,
  //       relegions: dropdownData.relegions,
  //       // nationalities: result[1]?.data?.records,
  //       idtypes: dropdownData.idtypes,
  //     };
  //   }
  // }
  // const {
  //   employee_code_placeHolder,
  //   relegions,
  //   // nationalities,
  //   idtypes,
  // } = dropdownDataPersonalDetails;

  // useEffect(() => {
  //   CalculateBasedonFormula();
  // }, [
  //   output?.insertearnComp,
  //   output?.insertDeductionComp,
  //   output?.insertContributeComp,
  // ]);
  // useEffect(() => {

  //   if (cost_to_company !== null) {
  //     CalculateBasedonFormula("after");
  //   } else {
  //     return;
  //   }
  // }, [cost_to_company]);

  // useEffect(() => {
  //   calculationTotals(
  //     {
  //       earningComponents: earningComponents,
  //       deductioncomponents: deductioncomponents,
  //     },
  //     ""
  //   );
  // }, [
  //   output?.updateearnComp,
  //   output?.updateDeductionComp,
  //   output?.updateContributeComp,
  // ]);
  // useEffect(() => {
  //   effect;
  // }, [input]);

  const { data: payrollcomponents } = useQuery(
    ["PAYROLL_COMPONENT_DATA", { employee_id: employee_id }],
    getEarningDeduction,
    {
      onSuccess: () => {},
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );

  useQuery(["getHrmsOptions"], getOptions, {
    onSuccess: (data) => {
      setBaseStateForCalc({
        ...baseStateForCalc,
        basic_earning_component: data,
      });
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  useQuery(
    ["EARNINGS_GET_DATA", { employee_id: employee_id }],
    getEmpEarningComponents,
    {
      onSuccess: (data) => {
        setEarningComponents(data);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  useQuery(
    ["DEDUCTION_GET_DATA", { employee_id: employee_id }],
    getEmpDeductionComponents,
    {
      onSuccess: (data) => {
        setDeductioncomponents(data);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  useQuery(
    ["CONTRIBUTION_GET_DATA", { employee_id: employee_id }],
    getEmpContibuteComponents,
    {
      onSuccess: (data) => {
        setContributioncomponents(data);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );

  const AddDeductionComponent = (e) => {
    debugger;
    if (
      baseStateForCalc.deduct_calculation_method === "FO" &&
      baseStateForCalc.deduct_formula === null
    ) {
      swalMessage({
        title:
          "Selected component is Formula based, but in master Formula not defined, Please contact ADMIN.",
        type: "warning",
      });
      return;
    }

    let basic_exists = _.find(
      earningComponents,
      (f) =>
        parseInt(f.earnings_id) ===
        parseInt(baseStateForCalc.basic_earning_component)
    );

    if (basic_exists === undefined) {
      swalMessage({
        title: "Please select Basic Salary in earnings.",
        type: "warning",
      });
      return;
    }

    // let formulaCal = $this.state.deduct_formula;
    // if ($this.state.deduct_calculation_method === "FO") {
    //   var notExists = [];

    //   const expression = new RegExp("Gross Salary", "g");
    //   formulaCal = formulaCal.replace(expression, "GrossSalary");

    //   let earn_comp = extend([], $this.state.earningComponents);
    //   earn_comp = earn_comp.concat([{ short_desc: "GrossSalary" }]);
    //   const x = formulaCal.match(/[a-zA-Z]+/g);
    //   notExists = x
    //     .map(function (item) {
    //       const rtn = earn_comp.find(
    //         (f) => String(f.short_desc).toLowerCase() === item.toLowerCase()
    //       );
    //       if (rtn === undefined) {
    //         return item;
    //       } else {
    //         return null;
    //       }
    //     })
    //     .filter((f) => f !== null);

    //   if (notExists.length > 0) {
    //     swalMessage({
    //       title:
    //         "Selected Component is Fomula based component missing some component related to formula .",
    //       type: "warning",
    //     });
    //     return;
    //   }
    // }

    let deductioncomponent = deductioncomponents;
    let insertDeductionComp =
      output?.insertDeductionComp === undefined
        ? []
        : output?.insertDeductionComp;

    const _dedComponent = Enumerable.from(deductioncomponents)
      .where((w) => w.deductions_id === baseStateForCalc.deducation_id)
      .any();
    if (_dedComponent) {
      swalMessage({
        title: "Selected component already exists.",
        type: "warning",
      });
      return;
    }

    deductioncomponent.push({
      employee_id: employee_id,
      deductions_id: baseStateForCalc.deducation_id,
      amount: getValues2().dedection_amount,
      allocate: baseStateForCalc.allocate,
      calculation_method: baseStateForCalc.deduct_calculation_method,
      calculation_type: baseStateForCalc.deduct_calculation_type,
      formula: baseStateForCalc.deduct_formula,
      short_desc: baseStateForCalc.deduct_short_desc,
      limit_applicable: baseStateForCalc.deduct_limit_applicable,
      limit_amount: baseStateForCalc.deduct_limit_amount,
      min_limit_applicable: baseStateForCalc.deduct_min_limit_applicable,
      min_limit_amount: baseStateForCalc.deduct_min_limit_amount,
    });

    insertDeductionComp.push({
      employee_id: employee_id,
      deductions_id: baseStateForCalc.deducation_id,
      amount: getValues2().dedection_amount,
      allocate: baseStateForCalc.allocate,
      calculation_method: baseStateForCalc.deduct_calculation_method,
      calculation_type: baseStateForCalc.deduct_calculation_type,
      formula: baseStateForCalc.deduct_formula,
      short_desc: baseStateForCalc.deduct_short_desc,
    });

    setDeductioncomponents([...deductioncomponent]);
    setEmployeeUpdateDetails({
      deductioncomponents: deductioncomponent,
      insertDeductionComp: insertDeductionComp,
    });
    CalculateBasedonFormula({
      deductioncomponents: deductioncomponent,
      insertDeductionComp: insertDeductionComp,
      contributioncomponents: contributioncomponents,
      insertContributeComp: output?.insertContributeComp,
      earningComponents: earningComponents,
      insertearnComp: output?.insertearnComp,
    });
    reset2({ deducation_id: null, dedection_amount: null });
  };

  const AddContributionComponent = (e) => {
    if (
      baseStateForCalc.contribut_calculation_method === "FO" &&
      baseStateForCalc.contribut_formula === null
    ) {
      swalMessage({
        title:
          "Selected component is Formula based, but in master Formula not defined, Please contact ADMIN.",
        type: "warning",
      });
      return;
    }

    let basic_exists = _.find(
      earningComponents,
      (f) =>
        parseInt(f.earnings_id) ===
        parseInt(baseStateForCalc.basic_earning_component)
    );

    if (basic_exists === undefined) {
      swalMessage({
        title: "Please select Basic Salary in earnings.",
        type: "warning",
      });
      return;
    }

    // let formulaCal = $this.state.contribut_formula;
    // if ($this.state.contribut_calculation_method === "FO") {
    //   const expression = new RegExp("Gross Salary", "g");
    //   formulaCal = formulaCal.replace(expression, "GrossSalary");

    //   let earn_comp = extend([], $this.state.earningComponents);
    //   earn_comp = earn_comp.concat([{ short_desc: "GrossSalary" }]);

    //   var notExists = [];
    //   const x = formulaCal.match(/[a-zA-Z]+/g);
    //   notExists = x
    //     .map(function (item) {
    //       const rtn = earn_comp.find(
    //         (f) => String(f.short_desc).toLowerCase() === item.toLowerCase()
    //       );
    //       if (rtn === undefined) {
    //         return item;
    //       } else {
    //         return null;
    //       }
    //     })
    //     .filter((f) => f !== null);

    //   if (notExists.length > 0) {
    //     swalMessage({
    //       title:
    //         "Selected Component is Fomula based component missing some component related to formula .",
    //       type: "warning",
    //     });
    //     return;
    //   }
    // }

    let contributioncomponent = [...contributioncomponents];
    let insertContributeComp =
      output?.insertContributeComp === undefined
        ? []
        : output?.insertContributeComp;

    const _contComponent = Enumerable.from(contributioncomponent)
      .where((w) => w.contributions_id === baseStateForCalc.contribution_id)
      .any();
    if (_contComponent) {
      swalMessage({
        title: "Selected component already exists.",
        type: "warning",
      });
      return;
    }

    contributioncomponent.push({
      employee_id: employee_id,
      contributions_id: baseStateForCalc.contribution_id,
      amount: getValues3().contribution_amount,
      allocate: baseStateForCalc.allocate,
      calculation_method: baseStateForCalc.contribut_calculation_method,
      calculation_type: baseStateForCalc.contribut_calculation_type,
      formula: baseStateForCalc.contribut_formula,
      short_desc: baseStateForCalc.contribut_short_desc,
      limit_applicable: baseStateForCalc.contribut_limit_applicable,
      limit_amount: baseStateForCalc.contribut_limit_amount,
      min_limit_applicable: baseStateForCalc.contribut_min_limit_applicable,
      min_limit_amount: baseStateForCalc.contribut_min_limit_amount,
    });

    insertContributeComp.push({
      employee_id: employee_id,
      contributions_id: baseStateForCalc.contribution_id,
      amount: getValues3().contribution_amount,
      allocate: baseStateForCalc.allocate,
      calculation_method: baseStateForCalc.contribut_calculation_method,
      calculation_type: baseStateForCalc.contribut_calculation_type,
      formula: baseStateForCalc.contribut_formula,
      short_desc: baseStateForCalc.contribut_short_desc,
    });
    setContributioncomponents([...contributioncomponent]);
    setEmployeeUpdateDetails({
      contributioncomponents: contributioncomponent,
      insertContributeComp: insertContributeComp,
    });
    CalculateBasedonFormula({
      contributioncomponents: contributioncomponent,
      insertContributeComp: insertContributeComp,
      deductioncomponents: deductioncomponents,
      insertDeductionComp: output?.insertDeductionComp,
      earningComponents: earningComponents,
      insertearnComp: output?.insertearnComp,
    });
    reset3(
      {
        contribution_id: null,
        contribution_amount: null,
      }
      // () => {
      //   CalculateBasedonFormula($this);
      // }
    );
  };

  const onchangegridcol = (row, e) => {
    debugger;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  };

  const calculationTotals = (parameters, From, callBack) => {
    debugger;
    let gross_salary = Enumerable.from(parameters.earningComponents).sum((w) =>
      parseFloat(w.amount)
    );
    let total_earnings = Enumerable.from(
      parameters.earningComponents
    ).sum((w) => parseFloat(w.amount));

    let total_deductions = Enumerable.from(
      parameters.deductioncomponents
    ).sum((w) => parseFloat(w.amount));
    let total_contributions = Enumerable.from(
      parameters.contributioncomponents
    ).sum((w) => parseFloat(w.amount));

    setGross_salary(gross_salary);
    setyearly_gross_salary(gross_salary * 12);
    settotal_earnings(total_earnings);
    setTotal_deductions(total_deductions);
    setTotal_contributions(total_contributions);
    setNet_salary(total_earnings - total_deductions);
    setCost_to_company(total_earnings + total_contributions);

    CalculateBasedonFormula(
      {
        contributioncomponents: parameters.contributioncomponents,
        insertContributeComp: parameters.insertContributeComp,
        deductioncomponents: parameters.deductioncomponent,
        insertDeductionComp: parameters.insertDeductionComp,
        earningComponents: parameters.earningComponent,
        insertearnComp: parameters.insertearnComp,
      },
      "after",
      callBack
    );

    setEmployeeUpdateDetails({
      gross_salary: gross_salary,
      yearly_gross_salary: gross_salary * 12,
      total_earnings: total_earnings,
      total_deductions: total_deductions,
      total_contributions: total_contributions,
      net_salary: total_earnings - total_deductions,
      cost_to_company: total_earnings + total_contributions,
    });
    // $this.props.employee_id.updateEmployeeTabs({

    // });
  };

  const deleteEarningComponent = (row) => {
    // const prevState = { ...$this.state };
    const previousContextState = { ...output };
    // const previousTabStateBaseStateCal = { ...baseStateForCalc };
    let deleteearnComp =
      output?.deleteearnComp === undefined ? [] : output?.deleteearnComp;
    let insertearnComp =
      output?.insertearnComp === undefined ? [] : output?.insertearnComp;
    let earningComponent = earningComponents;
    console.log(
      "deleteearnComp",
      deleteearnComp,
      "---earningComponent",
      earningComponent,
      "----insertearnComp",
      insertearnComp
    );
    debugger;
    if (row.hims_d_employee_earnings_id !== undefined) {
      deleteearnComp.push(row);
      earningComponent = earningComponent.filter(
        (f) => f.rowIdx !== row.rowIdx
      );
      //earningComponents.splice(row.rowIdx, 1);
    } else {
      insertearnComp = insertearnComp.filter(
        (f) => f.earnings_id !== row.earnings_id
      );
      earningComponent = earningComponent.filter(
        (f) => f.rowIdx !== row.rowIdx
      );
      // for (let x = 0; x < insertearnComp.length; x++) {
      //   if (insertearnComp[x].earnings_id === row.earnings_id) {
      //     insertearnComp.splice(x, 1);
      //   }
      // }
      //  earningComponents.splice(row.rowIdx, 1);
    }
    calculationTotals(
      {
        earningComponents: earningComponent,
        deductioncomponents: deductioncomponents,
        contributioncomponents: contributioncomponents,
      },
      "",
      (success) => {
        if (success === true) {
          setEmployeeUpdateDetails({
            deleteearnComp,
            earningComponents: earningComponent,
            insertearnComp,
          });
        } else {
          setEmployeeUpdateDetails(previousContextState);
        }
      }
    );

    // $this.setState(
    //   {
    //     earningComponents: earningComponents,
    //     deleteearnComp: deleteearnComp,
    //     insertearnComp: insertearnComp,
    //   },
    //   () => {
    //     calculationTotals("", (successs) => {
    //       if (successs === true) {
    //         $this.props.employee_id.updateEmployeeTabs({
    //           earningComponents: earningComponents,
    //           deleteearnComp: deleteearnComp,
    //           insertearnComp: insertearnComp,
    //         });
    //       } else {
    //         $this.props.employee_id.updateEmployeeTabs({
    //           deleteearnComp: [],
    //         });
    //         $this.setState({ ...prevState });
    //       }
    //     });
    //   }
    // );
  };

  const updateEarningComponent = (row) => {
    let updateearnComp =
      output?.updateearnComp === undefined ? [] : output?.updateearnComp;
    let insertearnComp =
      output?.insertearnComp === undefined ? [] : output?.insertearnComp;
    let earningComponent = earningComponents;
    let Updateobj = {};

    if (row.hims_d_employee_earnings_id !== undefined) {
      Updateobj = {
        hims_d_employee_earnings_id: row.hims_d_employee_earnings_id,
        employee_id: employee_id,
        earnings_id: row.earnings_id,
        amount: row.amount,
        allocate: row.allocate,
        record_status: "A",
        short_desc: row.short_desc,
      };
      updateearnComp.push(Updateobj);
      earningComponent[row.rowIdx] = Updateobj;
    } else {
      Updateobj = {
        employee_id: employee_id,
        earnings_id: row.earnings_id,
        amount: row.amount,
        allocate: row.allocate,
        short_desc: row.short_desc,
      };
      for (let x = 0; x < insertearnComp.length; x++) {
        if (insertearnComp[x].earnings_id === row.earnings_id) {
          insertearnComp[x] = Updateobj;
        }
      }
      // insertearnComp[row.rowIdx] = Updateobj;
      earningComponent[row.rowIdx] = Updateobj;
    }

    setEarningComponents([...earningComponent]);
    setEmployeeUpdateDetails({
      updateearnComp: updateearnComp,
      insertearnComp: insertearnComp,
    });
    calculationTotals(
      {
        earningComponents: earningComponent,
        deductioncomponents: deductioncomponents,
        contributioncomponents: contributioncomponents,
      },
      ""
    );
  };

  const deleteDeductionComponent = (row) => {
    let insertDeductionComp =
      output?.insertDeductionComp === undefined
        ? []
        : output?.insertDeductionComp;
    let deductioncomponent = deductioncomponents;
    let deleteDeductionComp =
      output?.deleteDeductionComp === undefined
        ? []
        : output?.deleteDeductionComp;

    if (row.hims_d_employee_deductions_id !== undefined) {
      deleteDeductionComp.push(row);
      deductioncomponent.splice(row.rowIdx, 1);
    } else {
      for (let x = 0; x < insertDeductionComp.length; x++) {
        if (insertDeductionComp[x].deductions_id === row.deductions_id) {
          insertDeductionComp.splice(x, 1);
        }
      }

      deductioncomponent.splice(row.rowIdx, 1);
    }
    setDeductioncomponents([...deductioncomponent]);
    setEmployeeUpdateDetails({
      deleteDeductionComp: deleteDeductionComp,
      insertDeductionComp: insertDeductionComp,
    });
    calculationTotals(
      {
        earningComponents: earningComponents,
        deductioncomponents: deductioncomponent,
        contributioncomponents: contributioncomponents,
      },
      ""
    );

    // $this.props.employee_id.updateEmployeeTabs({
    //   deductioncomponents: deductioncomponents,
    //   deleteDeductionComp: deleteDeductionComp,
    //   insertDeductionComp: insertDeductionComp,
  };

  const updateDeductionComponent = (row) => {
    let updateDeductionComp =
      output?.updateDeductionComp === undefined
        ? []
        : output?.updateDeductionComp;
    let insertDeductionComp =
      output?.insertDeductionComp === undefined
        ? []
        : output?.insertDeductionComp;
    let deductioncomponent = deductioncomponents;
    let Updateobj = {};
    if (row.hims_d_employee_deductions_id !== undefined) {
      Updateobj = {
        hims_d_employee_deductions_id: row.hims_d_employee_deductions_id,
        employee_id: employee_id,
        deductions_id: row.deductions_id,
        amount: row.amount,
        allocate: row.allocate,
        record_status: "A",
      };
      updateDeductionComp.push(Updateobj);
      deductioncomponent[row.rowIdx] = Updateobj;
    } else {
      Updateobj = {
        employee_id: employee_id,
        deductions_id: row.deductions_id,
        amount: row.amount,
        allocate: row.allocate,
      };
      for (let x = 0; x < insertDeductionComp.length; x++) {
        if (insertDeductionComp[x].deductions_id === row.deductions_id) {
          insertDeductionComp[x] = Updateobj;
        }
      }
      // insertDeductionComp[row.rowIdx] = Updateobj;
      deductioncomponent[row.rowIdx] = Updateobj;
    }
    setDeductioncomponents([...deductioncomponent]);
    setEmployeeUpdateDetails({
      updateDeductionComp: updateDeductionComp,
      insertDeductionComp: insertDeductionComp,
    });

    calculationTotals(
      {
        earningComponents: earningComponents,
        deductioncomponents: deductioncomponent,
        contributioncomponents: contributioncomponents,
      },
      ""
    );
  };

  const deleteContibuteComponent = (row) => {
    let contributioncomponent = contributioncomponents;
    let insertContributeComp =
      output?.insertContributeComp === undefined
        ? []
        : output?.insertContributeComp;
    let deleteContributeComp =
      output?.deleteContributeComp === undefined
        ? []
        : output?.deleteContributeComp;

    if (row.hims_d_employee_contributions_id !== undefined) {
      deleteContributeComp.push(row);
      contributioncomponent.splice(row.rowIdx, 1);
    } else {
      for (let x = 0; x < insertContributeComp.length; x++) {
        if (insertContributeComp[x].deductions_id === row.deductions_id) {
          insertContributeComp.splice(x, 1);
        }
      }

      contributioncomponent.splice(row.rowIdx, 1);
    }
    setContributioncomponents([...contributioncomponent]);
    setEmployeeUpdateDetails({
      deleteContributeComp: deleteContributeComp,
      insertContributeComp: insertContributeComp,
    });

    calculationTotals(
      {
        earningComponents: earningComponents,
        deductioncomponents: deductioncomponents,
        contributioncomponents: contributioncomponent,
      },
      ""
    );
  };

  const updateContibuteComponent = (row) => {
    let contributioncomponent = contributioncomponents;
    let insertContributeComp =
      output?.insertContributeComp === undefined
        ? []
        : output?.insertContributeComp;
    let updateContributeComp =
      output?.updateContributeComp === undefined
        ? []
        : output?.updateContributeComp;
    let Updateobj = {};
    if (row.hims_d_employee_contributions_id !== undefined) {
      Updateobj = {
        hims_d_employee_contributions_id: row.hims_d_employee_contributions_id,
        employee_id: employee_id,
        contributions_id: row.contributions_id,
        amount: row.amount,
        allocate: row.allocate,
        record_status: "A",
      };
      updateContributeComp.push(Updateobj);
      contributioncomponent[row.rowIdx] = Updateobj;
    } else {
      Updateobj = {
        employee_id: employee_id,
        contributions_id: row.contributions_id,
        amount: row.amount,
        allocate: row.allocate,
      };
      for (let x = 0; x < insertContributeComp.length; x++) {
        if (insertContributeComp[x].contributions_id === row.contributions_id) {
          insertContributeComp[x] = Updateobj;
        }
      }
      // insertContributeComp[row.rowIdx] = Updateobj;
      contributioncomponent[row.rowIdx] = Updateobj;
    }
    setContributioncomponents([...contributioncomponent]);
    setEmployeeUpdateDetails({
      updateContributeComp: updateContributeComp,
      insertContributeComp: insertContributeComp,
    });

    calculationTotals(
      {
        earningComponents: earningComponents,
        deductioncomponents: deductioncomponents,
        contributioncomponents: contributioncomponent,
      },
      ""
    );

    // $this.props.employee_id.updateEmployeeTabs({
    //   contributioncomponents: contributioncomponents,
    //   updateContributeComp: updateContributeComp,
    //   insertContributeComp: insertContributeComp,
    // });
  };
  const onSubmit = (e) => {
    console.error(errors);
    AddEarnComponent(e);
  };
  const onSubmit2 = (e) => {
    console.error(errors);
    AddDeductionComponent(e);
  };
  const onSubmit3 = (e) => {
    console.error(errors);
    AddContributionComponent(e);
  };

  const earnings = _.filter(payrollcomponents, (f) => {
    return f.component_category === "E";
  });
  const deducation = _.filter(payrollcomponents, (f) => {
    return f.component_category === "D";
  });
  const contribution = _.filter(payrollcomponents, (f) => {
    return f.component_category === "C";
  });
  return (
    <>
      <div className="hptl-phase1-add-employee-form popRightDiv">
        <div className="row">
          <div className="col-12">
            <div className="row" style={{ marginTop: 15 }}>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Gross Salary",
                  }}
                />
                <h6>{GetAmountFormart(gross_salary)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Earning",
                  }}
                />
                <h6>{GetAmountFormart(total_earnings)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Deduction",
                  }}
                />
                <h6>{GetAmountFormart(total_deductions)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Emp. Contribution",
                  }}
                />
                <h6>{GetAmountFormart(total_contributions)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Net Salary",
                  }}
                />
                <h6>{GetAmountFormart(net_salary)}</h6>
              </div>
              <div
                className="col"
                style={{
                  border: "1px dashed #d3d3d3",
                  background: "rgb(194, 255, 249)",
                }}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Cost to Company",
                  }}
                />
                <h6 style={{ fontWeight: "bold" }}>
                  {GetAmountFormart(cost_to_company)}
                </h6>
              </div>
            </div>
            <hr
              style={{
                marginTop: 0,
              }}
            ></hr>
          </div>
          <div className="col-4 primary-details">
            {/*  <h5>
                <span>Earnings Details</span>
              </h5>
             <div className="row">
                <div
                  className="col-2 customCheckbox"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="isdoctor"
                      checked={this.state.Applicable}
                    />
                    <span>
                      <AlgaehLabel label={{ forceLabel: "Allocation" }} />
                    </span>
                  </label>
                </div>
              </div> */}
            <div className="row padding-bottom-5" data-validate="EarnComponent">
              <form key={1} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  control={control}
                  name="earning_id"
                  rules={{ required: "Required" }}
                  render={({ value, onChange, onBlur }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col mandatory" }}
                      error={errors}
                      label={{
                        forceLabel: "Earnings Type",
                        isImp: true,
                      }}
                      selector={{
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);
                          let amount = _.calculation_method === "FO" ? 0 : null;
                          let formula =
                            _.calculation_method === "FO" ? _.formula : null;
                          setBaseStateForCalc({
                            ...baseStateForCalc,
                            earning_id: _.hims_d_earning_deduction_id,
                            earn_amount: amount,
                            earn_disable:
                              _.calculation_method === "FO" ? true : false,
                            earn_calculation_method: _.calculation_method,
                            earn_calculation_type: _.calculation_type,
                            earn_limit_applicable: _.limit_applicable,
                            earn_limit_amount: _.limit_amount,
                            earn_short_desc: _.short_desc,
                            earn_formula: formula,
                          });
                        },
                        onClear: () => {
                          onChange("");
                        },
                        name: "earning_id",
                        dataSource: {
                          textField: "earning_deduction_description",
                          valueField: "hims_d_earning_deduction_id",
                          data: earnings,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Earnings Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "earning_id",
                    className: "select-fld",
                    value: this.state.earning_id,
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: earnings,
                    },
                    onChange: earntexthandle.bind(this, this),
                  }}
                /> */}

                <Controller
                  name="earn_amount"
                  control={control}
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col-3 mandatory" }}
                      error={errors}
                      label={{
                        forceLabel: "Amount",
                        isImp:
                          baseStateForCalc.earn_calculation_method === "FO"
                            ? false
                            : true,
                      }}
                      textBox={{
                        name: "earn_amount",
                        type: "text",
                        className: "form-control",
                        ...props,
                        others: {
                          disabled:
                            baseStateForCalc.earn_calculation_method === "FO"
                              ? true
                              : false,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehFormGroup
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "Amount",
                    isImp:
                      earn_calculation_method === "FO"
                        ? false
                        : true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "earn_amount",
                    value: this.state.earn_amount,
                    decimal: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    events: {
                      onChange: numberSet.bind(this, this),
                    },
                    others: {
                      disabled:
                        this.state.earn_calculation_method === "FO"
                          ? true
                          : false,
                    },
                  }}
                /> */}

                <div className="col-2" style={{ paddingTop: "19px" }}>
                  <button
                    className="btn btn-default"
                    // onClick={() => {
                    //   AddEarnComponent();
                    // }}
                    type="submit"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>

            <div className="row">
              <div
                className="col-lg-12 margin-top-15"
                id="EarningComponent_Cntr"
              >
                <AlgaehDataGrid
                  id="EarningComponent"
                  // datavalidate="EarningComponent"
                  columns={[
                    {
                      fieldName: "earnings_id",
                      label: "Earnings",
                      displayTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.earnings_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.earnings_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      // others: {
                      //   style: {
                      //     //textAlign: "left"
                      //   },
                      // },
                    },
                    {
                      fieldName: "amount",
                      label: "Amount",
                      editorTemplate: (row) => {
                        debugger;
                        return row.calculation_method === "FO" ? (
                          row.amount
                        ) : (
                          <AlgaehFormGroup
                            div={{}}
                            textBox={{
                              number: {
                                allowNegative: false,
                                thousandSeparator: ",",
                              },

                              value: row.amount,
                              className: "txt-fld",
                              name: "amount",

                              onChange: (e) => {
                                debugger;
                                onchangegridcol(row, e);
                              },

                              others: {
                                placeholder: "0.00",
                              },
                            }}
                          />
                        );
                      },
                    },
                    // ,{
                    //   fieldName: "allocate",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Allocate" }} />
                    //   ),
                    //   displayTemplate: row => {
                    //     return row.allocate === "Y" ? "Yes" : "No";
                    //   },
                    //   editorTemplate: row => {
                    //     return (
                    //       <AlagehAutoComplete
                    //         div={{}}
                    //         selector={{
                    //           name: "allocate",
                    //           className: "select-fld",
                    //           value: row.allocate,
                    //           dataSource: {
                    //             textField: "name",
                    //             valueField: "value",
                    //             data: GlobalVariables.FORMAT_YESNO
                    //           },
                    //           onChange: onchangegridcol.bind(this, this, row),
                    //           others: {
                    //             errormessage: "Status - cannot be blank",
                    //             required: true
                    //           }
                    //         }}
                    //       />
                    //     );
                    //   }
                    // }
                  ]}
                  keyId="hims_d_employee_earnings_id"
                  data={earningComponents ? earningComponents : []}
                  isEditable={true}
                  // paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: (row) => {
                      deleteEarningComponent(row);
                    },
                    // onEdit: (row) => {},
                    onDone: (row) => {
                      updateEarningComponent(row);
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-4 primary-details">
            {/*      <h5>
                <span>Deduction Details</span>
              </h5>       */}
            <div
              className="row padding-bottom-5"
              data-validate="DeductionComponent"
            >
              <form key={2} onSubmit={handleSubmit2(onSubmit2)}>
                <Controller
                  control={control2}
                  name="deducation_id"
                  rules={{ required: "Required" }}
                  render={({ value, onChange, onBlur }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col mandatory" }}
                      error={errors2}
                      label={{
                        forceLabel: "Deduction Type",
                        isImp: true,
                      }}
                      selector={{
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);
                          if (
                            _.specific_nationality === "Y" &&
                            output?.nationality !== null
                          ) {
                            if (_.nationality_id !== output?.nationality) {
                              swalMessage({
                                title:
                                  "This employee is not entitle for this component.",
                                type: "warning",
                              });
                              onChange("");
                              return;
                            }
                          }
                          let amount = _.calculation_method === "FO" ? 0 : null;
                          let formula =
                            _.calculation_method === "FO" ? _.formula : null;

                          setBaseStateForCalc({
                            ...baseStateForCalc,
                            dedection_amount: amount,
                            deducation_id: _.hims_d_earning_deduction_id,
                            deduct_calculation_method: _.calculation_method,
                            deduct_calculation_type: _.calculation_type,
                            deduct_short_desc: _.short_desc,
                            deduct_formula: formula,
                            deduct_limit_applicable: _.limit_applicable,
                            deduct_limit_amount: _.limit_amount,
                            deduct_min_limit_applicable: _.min_limit_applicable,
                            deduct_min_limit_amount: _.min_limit_amount,
                          });
                        },
                        onClear: () => {
                          onChange("");
                        },
                        name: "deducation_id",
                        dataSource: {
                          textField: "earning_deduction_description",
                          valueField: "hims_d_earning_deduction_id",
                          data: deducation,
                        },
                      }}
                    />
                  )}
                />

                {/* <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Deduction Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "deducation_id",
                    className: "select-fld",
                    value: this.state.deducation_id,
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: deducation,
                    },
                    onChange: deducttexthandle.bind(this, this),
                  }}
                /> */}
                <Controller
                  name="dedection_amount"
                  control={control2}
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col-3 mandatory" }}
                      error={errors2}
                      label={{
                        forceLabel: "Amount",
                        isImp:
                          baseStateForCalc.deduct_calculation_method === "FO"
                            ? false
                            : true,
                      }}
                      textBox={{
                        name: "dedection_amount",
                        className: "txt-fld",
                        decimal: {
                          allowNegative: false,
                          thousandSeparator: ",",
                        },
                        number: {
                          allowearningComponentsNegative: false,
                          thousandSeparator: ",",
                        },
                        ...props,
                        others: {
                          disabled:
                            baseStateForCalc.deduct_calculation_method === "FO"
                              ? true
                              : false,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehFormGroup
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "-----------------",
                    isImp:
                      this.state.deduct_calculation_method === "FO"
                        ? false
                        : true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    decimal: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    name: "dedection_amount",
                    value: this.state.dedection_amount,
                    number: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    events: {
                      onChange: numberSet.bind(this, this),
                    },
                    others: {
                      disabled:
                        this.state.deduct_calculation_method === "FO"
                          ? true
                          : false,
                    },
                  }}
                /> */}
                <div className="col-2" style={{ paddingTop: "19px" }}>
                  <button
                    className="btn btn-default"
                    type="submit"
                    // onClick={() => {
                    //   AddDeductionComponent();
                    // }}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
            <div className="row">
              <div
                className="col-lg-12 margin-top-15"
                id="DeductionComponent_Cntr"
              >
                <AlgaehDataGrid
                  id="DeductionComponent"
                  datavalidate="DeductionComponent"
                  columns={[
                    {
                      fieldName: "deductions_id",
                      label: "Deductions",
                      displayTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.deductions_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.deductions_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      // others: {
                      //   style: {
                      //     //textAlign: "left"
                      //   },
                      // },
                    },
                    {
                      fieldName: "amount",
                      label: "Amount",
                      editorTemplate: (row) => {
                        return row.calculation_method === "FO" ? (
                          row.amount
                        ) : (
                          <AlgaehFormGroup
                            div={{}}
                            textBox={{
                              number: {
                                allowNegative: false,
                                thousandSeparator: ",",
                              },
                              value: row.amount,
                              className: "txt-fld",
                              name: "amount",
                              events: {
                                onChange: () => {
                                  onchangegridcol(row);
                                },
                              },
                            }}
                          />
                        );
                      },
                      // others: {
                      //   maxWidth: 90,
                      //   style: {
                      //     textAlign: "right",
                      //   },
                      // },
                    },
                  ]}
                  // keyId=""
                  data={deductioncomponents}
                  isEditable={true}
                  // paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: (row) => {
                      deleteDeductionComponent(row);
                    },
                    // onEdit:
                    onDone: (row) => {
                      updateDeductionComponent(row);
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-4 secondary-details">
            {/*   <h5>
                <span>Contribution Details</span>
              </h5>       */}
            <div
              className="row padding-bottom-5"
              data-validate="ContributeComponent"
            >
              <form key={3} onSubmit={handleSubmit3(onSubmit3)}>
                <Controller
                  control={control3}
                  name="contribution_id"
                  rules={{ required: "Required" }}
                  render={({ value, onChange, onBlur }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col mandatory" }}
                      error={errors3}
                      label={{
                        forceLabel: "Contribution Type",
                        isImp: true,
                      }}
                      selector={{
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);
                          if (
                            _.specific_nationality === "Y" &&
                            output?.nationality !== null
                          ) {
                            if (_.nationality_id !== output?.nationality) {
                              swalMessage({
                                title:
                                  "This employee is not entitle for this component.",
                                type: "warning",
                              });
                              onChange("");
                              return;
                            }
                          }

                          let amount = _.calculation_method === "FO" ? 0 : null;
                          let formula =
                            _.calculation_method === "FO" ? _.formula : null;
                          setBaseStateForCalc({
                            ...baseStateForCalc,
                            contribution_id: _.hims_d_earning_deduction_id,
                            contribution_amount: amount,
                            contribut_calculation_method: _.calculation_method,
                            contribut_calculation_type: _.calculation_type,
                            contribut_short_desc: _.short_desc,
                            contribut_formula: formula,
                            contribut_limit_applicable: _.limit_applicable,
                            contribut_limit_amount: _.limit_amount,
                            contribut_min_limit_applicable:
                              _.min_limit_applicable,
                            contribut_min_limit_amount: _.min_limit_amount,
                          });
                        },
                        onClear: () => {
                          onChange("");
                        },
                        name: "contribution_id",
                        dataSource: {
                          textField: "earning_deduction_description",
                          valueField: "hims_d_earning_deduction_id",
                          data: contribution,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Contribution Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "contribution_id",
                    className: "select-fld",
                    value: this.state.contribution_id,
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: contribution,
                    },
                    onChange: contributtexthandle.bind(this, this),
                  }}
                /> */}
                <Controller
                  name="dedection_amount"
                  control={control3}
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col-3 mandatory" }}
                      error={errors3}
                      label={{
                        forceLabel: "Amount",
                        isImp:
                          baseStateForCalc.contribut_calculation_method === "FO"
                            ? false
                            : true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "contribution_amount",
                        decimal: {
                          allowNegative: false,
                          thousandSeparator: ",",
                        },
                        // value: contribution_amount,
                        number: {
                          allowNegative: false,
                          thousandSeparator: ",",
                        },
                        ...props,

                        others: {
                          disabled:
                            baseStateForCalc.contribut_calculation_method ===
                            "FO"
                              ? true
                              : false,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehFormGroup
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "Amount",
                    isImp:
                      this.state.contribut_calculation_method === "FO"
                        ? false
                        : true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "contribution_amount",
                    decimal: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    value: this.state.contribution_amount,
                    number: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    events: {
                      // onChange: numberSet.bind(this, this),
                    },
                    others: {
                      disabled:
                      // contribut_calculation_method === "FO"
                      //     ? true
                      //     : false,
                    },
                  }}
                /> */}
                <div className="col-2" style={{ paddingTop: "19px" }}>
                  <button
                    type="submit"
                    className="btn btn-default"
                    // onClick={() => {
                    //   AddContributionComponent();
                    // }}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
            <div className="row">
              <div
                className="col-lg-12 margin-top-15"
                id="ContributionComponent_Cntr"
              >
                <AlgaehDataGrid
                  id="ContributionComponent"
                  datavalidate="ContributionComponent"
                  columns={[
                    {
                      fieldName: "contributions_id",
                      label: "Contributions",

                      displayTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.contributions_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.contributions_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      // others: {
                      //   style: {
                      //     //textAlign: "left"
                      //   },
                      // },
                    },
                    {
                      fieldName: "amount",
                      label: "Amount",
                      editorTemplate: (row) => {
                        return row.calculation_method === "FO" ? (
                          row.amount
                        ) : (
                          <AlgaehFormGroup
                            div={{}}
                            textBox={{
                              number: {
                                allowNegative: false,
                                thousandSeparator: ",",
                              },
                              value: row.amount,
                              className: "txt-fld",
                              name: "amount",
                              events: {
                                onChange: () => {
                                  onchangegridcol(row);
                                },
                              },
                            }}
                          />
                        );
                      },
                      // others: {
                      //   maxWidth: 90,
                      //   style: {
                      //     textAlign: "right",
                      //   },
                      // },
                    },
                  ]}
                  // keyId=""
                  data={contributioncomponents ? contributioncomponents : []}
                  isEditable={true}
                  // paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: (row) => {
                      deleteContibuteComponent(row);
                    },
                    // onEdit: (row) => {},
                    onDone: (row) => {
                      updateContibuteComponent(row);
                    },
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
