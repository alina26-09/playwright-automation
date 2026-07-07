import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Assignment 1: End-to-end UI automation of the note lifecycle", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  const dynamicTitle = `New_note_on_date_${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.navigateTo("/notes/app/login");

    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
  });

  test("Create, edit and delete a note", async () => {
    await dashboardPage.createNote(dynamicTitle, "Initial description", "Home");

    const myNote = dashboardPage.getNoteByTitle(dynamicTitle);
    await expect(myNote).toBeVisible();

    await dashboardPage.editNote(
      dynamicTitle,
      "I will change the description",
      "Work"
    );

    await dashboardPage.deleteNote(dynamicTitle);

    await expect(myNote).toBeHidden();
  });
});
