const request = require('supertest');
const express = require('express');

// Mock Express app for testing
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

describe('Server Endpoints', () => {
  it('should return Hello World on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});

