import { test, expect } from "@playwright/test";
import { NotesApi } from "../api/NotesApi";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";

test.describe("Assignment 2: API data and filter validation", () => {
  let notesApi: NotesApi;
  let dashboardPage: DashboardPage;
  let token: string;
  let loginPage: LoginPage;

  const notesData = {
    work: `Work_API_${Date.now()}`,
    home: `Home_API_${Date.now()}`,
    personal: `Personal_API_${Date.now()}`,
  };

  test.beforeAll("Login and precodintions", async ({ request }) => {
    notesApi = new NotesApi(request);
    token = await notesApi.loginAndGetToken(
      process.env.USER_EMAIL!,
      process.env.USER_PASSWORD!
    );
    await notesApi.createNoteViaApi(
      token,
      notesData.work,
      "First note",
      "Work"
    );

    await notesApi.createNoteViaApi(
      token,
      notesData.home,
      "Second note",
      "Home"
    );

    await notesApi.createNoteViaApi(
      token,
      notesData.personal,
      "Third note",
      "Personal"
    );
  });

  test.beforeEach("Navigate with token ", async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto("/notes/app");
    await page.evaluate(token => {
      window.localStorage.setItem("token", token);
    }, token);
    await page.reload();
  });

  test("Validate category filters on the dashboard", async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    const workNote = dashboardPage.getNoteByTitle(notesData.work);
    const homeNote = dashboardPage.getNoteByTitle(notesData.home);
    const personalNote = dashboardPage.getNoteByTitle(notesData.personal);

    // Verify all notes are visible initially (All category)
    await expect(workNote).toBeVisible();
    await expect(homeNote).toBeVisible();
    await expect(personalNote).toBeVisible();

    // Click the 'Work' filter and verify only Work note is visible
    await page.getByTestId("category-work").click();
    await expect(workNote).toBeVisible();
    await expect(homeNote).toBeHidden();
    await expect(personalNote).toBeHidden();

    // Click the 'Home' filter and verify only Home note is visible
    await page.getByTestId("category-home").click();
    await expect(homeNote).toBeVisible();
    await expect(workNote).toBeHidden();
    await expect(personalNote).toBeHidden();
  });
});
