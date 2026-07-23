/* eslint-disable */
describe('Health Check API - Cypress', () => {
  it('returns a successful health status', () => {
    cy.request('/api/health').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('ok');
      expect(response.body.service).to.eq('pern-stack-task-management-system');
    });
  });
});
