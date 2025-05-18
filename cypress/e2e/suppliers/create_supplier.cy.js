import {BASE_URL, USERNAME, PASSWORD} from '../../support/constants'

describe('Suppliers table', () => {
    beforeEach(() => {
        cy.visit(BASE_URL);
        cy.get('input[type="text"').first().type(USERNAME);
        cy.get('input[type="password"').first().type(PASSWORD);
        cy.get('[data-testid="loginButton"]').click();
        cy.url().should('match', /\/products$/);
        cy.wait(1000);
        cy.get('a[href="/manufacturers"]').click();
        cy.url().should('include', '/manufacturers');
        cy.wait(1000);
        cy.contains('button', 'CREATE SUPPLIER').click();
    });

    it('should display the new supplier form', () => {

        cy.contains('Add a new supplier to the platform').should('be.visible');
        cy.get('input[name="nombre"]').should('exist');
        cy.get('input[name="pais"]').should('exist');
        cy.contains('SUBMIT').should('be.visible');
        cy.contains('CANCEL').should('be.visible');
    });

    it('should close the form when cancel is clicked', () => {
        cy.contains('CANCEL').click();
        cy.contains('New Supplier').should('not.exist');
    });

    it('should fill the form with random data', () => {

        const randomName = `Product ${Date.now()}`;
        const countries = ['Argentina', 'Colombia', 'Honduras', 'Nicaragua', 'Paraguay', 'Puerto Rico', 'República Dominicana', 'Testland', 'Mexico', 'Chile'];
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];

        cy.get('input[name="nombre"]').type(randomName);
        cy.get('input[name="pais"]').type(randomCountry);
    });

    it('should submit the form and get success response', () => {
        const randomName = `Product ${Date.now()}`;
        const countries = ['Argentina', 'Colombia', 'Honduras', 'Nicaragua', 'Paraguay', 'Puerto Rico', 'República Dominicana', 'Testland', 'Mexico', 'Chile'];
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];

        cy.intercept('POST', '**/productos/crear_fabricante').as('createSupplier');

        cy.get('input[name="nombre"]').type(randomName);
        cy.get('input[name="pais"]').type(randomCountry);
        cy.contains('SUBMIT').click();

        cy.wait('@createSupplier').its('response.statusCode').should('eq', 201);
        cy.get('@createSupplier').its('request.url').should('match', /\/productos\/crear_fabricante$/);
    });

})