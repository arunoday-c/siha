import { Channel } from "amqplib";
import amqpConnection from "./rabbitMQ";
import { sendSMS } from "./send";
let channel: Channel | undefined = undefined;
const consumeSMS = async (queueName) => {
  try {
    if (!channel) {
      const connection = await amqpConnection;
      channel = await connection.createChannel();
    }
    // const connection = await amqpConnection;
    // const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);
    channel.consume(queueName, async (message) => {
      const data = JSON.parse(message?.content.toString() ?? "");

      sendSMS(data);
      channel.ack(message);
    });
  } catch (e) {
    console.error(`Error Consumer ${queueName} ===>`, e);
  }
};
consumeSMS("SMS");
