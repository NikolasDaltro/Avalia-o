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

    test('deve remover um de dois produtos e manter o outro no carrinho', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await loginPage.acessar();
      await loginPage.realizarLogin('standard_user', 'secret_sauce');

      await inventoryPage.adicionarProdutoAoCarrinho('Sauce Labs Backpack');
      await inventoryPage.adicionarProdutoAoCarrinho('Sauce Labs Bike Light');

      await inventoryPage.validarQuantidadeCarrinho(2);
      await inventoryPage.abrirCarrinho();

      await cartPage.removerProduto('Sauce Labs Backpack');

      await inventoryPage.validarQuantidadeCarrinho(1);

      await cartPage.validarProdutoRemovido('Sauce Labs Backpack');

      await cartPage.validarProduto(
        'Sauce Labs Bike Light',
        '$9.99'
      );
    });

    test('deve remover o último produto e deixar o carrinho vazio', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await loginPage.acessar();
      await loginPage.realizarLogin('standard_user', 'secret_sauce');

      await inventoryPage.adicionarProdutoAoCarrinho('Sauce Labs Backpack');

      await inventoryPage.validarQuantidadeCarrinho(1);
      await inventoryPage.abrirCarrinho();

      await cartPage.removerProduto('Sauce Labs Backpack');

      await cartPage.validarProdutoRemovido('Sauce Labs Backpack');
      await inventoryPage.validarCarrinhoVazio();
    });

    test('deve manter o produto no carrinho ao continuar comprando', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await loginPage.acessar();
      await loginPage.realizarLogin('standard_user', 'secret_sauce');

      await inventoryPage.adicionarProdutoAoCarrinho('Sauce Labs Backpack');

      await inventoryPage.validarQuantidadeCarrinho(1);
      await inventoryPage.abrirCarrinho();

      await cartPage.validarProduto(
        'Sauce Labs Backpack',
        '$29.99'
      );

      await cartPage.continuarComprando();

      await inventoryPage.validarQuantidadeCarrinho(1);
    });

    test('deve manter o produto no carrinho após recarregar a página', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.acessar();
      await loginPage.realizarLogin('standard_user', 'secret_sauce');

      await inventoryPage.adicionarProdutoAoCarrinho('Sauce Labs Backpack');

      await inventoryPage.validarQuantidadeCarrinho(1);

      await page.reload();

      await inventoryPage.validarQuantidadeCarrinho(1);
    });

    test('deve exibir corretamente dois produtos adicionados ao carrinho', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await loginPage.acessar();
      await loginPage.realizarLogin('standard_user', 'secret_sauce');

      await inventoryPage.adicionarProdutoAoCarrinho('Sauce Labs Backpack');
      await inventoryPage.adicionarProdutoAoCarrinho('Sauce Labs Bike Light');

      await inventoryPage.validarQuantidadeCarrinho(2);
      await inventoryPage.abrirCarrinho();

      await cartPage.validarProduto(
        'Sauce Labs Backpack',
        '$29.99'
      );

      await cartPage.validarProduto(
        'Sauce Labs Bike Light',
        '$9.99'
      );
    });

    test('deve adicionar produto ao carrinho pela página de detalhes', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.acessar();
      await loginPage.realizarLogin('standard_user', 'secret_sauce');

      await inventoryPage.abrirDetalhesProduto('Sauce Labs Backpack');

      await inventoryPage.adicionarProdutoPelosDetalhes();

      await inventoryPage.validarQuantidadeCarrinho(1);
    });

    test('usuário deve realizar logout com sucesso', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await loginPage.validarLoginRealizado();

      await inventoryPage.abrirMenu();

      await inventoryPage.realizarLogout();

      await loginPage.validarTelaLogin();
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

    test('usuário não deve acessar área autenticada após realizar logout', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await loginPage.validarLoginRealizado();

      await inventoryPage.abrirMenu();

      await inventoryPage.realizarLogout();

      await page.goto('/inventory.html');

      await loginPage.validarMensagemErro(
        "You can only access '/inventory.html' when you are logged in"
      );
    });

  });

});