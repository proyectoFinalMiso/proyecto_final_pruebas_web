import {BASE_URL, USERNAME, PASSWORD} from '../../support/constants'

describe('Products table', () => {
    beforeEach(() => {
        cy.visit(BASE_URL);
        cy.get('input[type="text"').first().type(USERNAME);
        cy.get('input[type="password"').first().type(PASSWORD);
        cy.get('[data-testid="loginButton"]').click();
        cy.url().should('match', /\/products$/);
        cy.wait(1000);
        cy.get('a[href="/sales"]').click();
        cy.url().should('include', '/sales');
        cy.wait(1000);
        cy.contains('button', 'Sales Plan').click();
    })

    it('should display the create sales plan form', () => {
        cy.contains('Create sales plan').should('be.visible');
        cy.contains('Create a sales plan for a seller').should('be.visible');
        cy.get('form').should('exist');
    });

    it('should close the form when cancel is clicked', () => {
        cy.contains('CANCEL').click();
        cy.contains('Create sales plan').should('not.exist');
    });

    it('should allow entering data in all fields', () => {
        cy.get('div[title="Fabricante del producto"]').click();
        cy.get('ul[role="listbox"] li').then($options => {
           const randomIndex = Math.floor(Math.random() * $options.length);
            cy.wrap($options[randomIndex]).click({force: true});
        });
        cy.get('input[name="meta_venta"]').type(Cypress._.random(10000, 1000000));
        cy.get('input[name="productos_plan"]').type('Test product');
    });

    // it('should submit the form and show a success message', () => {
    //     cy.get('div[title="Fabricante del producto"]').click();
    //     cy.get('ul[role="listbox"] li').then($options => {
    //        const randomIndex = Math.floor(Math.random() * $options.length);
    //         cy.wrap($options[randomIndex]).click({force: true});
    //     });
    //     cy.get('input[name="meta_venta"]').type(Cypress._.random(10000, 1000000));
    //     cy.get('input[name="productos_plan"]').type('Test product');

    //     cy.intercept('POST', '**/vendedor/crear_plan_ventas').as('createPlan');

    //     cy.get('button[type="submit"]').click();

    //     cy.wait('@createPlan').its('response.statusCode').should('eq', 201);
    //     cy.get('@createPlan').its('request.url').should('match', /\/vendedor\/crear_plan_ventas$/);
    // });

})