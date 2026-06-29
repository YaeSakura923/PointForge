import { test, expect } from '@playwright/test';

async function waitForReactUI(page: import('@playwright/test').Page) {
  // Wait for the React overlay to mount (happens after PlayCanvas engine boots)
  await page.waitForSelector('#pf-overlay-root', { timeout: 45000 });
  // Give React a moment to finish rendering
  await page.waitForTimeout(500);
}

test.describe('PointForge E2E', () => {
  test('page loads and title is correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('PointForge');
  });

  test('PlayCanvas canvas is created', async ({ page }) => {
    await page.goto('/');
    // PlayCanvas creates a canvas element in the body
    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 30000 });
  });

  test('React overlay mounts after engine init', async ({ page }) => {
    await page.goto('/');
    await waitForReactUI(page);

    // After engine init, the overlay should be present
    const overlay = page.locator('#pf-overlay-root');
    await expect(overlay).toBeVisible();

    // Toolbar should be rendered
    const toolbar = page.locator('#pf-toolbar');
    await expect(toolbar).toBeVisible();

    // Brand name visible (in TopToolbar component)
    await expect(page.locator('text=PointForge').first()).toBeVisible();

    // Status bar
    const statusBar = page.locator('#pf-status-bar');
    await expect(statusBar).toBeVisible();
  });

  test('panels toggle open and closed', async ({ page }) => {
    await page.goto('/');
    await waitForReactUI(page);

    // Left panel starts open by default
    const leftPanel = page.locator('#pf-left-panel');
    await expect(leftPanel).toHaveClass(/pf-panel-open/);

    // Right panel starts closed by default
    const rightPanel = page.locator('#pf-right-panel');
    await expect(rightPanel).toHaveClass(/pf-panel-closed/);

    // Toggle buttons exist
    const toggleBtns = page.locator('.pf-toggle-btn');
    await expect(toggleBtns).toHaveCount(2);

    // Click left toggle to close
    await toggleBtns.first().click();
    await page.waitForTimeout(400);
    await expect(leftPanel).toHaveClass(/pf-panel-closed/);

    // Click right toggle to open
    await toggleBtns.last().click();
    await page.waitForTimeout(400);
    await expect(rightPanel).toHaveClass(/pf-panel-open/);

    // Click left toggle to reopen
    await toggleBtns.first().click();
    await page.waitForTimeout(400);
    await expect(leftPanel).toHaveClass(/pf-panel-open/);
  });

  test('overlay has pointer-events none', async ({ page }) => {
    await page.goto('/');
    await waitForReactUI(page);

    const overlay = page.locator('#pf-overlay-root');
    const pointerEvents = await overlay.evaluate(el =>
      window.getComputedStyle(el).pointerEvents
    );
    expect(pointerEvents).toBe('none');
  });

  test('keyboard shortcuts dialog toggles with ? key', async ({ page }) => {
    await page.goto('/');
    await waitForReactUI(page);

    // Press ? to open shortcuts
    await page.keyboard.press('?');

    // Dialog should appear
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('Keyboard Shortcuts');

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Press ? again to verify toggle works
    await page.keyboard.press('?');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await page.keyboard.press('?');
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });
});
