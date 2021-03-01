import algaehMysql from "algaeh-mysql";
import { CronJob } from "cron";
import moment from "moment";
import { createNotification } from "./utils";
// const { CronJob } = cron;
export default function generalNotification(io) {
  var job = new CronJob(
    "5 * * * * *",
    async function () {
      const _mysql = new algaehMysql();

      try {
        // io.to("21").emit("notification", "Hello this is an message");
        // console.log("Here inside job", io.sockets.adapter.rooms);
        const result = await _mysql.executeQuery({
          query: `SELECT collection_id,primary_user_ids,primary_message,other_message,other_user_ids,title,record_inactive,created_at,module_type FROM Notification.notification_collection;`,
        });
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            const {
              collection_id,
              primary_user_ids,
              primary_message,
              other_message,
              other_user_ids,
              title,
              created_at,
              record_inactive,
              module_type,
            } = result[i];
            if (primary_user_ids && primary_message) {
              const pIdsList = primary_user_ids.split(",");
              for (let p = 0; p < pIdsList.length; p++) {
                const createForPIds = await createNotification({
                  message: primary_message,
                  module: module_type ?? "general",
                  user_id: pIdsList[p],
                  title: title,
                  isSeen: false,
                });
                io.to(`${pIdsList[p]}`).emit("notification", createForPIds);
              }
              //   io.sockets.broadcast.emit("notification", createForPIds);
            }

            if (other_user_ids && other_message) {
              const pIdsList = other_user_ids.split(",");

              for (let p = 0; p < pIdsList.length; p++) {
                const createForPIds = await createNotification({
                  message: other_message,
                  user_id: pIdsList[p],
                  module: module_type ?? "general",
                  title: title,
                  isSeen: false,
                });
                io.to(`${pIdsList[p]}`).emit("notification", createForPIds);
              }
              //   io.sockets.broadcast.emit("notification", createForPIds);
            }
            await _mysql.executeQuery({
              query: `DELETE FROM Notification.notification_collection  where collection_id=?;
              INSERT INTO Notification.archive_collection(primary_user_ids,primary_message,other_message,other_user_ids,created_at,
                updated_at,title,record_inactive,module_type) VALUE(?,?,?,?,?,?,?,?,?) ;`,
              values: [
                collection_id,
                primary_user_ids,
                primary_message,
                other_message,
                other_user_ids,
                created_at,
                new Date(),
                title,
                record_inactive,
                module_type,
              ],
              printQuery: true,
            });
            _mysql.releaseConnection();
          }
        }
      } catch (error) {
        console.error("<<Error inside General>>", error);
      }
    },
    null,
    true,
    "UTC"
  );
  job.start();
  //   console.log(
  //     job.running,
  //     job.nextDate().format("hh:mm a, dd/mm/yyyy"),
  //     "info"
  //   );
}
