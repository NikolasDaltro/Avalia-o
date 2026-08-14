import { expect, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async iniciarCheckout(): Promise<void> {
    await this.page
      .locator('[data-test="checkout"]')
      .click();

    await expect(this.page).toHaveURL(
      /checkout-step-one/
    );
  }

  async preencherDados(
    nome: string,
    sobrenome: string,
    cep: string
  ): Promise<void> {
    await this.page
      .locator('[data-test="firstName"]')
      .fill(nome);

    await this.page
      .locator('[data-test="lastName"]')
      .fill(sobrenome);

    await this.page
      .locator('[data-test="postalCode"]')
      .fill(cep);
  }

  async continuarCheckout(): Promise<void> {
    await this.page
      .locator('[data-test="continue"]')
      .click();
  }

  async validarProdutoNoResumo(
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

  async validarResumoFinanceiro(
    subtotalEsperado: string,
    totalEsperado: string
  ): Promise<void> {
    await expect(
      this.page.locator('[data-test="subtotal-label"]')
    ).toContainText(subtotalEsperado);

    await expect(
      this.page.locator('[data-test="total-label"]')
    ).toContainText(totalEsperado);
  }

  async finalizarCompra(): Promise<void> {
    await this.page
      .locator('[data-test="finish"]')
      .click();
  }

  async validarCompraFinalizada(): Promise<void> {
    await expect(
      this.page.locator('[data-test="complete-header"]')
    ).toHaveText('Thank you for your order!');

    await expect(
      this.page.locator('[data-test="complete-text"]')
    ).toBeVisible();
  }

  async validarMensagemErro(
    mensagemEsperada: string
  ): Promise<void> {
    const erro = this.page.locator(
      '[data-test="error"]'
    );

    await expect(erro).toBeVisible();
    await expect(erro).toContainText(
      mensagemEsperada
    );
  }
}