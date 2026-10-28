import { expect, test } from "@playwright/test";

test("root redirects to English", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("English and Arabic routes render with the correct direction", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/ar");
  await expect(page.locator("[dir='rtl'][lang='ar']")).toBeVisible();
});

for (const route of ["jobs", "services", "freelancers", "login", "register"]) {
  test(`${route} page renders`, async ({ page }) => {
    await page.goto(`/en/${route}`);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();
  });
}

test("invalid locale route returns a not found page", async ({ page }) => {
  const response = await page.goto("/en/not-a-real-page");
  expect(response?.status()).toBe(404);
});

test("health endpoint exposes status without configuration secrets", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toEqual({ status: "ok", supabaseConfigured: expect.any(Boolean) });
  expect(JSON.stringify(body)).not.toMatch(/https?:|key|secret|cookie/i);
});

test("security headers are present", async ({ page }) => {
  const response = await page.goto("/en");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});

test("marketplace pages remain usable at a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/en");
  await page.getByText("Menu", { exact: true }).click();
  await expect(page.getByRole("link", { name: "Jobs", exact: true })).toBeVisible();
  await page.goto("/en/jobs");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("h1").first()).toBeVisible();
  const fitsViewport = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  expect(fitsViewport).toBeTruthy();
});
