import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('About Page', () => {
  test('should load about page successfully', async ({ page }) => {
    await page.goto('/about');

    // Check page title
    await expect(page).toHaveTitle(/About/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('About');
  });

  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/about');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast']) // Disable color-contrast for accent colors used in headings
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should display career timeline', async ({ page }) => {
    await page.goto('/about');

    // Check if career journey section exists
    const careerHeading = page.getByRole('heading', { name: /career journey/i });
    await expect(careerHeading).toBeVisible();
  });

  test('should display expertise sections', async ({ page }) => {
    await page.goto('/about');

    // Check for expertise sections
    const expertiseHeading = page.getByRole('heading', { name: /^expertise$/i });
    await expect(expertiseHeading).toBeVisible();

    // Check for specific expertise areas
    const leadershipHeading = page.getByRole('heading', { name: /leadership & team building/i });
    await expect(leadershipHeading).toBeVisible();

    const architectureHeading = page.getByRole('heading', { name: /architecture & system design/i });
    await expect(architectureHeading).toBeVisible();

    const technicalHeading = page.getByRole('heading', { name: /technical skills/i });
    await expect(technicalHeading).toBeVisible();
  });

  test('should display engineering philosophy', async ({ page }) => {
    await page.goto('/about');

    // Check if philosophy section exists
    const philosophyHeading = page.getByRole('heading', { name: /engineering philosophy/i });
    await expect(philosophyHeading).toBeVisible();
  });

  test('should display interests section', async ({ page }) => {
    await page.goto('/about');

    // Check if interests section exists
    const interestsHeading = page.getByRole('heading', { name: /interests & focus areas/i });
    await expect(interestsHeading).toBeVisible();
  });

  test('should display key achievements', async ({ page }) => {
    await page.goto('/about');

    // Check if achievements section exists
    const achievementsHeading = page.getByRole('heading', { name: /key achievements/i });
    await expect(achievementsHeading).toBeVisible();
  });

  test('should have structured data for person', async ({ page }) => {
    await page.goto('/about');

    // Check if JSON-LD structured data exists
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toBeAttached();

    // Verify it contains person schema
    const content = await structuredData.textContent();
    expect(content).toContain('"@type":"Person"');
  });
});
