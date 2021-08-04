import { channelWrapper, EXCHANGE_NAME } from "./connection";
import bulkUpdatePortalSetup from "../models/bulkUpdatePortalSetup";
async function corporateMaster(queueName) {
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
          await bulkUpdatePortalSetup(data)
            .then(() => {
              setTimeout(async () => {
                //@ts-ignore
                await channel.ack(message);
              }, 20000);
            })
            .catch((e) => {
              setTimeout(async () => {
                //@ts-ignore
                await channel.nack(message, false, true);
                console.error(
                  `Exchange/Queue :${EXCHANGE_NAME} / ${queueName},@:${new Date().toLocaleString()} 
              ==>`,
                  data
                );
              }, 20000);
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

export default corporateMaster;
