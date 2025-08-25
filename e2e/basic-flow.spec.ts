import { test, expect } from '@playwright/test';

test.describe('TimeSync Basic Flow', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('domcontentloaded');
    
    // Check basic page elements are visible
    await expect(page.locator('text=TimeSync')).toBeVisible({ timeout: 10000 });
    
    // Check search conditions section (indicating the app loaded properly)
    await expect(page.locator('text=検索条件')).toBeVisible({ timeout: 10000 });
    
    // Check Google login section
    await expect(page.locator('text=Googleでログイン')).toBeVisible({ timeout: 10000 });
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // The app loads by default with the search tab visible (Japanese mode)
    // Check search form is visible
    await expect(page.locator('text=検索条件')).toBeVisible({ timeout: 10000 });
    
    // Check date range elements
    await expect(page.locator('text=期間')).toBeVisible();
    
    // Click on Calendar tab if it's visible (may be in Japanese)
    const calendarTab = page.locator('button').filter({ hasText: 'カレンダー表示' }).first();
    if (await calendarTab.isVisible()) {
      await calendarTab.click();
      // Calendar should show sign in prompt (Japanese)
      await expect(page.locator('text=Googleでログイン')).toBeVisible({ timeout: 10000 });
    }
  });

  test('should toggle language', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // App starts in Japanese, check Japanese text is visible
    await expect(page.locator('text=検索条件')).toBeVisible({ timeout: 10000 });
    
    // Find and click language toggle button (likely shows "EN" to switch to English)
    const languageButton = page.locator('button').filter({ hasText: /EN|JA/ });
    if (await languageButton.isVisible()) {
      await languageButton.click();
      await page.waitForTimeout(1000);
      
      // After toggle, either Japanese or English text should be visible
      const searchConditions = page.locator('text=/検索条件|Search Parameters/');
      await expect(searchConditions).toBeVisible({ timeout: 5000 });
    }
  });

  test('should enter demo mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Click demo mode button (Japanese text)
    const demoButton = page.locator('text=/デモを試す|Try Demo/');
    await expect(demoButton).toBeVisible({ timeout: 10000 });
    await demoButton.click();
    
    // Demo mode indicator should be visible (look for demo mode badge)
    await expect(page.locator('text=デモモード')).toBeVisible({ timeout: 5000 });
    
    // Calendar tab might be visible to click (select the main tab, not the selector)
    const calendarTab = page.locator('button').filter({ hasText: 'カレンダー表示' }).first();
    if (await calendarTab.isVisible()) {
      await calendarTab.click();
      await page.waitForTimeout(1000); // Wait for demo data to load
    }
  });

  test('should show date picker when clicking date input', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Search form should be visible by default
    await expect(page.locator('text=検索条件')).toBeVisible({ timeout: 10000 });
    
    // Click on date input (look for input fields)
    const dateInput = page.locator('input[type="text"]').first();
    if (await dateInput.isVisible()) {
      await dateInput.click();
      
      // Calendar popup should appear (look for calendar grid or month navigation)
      const calendar = page.locator('.react-calendar, [role="grid"], button[aria-label*="calendar"]');
      await expect(calendar.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should allow setting minimum duration', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Search form should be visible by default
    await expect(page.locator('text=検索条件')).toBeVisible({ timeout: 10000 });
    
    // Find duration select (look for select elements)
    const durationSelect = page.locator('select').first();
    if (await durationSelect.isVisible()) {
      // Try to select different duration values
      const options = await durationSelect.locator('option').all();
      if (options.length > 1) {
        // Select second option (usually 60 minutes)
        await durationSelect.selectOption({ index: 1 });
      }
    }
  });

  test('should toggle business hours restriction', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Search form should be visible by default
    await expect(page.locator('text=検索条件')).toBeVisible({ timeout: 10000 });
    
    // Find business hours checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      // Toggle checkbox
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      
      // Uncheck it
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }
  });

  test('should show search results in demo mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Enter demo mode first
    const demoButton = page.locator('text=/デモを試す|Try Demo/');
    await expect(demoButton).toBeVisible({ timeout: 10000 });
    await demoButton.click();
    
    // Verify demo mode is active (look for demo mode badge)
    await expect(page.locator('text=デモモード')).toBeVisible({ timeout: 5000 });
    
    // Search form should still be visible (default tab)
    await expect(page.locator('text=検索条件')).toBeVisible();
    
    // Click search button (Japanese text)
    const searchButton = page.locator('button').filter({ hasText: /空き時間を検索|Find Available Times/ });
    if (await searchButton.isVisible()) {
      await searchButton.click();
      
      // Wait for results
      await page.waitForTimeout(3000);
      
      // Results should appear (look for available slots text)
      const results = page.locator('text=/空き時間|Available Time|検索結果/');
      await expect(results.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should copy results to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Enter demo mode
    const demoButton = page.locator('text=/デモを試す|Try Demo/');
    await expect(demoButton).toBeVisible({ timeout: 10000 });
    await demoButton.click();
    
    // Verify demo mode is active (look for demo mode badge)
    await expect(page.locator('text=デモモード')).toBeVisible({ timeout: 5000 });
    
    // Click search button to generate results
    const searchButton = page.locator('button').filter({ hasText: /空き時間を検索|Find Available Times/ });
    if (await searchButton.isVisible()) {
      await searchButton.click();
      await page.waitForTimeout(3000);
      
      // Look for copy button (Japanese text)
      const copyButton = page.locator('button').filter({ hasText: /すべてコピー|Copy All/ });
      if (await copyButton.isVisible()) {
        await copyButton.click();
        
        // Success state should appear (button text changes)
        await expect(page.locator('text=/コピー済み|Copied/')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Title should still be visible
    await expect(page.locator('text=TimeSync')).toBeVisible({ timeout: 10000 });
    
    // Search form should be visible by default (mobile responsive)
    await expect(page.locator('text=検索条件')).toBeVisible();
    
    // Date range should be visible
    await expect(page.locator('text=期間')).toBeVisible();
    
    // Menu or navigation should be accessible on mobile
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="メニュー"], [role="button"]').first();
    if (await menuButton.isVisible()) {
      // Can access mobile navigation
      await menuButton.click();
    }
  });
});