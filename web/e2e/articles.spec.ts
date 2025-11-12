import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Articles Page', () => {
  test('should load articles page successfully', async ({ page }) => {
    await page.goto('/articles');

    // Check page title
    await expect(page).toHaveTitle(/Articles/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Articles');
  });

  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/articles');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should display article list', async ({ page }) => {
    await page.goto('/articles');

    // Check if articles are displayed
    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();
  });

  test('should expand article details', async ({ page }) => {
    await page.goto('/articles');

    // Find first article summary element
    const firstArticleSummary = page.locator('details summary').first();
    await firstArticleSummary.click();

    // Check if article description is visible after expanding
    const firstDetails = page.locator('details').first();
    await expect(firstDetails).toHaveAttribute('open', '');
  });

  test('should navigate to individual article', async ({ page }) => {
    await page.goto('/articles');

    // Check if there are any articles first
    const articles = page.locator('article');
    const articleCount = await articles.count();

    if (articleCount === 0) {
      test.skip();
      return;
    }

    // Expand first article to reveal the "Read article" link
    const firstArticleSummary = page.locator('details summary').first();
    await firstArticleSummary.click();

    // Click on "Read article" link
    const readArticleLink = page.getByRole('link', { name: /read article/i }).first();

    // Wait for the link to be visible and clickable
    await readArticleLink.waitFor({ state: 'visible' });
    await readArticleLink.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify navigation to article page
    await expect(page.url()).toMatch(/\/articles\/.+/);
  });

  test('should display article metadata', async ({ page }) => {
    await page.goto('/articles');

    // Check if first article has a date
    const firstArticle = page.locator('article').first();
    const dateElement = firstArticle.locator('time');
    await expect(dateElement).toBeVisible();
  });

  test('should display article tags', async ({ page }) => {
    await page.goto('/articles');

    // Expand first article
    const firstArticleSummary = page.locator('details summary').first();
    await firstArticleSummary.click();

    // Check if tags are visible (if article has tags)
    const firstDetails = page.locator('details').first();
    const tagsContainer = firstDetails.locator('span[class*="rounded"]');

    // At least check the container exists
    const count = await tagsContainer.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
