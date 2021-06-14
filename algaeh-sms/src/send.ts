import fs from "fs";
import path from "path";
import hbs from "handlebars";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { updateLabSMSStatus } from "./db/lab_sms";

const {
  SMS_GATEWAY_SERVER,
  SMS_GATEWAY_USER,
  SMS_GATEWAY_PASSWORD,
  SMS_GATEWAY_SID,
} = process.env;
export async function sendSMS(data) {
  try {
    const { template, contact_no, processed_by } = data;
    const filePath = path.resolve(
      process.cwd(),
      "templates",
      `${template}.hbs`
    );
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, "utf-8");
      const result = await hbs.compile(html)(data);
      console.log(
        "SMS_GATEWAY_SERVER,SMS_GATEWAY_USER,SMS_GATEWAY_PASSWORD,SMS_GATEWAY_SID,contact_no,message ",
        SMS_GATEWAY_SERVER,
        SMS_GATEWAY_USER,
        SMS_GATEWAY_PASSWORD,
        SMS_GATEWAY_SID,
        contact_no,
        result
      );
      const response = await axios
        .get(SMS_GATEWAY_SERVER ?? "", {
          params: {
            user: SMS_GATEWAY_USER,
            password: SMS_GATEWAY_PASSWORD,
            sid: SMS_GATEWAY_SID,
            msisdn: contact_no,
            msg: result,
            fl: 0,
          },
        })
        .catch((error) => {
          throw error;
        });
      let res = response.data;
      console.error("Raw sms response===>", res);
      let resData = {};
      try {
        if (typeof res === "string") resData = JSON.parse(res);
        else {
          resData = res;
        }
      } catch (e) {
        let rData = res.split('{"ErrorCode"');
        resData = JSON.parse(`{"ErrorCode"${rData[1]}`);
      }

      await updateLabSMSStatus({
        ...resData,
        message: result,
        number_contact: contact_no,
        error_message: resData["ErrorMessage"],
        delivery_status: parseInt(resData["ErrorCode"], 10) > 0 ? 1 : 0,
        processed_by,
      });
    } else {
      throw new Error("There is no TEMPLATE exists by name " + template);
    }
  } catch (e) {
    console.error("Error====>", e);
  }
}
