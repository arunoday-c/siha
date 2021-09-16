// import _ from "lodash";
import finance_day_end_header from "../model/finance_day_end_header";
import finance_day_end_sub_detail from "../model/finance_day_end_sub_detail";
import finance_account_child from "../model/finance_account_child";
import { publisher } from "../rabbitMQ";
export async function getFromDayEnd() {
  try {
    const result = await finance_day_end_header
      .findAll({
        where: {
          send_to_third_party: 0,
        },
        attributes: [
          "finance_day_end_header_id",
          "transaction_date",
          "amount",
          "voucher_type",
          "document_number",
          "invoice_no",
          "due_date",
          "cancel_transaction",
          "narration",
        ],
        include: [
          {
            model: finance_day_end_sub_detail,
            as: "day_end_details",
            // attributes: ["child_name", "ledger_code"],
            include: [
              {
                as: "child_account",
                model: finance_account_child,
                attributes: ["child_name", "ledger_code"],
              },
            ],
          },
        ],
        nest: true,
        // raw: true,
      })
      .catch((error) => {
        throw error;
      });
    const list = result.map((item: any) => {
      const {
        finance_day_end_header_id,
        transaction_date,
        amount,
        voucher_type,
        document_number,
        invoice_no,
        due_date,
        cancel_transaction,
        narration,
        day_end_details,
      } = item;
      return {
        finance_day_end_header_id,
        transaction_date,
        amount,
        voucher_type,
        document_number,
        invoice_no,
        due_date,
        cancel_transaction,
        narration,
        day_end_details: day_end_details.map((detail: any) => {
          const {
            month,
            year,
            payment_date,
            child_account,
            debit_amount,
            payment_type,
            credit_amount,
            reverted,
          } = detail;
          return {
            month,
            year,
            payment_date,
            debit_amount,
            payment_type,
            reverted,
            credit_amount,
            account_name: child_account.child_name,
            ledger_code: child_account.ledger_code,
          };
        }),
      };
    });
    // console.log("result===>", JSON.stringify(list));
    await publisher("ALGAEH_TO_MICROSOFT365D", list);
  } catch (error) {
    console.error("Error===>", error);
  }
}
