import amqp, { credentials } from "amqplib";
import keys from "algaeh-keys";
const rabbitMQ = keys.default.rabbitMQ;
const { RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD } = rabbitMQ;
const connection = amqp.connect(`amqp://${RABBIT_MQ_SERVER}`, {
  credentials: credentials.plain(
    RABBIT_MQ_USER ?? "",
    RABBIT_MQ_PASSWORD ?? ""
  ),
});

export default connection;
