import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { NotesApi } from "../api/NotesApi";
import { UsersApi } from "../api/UsersApi";
import { disableAds, loginAndNavigateToDashboard } from "./utils/TestHelpers";

test.describe("Assignment 1: End-to-end UI automation of the note lifecycle", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let notesApi: NotesApi;
  let usersApi: UsersApi;

  test.beforeEach(async ({ page }) => {
    dashboardPage = await loginAndNavigateToDashboard(page);
  });

  test("Create, edit and delete a note", async () => {
    const dynamicTitle = `New_note_on_date_${Date.now()}`;

    await dashboardPage.createNote(dynamicTitle, "Initial description", "Home");

    await dashboardPage.navigateToCategory("Home");
    const myNote = dashboardPage.getNoteByTitle(dynamicTitle);
    await expect(myNote).toBeVisible({ timeout: 10000 });

    await dashboardPage.editNote(
      dynamicTitle,
      "I will change the description",
      "Work"
    );
    await dashboardPage.navigateToCategory("Work");
    await expect(myNote).toBeVisible({ timeout: 10000 });

    await dashboardPage.deleteNote(dynamicTitle);

    await expect(myNote).toBeHidden({ timeout: 10000 });
  });

  test.afterAll(async ({ request }) => {
    notesApi = new NotesApi(request);
    usersApi = new UsersApi(request);

    let token = await usersApi.loginAndGetToken(
      process.env.USER_EMAIL!,
      process.env.USER_PASSWORD!
    );

    await notesApi.deleteAllNotes(token);
  });
});
