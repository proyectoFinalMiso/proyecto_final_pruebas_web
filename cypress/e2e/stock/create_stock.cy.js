import {BASE_URL, USERNAME, PASSWORD} from '../../support/constants'

describe('Products table', () => {
    beforeEach(() => {
        cy.visit(BASE_URL);
        cy.get('input[type="text"').first().type(USERNAME);
        cy.get('input[type="password"').first().type(PASSWORD);
        cy.get('[data-testid="loginButton"]').click();
        cy.url().should('match', /\/products$/);
        cy.wait(1000);
        cy.get('a[href="/stock"]').click();
        cy.url().should('include', '/stock');
        cy.wait(1000);
        cy.get('[data-testid="addStock"]').click();
        cy.wait(1000);
    });

    it('should show a form to create stock', () => {

        // Title
        cy.get('h6#modal-formulario-producto-title').should('have.text', 'Store product');

        // Subtitle
        cy.get('p#modal-formulario-producto-subtitle').should('have.text', 'Add a new product delivery to stock');

        // Fields
        cy.get('input[name="producto"]').should('exist');
        cy.get('input[name="lote"]').should('exist').and('have.attr', 'type', 'text');
        cy.get('input[name="cantidad"]').should('exist').and('have.attr', 'type', 'text');
        cy.get('input[name="bodega"]').should('exist');

        // Buttons
        cy.get('button[type="submit"]').should('contain', 'SUBMIT');
        cy.get('button[type="button"]').should('contain', 'CANCEL');
    });

    it('should close the modal when CANCEL is clicked', () => {

        cy.get('h6#modal-formulario-producto-title').should('exist');
        cy.get('button[type="button"]').contains('CANCEL').click();
        cy.get('h6#modal-formulario-producto-title').should('not.exist');
    });

    it('should show product options when clicking the product field', () => {
        // cy.get('[data-testid="addStock"]').click();
        cy.get('div[id="product-select"]').click();
        cy.get('[role="listbox"] [role="option"]').should('have.length.greaterThan', 0);
    });

    it('should show warehouse options when clicking the warehouse field', () => {
        // cy.get('[data-testid="addStock"]').click();
        cy.get('div[id="bodega-select"]').click();
        cy.get('[role="listbox"] [role="option"]').should('have.length.greaterThan', 0);
    });

    it('should fill the form with random data and select random options', () => {
        // cy.get('[data-testid="addStock"]').click();

        // Serial
        const randomSerial = `S${Cypress._.random(10000, 99999)}`;
        cy.get('input[name="lote"]').clear().type(randomSerial);

        // Quantity
        const randomQuantity = Cypress._.random(1, 100);
        cy.get('input[name="cantidad"]').clear().type(randomQuantity.toString());

        // Select random product
        cy.get('div[id="product-select"]').click();
        cy.get('[role="option"]').then($options => {
            const count = $options.length;
            const randomIndex = Cypress._.random(0, count - 1);
            cy.wrap($options[randomIndex]).click();
        });

        // Select random warehouse
        cy.get('div[id="bodega-select"]').click();
        cy.get('[role="option"]').then($options => {
            const count = $options.length;
            const randomIndex = Cypress._.random(0, count - 1);
            cy.wrap($options[randomIndex]).click();
        });

        // Optionally, submit the form
        // cy.get('button[type="submit"]').click();
    });

    it('should submit the form and show a success message', () => {
        // cy.get('[data-testid="addStock"]').click();

        // Intercept the POST request
        cy.intercept('POST', '**/bodega/stock_crear_producto').as('insertStock');

        // Serial
        const randomSerial = `S${Cypress._.random(10000, 99999)}`;
        cy.get('input[name="lote"]').clear().type(randomSerial);

        // Quantity
        const randomQuantity = Cypress._.random(1, 100);
        cy.get('input[name="cantidad"]').clear().type(randomQuantity.toString());

        // Select random product
        cy.get('div[id="product-select"]').click();
        cy.get('[role="option"]').then($options => {
            const count = $options.length;
            const randomIndex = Cypress._.random(0, count - 1);
            cy.wrap($options[randomIndex]).click();
        });

        // Select random warehouse
        cy.get('div[id="bodega-select"]').click();
        cy.get('[role="option"]').then($options => {
            const count = $options.length;
            const randomIndex = Cypress._.random(0, count - 1);
            cy.wrap($options[randomIndex]).click();
        });

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for POST request and check endpoint and status
        cy.wait('@insertStock').its('response.statusCode').should('eq', 201);
        cy.get('@insertStock').its('request.url').should('match', /\/bodega\/stock_crear_producto$/);

    });

})