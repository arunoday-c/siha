import amqpConnection from "./connection";
export async function publisher(queueName, data) {
  try {
    const connection = await amqpConnection;
    const channel = await connection.createChannel();
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
