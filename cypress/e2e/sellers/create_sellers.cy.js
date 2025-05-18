import {BASE_URL, USERNAME, PASSWORD} from '../../support/constants'

describe('Suppliers table', () => {
    beforeEach(() => {
        cy.visit(BASE_URL);
        cy.get('input[type="text"').first().type(USERNAME);
        cy.get('input[type="password"').first().type(PASSWORD);
        cy.get('[data-testid="loginButton"]').click();
        cy.url().should('match', /\/products$/);
        cy.wait(1000);
        cy.get('a[href="/sellers"]').click();
        cy.url().should('include', '/sellers');
        cy.contains('button', 'NEW SELLER').click();
        cy.wait(1000);
    });

    it('should display the new seller form', () => {
        cy.contains('New Seller').should('be.visible');
        cy.contains('Register a new seller').should('be.visible');
        cy.get('input[name="nombre"]').should('exist');
        cy.get('input[name="email"]').should('exist');
        cy.get('input[name="password"]').should('exist');
        cy.contains('SUBMIT').should('be.visible');
        cy.contains('CANCEL').should('be.visible');
    });

    it('should close the form when cancel is clicked', () => {
        cy.contains('CANCEL').click();
        cy.contains('New Seller').should('not.exist');
    });

    it('should fill the form with random data', () => {
        const randomName = `Seller ${Date.now()}`;
        const randomEmail = `seller${Date.now()}@ccp.com`;
        const randomPassword = `Pass${Math.floor(Math.random() * 10000)}!`;

        cy.get('input[name="nombre"]').type(randomName);
        cy.get('input[name="email"]').type(randomEmail);
        cy.get('input[name="password"]').type(randomPassword);
    });

    it('should submit the form and get success response', () => {
        const randomName = `Seller ${Date.now()}`;
        const randomEmail = `seller${Date.now()}@ccp.com`;
        const randomPassword = `Pass${Math.floor(Math.random() * 10000)}!`;

        cy.intercept('POST', '**/vendedor/crear_vendedor').as('createSeller');

        cy.get('input[name="nombre"]').type(randomName);
        cy.get('input[name="email"]').type(randomEmail);
        cy.get('input[name="password"]').type(randomPassword);
        cy.contains('SUBMIT').click();

        cy.wait('@createSeller').its('response.statusCode').should('eq', 201);
        cy.get('@createSeller').its('request.url').should('match', /\/vendedor\/crear_vendedor$/);
    });
    
});