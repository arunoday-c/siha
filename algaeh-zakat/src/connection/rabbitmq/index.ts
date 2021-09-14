import amqp from "amqp-connection-manager";
import { credentials } from "amqplib";
import path from "path";
// import connection from "./index";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(process.cwd(), "../", ".env_local") });
}
const { RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD } = process.env;
console.log(
  "RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD",
  RABBIT_MQ_SERVER,
  RABBIT_MQ_USER,
  RABBIT_MQ_PASSWORD
);
const connection = amqp.connect([`${RABBIT_MQ_SERVER}`], {
  connectionOptions: {
    credentials: credentials.plain(
      `${RABBIT_MQ_USER}`,
      `${RABBIT_MQ_PASSWORD}`
    ),
  },
});
connection.on("connect", () => {
  console.log("Connected successfully to RabbitMq server");
});
connection.on("disconnect", (error) => {
  console.error("Error===>", error);
});
export default connection;
