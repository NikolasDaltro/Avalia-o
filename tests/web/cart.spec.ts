import { test } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Fluxos Web - SauceDemo', () => {

  test.describe('Cenários Positivos', () => {

    test('usuário deve adicionar produto ao carrinho com sucesso', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await loginPage.validarLoginRealizado();

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Backpack'
      );

      await inventoryPage.validarQuantidadeCarrinho(1);

      await inventoryPage.abrirCarrinho();

      await cartPage.validarProduto(
        'Sauce Labs Backpack',
        '$29.99'
      );
    });

    test('usuário deve adicionar dois produtos e visualizar a quantidade correta no carrinho', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await loginPage.validarLoginRealizado();

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Backpack'
      );

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Bike Light'
      );

      await inventoryPage.validarQuantidadeCarrinho(2);
    });

    test('usuário deve remover produto do carrinho com sucesso', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await loginPage.validarLoginRealizado();

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Backpack'
      );

      await inventoryPage.validarQuantidadeCarrinho(1);

      await inventoryPage.abrirCarrinho();

      await cartPage.removerProduto(
        'Sauce Labs Backpack'
      );

      await cartPage.validarProdutoRemovido(
        'Sauce Labs Backpack'
      );
    });

    test('usuário deve realizar uma compra completa com sucesso', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await loginPage.validarLoginRealizado();

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Backpack'
      );

      await inventoryPage.validarQuantidadeCarrinho(1);

      await inventoryPage.abrirCarrinho();

      await cartPage.validarProduto(
        'Sauce Labs Backpack',
        '$29.99'
      );

      await checkoutPage.iniciarCheckout();

      await checkoutPage.preencherDados(
        'Nikolas',
        'QA',
        '77000-000'
      );

      await checkoutPage.continuarCheckout();

      await checkoutPage.validarProdutoNoResumo(
        'Sauce Labs Backpack',
        '$29.99'
      );

      await checkoutPage.validarResumoFinanceiro(
        '$29.99',
        '$32.39'
      );

      await checkoutPage.finalizarCompra();

      await checkoutPage.validarCompraFinalizada();
    });

  });

  test.describe('Cenários Negativos', () => {

    test('deve exibir erro ao realizar login com credenciais inválidas', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'usuario_invalido',
        'senha_invalida'
      );

      await loginPage.validarMensagemErro(
        'Username and password do not match'
      );
    });

    test('deve impedir login de usuário bloqueado', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'locked_out_user',
        'secret_sauce'
      );

      await loginPage.validarMensagemErro(
        'Sorry, this user has been locked out'
      );
    });

    test('deve impedir login quando o usuário não for informado', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        '',
        'secret_sauce'
      );

      await loginPage.validarMensagemErro(
        'Username is required'
      );
    });

    test('deve impedir login quando a senha não for informada', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        ''
      );

      await loginPage.validarMensagemErro(
        'Password is required'
      );
    });

    test('usuário não deve avançar no checkout sem informar o CEP', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const checkoutPage = new CheckoutPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await loginPage.validarLoginRealizado();

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Backpack'
      );

      await inventoryPage.abrirCarrinho();

      await checkoutPage.iniciarCheckout();

      await checkoutPage.preencherDados(
        'Nikolas',
        'QA',
        ''
      );

      await checkoutPage.continuarCheckout();

      await checkoutPage.validarMensagemErro(
        'Postal Code is required'
      );
    });

  });

});