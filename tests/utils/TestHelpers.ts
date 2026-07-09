import { Page } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";

export async function disableAds(page: Page) {
  // Wait for the page to load
  await page.waitForLoadState("domcontentloaded");

  // Hide ads using CSS
  await page.addStyleTag({
    content: "iframe, ins.adsbygoogle { display: none !important; }",
  });

  // Remove existing ads dynamically
  await page.evaluate(() => {
    const ads = document.querySelectorAll("iframe, ins.adsbygoogle");
    ads.forEach(ad => ad.remove());
  });

  // Observe and remove dynamically injected ads
  await page.evaluate(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const ads = document.querySelectorAll("iframe, ins.adsbygoogle");
        ads.forEach(ad => ad.remove());
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export async function loginAndNavigateToDashboard(
  page: Page
): Promise<DashboardPage> {
  const loginPage = new LoginPage(page);

  // Navigate to the login page and perform login
  await loginPage.navigateTo("/notes/app/login");
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);

  // Wait for the dashboard to load
  const dashboardPage = new DashboardPage(page);
  await page.waitForSelector('[data-testid="add-new-note"]', {
    timeout: 15000,
  });

  // Disable ads after the dashboard is loaded
  await disableAds(page);

  return dashboardPage;
}
