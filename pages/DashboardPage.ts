import { BasePage } from "./base/BasePage";
import { Page, Locator } from "@playwright/test";

export class DashboardPage extends BasePage {
  // 1. Declarăm variabilele o singură dată
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

  async createNote(title: string, description: string, category: string) {
    await this.addNoteButton.click();
    await this.categoryDropdown.selectOption(category);
    await this.titleInput.fill(title);
    await this.descriptionBox.fill(description);
    await this.saveNoteButton.click();
  }

  getNoteByTitle(title: string): Locator {
    return this.page.locator(".card").filter({ hasText: title });
  }

  async editNote(
    oldTitle: string,
    newDescription: string,
    newCategory: string
  ) {
    const noteCard = this.getNoteByTitle(oldTitle);

    await noteCard.getByTestId("note-edit").click();

    await this.categoryDropdown.selectOption(newCategory);
    await this.descriptionBox.fill(newDescription);
    await this.saveNoteButton.click();
  }

  async deleteNote(title: string) {
    const noteCard = this.getNoteByTitle(title);

    await noteCard.getByTestId("note-delete").click();

    await this.confirmDeleteButton.click();
  }
}
