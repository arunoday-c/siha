import amqp, { credentials } from "amqplib";
import dotenv from "dotenv";
dotenv.config();
const { RABBIT_MQ_SERVER, RABBIT_MQ_USER, RABBIT_MQ_PASSWORD } = process.env;
const connection = amqp.connect(`amqp://${RABBIT_MQ_SERVER}`, {
  credentials: credentials.plain(
    RABBIT_MQ_USER ?? "",
    RABBIT_MQ_PASSWORD ?? ""
  ),
});

export default connection;
