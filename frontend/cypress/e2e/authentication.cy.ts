describe('Autenticacion - Login', () => {
  it('inicia sesion correctamente con usuario admin', () => {
    cy.visit('/', { timeout: 60000 });

    cy.get('input[name="correo"]', { timeout: 20000 }).should('be.visible').type('admin');
    cy.get('input[name="contrasena"]').should('be.visible').type('admin123');

    cy.contains('button', 'Entrar al sistema').click();
    // Reproduce the manual interaction that unblocks UI updates in affected environments.
    cy.contains('button', 'Ver', { timeout: 20000 }).click({ force: true });
    cy.get('body').click(1, 1, { force: true });

    cy.contains('button', 'Cerrar sesion', { timeout: 30000 }).should('be.visible');
    cy.contains('h1', 'CRUD Empleados', { timeout: 30000 }).should('be.visible');
    cy.contains('p', 'Rol: ADMIN', { timeout: 30000 }).should('be.visible');
  });
});
