const url = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

export class HttpHandler {
  /**
   * POST request
   * @param endpoint backend endpoint of the request
   * @param {object} data data of the request
   * @param token user's token
   * @returns
   */
  static post(endpoint: string, token: string, data = {}): Promise<Response> {
    console.log("post", url + endpoint);
    return fetch(url + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token, ...data }),
    });
  }

  /**
   * GET request
   * @param endpoint backend endpoint of the request
   * @returns
   */
  static get(endpoint: string): Promise<Response> {
    return fetch(url + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static patch(
    endpoint: string,
    id: string,
    token: string,
    data = {}
  ): Promise<Response> {
    return fetch(url + endpoint + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token, ...data }),
    });
  }
}
export function checkUserIsInDB(token: string) {
  return fetch(`${url}/user/`, {
    method: "POST",
    body: JSON.stringify({ token: token }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
}
