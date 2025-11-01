import { uuidv4 } from "lib0/random";

export function generateUuid62(): string {
  const uuid = uuidv4();
  return encodeToBase62(uuid);
}

function encodeToBase62(uuid: string): string {
  const base62 =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const uuid62 = uuid
    .split("")
    .map((char) => {
      const index = base62.indexOf(char);
      return index === -1 ? char : index.toString(62);
    })
    .join("");
  return uuid62;
}
