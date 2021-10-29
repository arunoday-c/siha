//@ts-ignore
import { Channel } from "amqplib";
import connection from ".";
const EXCHANGE_NAME = "REQUEST_DOWNLOAD";
const channelWrapper = connection.createChannel({
  json: true,
  setup: (channel: Channel) => channel.assertExchange(EXCHANGE_NAME, "direct"),
  name: "REQUEST_DOWNLOAD",
});

export { connection, EXCHANGE_NAME, channelWrapper };
