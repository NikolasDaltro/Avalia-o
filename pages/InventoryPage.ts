import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator(
      '[data-test="shopping-cart-badge"]'
    );
    this.cartLink = page.locator(
      '[data-test="shopping-cart-link"]'
    );
  }

  async adicionarProdutoAoCarrinho(
    nomeProduto: string
  ): Promise<void> {
    const produto = this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: nomeProduto });

    await expect(produto).toBeVisible();

    await produto
      .locator('button')
      .click();
  }

  async validarQuantidadeCarrinho(
    quantidade: number
  ): Promise<void> {
    await expect(this.cartBadge).toHaveText(
      String(quantidade)
    );
  }

  async abrirCarrinho(): Promise<void> {
    await this.cartLink.click();

    await expect(this.page).toHaveURL(/cart/);
  }
}