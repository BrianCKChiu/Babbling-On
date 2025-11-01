const isDev = true;

export const API_URL = isDev ? "http://localhost:8080/" : "";
export class HttpHandler {
  static post({
    endpoint,
    body,
  }: {
    endpoint: string;
    body: unknown;
  }): Promise<Response> {
    return fetch(API_URL + endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
export function checkUserIsInDB(token: string) {
  return fetch(`${API_URL}user/`, {
    method: "POST",
    body: JSON.stringify({ token: token }), // HERE
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
}
