/// <reference types="Cypress" />

describe('CRUD-Clubes', () => {
  before(() => {
    cy.visit('http://127.0.0.1:8080');
  });

  it('Carga lista de clubes', ()=>{
    cy.get('tr').should('have.length', 21);
  });

  it('Ingresa al formulario de nuevo club', () => {
    cy.get('#nuevoequipo').click();
  });

  it('Completa los campos', () => {
    cy.get('#id-nombre').type('222');
    cy.get('#id-nombreCorto').type('222');
    cy.get('#id-acronimo').type('222');
  });

  it('Envía el formulario', () => {
    cy.get('form').submit();
  });

  it('Vuelve a la página principal', () => {
    cy.get('#inicio').click();
  });

  it('Visita al equipo creado', () => {
    cy.get('body > table > tbody > tr:nth-child(22) > td:nth-child(3) > a:nth-child(2)').click()
    //cy.visit('http://127.0.0.1:8080/equipo/222/editar')
  });

  it('Edita el equipo creado', () => {
    cy.get('#id-direccion').type('calle')
  })

  it('Vuelve a la página principal', () => {
    cy.get('#inicio').click();
  });

  it('Hace click en borrar el equipo nuevo', () => {
    cy.get('body > table > tbody > tr:nth-child(22) > td:nth-child(3) > div > a').click();

  })

  it('Comprueba la lista de clubes', ()=>{
    cy.get('tr').should('have.length', 21);
  });

})
