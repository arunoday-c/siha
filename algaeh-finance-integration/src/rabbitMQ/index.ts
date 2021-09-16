import { Channel } from "amqplib";
import connection from "../connection/rabbitmq";
const EXCHANGE_NAME = "ALGAEH";
const channelWrapper = connection.createChannel({
  json: true,
  setup: (channel: Channel) => channel.assertExchange(EXCHANGE_NAME, "direct"),
  name: "Portal-Publisher",
});
export async function publisher(queueName, data) {
  try {
    await channelWrapper.addSetup(async (channel) => {
      await channel.assertQueue(queueName, { durable: true });
      await channel.bindQueue(queueName, EXCHANGE_NAME, queueName);
      return;
    });

    await channelWrapper.publish(EXCHANGE_NAME, queueName, data, {
      contentType: `application/json`,
      persistent: true,
    });
  } catch (e) {
    throw e;
  }
}
