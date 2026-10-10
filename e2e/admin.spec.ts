import { expect, test } from "@playwright/test";

test("a non-admin cannot open admin settings", async ({ page }) => {
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

  await page.goto("gallery/admin");
  await expect(page.getByText("This page could not be found.")).toBeVisible();
});

test("an admin can open profile settings", async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  test.skip(!email || !password, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run the admin journey");

  await page.goto("login");
  await page.getByLabel("Email").fill(email!);
  await page.getByRole("textbox", { name: "Password", exact: true }).fill(password!);
  await page.locator("button", { hasText: "Login" }).click();
  await expect(page.getByText("Invalid email or password")).toHaveCount(0);
  await expect(page).toHaveURL(/\/gallery\/?$/);
  await page.goto("gallery/admin");
  await expect(page.getByText("This page could not be found.")).toHaveCount(0);
  await expect(page.locator("h2", { hasText: "Admin - Profile Settings" })).toBeVisible();
});
