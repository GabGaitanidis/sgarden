// ---------------------------------------------------------------------------
// Custom Cypress commands for SGarden smoke tests
// ---------------------------------------------------------------------------

const apiUrl = () => Cypress.env('apiUrl') || 'http://localhost:4000/api';

function establishSession(username, password, label) {
  cy.request({
    method: 'POST',
    url: `${apiUrl()}/authenticate`,
    body: { username, password },
    failOnStatusCode: false,
  }).then(({ body }) => {
    if (!body || !body.token) {
      throw new Error(`${label} login failed: ${body?.message ?? 'no token returned'}`);
    }
    cy.setCookie('_sgarden', body.token, { path: '/', sameSite: 'lax' });
  });
}

/**
 * Log in programmatically as the admin test account (admin / admin123).
 * Sets the _sgarden JWT cookie so Protected routes render without UI login.
 */
Cypress.Commands.add('loginAsAdmin', () => {
  cy.session('sgarden-admin-session', () => {
    establishSession('admin', 'admin123', 'Admin');
  }, {
    validate: () => {
      cy.getCookie('_sgarden').should('exist');
    },
  });
});

/**
 * Log in programmatically as the regular test account (user / user1234).
 */
Cypress.Commands.add('loginAsUser', () => {
  cy.session('sgarden-user-session', () => {
    establishSession('user', 'user1234', 'User');
  }, {
    validate: () => {
      cy.getCookie('_sgarden').should('exist');
    },
  });
});
