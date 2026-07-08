import { BasePage } from "./base/BasePage";
import { Page, Locator } from "@playwright/test";

export class DashboardPage extends BasePage {
  private readonly addNoteButton: Locator;
  private readonly categoryDropdown: Locator;
  private readonly titleInput: Locator;
  private readonly descriptionBox: Locator;
  private readonly saveNoteButton: Locator;
  private readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    super(page);

    this.addNoteButton = page.getByTestId("add-new-note");
    this.titleInput = page.getByTestId("note-title");
    this.categoryDropdown = page.getByTestId("note-category");
    this.descriptionBox = page.getByTestId("note-description");
    this.saveNoteButton = page.getByTestId("note-submit");
    this.confirmDeleteButton = page.getByTestId("note-delete-confirm");
  }

  async navigateToCategory(category: "All" | "Home" | "Work" | "Personal") {
    const categoryId = `category-${category.toLowerCase()}`;
    await this.page.getByTestId(categoryId).click({ force: true });
  }

  async createNote(title: string, description: string, category: string) {
    await this.addNoteButton.waitFor({ state: "visible" });
    await this.addNoteButton.click({ force: true });
    await this.categoryDropdown.selectOption(category);
    await this.titleInput.fill(title);
    await this.descriptionBox.fill(description);
    await this.saveNoteButton.click({ force: true });
  }

  getNoteByTitle(title: string): Locator {
    const noteCard = this.page.locator(".card").filter({ hasText: title });
    if (!noteCard) {
      throw new Error(`Note with title "${title}" not found.`);
    }
    return noteCard;
  }

  async editNote(
    oldTitle: string,
    newDescription: string,
    newCategory: string
  ) {
    const noteCard = this.getNoteByTitle(oldTitle);
    if (!(await noteCard.isVisible())) {
      throw new Error(
        `Note with title "${oldTitle}" not found or not visible.`
      );
    }

    await noteCard.getByTestId("note-edit").click();

    await this.categoryDropdown.selectOption(newCategory);
    await this.descriptionBox.fill(newDescription);
    await this.saveNoteButton.click({ force: true });
  }

  async deleteNote(title: string) {
    const noteCard = this.getNoteByTitle(title);
    if (!(await noteCard.isVisible())) {
      throw new Error(`Note with title "${title}" not found or not visible.`);
    }
    await noteCard
      .getByTestId("note-delete")
      .evaluate((btn: HTMLElement) => btn.click());
    await this.confirmDeleteButton.waitFor({ state: "visible" });
    await this.confirmDeleteButton.evaluate((btn: HTMLElement) => btn.click());
  }
}
