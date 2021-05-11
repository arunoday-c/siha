import mongoose, { Schema } from "mongoose";
import moment from "moment";
const notificationModel = mongoose.model(
  "notification",
  new Schema(
    {
      user_id: Number,
      module: String,
      message: String,
      title: String,
      pageToRedirect: String,
      savedData: Array,
      fromUserId: Number,
      fromModule: String,
      isSeen: { type: Boolean, default: false },
    },
    {
      timestamps: true,
    }
  )
);
export function deleteNotification(req, res, next) {
  const { id, user_id } = req.body;
  try {
    notificationModel.findByIdAndRemove(id.trim(), (err) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({
          success: true,
          message: "Deleted Successfully",
        });
      }
    });
  } catch (e) {
    next(e);
  }
}
export function seenNotification(req, res, next) {
  const { _id } = req.body;
  try {
    notificationModel
      .findByIdAndUpdate(_id, {
        $set: { isSeen: true },
      })
      .then((doc) => {
        res.status(200).json({
          success: true,
          message: "Successfully done",
        });
      })
      .catch((e) => {
        next(e);
      });
    // notificationModel.findByIdAndUpdate(id.trim(), (err) => {
    //   if (err) {
    //     next(err);
    //   } else {
    //     res.status(200).json({
    //       success: true,
    //       message: "Deleted Successfully",
    //     });
    //   }
    // });
  } catch (e) {
    next(e);
  }
}
export function getAllNotifications(req, res, next) {
  try {
    const { user_id, require_total_count, perPage, page, todays } = req.query;

    const _pageSize = parseInt(perPage);
    const _page = parseInt(page);
    new Promise((resolve, reject) => {
      // if (require_total_count === "true") {
      let todayNotifications = {};
      if (todays === "true") {
        todayNotifications = {
          createdAt: {
            $gt: moment().startOf("day"),
            $lt: moment().endOf("day"),
          },
        };
      }
      notificationModel.countDocuments(
        {
          user_id,
          ...todayNotifications,
        },
        (error, count) => {
          if (error) {
            reject(error);
          } else {
            resolve(count);
          }
        }
      );
      // } else {
      //   resolve(0);
      // }
    })
      .then((result) => {
        let todayNotifications = {};
        if (todays === "true") {
          todayNotifications = {
            createdAt: {
              $gt: moment().startOf("day"),
              $lt: moment().endOf("day"),
            },
          };
        }

        notificationModel
          .find({ user_id, ...todayNotifications })
          .select([
            "_id",
            "title",
            "createdAt",
            "message",
            "savedData",
            "pageToRedirect",
          ])
          .limit(_pageSize)
          .skip(_pageSize * Math.max(0, _page - 1))
          .sort({ createdAt: "desc" })
          .exec((error, details) => {
            if (error) {
              next(error);
            } else {
              let total_records = {};
              if (require_total_count === "true") {
                total_records = { total_records: result };
              }

              res.status(200).json({
                success: true,
                records: details,
                ...total_records,
              });
            }
          });
      })
      .catch((error) => {
        next(error);
      });
  } catch (e) {
    next(e);
  }
}
