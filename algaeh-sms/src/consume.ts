import amqpConnection from "./rabbitMQ";
import { sendSMS } from "./send";
const consumeSMS = async (queueName) => {
  try {
    const connection = await amqpConnection;
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);
    channel.consume(queueName, async (message) => {
      const data = JSON.parse(message?.content.toString() ?? "");
      console.log("Message===>", data);
      sendSMS(data);
      channel.ack(message);
    });
  } catch (e) {
    console.error(`Error Consumer ${queueName} ===>`, e);
  }
};
consumeSMS("SMS");
