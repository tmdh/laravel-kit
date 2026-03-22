import { test, expect, _electron as electron } from "@playwright/test";
import path from "path";

test("should display 'Artisan evolved' text after loading", async () => {
  const electronApp = await electron.launch({
    args: [
      "--no-sandbox",
      path.join(__dirname, "..", "dist", "main.js")
    ],
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

test("should display 'Build something amazing' after opening a project", async () => {
  const blogPath = process.env.LARAVEL_PROJECT_PATH || path.join(__dirname, "..", "blog");

  const electronApp = await electron.launch({
    args: [
      "--no-sandbox",
      path.join(__dirname, "..", "dist", "main.js")
    ],
    env: {
      ...process.env,
      NODE_ENV: "production"
    }
  });

  const window = await electronApp.firstWindow();

  await window.waitForLoadState("domcontentloaded");

  // Mock the dialogFolder IPC handler to return the blog project path
  // instead of showing a native file dialog
  await electronApp.evaluate(async ({ ipcMain }, projectPath) => {
    ipcMain.removeHandler("dialogFolder");
    ipcMain.handle("dialogFolder", async () => {
      return { canceled: false, filePaths: [projectPath] };
    });
  }, blogPath);

  // Click "Open project..." to trigger the open dialog flow
  await window.click("text=Open project...");

  // Wait for "Build something amazing!" to appear after the project loads
  const buildText = window.locator("text=Build something amazing!");
  await expect(buildText).toBeVisible({ timeout: 30000 });

  await electronApp.close();
});
