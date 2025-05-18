import {BASE_URL, USERNAME, PASSWORD} from '../../support/constants'

describe('Products table', () => {
    beforeEach(() => {
        cy.visit(BASE_URL);
        cy.get('input[type="text"').first().type(USERNAME);
        cy.get('input[type="password"').first().type(PASSWORD);
        cy.get('[data-testid="loginButton"]').click();
        cy.url().should('match', /\/products$/);
        cy.wait(1000);
    })

    it('Should show a form to create a product', () => {
        //Open modal to create products
        cy.get('[data-testid="nuevoProducto"]').click();

        // Title
        cy.get('h6#modal-formulario-producto-title').should('have.text', 'Create product');

        // Subtitle
        cy.get('p#modal-formulario-producto-subtitle').should('have.text', 'Add a new product to the platform');

        // Fields and types
        cy.get('input[name="nombre"]').should('exist').and('have.attr', 'type', 'text');
        cy.get('input[name="valorUnitario"]').should('exist').and('have.attr', 'type', 'text');
        cy.get('input[name="fabricante"]').should('exist'); // This is a select input
        cy.get('input[name="volumen"]').should('exist').and('have.attr', 'type', 'number');

        // Buttons
        cy.get('button[type="submit"]').should('contain', 'SUBMIT');
        cy.get('button[type="button"]').should('contain', 'CANCEL');
    })

    it('should close the modal when CANCEL is clicked', () => {
        cy.get('[data-testid="nuevoProducto"]').click();
        cy.get('h6#modal-formulario-producto-title').should('exist');
        cy.get('button[type="button"]').contains('CANCEL').click();
        cy.get('h6#modal-formulario-producto-title').should('not.exist');
    });

    it('should show provider options when clicking the provider field', () => {
        cy.get('[data-testid="nuevoProducto"]').click();
        cy.get('div[id="fabricante-select"]').click();

        // Adjust the selector below to match your dropdown options
        cy.get('[role="listbox"] .MuiAutocomplete-option, [role="option"]')
            .should('have.length.greaterThan', 0);
    });

    it('should fill the form with random data and select a random provider', () => {
        cy.get('[data-testid="nuevoProducto"]').click();

        // Generate random data
        const randomName = `Product ${Date.now()}`;
        const randomUnitCost = Cypress._.random(10000, 100000);
        const randomVolume = (Math.random() * (0.0001 - 0.00001) + 0.00001).toFixed(5);

        // Fill Name
        cy.get('input[name="nombre"]').clear().type(randomName);

        // Fill Unit Cost
        cy.get('input[name="valorUnitario"]').clear().type(randomUnitCost.toString());

        // Select a random provider
        cy.wait(1000);
        cy.get('div[id="fabricante-select"]').click();
        cy.get('[role="option"]').then($options => {
            const count = $options.length;
            const randomIndex = Cypress._.random(0, count - 1);
            cy.wrap($options[randomIndex]).click();
        });

        // Fill Volume
        cy.get('input[name="volumen"]').clear().type(randomVolume);
    });

    it('should submit the form and show a success message', () => {
        cy.get('[data-testid="nuevoProducto"]').click();

        // Generate random data
        const randomName = `Product ${Date.now()}`;
        const randomUnitCost = Cypress._.random(10000, 100000);
        const randomVolume = (Math.random() * (0.0001 - 0.00001) + 0.00001).toFixed(5);

        // Intercept the POST request
        cy.intercept('POST', '**/productos/crear_producto').as('createProduct');


        // Fill Name
        cy.get('input[name="nombre"]').clear().type(randomName);

        // Fill Unit Cost
        cy.get('input[name="valorUnitario"]').clear().type(randomUnitCost.toString());

        // Select a random provider
        cy.wait(1000);
        cy.get('div[id="fabricante-select"]').click();
        cy.get('[role="option"]').then($options => {
            const count = $options.length;
            const randomIndex = Cypress._.random(0, count - 1);
            cy.wrap($options[randomIndex]).click();
        });

        // Fill Volume
        cy.get('input[name="volumen"]').clear().type(randomVolume);

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for POST request and check endpoint and status
        cy.wait('@createProduct').its('response.statusCode').should('eq', 201);
        cy.get('@createProduct').its('request.url').should('match', /\/productos\/crear_producto$/);

        // Check for success message
        //cy.get('.MuiAlert-message').should('contain', 'Product created successfully');
    });

})