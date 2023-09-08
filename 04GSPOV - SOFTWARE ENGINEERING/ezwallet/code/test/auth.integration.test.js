import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import "jest-extended"
const bcrypt = require("bcryptjs")
import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';
import { response } from 'express';
dotenv.config();

beforeAll(async () => {
  const dbName = "testingDatabaseAuth";
  const url = `${process.env.MONGO_URI}/${dbName}`;
  mongoose.set('strictQuery', false);
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});


beforeEach( async() => {
  await User.deleteMany({})
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('register', () => {
  test('Should create a new user and return 200', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ 
        username: 'Mario', 
        email: 'mario.red@email.com', 
        password: 'securePass', 
      });
    expect(response.status).toBe(200);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(false);
  });
  test('Should return an error if the email have invalid format', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'Mario',
        email: 'invalidemail', 
        password: 'securePass',
      });
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  //Check empty string 
  test('Should return an error if at least one parameter is an empty string', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'Mario',
        email: 'mario.red@email.com',
        password: '', // Password empty string
      });
  
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
    
  });
  // Check empty string
  test('Should return an error if at least one parameter is an empty string', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        username: '', // Username empty string
        email: 'mario.red@email.com',
        password: 'securePass',
      });
  
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should return an error if at least one parameter is an empty string', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'Mario', 
        email: 'mario.red@email.com',
        password: '', // Password empty string
      });
  
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should return an error for already registered user', async () => {
    await User.create({ 
      username: 'Mario', 
      email: 'mario.red@email.com', 
      password: 'securePass',
    });
    const response = await request(app)
      .post('/api/register')
      .send({ 
        username: 'Mario', 
        email: 'mario.red@email.com', 
        password: 'securePass',
      });
    
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
});

describe("registerAdmin", () => {
  // Admin added successfully
  test('should register a new admin and return 200', async () => {
    const response = await request(app)
      .post('/api/admin')
      .send({
        username: 'admin',
        email: 'admin@email.com',
        password: 'securePass',
        
      });
    expect(response.status).toBe(200);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(false);
    
  });
  // Not contain all the necessary attributes
  test('should return an error if any required attributes is missing', async () => {
    const response = await request(app)
      .post('/api/admin')
      .send({
        username: 'admin',
        //email and password missing
      });
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
   
  });
  test('Should return an error if the email have invalid format', async () => {
    const response = await request(app)
      .post('/api/admin')
      .send({
        username: 'admin',
        email: 'invalidemail', //email non valida
        password: 'securePass',
      });
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  //Check empty string 
  test('Should return an error if at least one parameter is an empty string', async () => {
    const response = await request(app)
      .post('/api/admin')
      .send({
        username: 'admin',
        email: '', //empty string
        password: 'securePass', 
      });
  
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
    
  });
  // Check empty string
  test('Should return an error if at least one parameter is an empty string', async () => {
    const response = await request(app)
      .post('/api/admin')
      .send({
        username: '', // Username empty string
        email: 'admin@email.com',
        password: 'securePass',
      });
  
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should return an error if at least one parameter is an empty string', async () => {
    const response = await request(app)
      .post('/api/admin')
      .send({
        username: 'admin', 
        email: 'admin@email.com',
        password: '', // Password empty string
      });
  
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should return an error for already registered user', async () => {
    await User.create({ 
      username: 'admin', 
      email: 'admin@email.com', 
      password: 'securePass',
      role: 'Admin'
    });
    const response = await request(app)
      .post('/api/admin')
      .send({
        username: 'admin',
        email: 'admin@email.com',
        password: 'securePass',
    });
    
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
});

describe('login', () => {
  test('Should return access and refresh tokens on successful login', async () => {
    const password = await bcrypt.hash("securePass", 12)
    await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: password,
    })
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'mario.red@email.com',
        password: 'securePass',
      });
    
    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(false);
    
  });
  test('Should return an error if email is missing', async () => {
    const password = await bcrypt.hash("securePass", 12)
    await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: password,
    })
    const userData = {
      //email missing
      password: 'securePass'
    };
    const response = await request(app)
      .post('/api/login')
      .send(userData)
      
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);    
  });
  test('Should return an error if at least one of the parameters is an empty string', async () => {
    const password = await bcrypt.hash("securePass", 12)
    await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: password,
    })
    const userData = {
      email: ' ',
      password: 'securePass'
    };
    const response = await request(app)
      .post('/api/login')
      .send(userData)
    
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);  
  });
  test('Should return an error if the email is not in a valid format', async () => {
    const password = await bcrypt.hash("securePass", 12)
    await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: password,
    })
    const userData = {
      email: 'invalidemail',
      password: 'securePass'
    };
    const response = await request(app)
      .post('/api/login')
      .send(userData)
     
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true); 
  });
  test('Should return an error if the email does not identify a user in the database', async () => {
    const password = await bcrypt.hash("securePass", 12)
    await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: password,
    })
    const userData = {
      email: 'nonexistent@example.com',
      password: 'securePass'
    };
    const response = await request(app)
      .post('/api/login')
      .send(userData)
    
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true); 
    
  });
  test('Should return an error if the supplied password does not match with the one in the database', async () => {
    const password = await bcrypt.hash("securePass", 12)
    await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: password,
    })
    const userData = {
      email: 'mario.red@email.com',
      password: 'incorrectpassword'
    };
    const response = await request(app)
      .post('/api/login')
      .send(userData)
  
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true); 
  });
});

describe('logout', () => {
  test('Should logout a user', async () => {
    
    // Create new test user with refresh token
    const password = await bcrypt.hash("securePass", 12);
    const user = await User.create({
      username: 'Mario',
      email: 'mario.red@email.com',
      password: password,
      refreshToken: 'prova_refresh_token',
    });
       
    const response = await request(app)
      .get('/api/logout')
      .set('Cookie', `refreshToken=${user.refreshToken}`);
    expect(response.statusCode).toBe(200);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(false);
    // Check delete cookies
    const cookies = response.headers['set-cookie'];
    expect(cookies).toContainEqual(
      expect.stringContaining('accessToken=;'),
    );
    expect(cookies).toContainEqual(
      expect.stringContaining('refreshToken=;'),
    );
  });
  test('Should return an error if refreshToken is not provided', async () => {
    // request without refreshToken
    const password = await bcrypt.hash("securePass", 12);
    const user = await User.create({
      username: 'Mario',
      email: 'mario.red@email.com',
      password: password,
      refreshToken: 'prova_refresh_token',
    });
    const response = await request(app).get('/api/logout');
    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true); 
  });
  test('Should return an error if user is not found', async () => {
    // refresh token not valid
    const password = await bcrypt.hash("securePass", 12);
    const user = await User.create({
      username: 'Mario',
      email: 'mario.red@email.com',
      password: password,
      refreshToken: 'prova_refresh_token',
    });
    const response = await request(app)
      .get('/api/logout')
      .set('Cookie', 'refreshToken=non_valido');
      expect(response.status).toBe(400);
      const errorMessage = response.body.error ? true : response.body.message ? true : false;
      expect(errorMessage).toBe(true); 
  });
});