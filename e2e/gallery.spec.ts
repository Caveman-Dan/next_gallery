import { expect, test } from "@playwright/test";

test("a new sign-up reaches the gallery", async ({ page }) => {
  const stamp = Date.now();
  await page.goto("sign-up");
  await page.getByLabel("Forename").fill("E2E");
  await page.getByLabel("Surname").fill("User");
  await page.getByLabel("Username").fill(`e2e${stamp}`);
  await page.getByLabel("Email").fill(`e2e-${stamp}@example.com`);
  await page.getByRole("textbox", { name: "Password", exact: true }).fill("e2e-password");
  await page.getByLabel("Phone").fill("07000000000");
  await page.locator("button", { hasText: "Submit" }).click();
  await expect(page).toHaveURL(/\/gallery\/?$/);
});

test("logout returns the top bar to Login", async ({ page }) => {
  const stamp = Date.now();
  await page.goto("sign-up");
  await page.getByLabel("Forename").fill("E2E");
  await page.getByLabel("Surname").fill("User");
  await page.getByLabel("Username").fill(`e2e${stamp}`);
  await page.getByLabel("Email").fill(`e2e-${stamp}@example.com`);
  await page.getByRole("textbox", { name: "Password", exact: true }).fill("e2e-password");
  await page.getByLabel("Phone").fill("07000000000");
  await page.locator("button", { hasText: "Submit" }).click();
  await expect(page).toHaveURL(/\/gallery\/?$/);

  await page.locator("button", { hasText: "Logout" }).click();
  await expect(page).toHaveURL(/\/gallery\/?$/);
  await expect(page.locator("button", { hasText: "Login" })).toBeVisible();
});
