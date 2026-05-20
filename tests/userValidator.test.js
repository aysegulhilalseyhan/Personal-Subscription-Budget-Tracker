const test = require('node:test');
const assert = require('node:assert/strict');
const { validateBudgetInput } = require('../src/validators/userValidator');

test('validateBudgetInput accepts zero and positive monthly budget values', () => {
  assert.equal(validateBudgetInput({ monthlyBudgetLimit: 0 }).isValid, true);
  assert.equal(validateBudgetInput({ monthlyBudgetLimit: 750 }).isValid, true);
});

test('validateBudgetInput rejects negative and non-numeric values', () => {
  assert.equal(validateBudgetInput({ monthlyBudgetLimit: -1 }).isValid, false);
  assert.equal(validateBudgetInput({ monthlyBudgetLimit: 'abc' }).isValid, false);
});
