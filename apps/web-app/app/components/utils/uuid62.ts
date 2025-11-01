var BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var bs62 = require("base-x")(BASE62);
import { v4 as uuidv4 } from "uuid";

export default function uuid62(): string {
  const uuid = uuidv4();
  uuid.replace(/-/g, "");
  const bytes = Buffer.from(uuid, "hex");
  return bs62.encode(bytes);
}
