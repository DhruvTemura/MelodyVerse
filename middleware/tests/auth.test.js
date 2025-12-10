const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

// Test database connection
beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/melodyverse_test_db';
  await mongoose.connect(testDbUri);
});

// Clear database after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/auth/signup', () => {
  test('Should register a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toBe('testuser');
    expect(response.body.user.email).toBe('test@example.com');
    expect(response.body.user.password).toBeUndefined();
  });

  test('Should fail with duplicate email', async () => {
    // Create first user
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'user1',
        email: 'duplicate@example.com',
        password: 'password123'
      });

    // Try to create second user with same email
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'user2',
        email: 'duplicate@example.com',
        password: 'password456'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Email already registered');
  });

  test('Should fail with duplicate username', async () => {
    // Create first user
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'sameuser',
        email: 'user1@example.com',
        password: 'password123'
      });

    // Try to create second user with same username
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'sameuser',
        email: 'user2@example.com',
        password: 'password456'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Username already taken');
  });

  test('Should fail with invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('Should fail with short password', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: '12345'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    // Create a test user before each login test
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123'
      });
  });

  test('Should login with email successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'login@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('login@example.com');
  });

  test('Should login with username successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'loginuser',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toBe('loginuser');
  });

  test('Should fail with wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'login@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Invalid credentials');
  });

  test('Should fail with non-existent user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'nonexistent@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Invalid credentials');
  });

  test('Should fail with empty credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: '',
        password: ''
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe('POST /api/auth/forgot-password', () => {
  beforeEach(async () => {
    // Create a test user
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'resetuser',
        email: 'reset@example.com',
        password: 'password123'
      });
  });

  test('Should send reset token successfully', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'reset@example.com'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.resetToken).toBeDefined();
  });

  test('Should fail with non-existent email', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'nonexistent@example.com'
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test('Should fail with invalid email format', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'invalid-email'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe('POST /api/auth/reset-password', () => {
  let resetToken;

  beforeEach(async () => {
    // Create user and get reset token
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'resetuser',
        email: 'reset@example.com',
        password: 'oldpassword123'
      });

    const forgotResponse = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'reset@example.com'
      });

    resetToken = forgotResponse.body.resetToken;
  });

  test('Should reset password successfully', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: resetToken,
        password: 'newpassword123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // Try logging in with new password
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'reset@example.com',
        password: 'newpassword123'
      });

    expect(loginResponse.status).toBe(200);
  });

  test('Should fail with invalid token', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: 'invalidtoken123',
        password: 'newpassword123'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('Should fail with short password', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: resetToken,
        password: '12345'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});