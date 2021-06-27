import amqpConnection from "./connection";
let channel = undefined;

export async function publisher(queueName, data) {
  try {
    if (!channel) {
      const connection = await amqpConnection;
      channel = await connection.createChannel();
    }
    // const connection = await amqpConnection;
    // const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {
      durable: true,
      exclusive: false,
      autoDelete: false,
      arguments: null,
    });
    channel.sendToQueue(
      queueName,
      Buffer.from(typeof data === "string" ? data : JSON.stringify(data)),
      { persistent: true }
    );
  } catch (e) {
    throw e;
    // console.error("Error Publisher===>", e);
  }
}
console.log("<======SMS is activated=====>");
