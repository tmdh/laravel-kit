import { test, expect, _electron as electron } from "@playwright/test";
import path from "path";

test("should display 'Artisan evolved' text after loading", async () => {
  const electronApp = await electron.launch({
    args: [path.join(__dirname, "..", "dist", "main.js")],
    env: {
      ...process.env,
      NODE_ENV: "production"
    }
  });

  const window = await electronApp.firstWindow();

  await window.waitForLoadState("domcontentloaded");

  const artisanText = window.locator("text=Artisan evolved");
  await expect(artisanText).toBeVisible({ timeout: 10000 });

  await electronApp.close();
});
