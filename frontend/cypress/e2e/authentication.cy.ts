describe('Autenticacion - Login', () => {
  it('inicia sesion correctamente con usuario admin', () => {
    cy.visit('/');

    cy.get('input[name="correo"]', { timeout: 20000 }).should('be.visible').type('admin');
    cy.get('input[name="contrasena"]').should('be.visible').type('admin123');

    cy.contains('button', 'Entrar al sistema').click();

    cy.contains('p', 'Login correcto', { timeout: 20000 }).should('be.visible');
    cy.contains('p', 'Rol: ADMIN', { timeout: 20000 }).should('be.visible');
    cy.contains('h1', 'CRUD Empleados', { timeout: 20000 }).should('be.visible');
  });
});
