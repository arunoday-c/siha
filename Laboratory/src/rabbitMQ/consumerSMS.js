import { channelWrapper, EXCHANGE_NAME } from "./connection";
import { updateSMSStatus } from "../models/labSMS";
async function consumerSMSStatus(queueName) {
  try {
    await channelWrapper.addSetup(async (channel) => {
      await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      await channel.prefetch(1);
      await channel.bindQueue(queueName, EXCHANGE_NAME, queueName);
      await channel.consume(
        queueName,
        async (message) => {
          const data = JSON.parse(message?.content.toString() ?? "");

          //Here it is data.
          await updateSMSStatus(data)
            .then(() => {
              //@ts-ignore
              channel.ack(message);
            })
            .catch(() => {
              //@ts-ignore
              channel.nack(message, false, true);
            });
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
}

export default consumerSMSStatus;
