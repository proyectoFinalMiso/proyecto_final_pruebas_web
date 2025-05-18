import {BASE_URL, USERNAME, PASSWORD} from '../../support/constants'

describe('login ', () => {
  it('visit login page', () => {
    cy.visit(BASE_URL);
    cy.get('[data-testid="loginButton"]').should('exist');
    cy.get('input[type="text"').first().type(USERNAME);
    cy.get('input[type="password"').first().type(PASSWORD);
    cy.get('[data-testid="loginButton"]').click();
    cy.url().should('match', /\/products$/);
  })
  // it('Log in', () => {
  //   cy.get('input[id="outlined-basic"]').type(USERNAME)
  //   cy.get('input[type="password"]').type(PASSWORD)
  // })
})

// //*[@id="outlined-basic"]