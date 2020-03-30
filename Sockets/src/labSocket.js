import { createNotification } from "./utils";
function labSocket(socket) {
  socket.on("service_ordered", details => {
    const { billdetails } = details;
    const services = billdetails.map(service => service.service_name);
    socket.broadcast.to("lab").emit("service_added", services);
    // socket.broadcast.to("rad").emit("service_added", "New Service is added");
  });
}

export default labSocket;
