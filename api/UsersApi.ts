import { APIRequest, APIRequestContext } from "@playwright/test";
import { BaseApi } from "./BaseApi";

export class UsersApi extends BaseApi {

  async loginAndGetToken(email: string, password: string): Promise<string> {
    const response = await this.request.post("/notes/api/users/login", {
      data: {
        email: email,
        password: password,
      },
    })

    const responseBody = await response.json();

    return responseBody.data.token;
  }
}
