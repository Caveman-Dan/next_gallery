import { expect, test } from "@playwright/test";

test("a new account is told it is waiting for approval", async ({ page }) => {
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

  await page.goto("gallery/UserProfile");
  await expect(page.getByRole("heading", { name: "User profile", exact: true })).toBeVisible();
  await expect(page.getByText("Your account is waiting for an admin to approve it.")).toBeVisible();
  await expect(page.getByText("Status: pending")).toBeVisible();
});
