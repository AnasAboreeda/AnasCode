import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Anas Aboreeda/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Anas Aboreeda');
  });

  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should display recent articles', async ({ page }) => {
    await page.goto('/');

    // Check if recent articles section exists
    const recentArticlesHeading = page.getByRole('heading', { name: /recent articles/i });
    await expect(recentArticlesHeading).toBeVisible();
  });

  test('should navigate to articles page', async ({ page }) => {
    await page.goto('/');

    // Click on "View all articles" link
    const viewAllLink = page.getByRole('link', { name: /view all articles/i });
    await viewAllLink.click();

    // Verify navigation to articles page
    await expect(page).toHaveURL(/\/articles/);
  });

  test('should navigate to about page from nav', async ({ page }) => {
    await page.goto('/');

    // Check if we're on mobile by checking viewport width
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 768 : false;

    if (isMobile) {
      // On mobile, click the hamburger menu first
      const menuButton = page.getByRole('button', { name: /toggle menu/i });
      await menuButton.click();

      // Wait for menu to open
      await page.waitForTimeout(300);
    }

    // Click on About link
    const aboutLink = page.getByRole('link', { name: /^about$/i });
    await aboutLink.click();

    // Verify navigation to about page
    await expect(page).toHaveURL(/\/about/);
  });

  test('should navigate to links page from nav', async ({ page }) => {
    await page.goto('/');

    // Check if we're on mobile by checking viewport width
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 768 : false;

    if (isMobile) {
      // On mobile, click the hamburger menu first
      const menuButton = page.getByRole('button', { name: /toggle menu/i });
      await menuButton.click();

      // Wait for menu to open
      await page.waitForTimeout(300);
    }

    // Click on Links link
    const linksLink = page.getByRole('link', { name: /^links$/i });
    await linksLink.click();

    // Verify navigation to links page
    await expect(page).toHaveURL(/\/links/);
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');

    // Check if footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verify footer contains social links
    const githubLink = footer.getByRole('link', { name: /github/i });
    await expect(githubLink).toBeVisible();

    const linkedinLink = footer.getByRole('link', { name: /linkedin/i });
    await expect(linkedinLink).toBeVisible();
  });
});
