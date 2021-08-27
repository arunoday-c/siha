// import amqpConnection from "./connection";
// let channel = undefined;
// import { Channel } from "amqplib";
import { channelWrapper, EXCHANGE_NAME } from "./connection";
export async function publisher(queueName, data) {
  try {
    await channelWrapper.addSetup(async (channel) => {
      await channel.assertQueue(queueName, { durable: true });
      await channel.bindQueue(queueName, EXCHANGE_NAME, queueName);
      return;
    });
    console.log("Iam Here", queueName, EXCHANGE_NAME, data);
    await channelWrapper.publish(EXCHANGE_NAME, queueName, data, {
      contentType: `application/json`,
      persistent: true,
    });
  } catch (e) {
    throw e;
    // console.error("Error Publisher===>", e);
  }
}
console.log("<======SMS is activated=====>");
