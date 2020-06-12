import algaehMysql from "algaeh-mysql";
import cron from "cron";
import { createNotification } from "./utils";
const { CronJob } = cron;

export default function pharmacy(io) {
  var job = new CronJob(
    "0 11 * * *",
    async function () {
      try {
        const _mysql = new algaehMysql();
        const result = await _mysql.executeQuery({
          query: `select count(*) from hims_d_pharmacy_notification_expiry;`,
        });
        _mysql.releaseConnection();
        const msg = `You have ${result[0]["count(*)"]} items that are going to expiry soon.`;
        const create = await createNotification({
          message: msg,
          module: "phcy",
          title: "Pharmacy",
        });
        io.sockets.to("phcy").emit("/pharmacy/expired", create);
      } catch (error) {
        console.log(error);
      }
    },
    null,
    true,
    "Asia/Kolkata"
  );
  job.start();
  console.log(job.running, job.nextDate().format(), "info");
}
