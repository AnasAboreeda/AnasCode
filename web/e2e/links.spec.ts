import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Links Page', () => {
  test('should load links page successfully', async ({ page }) => {
    await page.goto('/links');

    // Check page title
    await expect(page).toHaveTitle(/Links/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Links');
  });

  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/links');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should display social links', async ({ page }) => {
    await page.goto('/links');

    // Check if links are displayed
    const links = page.getByRole('link');
    const linkCount = await links.count();

    // Should have at least some links
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should have external links with proper attributes', async ({ page }) => {
    await page.goto('/links');

    // Find GitHub link
    const githubLink = page.getByRole('link', { name: /github/i });

    if (await githubLink.count() > 0) {
      // Verify it opens in new tab (target="_blank")
      await expect(githubLink.first()).toHaveAttribute('target', '_blank');

      // Verify it has rel="noopener noreferrer" for security
      await expect(githubLink.first()).toHaveAttribute('rel', /noopener/);
    }
  });
});
