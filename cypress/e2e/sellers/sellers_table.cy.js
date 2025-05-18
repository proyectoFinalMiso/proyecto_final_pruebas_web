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
        cy.wait(1000);
    });

    it('should display the sellers table with correct columns', () => {
        cy.contains('Name').should('be.visible');
        cy.contains('Email').should('be.visible');
    });

    it('should display at least one seller row', () => {
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
    
});