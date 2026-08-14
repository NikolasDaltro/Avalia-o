import { expect, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validarProduto(
    nomeProduto: string,
    precoEsperado: string
  ): Promise<void> {
    const item = this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: nomeProduto });

    await expect(item).toBeVisible();
    await expect(item).toContainText(nomeProduto);
    await expect(item).toContainText(precoEsperado);
  }

  async removerProduto(
    nomeProduto: string
  ): Promise<void> {
    const item = this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: nomeProduto });

    await expect(item).toBeVisible();

    await item
      .locator('button')
      .click();
  }

  async validarProdutoRemovido(
    nomeProduto: string
  ): Promise<void> {
    const item = this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: nomeProduto });

    await expect(item).toHaveCount(0);
  }

  async continuarComprando(): Promise<void> {
    await this.page
      .locator('[data-test="continue-shopping"]')
      .click();

    await expect(this.page).toHaveURL(/inventory/);
  }
}