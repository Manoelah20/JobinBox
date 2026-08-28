import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('JobInbox - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load dashboard with stats', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Olá');
    await expect(page.locator('.stats-grid')).toBeVisible();
    await expect(page.locator('.stat-card').first()).toBeVisible();
  });

  test('should navigate to opportunities', async ({ page }) => {
    await page.click('a[href="/opportunities"]');
    await expect(page).toHaveURL(/\/opportunities/);
    await expect(page.locator('h1')).toContainText('Oportunidades');
  });

  test('should navigate to inbox', async ({ page }) => {
    await page.click('a[href="/inbox"]');
    await expect(page).toHaveURL(/\/inbox/);
    await expect(page.locator('h1')).toContainText('Inbox');
  });

  test('should navigate to import', async ({ page }) => {
    await page.click('a[href="/import"]');
    await expect(page).toHaveURL(/\/import/);
    await expect(page.locator('h1')).toContainText('Importar Oportunidades');
  });

  test('should open create opportunity modal from dashboard', async ({ page }) => {
    await page.click('button:has-text("Nova oportunidade")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('#modal-title')).toContainText('Nova oportunidade');
  });

  test('should create new opportunity', async ({ page }) => {
    await page.click('button:has-text("Nova oportunidade")');
    await page.fill('#title', 'Teste E2E Developer');
    await page.fill('#company', 'Empresa Teste');
    await page.fill('#technologies', 'Angular, TypeScript');
    await page.click('button[type="submit"]:has-text("Criar")');

    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('text=Teste E2E Developer')).toBeVisible();
  });
});

test.describe('JobInbox - Opportunities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/opportunities');
    await page.waitForLoadState('networkidle');
  });

  test('should filter by status', async ({ page }) => {
    await page.selectOption('#status', 'Nova');
    await expect(page.locator('.item-card')).toHaveCountGreaterThan(0);
  });

  test('should filter by type', async ({ page }) => {
    await page.selectOption('#type', 'CLT');
    await expect(page.locator('.item-card')).toHaveCountGreaterThan(0);
  });

  test('should search opportunities', async ({ page }) => {
    await page.fill('#search', 'Front-End');
    await expect(page.locator('.item-card')).toHaveCountGreaterThan(0);
  });

  test('should sort opportunities', async ({ page }) => {
    await page.selectOption('#sortBy', 'title');
    await expect(page.locator('.item-card').first()).toBeVisible();
  });

  test('should export JSON', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.click('button[title="Exportar JSON"]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('oportunidades.json');
  });

  test('should export CSV', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.click('button[title="Exportar CSV"]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('oportunidades.csv');
  });

  test('should open edit modal', async ({ page }) => {
    await page.click('.item-card .btn-icon:first-child');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('#modal-title')).toContainText('Editar oportunidade');
  });
});

test.describe('JobInbox - Inbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inbox');
    await page.waitForLoadState('networkidle');
  });

  test('should display messages', async ({ page }) => {
    await expect(page.locator('.message-card')).toHaveCountGreaterThan(0);
  });

  test('should filter messages by status', async ({ page }) => {
    await page.selectOption('#statusFilter', 'pending');
    await expect(page.locator('.message-card.unread')).toHaveCountGreaterThan(0);
  });

  test('should filter messages by type', async ({ page }) => {
    await page.selectOption('#typeFilter', 'Vaga');
    await expect(page.locator('.message-card')).toHaveCountGreaterThan(0);
  });

  test('should analyze message', async ({ page }) => {
    const firstMessage = page.locator('.message-card').first();
    await firstMessage.locator('button:has-text("Analisar oportunidade")').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('#analysis-title')).toContainText('Oportunidade identificada');
  });
});

test.describe('JobInbox - Import', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/import');
    await page.waitForLoadState('networkidle');
  });

  test('should show upload area', async ({ page }) => {
    await expect(page.locator('.upload-area')).toBeVisible();
  });

  test('should import JSON file', async ({ page }) => {
    const fileContent = JSON.stringify([
      {
        title: 'Imported Job',
        company: 'Import Corp',
        technologies: ['React', 'Node.js'],
        type: 'CLT',
        status: 'Nova',
        workMode: 'Remota',
        description: 'Test import',
        link: 'https://example.com',
        salary: 'R$ 10.000',
        location: 'São Paulo',
      },
    ]);

    const filePath = 'test-import.json';
    fs.writeFileSync(filePath, fileContent);

    await page.setInputFiles('#fileInput', filePath);
    await expect(page.locator('.preview-section')).toBeVisible();
    await page.click('button:has-text("Confirmar importação")');
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('text=Imported Job')).toBeVisible();

    fs.unlinkSync(filePath);
  });
});

test.describe('JobInbox - Accessibility', () => {
  test('should have skip link', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('should navigate with keyboard', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link:focus');
    await expect(skipLink).toBeVisible();
  });

  test('should trap focus in modal', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Nova oportunidade")');

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Tab should cycle within modal
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
