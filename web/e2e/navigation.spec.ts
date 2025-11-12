import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Navigation and Global Elements', () => {
  test('should have consistent navigation across pages', async ({ page }) => {
    const pages = ['/', '/articles', '/about', '/links'];

    for (const path of pages) {
      await page.goto(path);

      // Check navigation exists
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Check if we're on mobile
      const viewportSize = page.viewportSize();
      const isMobile = viewportSize ? viewportSize.width < 768 : false;

      if (isMobile) {
        // On mobile, check for hamburger menu button
        const menuButton = page.getByRole('button', { name: /toggle menu/i });
        await expect(menuButton).toBeVisible();

        // Open menu to check links
        await menuButton.click();
        await page.waitForTimeout(300);
      }

      // Check for navigation links
      const articlesLink = page.getByRole('link', { name: /^articles$/i });
      await expect(articlesLink).toBeVisible();

      const aboutLink = page.getByRole('link', { name: /^about$/i });
      await expect(aboutLink).toBeVisible();

      const linksLink = page.getByRole('link', { name: /^links$/i });
      await expect(linksLink).toBeVisible();

      if (isMobile) {
        // Close menu after checking
        const menuButton = page.getByRole('button', { name: /toggle menu/i });
        await menuButton.click();
      }
    }
  });

  test('should have consistent footer across pages', async ({ page }) => {
    const pages = ['/', '/articles', '/about', '/links'];

    for (const path of pages) {
      await page.goto(path);

      // Check footer exists
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Check for social links in footer
      const githubLink = footer.getByRole('link', { name: /github/i });
      await expect(githubLink).toBeVisible();

      const linkedinLink = footer.getByRole('link', { name: /linkedin/i });
      await expect(linkedinLink).toBeVisible();
    }
  });

  test('should navigate between all pages', async ({ page }) => {
    await page.goto('/');

    // Check if we're on mobile
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 768 : false;

    // Helper function to click navigation links
    const clickNavLink = async (linkPattern: RegExp) => {
      if (isMobile) {
        // On mobile, open hamburger menu first
        const menuButton = page.getByRole('button', { name: /toggle menu/i });
        await menuButton.click();
        await page.waitForTimeout(300);
      }

      const link = page.getByRole('link', { name: linkPattern });
      await link.click();
    };

    // Navigate to articles
    await clickNavLink(/^articles$/i);
    await expect(page).toHaveURL(/\/articles/);

    // Navigate to about
    await clickNavLink(/^about$/i);
    await expect(page).toHaveURL(/\/about/);

    // Navigate to links
    await clickNavLink(/^links$/i);
    await expect(page).toHaveURL(/\/links/);

    // Navigate back to home by clicking logo image
    const logoImage = page.getByRole('img', { name: /Anas Code Logo/i });
    await logoImage.click();
    await expect(page).toHaveURL('/');
  }); test('should have proper meta tags on all pages', async ({ page }) => {
    const pages = [
      { path: '/', title: /Anas Aboreeda/ },
      { path: '/articles', title: /Articles/ },
      { path: '/about', title: /About/ },
      { path: '/links', title: /Links/ },
    ];

    for (const { path, title } of pages) {
      await page.goto(path);

      // Check title
      await expect(page).toHaveTitle(title);

      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
    }
  });

  test('should have no accessibility violations on all pages', async ({ page }) => {
    const pages = ['/', '/articles', '/about', '/links'];

    for (const path of pages) {
      await page.goto(path);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .exclude('iframe') // Exclude iframes if any
        .disableRules(['color-contrast']) // Disable color-contrast for accent colors used in headings
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('should handle 404 page', async ({ page }) => {
    const response = await page.goto('/non-existent-page');

    // Should return 404 status
    expect(response?.status()).toBe(404);
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have RSS feed link', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    const rssLink = footer.getByRole('link', { name: /rss/i });

    await expect(rssLink).toBeVisible();
    await expect(rssLink).toHaveAttribute('href', '/rss');
  });
});
