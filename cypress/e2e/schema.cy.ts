/* eslint-disable */
import Ajv from 'ajv';

describe('JSON Schema Contract Testing - Cypress', () => {
  const ajv = new Ajv();

  const healthSchema = {
    type: 'object',
    properties: {
      status: { type: 'string' },
      service: { type: 'string' },
      timestamp: { type: 'string' },
    },
    required: ['status', 'service', 'timestamp'],
    additionalProperties: false,
  };

  it('Validates /health response against strict JSON Schema', () => {
    cy.request('/health').then((response) => {
      expect(response.status).to.eq(200);

      const validate = ajv.compile(healthSchema);
      const isValid = validate(response.body);

      // If validation fails, this will print exactly which field failed in Cypress logs
      expect(isValid, JSON.stringify(validate.errors)).to.be.true;
    });
  });
});
