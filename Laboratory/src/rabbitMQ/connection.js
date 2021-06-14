import amqp, { credentials } from "amqplib";
import keys from "algaeh-keys";
const rabbitMQ =
  process.env.NODE_ENV === "development" ? keys.default.rabbitMQ : process.env;
const { RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD } = rabbitMQ;
console.log(
  "RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD",
  RABBIT_MQ_SERVER,
  RABBIT_MQ_USER,
  RABBIT_MQ_PASSWORD
);
const connection = amqp.connect(`amqp://${RABBIT_MQ_SERVER}`, {
  credentials: credentials.plain(
    RABBIT_MQ_USER ?? "",
    RABBIT_MQ_PASSWORD ?? ""
  ),
});

export default connection;
