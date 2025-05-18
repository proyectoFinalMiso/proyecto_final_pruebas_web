import {BASE_URL, USERNAME, PASSWORD} from '../../support/constants'

describe('Products table', () => {
    beforeEach(() => {
        cy.visit(BASE_URL);
        cy.get('input[type="text"').first().type(USERNAME);
        cy.get('input[type="password"').first().type(PASSWORD);
        cy.get('[data-testid="loginButton"]').click();
        cy.url().should('match', /\/products$/);
        cy.wait(1000);
        cy.get('a[href="/orders"]').click();
        cy.url().should('include', '/orders');
        cy.wait(1000);
    });

    it('should display the orders table with correct columns', () => {
        cy.contains('ID').should('be.visible');
        cy.contains('Status').should('be.visible');
        cy.contains('Creation Date').should('be.visible');
        cy.contains('Customer').should('be.visible');
        cy.contains('Seller').should('be.visible');
        cy.contains('Latitude').should('be.visible');
        cy.contains('Longitude').should('be.visible');
        cy.contains('Delivery Route').should('be.visible');
    });

    it('should display at least one order row', () => {
        cy.get('.MuiDataGrid-row').should('have.length.greaterThan', 0);
    });

    it('should open the column menu on hover and click for each column', () => {
        cy.get('.MuiDataGrid-columnHeader').each(($header) => {
            cy.wrap($header)
                .trigger('mouseover')
                .find('.MuiDataGrid-menuIconButton, .MuiDataGrid-menuIcon button')
                .click({ force: true });
            cy.get('.MuiPopover-root, [role="menu"]').should('exist');
            cy.get('body').type('{esc}');
        });
    });

})