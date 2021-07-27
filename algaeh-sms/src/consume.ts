// import amqpConnection from "./rabbitMQ";
import { sendSMS } from "./send";
import { Channel } from "amqplib";
// let channel: Channel | undefined = undefined;
// import { EXCHANGE_NAME, channelWrapper } from "./";
import { EXCHANGE_NAME, channelWrapper } from "./rabbitMQ";
import { publisher } from "./publisher";
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
          sendSMS(data)
            .then(async (result) => {
              let _MsgId;
              if (result.MessageData) {
                if (
                  Array.isArray(result.MessageData) &&
                  result.MessageData.length > 0
                ) {
                  const { MessageParts } = result.MessageData[0];
                  if (Array.isArray(MessageParts) && MessageParts.length > 0) {
                    const { MsgId } = MessageParts[0];
                    _MsgId = MsgId;
                  }
                }
              }
              await publisher("SMS_STATUS", {
                hims_f_lab_order_id: result.hims_f_lab_order_id,
                message_id: _MsgId,
                code: result.ErrorCode,
                message: result.ErrorMessage,
              });
            })
            .finally(() => {
              //@ts-ignore
              channel.ack(message);
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
consumeSMS("SMS");
