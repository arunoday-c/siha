import fs from "fs";
import path from "path";
import hbs from "handlebars";
import axios from "axios";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();
import { updateLabSMSStatus } from "./db/lab_sms";

const {
  SMS_GATEWAY_SERVER,
  SMS_GATEWAY_USER,
  SMS_GATEWAY_PASSWORD,
  SMS_GATEWAY_SID,
} = process.env;
export async function sendSMS(data) {
  try {
    const { template, contact_no, processed_by, sid } = data;
    const filePath = path.resolve(
      process.cwd(),
      "templates",
      `${template}.hbs`
    );
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, "utf-8");
      const result = await hbs.compile(html)(data);

      const generateUrl = SMS_GATEWAY_SERVER?.replace(
        /\$user/gi,
        `${SMS_GATEWAY_USER}`
      )
        .replace(/\$password/gi, `${SMS_GATEWAY_PASSWORD}`)
        .replace(/\$sid/gi, `${sid ? sid : SMS_GATEWAY_SID}`)
        .replace(/\$mobileNo/gi, contact_no)
        .replace(/\$msg/gi, result);
      //   SMS_GATEWAY_SERVER ?? "", {
      //   params: {
      //     user: SMS_GATEWAY_USER,
      //     password: SMS_GATEWAY_PASSWORD,
      //     sid: SMS_GATEWAY_SID,
      //     msisdn: contact_no,
      //     msg: result,
      //     fl: 0,
      //   },
      // }
      const response = await axios
        .get(encodeURI(generateUrl ?? ""))
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
      return { ...data, ...resData };
    } else {
      throw new Error("There is no TEMPLATE exists by name " + template);
    }
  } catch (e) {
    console.error(`Error in Send SMS @${new Date().toLocaleString()}===>`, e);
    throw e;
  }
}
