import connection from "./connectionManager";
const EXCHANGE_NAME = "CORPORATE";
const channelWrapper = connection.createChannel({
  json: true,
  setup: (channel) => channel.assertExchange(EXCHANGE_NAME, "direct"),
  name: "Portal-Publisher",
});
export { connection, EXCHANGE_NAME, channelWrapper };
