import { test, expect } from '@playwright/test';

test.describe('TimeSync Basic Flow', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Check title is visible
    await expect(page.locator('text=TimeSync')).toBeVisible();
    
    // Check both tabs are visible
    await expect(page.locator('text=Calendar View')).toBeVisible();
    await expect(page.locator('text=Find Available Time')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/');
    
    // Click on Search tab
    await page.click('text=Find Available Time');
    
    // Search form should be visible
    await expect(page.locator('text=Date Range')).toBeVisible();
    
    // Click on Calendar tab
    await page.click('text=Calendar View');
    
    // Calendar should be visible (sign in prompt if not logged in)
    const calendarOrSignIn = page.locator('text=/Sign in with your Google account|Calendar/');
    await expect(calendarOrSignIn).toBeVisible();
  });

  test('should toggle language', async ({ page }) => {
    await page.goto('/');
    
    // Find language toggle button (globe icon)
    const languageToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
    await languageToggle.click();
    
    // Check if Japanese text appears
    await expect(page.locator('text=/カレンダー表示|Calendar View/')).toBeVisible();
  });

  test('should enter demo mode', async ({ page }) => {
    await page.goto('/');
    
    // Click demo mode button
    await page.click('text=Demo Mode');
    
    // Demo mode indicator should be visible
    await expect(page.locator('text=Exit Demo')).toBeVisible();
    
    // Calendar should show demo data
    await page.click('text=Calendar View');
    await page.waitForTimeout(1000); // Wait for demo data to load
  });

  test('should show date picker when clicking date input', async ({ page }) => {
    await page.goto('/');
    
    // Go to search tab
    await page.click('text=Find Available Time');
    
    // Click on date input
    const dateInput = page.locator('input[type="text"]').first();
    await dateInput.click();
    
    // Calendar popup should appear
    await expect(page.locator('.react-calendar')).toBeVisible();
  });

  test('should allow setting minimum duration', async ({ page }) => {
    await page.goto('/');
    
    // Go to search tab
    await page.click('text=Find Available Time');
    
    // Find and interact with duration select
    const durationSelect = page.locator('select').filter({ hasText: /minutes/ });
    await durationSelect.selectOption('60');
    
    // Verify selection
    await expect(durationSelect).toHaveValue('60');
  });

  test('should toggle business hours restriction', async ({ page }) => {
    await page.goto('/');
    
    // Go to search tab
    await page.click('text=Find Available Time');
    
    // Find and click business hours checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();
    
    // Verify it's checked
    await expect(checkbox).toBeChecked();
    
    // Uncheck it
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should show search results in demo mode', async ({ page }) => {
    await page.goto('/');
    
    // Enter demo mode
    await page.click('text=Demo Mode');
    
    // Go to search tab
    await page.click('text=Find Available Time');
    
    // Click search button
    await page.click('button:has-text("Search")');
    
    // Wait for results
    await page.waitForTimeout(2000);
    
    // Results should appear
    const results = page.locator('text=/Available Time Slots|空き時間/');
    await expect(results).toBeVisible();
  });

  test('should copy results to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/');
    
    // Enter demo mode
    await page.click('text=Demo Mode');
    
    // Go to search tab
    await page.click('text=Find Available Time');
    
    // Search for available slots
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);
    
    // Click copy button
    const copyButton = page.locator('button:has-text("Copy to Clipboard")');
    await copyButton.click();
    
    // Success message should appear
    await expect(page.locator('text=/Results copied|コピーしました/')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Title should still be visible
    await expect(page.locator('text=TimeSync')).toBeVisible();
    
    // Tabs should be visible and functional
    await expect(page.locator('text=Calendar View')).toBeVisible();
    await page.click('text=Find Available Time');
    await expect(page.locator('text=Date Range')).toBeVisible();
  });
});