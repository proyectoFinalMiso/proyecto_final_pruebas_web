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
    
    it('should display the products table', () => {
        const expectedColumns = [
            'SKU',
            'Name',
            'Volume',
            'Provider',
            'Unit Cost',
            'Creation Date',
            'Stock',
            'Missing',
            'Location'
        ];

        cy.get('.MuiDataGrid-root').should('exist');
        cy.get('.MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderTitle')
            .then($headers => {
            const actualColumns = [...$headers].map(header => header.textContent.trim());
            expect(actualColumns).to.deep.equal(expectedColumns);
        });
        cy.get('.MuiDataGrid-row').its('length').should('be.gte', 1);
    })

    it('should open the column menu on hover and click for each column', () => {
        cy.get('.MuiDataGrid-columnHeader').each(($header) => {
        cy.wrap($header)
            .trigger('mouseover') // Hover over the column header
            .find('.MuiDataGrid-menuIconButton, .MuiDataGrid-menuIcon button') // Adjust selector if needed
            .click({ force: true }); // Click the menu icon

        // Optionally, check if the menu appears
        cy.get('.MuiPopover-root, [role="menu"]').should('exist');

        // Close the menu before moving to the next column
        cy.get('body').type('{esc}');
    });
});
    
    // it('should display the correct number of rows in the table', () => {
    //     cy.get('[data-testid="productsTable"] tbody tr').should('have.length', 10);
    // })
})