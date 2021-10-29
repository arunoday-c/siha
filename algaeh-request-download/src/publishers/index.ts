import { EXCHANGE_NAME, channelWrapper } from "../connections/rabbitMq/channel";
//@ts-ignore
import { Channel } from "amqplib";
const publisher = async (queueName: string, data: any, headers: any) => {
  try {
    await channelWrapper.addSetup(async (channel: Channel) => {
      await channel.assertQueue(queueName, { durable: true });
      await channel.bindQueue(queueName, EXCHANGE_NAME, queueName);
      return;
    });
    let _headers = {};
    if (headers) {
      _headers = { headers: headers };
    }
    await channelWrapper.publish(EXCHANGE_NAME, queueName, data, {
      //@ts-ignore
      contentType: `application/json`,
      persistent: true,
      ..._headers,
    });
  } catch (e) {
    console.error("Error Publisher===>", e);
    throw e;
  }
};
// export { channelWrapper };
export default publisher;
