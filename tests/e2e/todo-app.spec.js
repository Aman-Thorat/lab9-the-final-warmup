import { test, expect } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');

    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());

    // Reload to apply cleared storage
    await page.reload();
  });

  test('should display the app title and initial UI', async ({ page }) => {
    // Check for main heading
    await expect(page.locator('h1')).toContainText('My Tasks');

    // Check for subtitle
    await expect(page.locator('.subtitle')).toContainText('Stay organized');

    // Check for form input
    await expect(page.locator('input[type="text"]')).toBeVisible();

    // Check for stats showing 0 tasks
    await expect(page.locator('.stat-value').first()).toContainText('0');
  });

  test('should add a new task', async ({ page }) => {
    // Find the input field
    const input = page.locator('input[type="text"]');

    // Type a new task
    await input.fill('Buy groceries');

    // Submit the form (press Enter or click button)
    await input.press('Enter');

    // Verify the task appears in the list
    await expect(page.locator('todo-item')).toHaveCount(1);
    await expect(page.locator('todo-item').first()).toContainText('Buy groceries');

    // Verify stats updated
    await expect(page.locator('.stat-value').first()).toContainText('1');
  });

  test('should add multiple tasks', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    // Add first task
    await input.fill('Task 1');
    await input.press('Enter');

    // Add second task
    await input.fill('Task 2');
    await input.press('Enter');

    // Add third task
    await input.fill('Task 3');
    await input.press('Enter');

    // Verify all tasks appear
    await expect(page.locator('todo-item')).toHaveCount(3);

    // Verify stats
    await expect(page.locator('.stat-value').first()).toContainText('3');
  });

  test('should not add empty tasks', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    // Try to add empty task
    await input.fill('');
    await input.press('Enter');

    // Verify no task was added
    await expect(page.locator('todo-item')).toHaveCount(0);

    // Try with whitespace only
    await input.fill('   ');
    await input.press('Enter');

    // Still no tasks
    await expect(page.locator('todo-item')).toHaveCount(0);
  });

  test('should complete a task', async ({ page }) => {
    // Add a task first
    const input = page.locator('input[type="text"]');
    await input.fill('Complete this task');
    await input.press('Enter');

    // Find and click the checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();

    // Verify task is marked as completed (check for completed class or strikethrough)
    await expect(checkbox).toBeChecked();

    // Verify stats updated (1 completed, 0 active)
    const stats = page.locator('.stat-value');
    await expect(stats.nth(1)).toContainText('0'); // Active
    await expect(stats.nth(2)).toContainText('1'); // Completed
  });

  test('should toggle task completion', async ({ page }) => {
    // Add a task
    const input = page.locator('input[type="text"]');
    await input.fill('Toggle me');
    await input.press('Enter');

    const checkbox = page.locator('input[type="checkbox"]').first();

    // Complete the task
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Uncomplete the task
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();

    // Verify stats (1 active, 0 completed)
    const stats = page.locator('.stat-value');
    await expect(stats.nth(1)).toContainText('1'); // Active
    await expect(stats.nth(2)).toContainText('0'); // Completed
  });

  test('should delete a task', async ({ page }) => {
    // Add a task
    const input = page.locator('input[type="text"]');
    await input.fill('Delete me');
    await input.press('Enter');

    // Verify task exists
    await expect(page.locator('todo-item')).toHaveCount(1);

    // Set up dialog handler to auto-accept confirm dialog
    page.on('dialog', dialog => dialog.accept());

    // Find and click the delete button using aria-label
    const deleteButton = page.getByRole('button', { name: 'Delete todo' });
    await deleteButton.click();

    // Wait for deletion to complete
    await page.waitForTimeout(500);

    // Verify task is gone
    await expect(page.locator('todo-item')).toHaveCount(0);

    // Verify stats back to 0
    await expect(page.locator('.stat-value').first()).toContainText('0');
  });

  test('should persist tasks after page refresh', async ({ page }) => {
    // Add multiple tasks
    const input = page.locator('input[type="text"]');

    await input.fill('Persistent task 1');
    await input.press('Enter');

    await input.fill('Persistent task 2');
    await input.press('Enter');

    // Complete one task
    await page.locator('input[type="checkbox"]').first().check();

    // Verify initial state
    await expect(page.locator('todo-item')).toHaveCount(2);

    // Reload the page
    await page.reload();

    // Verify tasks persisted
    await expect(page.locator('todo-item')).toHaveCount(2);

    // Check each task individually
    const todoItems = page.locator('todo-item');
    await expect(todoItems.first()).toContainText('Persistent task 1');
    await expect(todoItems.last()).toContainText('Persistent task 2');

    // Verify completion state persisted
    await expect(page.locator('input[type="checkbox"]').first()).toBeChecked();
  });

  test('should clear completed tasks', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    // Add three tasks
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    // Complete two tasks
    await page.locator('input[type="checkbox"]').first().check();
    await page.locator('input[type="checkbox"]').nth(1).check();

    // Set up dialog handler to auto-accept confirm dialogs
    page.on('dialog', dialog => dialog.accept());

    // Click "Clear Completed" button
    const clearButton = page.locator('button').filter({ hasText: /clear completed/i });
    await clearButton.click();

    // Wait a moment for the action to complete
    await page.waitForTimeout(500);

    // Verify only incomplete task remains
    await expect(page.locator('todo-item')).toHaveCount(1);
    await expect(page.locator('todo-item').first()).toContainText('Task 3');
  });

  test('should clear all tasks', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    // Add tasks
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // Set up dialog handler to auto-accept confirm dialogs
    page.on('dialog', dialog => dialog.accept());

    // Click "Clear All" button
    const clearAllButton = page.locator('button').filter({ hasText: /clear all/i });
    await clearAllButton.click();

    // Wait a moment for the action to complete
    await page.waitForTimeout(500);

    // Verify all tasks are gone
    await expect(page.locator('todo-item')).toHaveCount(0);
    await expect(page.locator('.stat-value').first()).toContainText('0');
  });

  test('should update task statistics correctly', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    const stats = page.locator('.stat-value');

    // Initially 0 tasks
    await expect(stats.first()).toContainText('0');

    // Add 3 tasks
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    // Verify: 3 total, 3 active, 0 completed
    await expect(stats.nth(0)).toContainText('3'); // Total
    await expect(stats.nth(1)).toContainText('3'); // Active
    await expect(stats.nth(2)).toContainText('0'); // Completed

    // Complete 2 tasks
    await page.locator('input[type="checkbox"]').first().check();
    await page.locator('input[type="checkbox"]').nth(1).check();

    // Verify: 3 total, 1 active, 2 completed
    await expect(stats.nth(0)).toContainText('3'); // Total
    await expect(stats.nth(1)).toContainText('1'); // Active
    await expect(stats.nth(2)).toContainText('2'); // Completed
  });

  test('should handle rapid task additions', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    // Rapidly add 5 tasks
    for (let i = 1; i <= 5; i++) {
      await input.fill(`Rapid task ${i}`);
      await input.press('Enter');
    }

    // Verify all tasks were added
    await expect(page.locator('todo-item')).toHaveCount(5);

    // Verify last task is visible
    await expect(page.locator('todo-item').last()).toContainText('Rapid task 5');
  });
});