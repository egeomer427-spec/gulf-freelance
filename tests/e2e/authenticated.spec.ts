import { expect, test } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;
const jobId = process.env.E2E_JOB_ID;
const authenticated = Boolean(email && password);

test.describe("authenticated account flows", () => {
  test.skip(!authenticated, "Set E2E_USER_EMAIL and E2E_USER_PASSWORD to enable account tests.");

  test("login and open profile and CV manager", async ({ page }) => {
    await page.goto("/en/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/en\/(dashboard|profile|cv)/);

    await page.goto("/en/profile");
    await expect(page.locator("main")).toBeVisible();
    await page.goto("/en/cv");
    await expect(page.getByRole("heading", { name: /CV manager/i })).toBeVisible();
  });

  test("authenticated account can reach messaging", async ({ page }) => {
    await page.goto("/en/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.goto("/en/messages");
    await expect(page.locator("main")).toBeVisible();
  });

  test("account can upload and remove a private CV", async ({ page }) => {
    await page.goto("/en/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.goto("/en/cv");
    const title = `Playwright CV ${Date.now()}`;
    await page.getByPlaceholder("CV title").fill(title);
    await page.locator('input[name="file"]').setInputFiles({
      name: "playwright-cv.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n%%EOF"),
    });
    await page.getByRole("button", { name: "Upload CV" }).click();
    const uploaded = page.locator(".card").filter({ hasText: title });
    await expect(uploaded).toBeVisible();
    await uploaded.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(title)).toHaveCount(0);
  });

  test("account can log out", async ({ page }) => {
    await page.goto("/en/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/en$/);
  });

  test("job seeker can open a job application form", async ({ page }) => {
    test.skip(!jobId, "Set E2E_JOB_ID to a public active job UUID to enable this check.");
    await page.goto("/en/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.goto(`/en/jobs/${jobId}`);
    await expect(page.getByRole("heading", { name: "Apply" })).toBeVisible();
  });
});
