import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /* -------------------------------------------------------------------------- */
  /*                            Ações de Interação                              */
  /* -------------------------------------------------------------------------- */

  async acessar(): Promise<void> {
    await this.page.goto('/');
  }

  async realizarLogin(
    usuario: string,
    senha: string
  ): Promise<void> {
    await this.usernameInput.fill(usuario);
    await this.passwordInput.fill(senha);
    await this.loginButton.click();
  }

  /* -------------------------------------------------------------------------- */
  /*                            Validações Positivas                            */
  /* -------------------------------------------------------------------------- */

  async validarLoginRealizado(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory/);
  }

  async validarTelaLogin(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
    await expect(this.page).toHaveURL('/');
  }

  /* -------------------------------------------------------------------------- */
  /*                   Validações Negativas / Tratamento de Erros               */
  /* -------------------------------------------------------------------------- */

  async validarMensagemErro(
    mensagemEsperada: string
  ): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(
      mensagemEsperada
    );
  }
}