import { expect, test } from "@playwright/test";

test("empty login shows the required-field messages", async ({ page }) => {
  await page.goto("login");
  await expect(page.getByRole("heading", { name: "Please enter your details..." })).toBeVisible();
  await page.locator("button", { hasText: "Login" }).click();
  await expect(page.getByText("Email address is required!")).toBeVisible();
  await expect(page.getByText("Password is required!")).toBeVisible();
});
