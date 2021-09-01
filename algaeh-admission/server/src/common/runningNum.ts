import { Model, BuildOptions, Transaction } from "sequelize";
type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Model;
};
function padString(
  targetString: string,
  new_number: string,
  length: number,
  padCharacter: string
) {
  targetString = targetString + new_number.padStart(length, padCharacter);
  return targetString;
}

export class RunningNumber<MdModel extends ModelStatic, T extends Transaction> {
  model?: MdModel;
  transaction?: T;
  async generateNumber(numGenCode: string): Promise<string | Error> {
    const result = await this.model
      ?.findOne({
        where: {
          numgen_codes: numGenCode,
          record_status: "A",
        },
        attributes: [
          "numgen_code",
          "prefix",
          "intermediate_series",
          "postfix",
          "length",
          "numgen_seperator",
          "intermediate_series_req",
          "preceding_zeros_req",
          "reset_slno_on_year_change",
        ],
        lock: this.transaction?.LOCK.UPDATE,
        raw: true,
        transaction: this.transaction,
      })
      .catch((error) => {
        throw error;
      });
    if (result) {
      const current_year = new Date().getFullYear().toString().substr(-2);

      // let str = "";
      let new_number: number = 0;
      let complete_number = "";
      let {
        prefix,
        intermediate_series,
        postfix,
        length,
        increment_by,
        numgen_seperator,
        preceding_zeros_req,
        intermediate_series_req,
        reset_slno_on_year_change,
      }: any = result;
      if (intermediate_series_req === "Y") {
        if (current_year > intermediate_series) {
          intermediate_series = current_year;
          // str = ", intermediate_series =" + current_year;
          if (reset_slno_on_year_change == "Y") {
            postfix = 0;
          }
        }
        new_number = parseInt(postfix) + parseInt(increment_by);
        complete_number =
          prefix + numgen_seperator + current_year + numgen_seperator;
        if (preceding_zeros_req === "Y") {
          complete_number = padString(
            complete_number,
            String(new_number),
            parseInt(length) - complete_number.length,
            "0"
          );
        } else {
          complete_number += new_number;
        }
      } else {
        new_number = parseInt(postfix) + parseInt(increment_by);
        if (preceding_zeros_req == "Y") {
          complete_number = prefix + numgen_seperator;

          complete_number = padString(
            complete_number,
            String(new_number),
            parseInt(length) - complete_number.length,
            "0"
          );
        } else {
          complete_number = prefix + numgen_seperator + new_number;
        }
      }
      await this.model?.update(
        {
          pervious_num: complete_number,
          postfix: new_number,
          intermediate_series: current_year,
        },
        {
          where: {
            numgen_codes: numGenCode,
            record_status: "A",
          },
          transaction: this.transaction,
        }
      );
      return complete_number;
    } else {
      return new Error(`Record not found for Num Gen Code ${numGenCode}`);
    }
  }
}
