// import amqpConnection from "./rabbitMQ";
import { sendSMS } from "./send";
import { Channel } from "amqplib";
// let channel: Channel | undefined = undefined;
// import { EXCHANGE_NAME, channelWrapper } from "./";
import { EXCHANGE_NAME, channelWrapper } from "./rabbitMQ";
const consumeSMS = async (queueName) => {
  try {
    await channelWrapper.addSetup(async (channel: Channel) => {
      await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      await channel.prefetch(1);
      await channel.bindQueue(queueName, EXCHANGE_NAME, queueName);
      await channel.consume(
        queueName,
        async (message) => {
          const data = JSON.parse(message?.content.toString() ?? "");
          sendSMS(data);
          //@ts-ignore
          channel.ack(message);
        },
        { noAck: false }
      );
    });

    // if (!channel) {
    //   const connection = await amqpConnection;
    //   channel = await connection.createChannel();
    // }
    // // const connection = await amqpConnection;
    // // const channel = await connection.createChannel();
    // await channel.assertQueue(queueName, { durable: true });
    // channel.prefetch(1);
    // channel.consume(queueName, async (message) => {
    //   const data = JSON.parse(message?.content.toString() ?? "");

    //   sendSMS(data);
    //   channel.ack(message);
    // });
  } catch (e) {
    console.error(`Error Consumer ${queueName} ===>`, e);
  }
};
consumeSMS("SMS");
