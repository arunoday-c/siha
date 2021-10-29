//@ts-ignore
import { Channel } from "amqplib";
import axios from "axios";

import { EXCHANGE_NAME, channelWrapper } from "../connections/rabbitMq/channel";

const consume = async (queueName: string) => {
  try {
    await channelWrapper.addSetup(async (channel: Channel) => {
      await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      await channel.prefetch(1);
      await channel.bindQueue(queueName, EXCHANGE_NAME, queueName);
      await channel.consume(
        queueName,
        async (message: any) => {
          let headers = undefined;
          if (message) {
            headers = message?.properties?.headers;
          }
          const data = JSON.parse(message?.content.toString() ?? "");

          getReport(data, headers, async (isError: boolean) => {
            if (isError === true) {
              await channel.ack(message);
            } else {
              //@ts-ignore
              await channel.nack(message, false, true);
            }
          });
        },
        { noAck: false }
      );
    });
  } catch (e) {
    console.error(
      `Error Consumer ${queueName} @ ${new Date().toLocaleString()}===>`,
      e
    );
  }
};

export default consume;
export async function getReport(data: any, headers: any, cb: Function) {
  try {
    if (headers["apiKey"]) {
      const response = await axios({
        url: `http://localhost:3018/api/v1/report`,
        params: data,
        headers: {
          "x-api-key": headers["apiKey"],
          "x-give-access": "algaeh",
        },
      })
        .then(() => {
          cb(true);
        })
        .catch((error) => {
          console.error("Error==========>", error);
          cb(false);
          // throw error.response;
        });
      console.log("response.data====>", response);
      // return response;
    } else {
      throw new Error("Authentication issue request can not process");
    }
  } catch (e) {
    throw e;
  }
}
