import { channelWrapper, BULK_VERIFY } from "./connection";
const consumer = async (queueName) => {
  try {
    await channelWrapper.addSetup(async (channel) => {
      await channel.assertExchange(BULK_VERIFY, "direct", { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      await channel.prefetch(1);
      await channel.bindQueue(queueName, BULK_VERIFY, queueName);
      await channel.consume(
        queueName,
        async (message) => {
          const data = JSON.parse(message?.content.toString() ?? "");
          //Here it is data.

          //@ts-ignore
          channel.ack(message);
        },
        { noAck: false }
      );
    });
  } catch (e) {
    console.error(
      `Error Consumer ${queueName} @${new Date().toLocaleString()} ===>`,
      e
    );
  }
};
