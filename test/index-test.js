'use strict';

const test = require('ava');
const supertest = require('supertest');
const { createCustomServer } = require('../server');

test('should render the page', async (t) => {
  const server = await createCustomServer({ dev: false });
  t.teardown(() => server.closeAsync());

  const response = await supertest(server).get('/');

  t.is(response.statusCode, 200);
  t.true(response.text.includes('Hello world'));
});