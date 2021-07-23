import { channelWrapper, EXCHANGE_NAME } from "./connection";
import { report } from "../models/bulkReportProcess";
async function consumerPCR() {
  try {
    const queueName = "UPDATE_BULK_PATIENT_SERVRPT";
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
          await report(data).catch((e) => {
            setTimeout(async () => {
              //@ts-ignore
              await channel.nack(message, false, true);
              console.error(
                `Exchange/Queue :${EXCHANGE_NAME} / ${queueName}, At :${new Date().toLocaleString()} 
              ==>`,
                data
              );
            }, 20000);
          });
          setTimeout(async () => {
            //@ts-ignore
            await channel.ack(message);
          }, 20000);
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

export default consumerPCR;
