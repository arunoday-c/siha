import amqp, { credentials } from "amqplib";
import dotenv from "dotenv";
// import keys from "algaeh-keys";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const { RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD } = process.env;
console.log(
  "RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD",
  RABBIT_MQ_SERVER,
  RABBIT_MQ_USER,
  RABBIT_MQ_PASSWORD
);
const connection = amqp.connect(`${RABBIT_MQ_SERVER}`, {
  credentials: credentials.plain(`${RABBIT_MQ_USER}`, `${RABBIT_MQ_PASSWORD}`),
});

export default connection;
