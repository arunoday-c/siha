import { channelWrapper, EXCHANGE_NAME } from "./rabbitMQ";
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
    // console.error("Error Publisher===>", e);
  }
}
