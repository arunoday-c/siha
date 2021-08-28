import { notifiModel } from "./model";
import moment, { relativeTimeThreshold } from "moment";
import { formatDate, formatTime } from "./utils";

const apsock = (socket) => {
  socket.on("appointment_created", (patient) => {
    // frontdesk users
    const frontMsg = `Patient ${patient.patient_name} added to ${formatTime(
      patient.appointment_from_time
    )} slot ${formatDate(patient.appointment_date)}`;

    const frontDeskNot = new notifiModel({
      module: "ftdsk",
      message: frontMsg,
      title: "FrontDesk",
    });

    frontDeskNot.save().then((doc) => {
      // console.log("saved---refresh_appointment");
      socket.emit("reload_appointment", patient);
      socket.broadcast
        .to("ftdsk")
        .emit("refresh_appointment", { msg: doc, patient });
    });

    // doctor
    const time = formatTime(patient.appointment_from_time);
    const date = formatDate(patient.appointment_date);
    const docMsg = `${patient.patient_name} booked an appointment on ${time}
    ${date}`;
    const docNoti = new notifiModel({
      user_id: patient.provider_id,
      message: docMsg,
      title: "FrontDesk",
      isSeen: false,
    });
    docNoti.save().then((doc) => {
      // console.log("saved---patient_added", doc);
      socket.broadcast.to(`${patient.provider_id}`).emit("patient_added", doc);
    });
  });
  socket.on("patient_checked", (patient) => {
    const docMsg = `${
      patient.full_name
    } checked in for consultation on ${moment(patient.visit_date).format(
      "hh:mm A"
    )}`;

    const docNoti = new notifiModel({
      user_id: patient.provider_id,
      message: docMsg,
      title: "Front Desk",
      isSeen: false,
    });
    docNoti
      .save()
      .then((doc) => {
        // console.log("saved----Here IM--patient_added", doc);
        socket.broadcast
          .to(`${patient.provider_id}`)
          .emit("patient_added", doc);
      })
      .catch((error) => {
        console.log("Error ====>", error);
      });
  });
  socket.on("request_insurance_correction", ({ type, rowData }) => {
    const docMsg = `${rowData.patient_name} : Request For Insurance Correction`;

    const docNoti = new notifiModel({
      user_id: rowData.doctor_id,
      message: docMsg,
      title: type,
      isSeen: false,
      savedData: [rowData],
      pageToRedirect: "/InsuranceCorrectionList",
    });
    docNoti
      .save()
      .then((doc) => {
        socket.broadcast.to(`${rowData.algaeh_d_app_user_id}`);
        // .emit("req_correction_insurance", {
        //   dataprops: dataprops,
        //   dataprops: dataprops,
        // });
      })
      .catch((error) => {
        console.log("Error ====>", error);
      });
  });
  socket.on("corrected_insurance_notify", ({ rowData }) => {
    const docMsg = `${rowData.patient_name} : ${rowData.invoice_number}`;

    const docNoti = new notifiModel({
      user_id: rowData.requested_by,
      message: docMsg,
      title: "RCM workBench",
      isSeen: false,
      // savedData: [rowData],
      // pageToRedirect: "/InsuranceCorrectionList",
    });
    docNoti
      .save()
      .then((doc) => {
        socket.broadcast.to(`${rowData.requested_by}`);
        // .emit("req_correction_insurance", {
        //   dataprops: dataprops,
        //   dataprops: dataprops,
        // });
      })
      .catch((error) => {
        console.log("Error ====>", error);
      });
  });

  socket.on("opBill_cancel", ({ bill_date, billdetails }) => {
    const labRecord = billdetails.filter((f) => f.service_type === "Lab");
    if (labRecord.length > 0) {
      socket.broadcast.emit("reload_lab_result_entry", {
        bill_date: bill_date,
        // service_type: service_type,
      });
    } else if (labRecord.length != billdetails.length) {
      socket.broadcast.emit("reload_radiology_entry", {
        bill_date: bill_date,
      });
    }
    // billdetails.forEach((element) => {
    //   if (element.service_type === "Lab") {
    //     socket.broadcast.emit("reload_lab_result_entry", {
    //       bill_date: bill_date,
    //       // service_type: service_type,
    //     });
    //   } else {
    //     socket.broadcast.emit("reload_radiology_entry", {
    //       bill_date: bill_date,
    //     });
    //   }
    // });
  });

  socket.on("encounter_dash", (patient) => {
    console.log("iamhererereererere");
    socket.broadcast.emit("reload_encounter_dash", {
      ...patient,
    });
  });
  socket.on("opBill_add", ({ bill_date, billdetails }) => {
    // console.log("billdetails", billdetails);
    const labRecord = billdetails.filter((f) => f.service_type === "Lab");
    const packageRecord = billdetails.filter(
      (f) => f.service_type === "Package"
    );

    if (packageRecord.length > 0) {
      console.log("packageRecord", packageRecord);
      socket.broadcast.emit("reload_specimen_collection", {
        bill_date: bill_date,
      });
      // socket.broadcast.emit("reload_radiology_entry", {
      //   bill_date: bill_date,
      // });
    } else if (labRecord.length > 0) {
      socket.broadcast.emit("reload_specimen_collection", {
        bill_date: bill_date,
        // service_type: service_type,
      });
    } else if (labRecord.length != billdetails.length) {
      socket.broadcast.emit("reload_radiology_entry", {
        bill_date: bill_date,
      });
    }
    // billdetails.forEach((element) => {
    //   if (element.service_type === "Lab") {
    //     socket.broadcast.emit("reload_specimen_collection", {
    //       bill_date: bill_date,
    //       // service_type: service_type,
    //     });
    //   } else {
    //     socket.broadcast.emit("reload_radiology_entry", {
    //       bill_date: bill_date,
    //     });
    //   }
    //   return;
    // });
  });
  socket.on("specimen_acknowledge", ({ collected_date }) => {
    // if (element.service_type === "Lab") {
    socket.broadcast.emit("reload_specimen_acknowledge", {
      bill_date: collected_date,
      // service_type: service_type,
    });
    // socket.broadcast.emit("reload_specimen_acknowledge", {
    //   collected_date: collected_date,
    //   // service_type: service_type,
    // });
    // }
  });
  socket.on("result_entry", ({ collected_date }) => {
    // if (element.service_type === "Lab") {
    socket.broadcast.emit("reload_result_entry", {
      bill_date: collected_date,
      // service_type: service_type,
    });
    // }
  });
  // specimen_collection_reload
};
// socket.on("appointment_created_updated", ({ collected_date }) => {
//   // if (element.service_type === "Lab") {
//   socket.broadcast.emit("reload_specimen_acknowledge", {
//     collected_date: collected_date,
//     // service_type: service_type,
//   });
//   // }
// });
export default apsock;
