import { test, expect } from "@playwright/test";
import { NotesApi } from "../api/NotesApi";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { UsersApi } from "../api/UsersApi";

test.describe("Assignment 2: API data and filter validation", () => {
  let notesApi: NotesApi;
  let usersApi: UsersApi;
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
    usersApi = new UsersApi(request);
    token = await usersApi.loginAndGetToken(
      process.env.USER_EMAIL!,
      process.env.USER_PASSWORD!
    );
    await notesApi.createNoteViaApi({
      token,
      title: notesData.work,
      description: "First note",
      category: "Work",
    });

    await notesApi.createNoteViaApi({
      token,
      title: notesData.home,
      description: "Second note",
      category: "Home",
    });

    await notesApi.createNoteViaApi({
      token,
      title: notesData.personal,
      description: "Third note",
      category: "Personal",
    });
  });

  test.beforeEach("Navigate with token ", async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto("");
    await page.evaluate(token => {
      window.localStorage.setItem("token", token);
    }, token);
    await page.goto("/notes/app");
    await page.addStyleTag({
      content: "iframe, ins.adsbygoogle { display: none !important; }",
    });
    await page
      .getByTestId("add-new-note")
      .waitFor({ state: "visible", timeout: 15000 });
  });

  test("Validate category filters on the dashboard", async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    const workNote = dashboardPage.getNoteByTitle(notesData.work);
    const homeNote = dashboardPage.getNoteByTitle(notesData.home);
    const personalNote = dashboardPage.getNoteByTitle(notesData.personal);

    // Verify all notes are visible initially (All category)

    await expect(workNote).toBeVisible({ timeout: 10000 });
    await expect(homeNote).toBeVisible();
    await expect(personalNote).toBeVisible();

    // Click the 'Work' filter and verify only Work note is visible
    await dashboardPage.navigateToCategory("Work");
    await expect(workNote).toBeVisible();
    await expect(homeNote).toBeHidden();
    await expect(personalNote).toBeHidden();

    // Click the 'Home' filter and verify only Home note is visible
    await dashboardPage.navigateToCategory("Home");
    await expect(homeNote).toBeVisible();
    await expect(workNote).toBeHidden();
    await expect(personalNote).toBeHidden();

    // Click the 'Personal' filter and verify only Home note is visible
    await dashboardPage.navigateToCategory("Personal");
    await expect(homeNote).toBeHidden();
    await expect(workNote).toBeHidden();
    await expect(personalNote).toBeVisible();
  });

  test.afterAll(async ({ request }) => {
    const cleanUpApi = new NotesApi(request);
    await cleanUpApi.deleteAllNotes(token);
  });
});
