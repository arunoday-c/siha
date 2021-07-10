// import amqp, { credentials } from "amqplib";
// import dotenv from "dotenv";
// if (process.env.NODE_ENV !== "production") dotenv.config();
// //Link: amqps://b-cd037f42-e886-4406-8a95-b3eb8ab24e47.mq.me-south-1.amazonaws.com:5671
// // User: 1touchlabotp1
// // Pass: x1a&QrV2@rAyOaB*17D
// //`amqp://${RABBIT_MQ_SERVER}`
// const { RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD } = process.env;
// const connection = amqp.connect(`${RABBIT_MQ_SERVER}`, {
//   credentials: credentials.plain(`${RABBIT_MQ_USER}`, `${RABBIT_MQ_PASSWORD}`),
// });

// export default connection;

// import amqp from "amqp-connection-manager";
// import { credentials } from "amqplib";
// // import connection from "./index";
// import dotenv from "dotenv";
// if (process.env.NODE_ENV !== "production") {
//   dotenv.config();
// }
// const { RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD } = process.env;
// console.log(
//   "RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD",
//   RABBIT_MQ_SERVER,
//   RABBIT_MQ_USER,
//   RABBIT_MQ_PASSWORD
// );
// const connection = amqp.connect([`${RABBIT_MQ_SERVER}`], {
//   connectionOptions: {
//     credentials: credentials.plain(
//       `${RABBIT_MQ_USER}`,
//       `${RABBIT_MQ_PASSWORD}`
//     ),
//   },
// });
// connection.on("connect", () => {
//   console.log("Connected successfully to RabbitMq server");
// });
// connection.on("disconnect", (error) => {
//   console.error("Error===>", error);
// });

// export default connection;
import { Channel } from "amqplib";
import connection from "./connectionManager";
const EXCHANGE_NAME = "PATIENT";
const channelWrapper = connection.createChannel({
  json: true,
  setup: (channel: Channel) => channel.assertExchange(EXCHANGE_NAME, "direct"),
  name: "Portal-Publisher",
});

export { connection, EXCHANGE_NAME, channelWrapper };
