import { createNotification } from "./utils";
function labSocket(socket) {
  socket.on("service_ordered", (details) => {
    const { billdetails, bill_date } = details;
    const services = billdetails.map((service) => service.service_name);
    socket.broadcast.to("lab").emit("service_added", services);
    // socket.broadcast.to("rad").emit("service_added", "New Service is added");
    const labRecord = billdetails.filter((f) => f.service_type === "Lab");
    if (labRecord.length > 0) {
      socket.broadcast.emit("reload_specimen_collection", {
        bill_date: bill_date,
        // service_type: service_type,
      });
    } else if (labRecord.length != billdetails.length) {
      socket.broadcast.emit("reload_radiology_entry", {
        bill_date: bill_date,
      });
    }
  });
}

export default labSocket;
