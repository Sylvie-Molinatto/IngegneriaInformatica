import request from 'supertest';
import { app } from '../app';
import * as utils from '../controllers/utils.js'
import { categories, transactions } from '../models/model';
import { Group, User } from '../models/User';
import { createCategory, updateCategory, deleteCategory, getCategories } from '../controllers/controller';
import { getAllTransactions, getTransactionsByUser, getTransactionsByUserByCategory, getTransactionsByGroup, getTransactionsByGroupByCategory } from '../controllers/controller'
import { verifyAuth, handleDateFilterParams, handleAmountFilterParams } from '../controllers/utils.js';
import { createTransaction, deleteTransaction, deleteTransactions } from '../controllers/controller';

jest.mock('../models/model');
jest.mock('../controllers/utils.js')
jest.mock('../models/User.js')
jest.mock('../controllers/utils.js', () => ({
  verifyAuth: jest.fn(),
  handleDateFilterParams: jest.fn(),
  handleAmountFilterParams: jest.fn()
}))

beforeEach(() => {
  categories.find.mockClear();
  categories.findOne.mockClear();
  categories.prototype.save.mockClear();
  categories.countDocuments.mockReset();
  transactions.find.mockClear();
  transactions.deleteOne.mockClear();
  transactions.aggregate.mockClear();
  transactions.prototype.save.mockClear();
  User.find.mockClear();
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('createCategory', () => {
  test('should create a new category', async () => {
    const mockReq = {
      body: { type: 'food', color: 'red' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };
    const categoryExists = false;
    const savedCategory = { type: 'food', color: 'red' };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    categories.findOne.mockResolvedValue(categoryExists);
    categories.prototype.save.mockResolvedValue(savedCategory);

    await createCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        type: savedCategory.type,
        color: savedCategory.color,
      },
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    });
  });

  test('should return 400 error if request body is missing attributes', async () => {
    const mockReq = {
      body: { type: 'food' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    await createCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return 400 error if request body has empty attributes', async () => {
    const mockReq = {
      body: { type: '', color: 'red' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });

    await createCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return 400 error if category type already exists', async () => {
    const mockReq = {
      body: { type: 'food', color: 'red' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const categoryExists = true;
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    categories.findOne.mockResolvedValue(categoryExists);

    await createCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return 401 error if called by non-admin user', async () => {
    const mockReq = {
      body: { type: 'food', color: 'red' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: false, cause: 'Not an admin' });

    await createCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not an admin' });
  });

  test('should return a 500 error when an error occurs', async () => {
    const mockReq = {
      body: { type: 'food', color: 'red' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });

    const errorMessage = 'Database error';
    categories.findOne.mockRejectedValueOnce(new Error(errorMessage));

    // Call the function
    await createCategory(mockReq, mockRes);

    // Check the response
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
  });

  test('should handle error when saving a new category', async () => {
    const mockReq = {
      body: {
        type: 'food',
        color: 'red',
      },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    jest.spyOn(categories, 'findOne').mockResolvedValue(null);
    jest.spyOn(categories.prototype, 'save').mockRejectedValue(new Error('Save error'));

    await createCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });
});

describe('updateCategory', () => {

  test('should return a 401 error if called by non-admin user', async () => {
    const mockReq = {
      params: { type: 'food' },
      body: { type: 'Food', color: 'yellow' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: false, cause: 'Not an admin' });
    categories.findOne.mockResolvedValue(null);

    await updateCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not an admin' });
  });

  test('should return a 400 error if category is not found', async () => {
    const mockReq = {
      params: { type: 'food' },
      body: { type: 'Food', color: 'yellow' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token",
      },
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    categories.findOne.mockResolvedValue(null);

    await updateCategory(mockReq, mockRes);

    expect(categories.findOne).toHaveBeenCalledWith({ type: mockReq.params.type });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if request body is missing attributes', async () => {
    const mockReq = {
      params: { type: 'food' },
      body: {},
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token",
      },
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    const category = { type: 'Food', color: 'red' };
    categories.findOne.mockResolvedValue(category);

    await updateCategory(mockReq, mockRes);

    expect(categories.findOne).toHaveBeenCalledWith({ type: mockReq.params.type });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if updated category already exists', async () => {
    const mockReq = {
      params: { type: 'food' },
      body: { type: 'Food', color: 'yellow' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token",
      },
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    const category = { type: 'food', color: 'red' };
    const updatedCategory = { type: 'Food', color: 'yellow' };
    categories.findOne.mockResolvedValueOnce(category);
    categories.prototype.save.mockResolvedValue();
    categories.findOne.mockResolvedValueOnce(updatedCategory);

    await updateCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 500 error when an error occurs', async () => {
    const mockReq = {
      params: { type: 'food' },
      body: { type: 'Food', color: 'yellow' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });

    // Mock the categories.find() method to throw an error
    const errorMessage = 'Database error';
    categories.findOne.mockRejectedValueOnce(new Error(errorMessage));

    // Call the function
    await updateCategory(mockReq, mockRes);

    // Check the response
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
  });

  test('should update the category and transactions', async () => {
    const mockReq = {
      params: { type: 'food' },
      body: { type: 'Food', color: 'yellow' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };
    const category = { type: 'food', color: 'red' };
    const category_exists = { type: 'Food', color: 'yellow' };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({flag: true, cause:'Authorized'});
    categories.findOne.mockResolvedValueOnce(category);
    categories.prototype.save.mockResolvedValue();

    categories.findOne.mockResolvedValueOnce(null);
    transactions.updateMany.mockResolvedValue();
    transactions.countDocuments.mockResolvedValue(2);

    await updateCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        message: expect.any(String),
        count: 2,
      },
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    });
  });

  test('should update the category color', async () => {
    const mockReq = {
      params: { type: 'food' },
      body: { type: 'food', color: 'yellow' },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };
    const category = { type: 'food', color: 'red' };
    const category_exists = { type: 'food', color: 'yellow' };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({flag: true, cause:'Authorized'});
    categories.findOne.mockResolvedValueOnce(category);
    categories.prototype.save.mockResolvedValueOnce();

    categories.findOne.mockResolvedValueOnce(null);
    transactions.updateMany.mockResolvedValueOnce();
    transactions.countDocuments.mockResolvedValueOnce(0);

    await updateCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        message: expect.any(String),
        count: 0,
      },
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    });
  });
});

describe('deleteCategory', () => {
  test('should return a 401 error if called by a non-admin user', async () => {
    const mockReq = {
      body: { types: ["health"] },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: false, cause: 'Not an admin' });

    await deleteCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not an admin' });
  });

  test('should return a 400 error if the request body does not contain all the necessary attributes', async () => {
    const mockReq = {
      body: {},
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });

    await deleteCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if there is only one category in the database', async () => {
    const mockReq = {
      body: { types: ["health"] },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    categories.find.mockResolvedValue([{ type: "health" }]);

    await deleteCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'There is only one category in the database' });
  });

  test('should return a 400 error if at least one of the types in the array is an empty string', async () => {
    const mockReq = {
      body: { types: ["health", "transports", ""] },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    categories.find.mockResolvedValue([{ type: "health" }, { type: "transaports" }]);
    await deleteCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if at least one of the types in the array does not represent a category in the database', async () => {
    const mockReq = {
      body: { types: ["health", "food", "transports"] },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    categories.find.mockResolvedValue([{ type: "health" }, { type: "transports" }]);

    await deleteCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 500 error when an error occurs', async () => {

    const mockReq = {
      body: { types: ["health"] },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });

    // Mock the categories.find() method to throw an error
    const errorMessage = 'Database error';
    categories.find.mockRejectedValueOnce(new Error(errorMessage));

    // Call the function
    await deleteCategory(mockReq, mockRes);

    // Check the response
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
  });

  test('should delete the categories and update the affected transactions', async () => {
    const mockReq = {
      body: { types: ["health"] },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    categories.find.mockResolvedValueOnce([{ type: "food", color: "red" }, { type: "health", color: "green" }]);
    categories.find.mockResolvedValueOnce([{ type: "health ", color: "green" }]);

    categories.find.mockReturnValueOnce({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([{ type: "food", color: "red" }]),
    });

    categories.find.mockReturnValueOnce({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([{ type: "food", color: "red" }]),
    });

    categories.deleteMany.mockResolvedValue();
    transactions.countDocuments.mockResolvedValue(1);
    transactions.updateMany.mockResolvedValue();

    await deleteCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        message: expect.any(String),
        count: 1,
      },
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    });
  });

  test('should delete all the categories, except the oldest, and update the affected transactions', async () => {
    const mockReq = {
      body: { types: ["health", "food"] },
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    categories.find.mockResolvedValueOnce([{ type: "food", color: "red" }, { type: "health", color: "green" }]);
    categories.find.mockResolvedValueOnce([{ type: "food", color: "red" }, { type: "health ", color: "green" }]);

    categories.find.mockReturnValueOnce({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([{ type: "food", color: "red" }]),
    });

    categories.find.mockReturnValueOnce({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([{ type: "food", color: "red" }]),
    });

    categories.deleteMany.mockResolvedValueOnce();
    transactions.countDocuments.mockResolvedValueOnce(2);
    transactions.updateMany.mockResolvedValueOnce();

    await deleteCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        message: expect.any(String),
        count: 2,
      },
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    });
  });
});

describe('getCategories', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks
    categories.find.mockReset();   // Clear mocks for categories
  });

  test('should return an array of objects when authenticated with Simple auth', async () => {

    const mockReq = {
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });

    // Mock the categories.find() method to return sample data
    const mockCategories = [
      { type: 'food', color: 'red' },
      { type: 'health', color: 'green' },
    ];
    categories.find.mockResolvedValueOnce(mockCategories);

    // Call the function
    await getCategories(mockReq, mockRes);

    // Check the response

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockCategories.map((v) => ({ type: v.type, color: v.color })),
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    });
  });

  test('should return an empty array of objects', async () => {

    const mockReq = {
      cookies: { accessToken: "adminAccessTokenInvalid", refreshToken: "adminRefreshTokenInvalid" }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });

    // Mock the categories.find() method to return sample data
    const mockCategories = [
    ];
    categories.find.mockResolvedValueOnce(mockCategories);

    // Call the function
    await getCategories(mockReq, mockRes);

    // Check the response

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockCategories.map((v) => ({ type: v.type, color: v.color })),
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    });
  });

  test('should return a 401 error when not authenticated with Simple auth', async () => {

    const mockReq = {
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: false, cause: 'Unauthorized' });

    // Call the function
    await getCategories(mockReq, mockRes);

    // Check the response
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  test('should return a 500 error when an error occurs', async () => {

    const mockReq = {
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });

    // Mock the categories.find() method to throw an error
    const errorMessage = 'Database error';
    categories.find.mockRejectedValueOnce(new Error(errorMessage));

    // Call the function
    await getCategories(mockReq, mockRes);

    // Check the response
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});

describe('createTransaction', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: { username: 'tester' },
      body: { username: 'tester', amount: 100, type: 'food' },
      cookies: { refreshToken: 'refreshToken' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: '' },
    };
    categories.findOne.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create a new transaction and return the transaction data', async () => {

    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "refreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce(true)
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);
    // Call the function
    await createTransaction(mockReq, mockRes);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        username: 'tester',
        amount: 100,
        type: 'food',
        date : expect.any(String)
      },
      refreshedTokenMessage: '',
    });
  });

  test('should return a 400 error if the request body does not contain all the necessary attributes', async () => {
    mockReq.body = { username: 'tester', amount: 100 };

    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "refreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce({ type: 'food', color: 'red' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);

    await createTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if at least one of the parameters in the request body is an empty string', async () => {
    mockReq.body = { username: '', amount: 100, type: 'food' };
    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "refreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce({ type: 'food', color: 'red' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);

    await createTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if the type of category passed in the request body does not exist', async () => {

    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "refreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce()
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);

    await createTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if the username passed in the request body is not equal to the one passed as a route parameter', async () => {

    mockReq.body.username = 'other tester';
    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "refreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce({ type: 'food', color: 'red' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);

    await createTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if the username passed in the request body does not represent a user in the database', async () => {

    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "refreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce()
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce({ type: 'food', color: 'red' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);
    await createTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if the amount passed in the request body cannot be parsed as a floating value', async () => {
    mockReq.body.amount = 'invalid';

    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "refreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce({ type: 'food', color: 'red' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);

    await createTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if the user\'s refreshToken in the request cookie is not valid', async () => {

    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "otherRefreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce({ type: 'food', color: 'red' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);
    await createTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 401 error if not authorized', async () => {
    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "otherRefreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: false, cause: 'Unauthorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce({ type: 'food', color: 'red' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);
    await createTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  test('should return a 500 error is internal server error happens', async () => {
    const mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "otherRefreshToken",
      role: "Regular"
    };
    const mockTransaction = {
      username: 'tester',
      amount: 100,
      type: 'food',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Internal Server Error'))
    jest.spyOn(categories, 'findOne').mockResolvedValueOnce({ type: 'food', color: 'red' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    transactions.prototype.save.mockResolvedValue(mockTransaction);
    await createTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe("getAllTransactions", () => {

  let mockReq;
  let mockRes;

  beforeEach(() => {

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token"
      }
    }
    jest.clearAllMocks();
    transactions.aggregate.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should return all transactions made by all users", async () => {

    //Mock the result that we expect
    const mockResult = [
      { username: "Mario", amount: 100, type: "food", date: "2023-05-19T00:00:00", color: "red" },
      { username: "Mario", amount: 70, type: "health", date: "2023-05-19T10:00:00", color: "green" },
      { username: "Luigi", amount: 20, type: "food", date: "2023-05-19T10:00:00", color: "red" }
    ]

    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" }
    });
    // Mock the transactions.aggregate function
    const mockAggregate = jest.spyOn(transactions, 'aggregate').mockImplementation(async () => {
      return [
        {
          username: 'Mario',
          type: 'food',
          amount: 100,
          date: '2023-05-19T00:00:00',
          categories_info: { color: 'red' },
        },
        {
          username: 'Mario',
          type: 'health',
          amount: 70,
          date: '2023-05-19T10:00:00',
          categories_info: { color: 'green' },
        },
        {
          username: 'Luigi',
          type: 'food',
          amount: 20,
          date: '2023-05-19T10:00:00',
          categories_info: { color: 'red' },
        },
      ];
    });

    //Call the function
    await getAllTransactions(mockReq, mockRes)

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockResult,
      refreshedTokenMessage: "expired token"
    })
  });

  test("should return error 401 if not authorized", async () => {
    
    verifyAuth.mockImplementation(() => {
      return { flag: false, cause: "Unauthorized" }
    })

    //Call function
    await getAllTransactions(mockReq, mockRes)

    //Verify correct result
    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" })
  })

  test("should return error 500 if Internal Server Error happens", async () => {
    
    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" }
    });

    //Call the function
    await getAllTransactions(mockReq, mockRes);

    //Expected result
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }))
  })

})

describe("getTransactionsByUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    transactions.aggregate.mockReset();
    User.findOne.mockClear();
  })

  test("Only username parameter requested by admin", async () => {
    const mockReq = {
      params: {
        username: "antonio"
      },
      cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
      url: "/transactions/users/"
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token"
      }
    };

    const mockResult = [
      {
        username: "antonio",
        amount: 23,
        type: "Sport",
        date: "2023-06-02T10:23:34",
        color: "Giallo"
      },
      {
        username: "antonio",
        amount: 23,
        type: "Sport",
        date: "2023-06-02T10:23:34",
        color: "Giallo"
      }
    ];

    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" };
    });

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(true);
    //Force aggregate to return this value
    jest.spyOn(transactions, 'aggregate').mockImplementation(async () => {
      return [
        {
          username: 'antonio',
          amount: 23,
          type: 'Sport',
          date: '2023-06-02T10:23:34',
          categories_info: { color: 'Giallo' },
        },
        {
          username: 'antonio',
          amount: 23,
          type: 'Sport',
          date: '2023-06-02T10:23:34',
          categories_info: { color: 'Giallo' },
        }
      ];
    });

    //Call function
    await getTransactionsByUser(mockReq, mockRes);

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockResult,
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
    });
  })

  test("Only username parameter requested by user", async () => {
    const mockReq = {
      params: {
        username: "antonio"
      },
      cookies: { accessToken: "userAccessTokenValid", refreshToken: "userRefreshTokenValid" },
      url: "/api/users/"
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token"
      }
    };

    const mockResult = [
      {
        username: "antonio",
        amount: 23,
        type: "Sport",
        date: "2023-06-02T10:23:34",
        color: "Giallo"
      },
      {
        username: "antonio",
        amount: 23,
        type: "Sport",
        date: "2023-06-02T10:23:34",
        color: "Giallo"
      }
    ];

    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" };
    });

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(true);
    //Force aggregate to return this value
    jest.spyOn(transactions, 'aggregate').mockImplementation(async () => {
      return [
        {
          username: 'antonio',
          amount: 23,
          type: 'Sport',
          date: '2023-06-02T10:23:34',
          categories_info: { color: 'Giallo' },
        },
        {
          username: 'antonio',
          amount: 23,
          type: 'Sport',
          date: '2023-06-02T10:23:34',
          categories_info: { color: 'Giallo' },
        }
      ];
    });

    //Call function
    await getTransactionsByUser(mockReq, mockRes);

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockResult,
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
    });
  })

  test("Only with date", async () => {
    const mockReq = {
      params: {
        username: "antonio"
      },
      query: {
        date: "2023-06-02"
      },
      cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
      url: "/api/users/"
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token"
      }
    };

    const mockResult = [
      {
        username: "antonio",
        amount: 23,
        type: "Sport",
        date: "2023-06-02T10:23:34",
        color: "Giallo"
      },
      {
        username: "antonio",
        amount: 23,
        type: "Sport",
        date: "2023-06-02T10:23:34",
        color: "Giallo"
      }
    ];

    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" };
    });

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(true);

    handleDateFilterParams.mockImplementation( () => {
      let matchStage = {
        date :
        {
          $gte : new Date(mockReq.query.date + "T00:00:00Z"),
          $lte : new Date(mockReq.query.date + "T23:59:59Z")
        }
      }
      return matchStage;
    })

    //Force aggregate to return this value
    jest.spyOn(transactions, 'aggregate').mockImplementation(async () => {
      return [
        {
          username: 'antonio',
          amount: 23,
          type: 'Sport',
          date: '2023-06-02T10:23:34',
          categories_info: { color: 'Giallo' },
        },
        {
          username: 'antonio',
          amount: 23,
          type: 'Sport',
          date: '2023-06-02T10:23:34',
          categories_info: { color: 'Giallo' },
        }
      ];
    });
 
    //Call function
    await getTransactionsByUser(mockReq, mockRes);

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockResult,
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
    });
  })

  test("Only with amount", async () => {
    const mockReq = {
      params: {
        username: "antonio"
      },
      query: {
        min: 20,
        max: 30
      },
      cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
      url: "/api/users/"
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token"
      }
    };
    
    const mockResult = [
      {
        username: "antonio",
        amount: 20,
        type: "Sport",
        date: "2023-06-02T10:23:34",
        color: "Giallo"
      },
      {
        username: "antonio",
        amount: 23,
        type: "Sport",
        date: "2023-06-02T10:23:34",
        color: "Giallo"
      }
    ];

    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" };
    });

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(true);

    handleAmountFilterParams.mockImplementation( () => {
      let matchStage = {amount : {
        $gte: Number(mockReq.query.min),
        $lte: Number(mockReq.query.max)
     }}
     return matchStage
    })

    //Force aggregate to return this value
    jest.spyOn(transactions, 'aggregate').mockImplementation(async () => {
      return [
        {
          username: 'antonio',
          amount: 20,
          type: 'Sport',
          date: '2023-06-02T10:23:34',
          categories_info: { color: 'Giallo' },
        },
        {
          username: 'antonio',
          amount: 23,
          type: 'Sport',
          date: '2023-06-02T10:23:34',
          categories_info: { color: 'Giallo' },
        }
      ];
    });

    //Call function
    await getTransactionsByUser(mockReq, mockRes);

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockResult,
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
    });
  })

  test('Admin not authorized and should return 401', async () => {
    const mockReq = {
      params: {
        username: "antonio01"
      },
      cookies: {
        accessToken: "adminAccessTokenValid",
        refreshToken: "adminRefreshTokenValid"
      },
      url: "/api/transactions/users/"
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: ""
      }
    }
    verifyAuth.mockImplementation(() => {
      return { flag: false, cause: "Unauthorized" }
    })

    //Call function
    await getTransactionsByUser(mockReq, mockRes)

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }))
  });

  test("Admin request with user not found, error 400", async () => {
    const mockReq = {
      cookies: {
        accessToken: "adminAccessTokenValid",
        refreshToken: "adminRefreshTokenValid"
      },
      url: "/api/transactions/users/"
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: ""
      }
    }
    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" }
    })

    User.findOne.mockResolvedValueOnce("")

    //Call function
    await getTransactionsByUser(mockReq, mockRes)

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }))
  })

  test("User not authorized and should return 401", async () => {
    const mockReq = {
      params: {
        username: "antonio01"
      },
      url: "/api/users/",
      cookies: {
        accessToken: "userNotAccessTokenValid",
        refreshToken: "userNotRefreshTokenValid"
      },
    }

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "" }
    }

    verifyAuth.mockImplementation(() => {
      return { flag: false, cause: "Unauthorized" }
    })

    await getTransactionsByUser(mockReq, mockRes)

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }))
  })

  test("User request with user not found, error 400", async () => {
    const mockReq = {
      params: {
        username: "antonio01"
      },
      url: "/api/users/",
      cookies: {
        accessToken: "userAccessTokenValid",
        refreshToken: "userRefreshTokenValid"
      },
    }

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "" }
    }

    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" }
    })
    //Force findOne
    User.findOne.mockResolvedValueOnce("")

    await getTransactionsByUser(mockReq, mockRes)

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }))
  })

  test("Error 500", async () => {
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token"
      }
    };

    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" };
    });

    //Call function
    await getTransactionsByUser(mockReq, mockRes);

    //Check response
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }))
  })
})

describe("getTransactionsByUserByCategory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    transactions.aggregate.mockReset();
    User.findOne.mockClear();
    categories.findOne.mockClear();
  })

  test("User correct request", async () => {
    const mockReq = {
      params: {
        username: "antonio",
        category: "sport"
      },
      cookies: {
        accessToken: "userAccessToken",
        refreshToken: "userRefreshToken"
      },
      url: "/api/users/"
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "expired token" }
    }
    const retrievedTransactions = [
      { username: "antonio", amount: 100, type: "sport", date: "2023-05-19T00:00:00", color: "red" },
    ]

    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" }
    })

    User.findOne.mockResolvedValueOnce(mockReq.params.username)
    categories.findOne.mockResolvedValueOnce(mockReq.params.category)
    transactions.aggregate.mockResolvedValueOnce(retrievedTransactions)

    await getTransactionsByUserByCategory(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      data: retrievedTransactions,
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
    })
  })

  test("Admin correct request", async () => {
    const mockReq = {
      params: {
        username: "antonio",
        category: "sport"
      },
      cookies: {
        accessToken: "userAccessToken",
        refreshToken: "userRefreshToken"
      },
      url: "api/transactions/users/"
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "expired token" }
    }
    const retrievedTransactions = [
      { username: "antonio", amount: 100, type: "sport", date: "2023-05-19T00:00:00", color: "red" },
    ]

    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" }
    })

    User.findOne.mockResolvedValueOnce(mockReq.params.username)
    categories.findOne.mockResolvedValueOnce(mockReq.params.category)
    transactions.aggregate.mockResolvedValueOnce(retrievedTransactions)

    await getTransactionsByUserByCategory(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      data: retrievedTransactions,
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
    })
  })

  test("Admin not authorized, error 401", async () => {
    const mockReq = {
      cookies: {
        accessToken: "adminAccessTokenNotValid",
        refreshToken: "adminRefreshTokenNotValid"
      },
      url: "api/transactions/users/"
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "expired token" }
    }

    verifyAuth.mockImplementation(() => {
      return { flag: false, cause: "Unauthorized" }
    })

    await getTransactionsByUserByCategory(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }))
  })

  test("User not authorized, error 401", async () => {
    const mockReq = {
      params: {
        username: "antonio"
      },
      cookies: {
        accessToken: "userAccessTokenNotValid",
        refreshToken: "userRefreshTokenNotValid"
      },
      url: "/api/users/"
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "expired token" }
    }
    verifyAuth.mockImplementation(() => {
      return { flag: false, cause: "Unauthorized" }
    })

    await getTransactionsByUserByCategory(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }))
  })

  test("User doesn't exist with admin authentication, error 400", async () => {
    const mockReq = {
      params: {
        username: "antonio01",
        category: "Sport"
      },
      cookies: {
        accessToken: "adminAccessTokenValid",
        refreshToken: "adminRefreshTokenValid"
      },
      url: "api/transactions/users/"
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "expired token" }
    };
    //Mock function
    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" };
    });
    User.findOne.mockResolvedValueOnce(false);
    categories.findOne.mockResolvedValueOnce(true);
    //Call the method
    await getTransactionsByUserByCategory(mockReq, mockRes);
    //Expected value
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({ error: "User or category doesn't exist" })
  })

  test("Category doesn't exist with admin authentication, error 400", async () => {
    const mockReq = {
      params: {
        username: "antonio01",
        category: "Sport"
      },
      cookies: {
        accessToken: "adminAccessTokenValid",
        refreshToken: "adminRefreshTokenValid"
      },
      url: "api/transactions/users/"
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "expired token" }
    };
    //Mock function
    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" };
    });
    User.findOne.mockResolvedValueOnce(true);
    categories.findOne.mockResolvedValueOnce(false);
    //Call the method
    await getTransactionsByUserByCategory(mockReq, mockRes);
    //Expected value
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({ error: "User or category doesn't exist" })
  })

  test("Category doesn't exist with user authentication, error 400", async () => {
    const mockReq = {
      params: {
        username: "antonio01",
        category: "Sport"
      },
      cookies: {
        accessToken: "userAccessTokenValid",
        refreshToken: "userRefreshTokenValid"
      },
      url: "/api/users/"
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "expired token" }
    };
    //Mock function
    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" };
    });
    User.findOne.mockResolvedValueOnce(true);
    categories.findOne.mockResolvedValueOnce(false);
    //Call the method
    await getTransactionsByUserByCategory(mockReq, mockRes);
    //Expected value
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({ error: "User or category doesn't exist" })
  })

  test("Error 500", async () => {
    const mockReq = {
      params: {
        username: "antonio01",
        category: "Sport"
      },
      cookies: {
        accessToken: "userAccessTokenValid",
        refreshToken: "userRefreshTokenValid"
      },
      url: "/api/users/"
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: "expired token" }
    };
    //Mock function
    verifyAuth.mockImplementation(() => {
      return { flag: true, cause: "Authorized" };
    });
    categories.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));
    //Call the method
    await getTransactionsByUserByCategory(mockReq, mockRes);
    //Expected value
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }))
  })
})

describe("getTransactionsByGroup", () => { 
  beforeEach(() => {
      User.find.mockClear();
      Group.findOne.mockClear();
  });
  test("admin success", async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family'},
          url : '/api/transactions/groups/Family', 
        };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          locals: { refreshedTokenMessage:'Success'},
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce({name: "Family", members: 
          [{email: "mario.red@email.com"},
          {email: "luigi.red@email.com"}]});
      jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
      jest.spyOn(User, "find").mockResolvedValueOnce(
          [{username: "Mario", email: "mario.red@email.com"},
          {username: "Luigi", email: "luigi.red@email.com"}]
      );
      jest.spyOn(transactions, "aggregate").mockResolvedValueOnce(
          [{username: "Mario", 
          amount: 100, 
          type: "food",
          date: "2023-05-19T00:00:00", 
          color: "red"},
           {username: "Mario",
          amount: 70,
          type: "health",
          date: "2023-05-19T10:00:00", 
          color: "green"}, 
          {username: "Luigi", 
          amount: 20, 
          type: "food", 
          date: "2023-05-19T10:00:00", 
          color: "red"} ]
      );

      await getTransactionsByGroup(mockReq, mockRes)

      expect(Group.findOne).toHaveBeenCalled();
      expect(utils.verifyAuth).toHaveBeenCalled();
      expect(User.find).toHaveBeenCalled();
      expect(transactions.aggregate).toHaveBeenCalled();

      expect(mockRes.json).toHaveBeenCalledWith(
      {
          data: 
          [{username: "Mario", amount: 100, type: "food", date: "2023-05-19T00:00:00", color: "red"}, 
          {username: "Mario", amount: 70, type: "health", date: "2023-05-19T10:00:00", color: "green"}, 
          {username: "Luigi", amount: 20, type: "food", date: "2023-05-19T10:00:00", color: "red"} ], 
          refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
      }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  test("user success", async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family'},
          url : '/api/groups/Family/transactions', 
        };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          locals: { refreshedTokenMessage:'Success'},
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce({name: "Family", members: 
          [{email: "mario.red@email.com"},
          {email: "luigi.red@email.com"}]});
      jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
      jest.spyOn(User, "find").mockResolvedValueOnce(
          [{username: "Mario", email: "mario.red@email.com"},
          {username: "Luigi", email: "luigi.red@email.com"}]
      );
      jest.spyOn(transactions, "aggregate").mockResolvedValueOnce(
          [{username: "Mario", 
          amount: 100, 
          type: "food",
          date: "2023-05-19T00:00:00", 
          color: "red"},
           {username: "Mario",
          amount: 70,
          type: "health",
          date: "2023-05-19T10:00:00", 
          color: "green"}, 
          {username: "Luigi", 
          amount: 20, 
          type: "food", 
          date: "2023-05-19T10:00:00", 
          color: "red"} ]
      );

      await getTransactionsByGroup(mockReq, mockRes)

      expect(utils.verifyAuth).toHaveBeenCalled();
      expect(Group.findOne).toHaveBeenCalled();
      expect(User.find).toHaveBeenCalled();
      expect(transactions.aggregate).toHaveBeenCalled();

      expect(mockRes.json).toHaveBeenCalledWith(
      {
          data: 
          [{username: "Mario", amount: 100, type: "food", date: "2023-05-19T00:00:00", color: "red"}, 
          {username: "Mario", amount: 70, type: "health", date: "2023-05-19T10:00:00", color: "green"}, 
          {username: "Luigi", amount: 20, type: "food", date: "2023-05-19T10:00:00", color: "red"} ], 
          refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
      }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  test("unauthorized user route", async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family'},
          url : '/api/groups/Family/transactions', 
        };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce({name: "Family", members: 
          [{email: "mario.red@email.com"},
          {email: "luigi.red@email.com"}]});
      jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });
      
      await getTransactionsByGroup(mockReq, mockRes)

      expect(utils.verifyAuth).toHaveBeenCalled();
      expect(Group.findOne).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
      {
          error: "Unauthorized"
      }
      );
      expect(mockRes.status).toHaveBeenCalledWith(401);
  });
  test("unauthorized admin route", async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family'},
          url : '/api/transactions/groups/Family', 
        };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce({name: "Family", members: 
          [{email: "mario.red@email.com"},
          {email: "luigi.red@email.com"}]});
      jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });
      

      await getTransactionsByGroup(mockReq, mockRes)

      expect(Group.findOne).toHaveBeenCalled();
      expect(utils.verifyAuth).toHaveBeenCalled();

      expect(mockRes.json).toHaveBeenCalledWith(
      {
          error: "Unauthorized"
      }
      );
      expect(mockRes.status).toHaveBeenCalledWith(401);
  });
  test("group does not exist", async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family'},
          url : '/api/transactions/groups/Family', 
        };
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        jest.spyOn(Group, "findOne").mockResolvedValueOnce(null); // Simulate group not found
    
        await getTransactionsByGroup(mockReq, mockRes);
    
        expect(Group.findOne).toHaveBeenCalled();
    
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: "Group doesn't exist",
        });
  });
  test("fail due to a db error", async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family'},
          url : '/api/transactions/groups/Family', 
        };
        const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),  
        };
        jest.spyOn(Group, 'findOne').mockImplementation(() => {
          throw new Error('Internal server error');
        });
    
        await getTransactionsByGroup(mockReq, mockRes)
    
        expect(Group.findOne).toHaveBeenCalled();
    
        expect(mockRes.json).toHaveBeenCalledWith(
          {
            error: 'Internal server error'
          }
        );
        expect(mockRes.status).toHaveBeenCalledWith(500);
    
  });

})

describe("getTransactionsByGroupByCategory", () => { 
  beforeEach(() => {
      User.find.mockClear();
      Group.findOne.mockClear();
  });
  test('admin success', async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family', category: 'food'},
          url : '/api/transactions/groups/Family/category/food', 
        };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          locals: { refreshedTokenMessage:'Success'},
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce({
          name: "Family",
          members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
      });
      jest.spyOn(categories, "findOne").mockResolvedValueOnce(true);
      jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
      jest.spyOn(User, "find").mockResolvedValueOnce(
          [{username: "Mario", email: "mario.red@email.com"},
          {username: "Luigi", email: "luigi.red@email.com"}]
      );
      jest.spyOn(transactions, "aggregate").mockResolvedValueOnce(
          [{username: "Mario", 
          amount: 100, 
          type: "food",
          date: "2023-05-19T00:00:00", 
          color: "red"},
          {username: "Luigi", 
          amount: 20, 
          type: "food", 
          date: "2023-05-19T10:00:00", 
          color: "red"} ]
      );

      await getTransactionsByGroupByCategory(mockReq, mockRes)

      expect(Group.findOne).toHaveBeenCalled();
      expect(utils.verifyAuth).toHaveBeenCalled();
      expect(User.find).toHaveBeenCalled();
      expect(transactions.aggregate).toHaveBeenCalled();

      expect(mockRes.json).toHaveBeenCalledWith(
      {
          data: 
          [{username: "Mario", amount: 100, type: "food", date: "2023-05-19T00:00:00", color: "red"}, 
          {username: "Luigi", amount: 20, type: "food", date: "2023-05-19T10:00:00", color: "red"} ], 
          refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
      }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  test('user success', async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family', category: 'food'},
          url : '/api/groups/Family/transactions/category/food', 
        };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          locals: { refreshedTokenMessage:'Success'},
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce({
          name: "Family",
          members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
      });
      jest.spyOn(categories, "findOne").mockResolvedValueOnce(true);
      jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
      jest.spyOn(User, "find").mockResolvedValueOnce(
          [{username: "Mario", email: "mario.red@email.com"},
          {username: "Luigi", email: "luigi.red@email.com"}]
      );
      jest.spyOn(transactions, "aggregate").mockResolvedValueOnce(
          [{username: "Mario", 
          amount: 100, 
          type: "food",
          date: "2023-05-19T00:00:00", 
          color: "red"},
          {username: "Luigi", 
          amount: 20, 
          type: "food", 
          date: "2023-05-19T10:00:00", 
          color: "red"} ]
      );

      await getTransactionsByGroupByCategory(mockReq, mockRes)

      expect(Group.findOne).toHaveBeenCalled();
      expect(utils.verifyAuth).toHaveBeenCalled();
      expect(User.find).toHaveBeenCalled();
      expect(transactions.aggregate).toHaveBeenCalled();

      expect(mockRes.json).toHaveBeenCalledWith(
      {
          data: 
          [{username: "Mario", amount: 100, type: "food", date: "2023-05-19T00:00:00", color: "red"}, 
          {username: "Luigi", amount: 20, type: "food", date: "2023-05-19T10:00:00", color: "red"} ], 
          refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
      }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  test("unauthorized user route", async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family'},
          url : '/api/groups/Family/transactions/category/food', 
        };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce({name: "Family", members: 
          [{email: "mario.red@email.com"},
          {email: "luigi.red@email.com"}]});
      jest.spyOn(categories, "findOne").mockResolvedValueOnce(true);
      jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });
      
      await getTransactionsByGroupByCategory(mockReq, mockRes)

      expect(utils.verifyAuth).toHaveBeenCalled();
      expect(Group.findOne).toHaveBeenCalled();
      expect(categories.findOne).toHaveBeenCalled();
      
      expect(mockRes.json).toHaveBeenCalledWith(
      {
          error: "Unauthorized"
      }
      );
      expect(mockRes.status).toHaveBeenCalledWith(401);
  });
  test("unauthorized admin route", async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family'},
          url : '/api/transactions/groups/Family/category/food', 
        };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce({name: "Family", members: 
          [{email: "mario.red@email.com"},
          {email: "luigi.red@email.com"}]});
      jest.spyOn(categories, "findOne").mockResolvedValueOnce(true);
      jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });
      

      await getTransactionsByGroupByCategory(mockReq, mockRes)

      expect(Group.findOne).toHaveBeenCalled();
      expect(categories.findOne).toHaveBeenCalled();
      expect(utils.verifyAuth).toHaveBeenCalled();

      expect(mockRes.json).toHaveBeenCalledWith(
      {
          error: "Unauthorized"
      }
      );
      expect(mockRes.status).toHaveBeenCalledWith(401);
  });
  test('group does not exist', async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family', category: 'food'},
          url : '/api/groups/Family/transactions/category/food', 
      };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          locals: { refreshedTokenMessage:'Success'},
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce(null); // Simulate group not found
      
      
      await getTransactionsByGroupByCategory(mockReq, mockRes);
    
      expect(Group.findOne).toHaveBeenCalled();
    
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
          error: "Group or category doesn't exist",
      });
  });
  test('category does not exist', async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family', category: 'food'},
          url : '/api/groups/Family/transactions/category/food', 
      };
      const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          locals: { refreshedTokenMessage:'Success'},
      };
      jest.spyOn(Group, "findOne").mockResolvedValueOnce({
          name: "Family",
          members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
      });jest.spyOn(categories, "findOne").mockResolvedValueOnce(false);

      await getTransactionsByGroupByCategory(mockReq, mockRes);
    
      expect(Group.findOne).toHaveBeenCalled();
      expect(categories.findOne).toHaveBeenCalled();
    
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
          error: "Group or category doesn't exist",
      });
  });
  test("fail due to a db error", async () => {
      const mockReq = {
          cookies : { refreshToken:'fakeRefreshToken'},
          params : { name: 'Family'},
          url : '/api/transactions/groups/Family', 
        };
        const mockRes= {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),  
        };
        jest.spyOn(Group, 'findOne').mockImplementation(() => {
          throw new Error('Internal server error');
        });
    
        await getTransactionsByGroupByCategory(mockReq, mockRes)
    
        expect(Group.findOne).toHaveBeenCalled();
    
        expect(mockRes.json).toHaveBeenCalledWith(
          {
            error: 'Internal server error'
          }
        );
        expect(mockRes.status).toHaveBeenCalledWith(500);
    
  });
})


describe('deleteTransaction', () => {
  let mockReq;
  let mockRes;
  let mockUser;
  let mockTransaction;

  beforeEach(() => {
    mockReq = {
      params: { username: 'tester' },
      body: { _id: '6hjkohgfc8nvu786' },
      cookies: { refreshToken: 'refreshToken' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: '' },
    };
    mockUser = {
      username: "tester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "refreshToken",
      role: "Regular"
    };

    mockTransaction = {
      username: "tester",
      amount: "100",
      type: "food"
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should delete a transaction and return a success message', async () => {

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: 'true', cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(transactions, 'findOne').mockResolvedValueOnce(mockTransaction)
    jest.spyOn(transactions, 'deleteOne').mockResolvedValueOnce();

    // Call the function
    await deleteTransaction(mockReq, mockRes);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: { message: 'Transactions deleted' },
      refreshedTokenMessage: '',
    });
  });
 
  test('should return a 400 error if the username passed as a route parameter does not represent a user in the database', async () => {

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: 'true', cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce()
    jest.spyOn(transactions, 'findOne').mockResolvedValueOnce(mockTransaction)
    jest.spyOn(transactions, 'deleteOne').mockResolvedValueOnce();

    await deleteTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if the _id in the request body does not represent a transaction in the database', async () => {

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: 'true', cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(transactions, 'findOne').mockResolvedValueOnce()
    jest.spyOn(transactions, 'deleteOne').mockResolvedValueOnce();

    await deleteTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if the _id in the request body represents a transaction made by a different user than the one in the route', async () => {

    mockUser = {
      username: "otherTester",
      email: "tester@test.com",
      password: "password",
      refreshToken: "refreshToken",
      role: "Regular"
    }

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: 'true', cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(transactions, 'findOne').mockResolvedValueOnce(mockTransaction)
    jest.spyOn(transactions, 'deleteOne').mockResolvedValueOnce();

    await deleteTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if the request body does not contain all the necessary attributes', async () => {

    mockReq.body._id=""
    jest.spyOn(utils, 'verifyAuth').mockReturnValueOnce({ flag: 'true', cause: 'Authorized' })
    jest.spyOn(User, 'findOne').mockRejectedValueOnce(mockUser)
    jest.spyOn(transactions, 'findOne').mockResolvedValueOnce(mockTransaction)
    jest.spyOn(transactions, 'deleteOne').mockResolvedValueOnce();

    await deleteTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 401 error if called by an authenticated user who is not the same user as the one in the route', async () => {

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: false, cause: 'Unauthorized' })
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser)
    jest.spyOn(transactions, 'findOne').mockResolvedValueOnce(mockTransaction)
    jest.spyOn(transactions, 'deleteOne').mockResolvedValueOnce();

    await deleteTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  test('should return a 500 error if Internal Server Error happens', async () => {

    jest.spyOn(utils, 'verifyAuth').mockReturnValueOnce({ flag: 'false', cause: 'Unauthorized' })
    jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Internal Server Error'))
    jest.spyOn(transactions, 'findOne').mockResolvedValueOnce(mockTransaction)
    jest.spyOn(transactions, 'deleteOne').mockResolvedValueOnce();

    await deleteTransaction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('deleteTransactions', () => {
  let mockReq;
  let mockRes;
  let mockTransactions;

  beforeEach(() => {
    mockReq = {
      body: { _ids: ['6hjkohgfc8nvu786', '6hjkohgfc8nvu787'] },
      cookies: { refreshToken: 'refreshToken' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage: '' },
    };
    mockTransactions = [
      {
        _id: '6hjkohgfc8nvu786',
        username: 'tester',
        amount: 100,
        type: 'food'
      },
      {
        _id: '6hjkohgfc8nvu787',
        username: 'tester',
        amount: 150,
        type: 'health'
      }
    ]
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should delete transactions and return a success message', async () => {

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(transactions, 'find').mockResolvedValueOnce(mockTransactions)
    jest.spyOn(transactions, 'deleteMany').mockResolvedValueOnce()

    // Call the function
    await deleteTransactions(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: { message: 'Transactions succesfully deleted' },
      refreshedTokenMessage: '',
    });
  });

  test('should return a 400 error if the request body does not contain all the necessary attributes', async () => {
    mockReq.body = {};

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(transactions, 'find').mockResolvedValueOnce(mockTransactions)
    jest.spyOn(transactions, 'deleteMany').mockResolvedValueOnce()

    await deleteTransactions(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if at least one of the ids in the array is an empty string', async () => {
    mockReq.body = {};

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(transactions, 'find').mockResolvedValueOnce(mockTransactions)
    jest.spyOn(transactions, 'deleteMany').mockResolvedValueOnce()

    await deleteTransactions(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if at least one of the ids in the array is an empty string', async () => {
    mockReq.body._ids = ['', '6hjkohgfc8nvu786'];
    mockTransactions = [{
      _id: '6hjkohgfc8nvu786',
      username: 'tester',
      amount: 100,
      type: 'food'
    }]
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(transactions, 'find').mockResolvedValueOnce(mockTransactions)
    jest.spyOn(transactions, 'deleteMany').mockResolvedValueOnce()

    await deleteTransactions(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 400 error if at least one of the ids in the array does not represent a transaction in the database', async () => {
    mockTransactions = [{
      _id: '6hjkohgfc8nvu786',
      username: 'tester',
      amount: 100,
      type: 'food'
    }]
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(transactions, 'find').mockResolvedValueOnce(mockTransactions)
    jest.spyOn(transactions, 'deleteMany').mockResolvedValueOnce()

    await deleteTransactions(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test('should return a 401 error if called by an authenticated user who is not an admin', async () => {

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: false, cause: 'Unauthorized' })
    jest.spyOn(transactions, 'find').mockResolvedValueOnce(mockTransactions)
    jest.spyOn(transactions, 'deleteMany').mockResolvedValueOnce()

    await deleteTransactions(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  test('should return a 500 error if Internal Server Error happens', async () => {

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' })
    jest.spyOn(transactions, 'find').mockRejectedValueOnce(new Error('Internal Server Error'))
    jest.spyOn(transactions, 'deleteMany').mockResolvedValueOnce()

    await deleteTransactions(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
