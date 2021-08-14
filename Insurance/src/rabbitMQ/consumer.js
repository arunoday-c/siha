import { channelWrapper, EXCHANGE_NAME } from "./connection";
import {
  corporateServiceMasterSync,
  getListFromPortal,
} from "../models/bulkUpdatePortalSetup";

const CORPORATE_MASTER_ACK = "CORPORATE_MASTER_ACK";
const CORPORATE_PACKAGE_LIST = "CORPORATE_PACKAGE_LIST";
async function corporateServices(queueName, exchangeName) {
  try {
    exchangeName = exchangeName ?? EXCHANGE_NAME;
    await channelWrapper.addSetup(async (channel) => {
      await channel.assertExchange(exchangeName, "direct", { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      await channel.prefetch(1);
      await channel.bindQueue(queueName, exchangeName, queueName);
      await channel.consume(
        queueName,
        async (message) => {
          const data = JSON.parse(message?.content.toString() ?? "");
          //Here it is data.
          await pushToLocal(data, queueName)
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
                  `Exchange/Queue :${exchangeName} / ${queueName},@:${new Date().toLocaleString()} 
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

// export default corporateMaster;

async function pushToLocal(data, queue) {
  try {
    switch (queue) {
      case "CORPORATE_MASTER_ACK":
        return corporateServiceMasterSync(data);
        break;
      case "CORPORATE_PACKAGE_LIST":
        return getListFromPortal(data);
        break;
    }
  } catch (e) {
    throw e;
  }
}

//For Master ACK.
corporateServices(CORPORATE_MASTER_ACK);
//For Package List.
corporateServices(CORPORATE_PACKAGE_LIST);
