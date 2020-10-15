import React from "react";
// import { newAlgaehApi } from "../../../hooks";
// import { AlgaehTable } from "algaeh-react-components";
// import moment from "moment";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
// import jwtDecode from "jwt-decode";
// import { AlgaehMessagePop } from "algaeh-react-components";
// import ReportHeader from "../header";
import PrintLayout from "../printlayout";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout
  // createPrintObject,
}) {
  const { asset, expense, liability, capital, income } = data;
  let accounts = [];
  if (asset) {
    accounts.push(asset);
  }
  if (expense) {
    accounts.push(expense);
  }
  if (liability) {
    accounts.push(liability);
  }
  if (capital) {
    accounts.push(capital);
  }
  if (income) {
    accounts.push(income);
  }
  // const accounts = [asset, expense, liability, capital, income];
  // const [organisation, setOrganisation] = useState({});

  // useEffect(() => {
  // newAlgaehApi({
  //   uri: "/organization/getMainOrganization",
  //   method: "GET",
  // })
  //   .then((result) => {
  //     const { records, success, message } = result.data;
  //     if (success === true) {
  //       setOrganisation(records);
  //     } else {
  //       AlgaehMessagePop({
  //         display: message,
  //         type: "error",
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     AlgaehMessagePop({
  //       display: error.message,
  //       type: "error",
  //     });
  //   });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const { organization_name, address1, address2, full_name } = organisation;

  // if (data.asset) {
  return (
    <PrintLayout
      title="Trail Balance"
      columns={[
        {
          fieldName: "label",
          label: "Paticulars",
          filterable: true,
          freezable: true
        },
        {
          fieldName: "op_amount",
          label: "Opening Balance",
          displayTemplate: row => {
            const opamt = String(row["op_amount"]).replace(/[^0-9\.]+/g, "");

            if (!isNaN(opamt)) {
              return (
                getAmountFormart(parseFloat(opamt), { appendSymbol: false }) +
                " " +
                String(row["op_amount"]).replace(/[^a-zA-Z]+/g, "")
              );
            }
            return row["op_amount"];
          }
        },
        {
          fieldName: "tr_debit_amount",
          label: "Transactions Debit",
          displayTemplate: row => {
            return getAmountFormart(row["tr_debit_amount"], {
              appendSymbol: false
            });
          }
        },
        {
          fieldName: "tr_credit_amount",
          label: "Transaction Credit",
          displayTemplate: row => {
            return getAmountFormart(row["tr_credit_amount"], {
              appendSymbol: false
            });
          }
        },
        {
          fieldName: "cb_amount",
          label: "Closing Balance",
          displayTemplate: row => {
            const opamt = String(row["cb_amount"]).replace(/[^0-9\.]+/g, "");

            if (!isNaN(opamt)) {
              return (
                getAmountFormart(parseFloat(opamt), { appendSymbol: false }) +
                " " +
                String(row["cb_amount"]).replace(/[^a-zA-Z]+/g, "")
              );
            }
            return row["cb_amount"];
          }
        }
      ]}
      data={accounts || []}
      layout={layout}
    />
    // <>
    //   <div ref={createPrintObject}>

    //     <ReportHeader title="Trail Balance" />
    //     <div className="reportTableStyle" style={{ border: "none" }}>
    //       <AlgaehTable
    //         className="reportGridPlain"
    //         data={accounts || []}
    //         columns={[
    //           {
    //             fieldName: "label",
    //             label: "Paticulars",
    //             filterable: true,
    //           },
    //           {
    //             fieldName: "op_amount",
    //             label: "Opening Balance",
    //           },
    //           {
    //             fieldName: "tr_debit_amount",
    //             label: "Transactions Debit",
    //           },
    //           {
    //             fieldName: "tr_credit_amount",
    //             label: "Transaction Credit",
    //           },
    //           {
    //             fieldName: "cb_amount",
    //             label: "Closing Balance",
    //           },
    //         ]}
    //         isFilterable={true}
    //         rowUniqueId="label"
    //         expandAll={layout.expand}
    //         pagination={false}
    //       />
    //     </div>
    //   </div>
    // </>
  );
  // }
  // return null;
}
