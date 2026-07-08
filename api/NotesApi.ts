import { APIRequestContext } from "@playwright/test";
import { BaseApi } from "./BaseApi";

export class NotesApi extends BaseApi {
  async createNoteViaApi({
    token,
    title,
    description,
    category,
  }: {
    token: string;
    title: string;
    description: string;
    category: string;
  }) {
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

  async deleteNoteViaApi(token: string, noteId: string) {
    return await this.request.delete(`/notes/api/notes/${noteId}`, {
      headers: { "x-auth-token": token },
    });
  }

  async getAllNotes(token: string) {
    const response = await this.request.get("/notes/api/notes", {
      headers: { "x-auth-token": token },
    });

    const responseBody = await response.json();
    return responseBody.data;
  }

  async deleteAllNotes(token: string) {
    const notes = await this.getAllNotes(token);

    const deletePromises = notes.map((note: any) =>
      this.deleteNoteViaApi(token, note.id)
    );

    await Promise.all(deletePromises);
  }

}
