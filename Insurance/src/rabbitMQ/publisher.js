// import amqpConnection from "./connection";
// let channel = undefined;
// import { Channel } from "amqplib";
import { channelWrapper, EXCHANGE_NAME } from "./connection";
export async function publisher(queueName, data, exchangeName) {
  try {
    exchangeName = exchangeName ?? EXCHANGE_NAME;

    await channelWrapper.addSetup(async (channel) => {
      await channel.assertQueue(queueName, { durable: true });
      await channel.bindQueue(queueName, exchangeName, queueName);
      return;
    });

    await channelWrapper.publish(exchangeName, queueName, data, {
      contentType: `application/json`,
      persistent: true,
    });
  } catch (e) {
    throw e;
    // console.error("Error Publisher===>", e);
  }
}

console.log("<======Portal sync is activated=====>");
