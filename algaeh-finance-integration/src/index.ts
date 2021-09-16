import "./connection/db";
import "./connection/rabbitmq";
import { getFromDayEnd } from "./microsoftD365/services";
getFromDayEnd();
console.log("Connected to integration server");
