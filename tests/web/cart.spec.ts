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

      /*
       * FALHA CONTROLADA 1 — QUANTIDADE INCORRETA
       *
       * Descomente a linha abaixo para provocar uma falha intencional.
       * O carrinho possui 1 produto, mas a validação irá esperar 5.
       * Pode ser utilizada para verificar a geração de screenshot,
       * vídeo e trace do Playwright em caso de falha.
       */

      // await inventoryPage.validarQuantidadeCarrinho(5);

      await inventoryPage.abrirCarrinho();

      await cartPage.validarProduto(
        'Sauce Labs Backpack',
        '$29.99'
      );

      /*
       * FALHA CONTROLADA 2 — PREÇO INCORRETO
       *
       * Descomente o bloco abaixo para simular uma divergência
       * entre o preço esperado e o preço apresentado no carrinho.
       */

      // await cartPage.validarProduto(
      //   'Sauce Labs Backpack',
      //   '$99.99'
      // );
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

      /*
       * FALHA CONTROLADA 3 — TOTAL INCORRETO
       *
       * Descomente o bloco abaixo para simular uma divergência
       * no valor total apresentado durante o checkout.
       *
       * O total correto esperado neste cenário é $32.39.
       */

       //await checkoutPage.validarResumoFinanceiro(
       //  '$29.99',
       //  '$99.99'
       //);

      await checkoutPage.finalizarCompra();

      await checkoutPage.validarCompraFinalizada();
    });


    test('deve remover um de dois produtos e manter o outro no carrinho', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Backpack'
      );

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Bike Light'
      );

      await inventoryPage.validarQuantidadeCarrinho(2);

      await inventoryPage.abrirCarrinho();

      await cartPage.removerProduto(
        'Sauce Labs Backpack'
      );

      await inventoryPage.validarQuantidadeCarrinho(1);

      await cartPage.validarProdutoRemovido(
        'Sauce Labs Backpack'
      );

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

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

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

      await inventoryPage.validarCarrinhoVazio();
    });


    test('deve manter o produto no carrinho ao continuar comprando', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Backpack'
      );

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

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Backpack'
      );

      await inventoryPage.validarQuantidadeCarrinho(1);

      await page.reload();

      await inventoryPage.validarQuantidadeCarrinho(1);

      /*
       * FALHA CONTROLADA 4 — PERSISTÊNCIA DO CARRINHO
       *
       * Neste cenário o produto deve continuar no carrinho
       * após o reload.
       *
       * Descomente a linha abaixo para provocar uma falha
       * simulando uma expectativa incorreta de carrinho vazio.
       */

       //await inventoryPage.validarCarrinhoVazio();
    });


    test('deve exibir corretamente dois produtos adicionados ao carrinho', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Backpack'
      );

      await inventoryPage.adicionarProdutoAoCarrinho(
        'Sauce Labs Bike Light'
      );

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

      /*
       * FALHA CONTROLADA 5 — PRODUTO INEXISTENTE
       *
       * Descomente o bloco abaixo para simular uma situação
       * em que um produto esperado não está presente no carrinho.
       */

      //await cartPage.validarProduto(
      //'Produto Inexistente',
      // '$9.99'
      //);
    });


    test('deve adicionar produto ao carrinho pela página de detalhes', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.acessar();

      await loginPage.realizarLogin(
        'standard_user',
        'secret_sauce'
      );

      await inventoryPage.abrirDetalhesProduto(
        'Sauce Labs Backpack'
      );

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