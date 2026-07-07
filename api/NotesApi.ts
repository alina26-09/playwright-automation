import { APIRequestContext } from "@playwright/test";

export class NotesApi {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async loginAndGetToken(email: string, password: string): Promise<string> {
    const response = await this.request.post("/notes/api/users/login", {
      data: {
        email: email,
        password: password,
      },
    });

    const responseBody = await response.json();

    return responseBody.data.token;
  }

  async createNoteViaApi(
    token: string,
    title: string,
    description: string,
    category: string
  ) {
    const response = await this.request.post("/notes/api/notes", {
      headers: {
        "x-auth-token": token,
      },
      data: {
        title: title,
        description: description,
        category: category,
      },
    });

    return response;
  }
}
