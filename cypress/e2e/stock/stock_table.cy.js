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
        cy.wait(3000);
    });

    it('should display the stock table with correct columns', () => {
        const expectedColumns = [
            'Product',
            'Warehouse',
            'Position',
            'SKU',
            'Serial',
            'Available',
            'Reserved'
        ];

        cy.get('.MuiDataGrid-root').should('exist');
        cy.get('.MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderTitle')
            .then($headers => {
                const actualColumns = [...$headers].map(header => header.textContent.trim());
                expect(actualColumns).to.deep.equal(expectedColumns);
            });
        // cy.get('.MuiDataGrid-row').its('length').should('be.gte', 1);
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