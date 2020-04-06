import moment from "moment";
import { notifiModel } from "../model";

export function formatTime(time) {
  return moment(time, "HH:mm:ss").format("hh:mm A");
}

export function formatDate(date) {
  const req_date = moment(date, "YYYY-MM-DD");
  if (req_date.isSame(moment(), "day")) {
    return "for today";
  } else {
    return `on ${req_date.format("D MMM")}`;
  }
}

export async function createNotification({ message, user_id, module }) {
  try {
    const notifi = new notifiModel({
      user_id: user_id ? user_id : null,
      module: module ? module : null,
      message,
    });
    const result = await notifi.save();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export function deleteNotification({ id }) {
  return new Promise((resolve, reject) => {
    notifiModel.findByIdAndRemove(id, (err, doc) => {
      if (err) {
        reject(err.message);
      } else {
        console.log(doc, "doc");
        resolve(doc);
      }
    });
  });
}
