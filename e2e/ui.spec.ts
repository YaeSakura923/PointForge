import { test, expect } from '@playwright/test';

async function waitForReactUI(page: import('@playwright/test').Page) {
  await page.waitForSelector('#pf-overlay-root', { timeout: 45000 });
  await page.waitForTimeout(500);
}

test.describe('PointForge UI Interactions', () => {
  test('React toolbar brand is visible', async ({ page }) => {
    await page.goto('/');
    await waitForReactUI(page);

    // The React toolbar renders PointForge brand in orange
    const brand = page.locator('#pf-toolbar span').filter({ hasText: 'PointForge' }).first();
    await expect(brand).toBeVisible({ timeout: 5000 });
  });

  test('File menu dropdown shows menu items', async ({ page }) => {
    await page.goto('/');
    await waitForReactUI(page);

    // Click the React File button inside the toolbar
    const fileBtn = page.locator('#pf-toolbar button').filter({ hasText: 'File' }).first();
    await expect(fileBtn).toBeVisible({ timeout: 5000 });
    await fileBtn.click({ force: true });

    // Wait for dropdown items to appear
    await page.waitForTimeout(300);

    // Check that menu items exist (both React and PCUI may render them)
    const saveItem = page.getByText('Save').first();
    await expect(saveItem).toBeVisible({ timeout: 3000 });

    // Click away to dismiss
    await page.mouse.click(10, 10);
  });

  test('keyboard shortcut ? opens shortcuts dialog', async ({ page }) => {
    await page.goto('/');
    await waitForReactUI(page);

    // Press ? to open shortcuts
    await page.keyboard.press('?');

    // Dialog should appear (React Dialog component)
    const dialog = page.locator('[role="dialog"]').first();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('Keyboard Shortcuts');

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test('about dialog opens and shows version', async ({ page }) => {
    await page.goto('/');
    await waitForReactUI(page);

    // Open Help menu via React toolbar
    const helpBtn = page.locator('#pf-toolbar button').filter({ hasText: 'Help' }).first();
    await expect(helpBtn).toBeVisible({ timeout: 5000 });
    await helpBtn.click({ force: true });

    await page.waitForTimeout(300);

    // Click About in the React dropdown
    const aboutItem = page.locator('text=About PointForge').first();
    await expect(aboutItem).toBeVisible({ timeout: 3000 });
    await aboutItem.click({ force: true });

    // About dialog should appear
    const dialog = page.locator('[role="dialog"]').first();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('3.0.0');

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test('panels can be toggled and show content', async ({ page }) => {
    await page.goto('/');
    await waitForReactUI(page);

    // Left panel is open by default, should show Scene Manager
    const leftPanel = page.locator('#pf-left-panel');
    await expect(leftPanel).toHaveClass(/pf-panel-open/);
    await expect(leftPanel).toContainText('Scene Manager');

    // Right panel is closed by default - click to open
    const toggleBtns = page.locator('.pf-toggle-btn');
    await toggleBtns.last().click();
    await page.waitForTimeout(400);

    const rightPanel = page.locator('#pf-right-panel');
    await expect(rightPanel).toHaveClass(/pf-panel-open/);
    await expect(rightPanel).toContainText('View Options');
  });
});
