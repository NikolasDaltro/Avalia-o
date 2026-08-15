import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  /* -------------------------------------------------------------------------- */
  /*                            Ações de Interação                              */
  /* -------------------------------------------------------------------------- */

  async adicionarProdutoAoCarrinho(nomeProduto: string): Promise<void> {
    const produto = this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: nomeProduto });

    await expect(produto).toBeVisible();
    await produto.locator('button').click();
  }

  async abrirDetalhesProduto(nomeProduto: string): Promise<void> {
    await this.page
      .locator('[data-test="inventory-item-name"]')
      .filter({ hasText: nomeProduto })
      .click();
  }

  async adicionarProdutoPelosDetalhes(): Promise<void> {
    await this.page.locator('[data-test="add-to-cart"]').click();
  }

  async abrirCarrinho(): Promise<void> {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/cart/);
  }

  async abrirMenu(): Promise<void> {
    await this.page.locator('#react-burger-menu-btn').click();
  }

  async realizarLogout(): Promise<void> {
    await this.page.locator('[data-test="logout-sidebar-link"]').click();
  }

  /* -------------------------------------------------------------------------- */
  /*                            Validações / Asserções                          */
  /* -------------------------------------------------------------------------- */

  async validarQuantidadeCarrinho(quantidade: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(quantidade));
  }

  async validarCarrinhoVazio(): Promise<void> {
    await expect(this.cartBadge).toHaveCount(0);
  }
}