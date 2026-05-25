describe('Autenticacion - Login', () => {
  it('inicia sesion correctamente con usuario admin', () => {
    cy.intercept('POST', '/auth/login', {
      token: 'fake-token',
      role: 'ADMIN'
    }).as('login');
    cy.intercept('GET', '/api/departamentos*', []).as('departamentos');
    cy.intercept('GET', '/api/empleados*', []).as('empleados');

    cy.visit('/', { timeout: 60000 });

    cy.get('input[name="correo"]', { timeout: 20000 }).should('be.visible').type('admin');
    cy.get('input[name="contrasena"]').should('be.visible').type('admin123');

    cy.contains('button', 'Entrar al sistema').click();
    cy.wait('@login');
    cy.wait('@departamentos');
    cy.wait('@empleados');
    cy.contains('button', 'Cerrar sesion', { timeout: 30000 }).should('be.visible');
    cy.contains('h1', 'CRUD Empleados', { timeout: 30000 }).should('be.visible');
    cy.contains('p', 'Rol: ADMIN', { timeout: 30000 }).should('be.visible');
  });
});
