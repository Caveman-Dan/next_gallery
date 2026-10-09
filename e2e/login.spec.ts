import { expect, test } from "@playwright/test";

test("empty login shows the required-field messages", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Email address is required!")).toBeVisible();
  await expect(page.getByText("Password is required!")).toBeVisible();
});
