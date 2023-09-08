import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User.js';
import { register, registerAdmin, login, logout } from '../controllers/auth';
import jwt from 'jsonwebtoken';
const bcrypt = require("bcryptjs")

jest.mock("bcryptjs")
jest.mock('../models/User.js');

beforeEach(() => {
    User.find.mockReset();
    User.findOne.mockReset();
})
  
describe('register', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should register a new user and return success message', async () => {
        
        // Mocked request and response objects
        const mockReq = {
            body: {
                username: 'mockUsername',
                email: 'mockEmail@example.com',
                password: 'mockPassword',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({});

        await register(mockReq, mockRes);
    
        expect(User.findOne).toHaveBeenCalledWith({
            $or: [{ username: 'mockUsername' }, { email: 'mockEmail@example.com' }],
        });

        const hashedPassword = await bcrypt.hash(mockReq.body.password, 12);
        expect(User.create).toHaveBeenCalledWith({
            username: 'mockUsername',
            email: 'mockEmail@example.com',
            password: hashedPassword,
        });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ 
            data: { 
                message: expect.any(String),
            } 
        });
    });
    test('should return a 400 error if request body is missing attributes', async () => {
        
        // Mocked request and response objects
        const mockReq = {
            body: {
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        await register(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.any(String),
        });
    });
    test('should return a 400 error if email is not in a valid format', async () => {
        
        // Mocked request and response objects
        const mockReq = {
            body: {
                username: 'mockUsername',
                email: 'mockEmail',
                password: 'mockPassword',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await register(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
    test('should return a 400 error if username or email already exists', async () => {
        
        // Mocked request and response objects
        const mockReq = {
            body: {
                username: 'mockUsername',
                email: 'mockEmail@example.com',
                password: 'mockPassword',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue({}); // User already exists
    
        await register(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error:  expect.any(String) });
    });
    test('should handle internal server errors and return 500 status', async () => {
        
        // Mocked request and response objects
        const mockReq = {
            body: {
                username: 'mockUsername',
                email: 'mockEmail@example.com',
                password: 'mockPassword',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockRejectedValue(new Error('Database error'));
    
        await register(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(new Error('Database error'));
    });
  });

describe('registerAdmin', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should register a new admin user and return success message', async () => {
      
        const mockReq = {
            body: {
              username: 'admin',
              email: 'admin@example.com',
              password: 'securePass',
            },
          };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
      
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({});
    
        await registerAdmin(mockReq, mockRes);
    
        expect(User.findOne).toHaveBeenCalledWith({
            $or: [{ username: 'admin' }, { email: 'admin@example.com' }],
        });
        const hashedPassword = await bcrypt.hash(mockReq.body.password, 12);
        expect(User.create).toHaveBeenCalledWith({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'Admin',
        });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ data: { message:  expect.any(String) } });
    });
  
    test('should return a 400 error if request body is missing attributes', async () => {
      
        const mockReq = {
            body: {
                // Missing attributes
            },
          };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        await registerAdmin(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error:  expect.any(String),
        });
    });
  
    test('should return a 400 error if email is not in a valid format', async () => {
     
        const mockReq = {
            body: {
                username: 'admin',
                email: 'adminEmail', //invalid email
                password: 'securePass', 
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };  
  
        await registerAdmin(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error:  expect.any(String) });
    });
  
    test('should return a 400 error if username or email already exists', async () => {
      
        const mockReq = {
            body: {
                username: 'admin',
                email: 'admin@example.com', 
                password: 'securePass', 
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({}); // User already exists
    
        await registerAdmin(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error:  expect.any(String) });
    });
  
    test('should handle internal server errors and return 500 status', async () => {
      
        const mockReq = {
            body: {
                username: 'admin',
                email: 'adminEmail', //invalid email
                password: 'securePass', 
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockRejectedValue(new Error('Database error'));
    
        await registerAdmin(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(new Error('Database error'));
    });
  });

describe('login', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should login and return access token and refresh token', async () => {
        
        // Mocked request and response objects
        const mockReq = {
            body: {
                email: "testuser@email.com",
                password: "testpassword"
            },
            cookies:{}
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        }; 

        const mockUser = {
            username: "testuser",
            email: "testuser@email.com",
            password: "testpassword",
            refreshToken: "testRefreshToken",
            role: "Regular"
        }

        User.findOne.mockResolvedValueOnce(mockUser);
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
        jest.spyOn(jwt, 'sign').mockReturnValueOnce('accessToken');
        jest.spyOn(jwt, 'sign').mockReturnValueOnce('refreshToken');

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            data : {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken'
            }
        })
    });    
  
    test('should return a 400 error if request body is missing attributes', async () => {
      
      // Mocked request and response objects
        const mockReq = {
            body: {},
            cookies:{}
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        }; 
  
      await login(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  
    test('should return a 400 error if at least one parameter is an empty string', async () => {
        const mockReq = {
            body: {
                email: ' ', // empty string
                password: 'securePass',
            },
            cookies: {},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };
  
      await login(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  
    test('should return a 400 error if email is not in a valid format', async () => {
        const mockReq = {
            body: {
                email: 'invalidEmail', // invalid email format
                password: 'securePass',
            },
            cookies: {},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };
  
      await login(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  
    test('should return a 400 error if user does not exist', async () => {
        const mockReq = {
            body: {
                email: 'test@example.com', 
                password: 'securePass',
            },
            cookies: {},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };
    User.findOne.mockResolvedValue(null); // User does not exist
  
      await login(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  
    test('should return a 400 error if supplied password does not match', async () => {
      
        const mockReq = {
            body: {
                email: 'test@example.com', 
                password: 'securePass',
            },
            cookies: {},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };

      User.findOne.mockResolvedValueOnce(true);  
      bcrypt.compare.mockResolvedValue(false); // Password does not match
  
      await login(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  
    test('should handle internal server errors and return 500 status', async () => {
        
        const mockReq = {
            body: {
            email: 'test@example.com',
            password: 'securePass',
            },
            cookies: {},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };
        
        User.findOne.mockRejectedValue(new Error('Database error'));
    
        await login(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(new Error('Database error'));
      });
  });

describe('logout', () => { 
    test('Should return error 400 if request does not have a refresh token', async() => {
        const mockReq = {
            cookies: { refreshToken: "" }
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await logout(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.any(String)
        })
    });

    test('Should return error 400 if refresh token does not represent a user in the database', async() => {
        const mockReq = {
            cookies: { refreshToken: "refreshToken" }
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

        await logout(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.any(String)
        })
    });

    test('Should logout', async() => {
        const mockReq = {
            cookies: { accessToken: "accesToken", refreshToken: "refreshToken" }
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        }
        const mockUser = {
            username : "testuser",
            email : "testuser@email.com",
            password : "testpassword",
            refreshToken : "refreshToken",
            role : "Regular"
        }
        jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser)
        
        await logout(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            data:{
                message: expect.any(String)
            }
        })
    });

    test('should handle internal server errors and return 500 status', async() => {
        const mockReq = {
            cookies: { refreshToken: "refreshToken" }
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(User, "findOne").mockRejectedValue(new Error('Internal Server Error'));

        await logout(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(new Error('Internal Server Error'))
    });
});
