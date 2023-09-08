import request from 'supertest';
import { app } from '../app';
import { Group, User } from '../models/User.js';
import * as utils from '../controllers/utils.js'
import { createGroup, getGroups, getGroup, getUser, getUsers, addToGroup, removeFromGroup, deleteGroup, deleteUser} from '../controllers/users';
import { transactions } from '../models/model';
import { Jwt } from 'jsonwebtoken';

/**
 * In order to correctly mock the calls to external modules it is necessary to mock them using the following line.
 * Without this operation, it is not possible to replace the actual implementation of the external functions with the one
 * needed for the test cases.
 * `jest.mock()` must be called for every external module that is called in the functions under test.
 */
jest.mock("../models/User.js")
jest.mock("../controllers/utils.js")
jest.mock('../models/model.js')
/**
 * Defines code to be executed before each test case is launched
 * In this case the mock implementation of `User.find()` is cleared, allowing the definition of a new mock implementation.
 * Not doing this `mockClear()` means that test cases may use a mock implementation intended for other test cases.
 */
beforeEach(() => {
  User.find.mockClear()
  utils.verifyAuth.mockClear()
  Group.find.mockClear()
  
  //additional `mockClear()` must be placed here
});

describe("getUsers", () => {
  test("should return empty list if there are no users", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token"
      }
    }
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValue([])

    await getUsers(mockReq, mockRes)

    expect(User.find).toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({ data: [], refreshedTokenMessage: mockRes.locals.refreshedTokenMessage})
  })

  test("should retrieve list of all users", async () => {
    const mockReq = {
      cookies: { refreshToken: 'fakeRefreshToken' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: "expired token"
      }
    };
    const retrievedUsers = [
      { username: 'test1', email: 'test1@example.com', role: 'Regular' },
      { username: 'test2', email: 'test2@example.com', password: 'Regular' },
      { username: 'admin1', email: 'admin1@example.com', password: 'Admin' },
    ];
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValue(retrievedUsers);

    await getUsers(mockReq, mockRes);

    expect(User.find).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: retrievedUsers, // Remove the unnecessary object wrapping
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
    })
  })

  test("should return error with invalid authentication", async () => {
    const mockReq = {
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Not an admin" });
    jest.spyOn(User, "find").mockResolvedValue(null);

    await getUsers(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Not an admin'
    })
  })

  test('should handle other errors and return 500 response', async () => {
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };
  
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    jest.spyOn(User, 'find').mockImplementation(() => {
      throw new Error('Database error');
    });
  
    await getUsers(mockReq, mockRes);
  
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith('Database error');
  });  

})

describe('getUser', () => {
  test('should retrieve user details with user authentication', async () => {
    const mockReq = {
      cookies: { refreshToken: 'fakeRefreshToken' },
      params: { username: 'testuser' },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'refreshed token',
      },
    };

    const mockUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      role: 'Regular',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

    await getUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ refreshToken: 'fakeRefreshToken' });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        username: 'testuser',
        email: 'testuser@example.com',
        role: 'Regular',
      },
      refreshedTokenMessage: 'refreshed token',
    });
  });

  test('should return error with invalid authentication', async () => {
    const mockReq = {
      params: { username: 'testuser' },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: false, cause: 'Unauthorized' });
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    await getUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'userAuth: Unauthorized - adminAuth: Unauthorized',
    });
  });

  test('should retrieve user details with admin authentication', async () => {
    const mockReq = {
      cookies: { refreshToken: 'fakeRefreshToken' },
      params: { username: 'testadmin' },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'refreshed token',
      },
    };

    const mockUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      role: 'Regular',
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValueOnce({ flag: false, cause: 'Unauthorized' });

    jest.spyOn(utils, 'verifyAuth').mockReturnValueOnce({ flag: true, cause: 'Authorized' });
    
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

    await getUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ refreshToken: 'fakeRefreshToken' });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        username: 'testuser',
        email: 'testuser@example.com',
        role: 'Regular',
      },
      refreshedTokenMessage: 'refreshed token',
    });
  });

  test('should return a 400 error when user is not found with admin authentication', async () => {
    const mockReq = {
      cookies: { refreshToken: 'fakeRefreshToken' },
      params: { username: 'testAdmin' },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(utils, 'verifyAuth').mockReturnValueOnce({ flag: false, cause: 'Unauthorized' });
    jest.spyOn(utils, 'verifyAuth').mockReturnValueOnce({ flag: true, cause: 'Authorized' });
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    await getUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
  });

  test('should handle error and return 500 response', async () => {
    const mockReq = {
      cookies: { refreshToken: 'mockRefreshToken' },
      params: { username: 'mockUsername' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        refreshedTokenMessage: 'expired token',
      },
    };
  
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
    jest.spyOn(User, 'findOne').mockImplementation(() => {
      throw new Error('Database error');
    });
  
    await getUser(mockReq, mockRes);
  
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith('Database error');
  });
  

});

describe("createGroup", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    Group.findOne.mockClear();
    Group.create.mockClear();
    User.findOne.mockClear();
  });

  test("user creates a group", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: "Family", 
        memberEmails: ["mario.red@email.com", "luigi.red@email.com"]},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
   
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({
      email: mockReq.body.memberEmails[0]
    });
    jest.spyOn(User, "findOne").mockResolvedValueOnce({
      id: 1,
      email: mockReq.body.memberEmails[0]
    });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({
      id: 1,
      email: mockReq.body.memberEmails[1]
    });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(Group, "create").mockResolvedValueOnce({
      name: 'Family',
      members: [
        { email: mockReq.body.memberEmails[0] },
        { email: mockReq.body.memberEmails[1] },
      ],
    });

    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.create).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        group: {
          name: "Family",
          members: [
            { email: mockReq.body.memberEmails[0] },
            { email: mockReq.body.memberEmails[1] },
          ],
        },
        membersNotFound: [],
        alreadyInGroup: [],
      },
      refreshedTokenMessage: 'refreshed token',
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  test("user creates a group and he does not have his email in the list", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: "Family", 
        memberEmails: ["luigi.red@email.com"]},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
   
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({email:"mario.red@email.com"});
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({id: 1, email:"luigi.red@email.com"});
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(Group, "create").mockResolvedValueOnce({name: 'Family',
    members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}],
    });

    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(Group.create).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        data:
          { 
            group: 
            {name: "Family",
             members: 
             [{email: "mario.red@email.com"},
              {email: "luigi.red@email.com"}]
            }, 
            membersNotFound: [],
            alreadyInGroup: [],
          },
        refreshedTokenMessage: 'refreshed token',
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  test("request body does not contain all the necessary attributes (missing memberEmails)", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: "Family", },
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    
    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: "The request body does not contain all the necessary attributes"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("request body does not contain all the necessary attributes (missing name)", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        memberEmails: ["mario.red@email.com", "luigi.red@email.com"] },
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    
    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: "The request body does not contain all the necessary attributes"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("request body does not contain all the necessary attributes (missing body)", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    
    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: "The request body does not contain all the necessary attributes"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("empty string as name", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: "  ", 
        memberEmails: ["mario.red@email.com", "luigi.red@email.com"]},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });

    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      { error: "The name passed in the request body is an empty string" }
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("user creates a group with only himself, specifying his\
  email and other 2 non existing emails in the body", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: 'Family',
        memberEmails: ["mario.red@email.com", "luigi.red@email.com", "marcello.red@email.com"],
      },
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({email:"mario.red@email.com"});
    jest.spyOn(User, "findOne").mockResolvedValueOnce({id: 1, email:"mario.red@email.com"});
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce(false).mockResolvedValueOnce(false);
    jest.spyOn(Group, "create").mockResolvedValueOnce({name: 'Family',
    members: [{email: "mario.red@email.com"}],
    });

    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(Group.create).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        data:{
          group: {
            name: "Family",
            members: [
              {email: "mario.red@email.com"},
            ],
          },
          alreadyInGroup: [],
          membersNotFound: ["luigi.red@email.com", "marcello.red@email.com"],
        },
        refreshedTokenMessage: 'refreshed token',
      });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  test("all the provided emails represent users that do not exist", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: 'Family',
        memberEmails: ["luigi.red@email.com", "marcello.red@email.com"],
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({email:"mario.red@email.com"});
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce(false).mockResolvedValueOnce(false);

    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error:"All the `memberEmails` either do not exist or are already in a group",
      });
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("all the provided emails represent users belong to another group", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: 'Family',
        memberEmails: ["luigi.red@email.com", "marcello.red@email.com"],
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({email:"mario.red@email.com"});
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({_id: 1, email:"luigi.red@email.com"});
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(true);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({_id: 2, email:"luigi.red@email.com"});
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(true);

    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error:"All the `memberEmails` either do not exist or are already in a group",
      });
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("user unauthorized", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: "Family", 
        memberEmails: ["luigi.red@email.com", "marcello.red@email.com"],},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause:"Token is missing information"});
    
    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: "Token is missing information"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
  test("existing group name", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: "Family", 
        memberEmails: ["mario.red@email.com", "luigi.red@email.com"]},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(true);
    
    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      error:"Group with the same name already exists"
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("user who creates the group is already in another group", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: "Family", 
        memberEmails: ["mario.red@email.com", "luigi.red@email.com"]},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({email: "andrea.red@email.com"});
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(true);
    
    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      error:"The user that requests to create a group is already in another group"
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("empty emails", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: "Family", 
        memberEmails: ["  ", ""]},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);

    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Email not valid"
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("not valid emails", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body : {
        name: "Family", 
        memberEmails: ["mario1234", "luigi.com"]},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);

    await createGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Email not valid"
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  test("group creation fails due to a db error", async () => {
    const mockReq = {
      cookies: { refreshToken: 'fakeRefreshToken' },
      body: {
        name: 'Family',
        memberEmails: ["mario.red@email.com", "luigi.red@email.com"],
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, 'verifyAuth').mockReturnValue({ flag: true, cause: 'Authorized' });
  
    jest.spyOn(Group, 'findOne').mockImplementation(() => {
      throw new Error('Internal server error');
    });
  
    await createGroup(mockReq, mockRes);
  
    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});

describe("getGroups", () => { 
  beforeEach(() => {
    jest.restoreAllMocks()
    Group.find.mockClear();
  });

  test("authenticated admin requests all the groups", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "find").mockResolvedValueOnce([
      {name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]},
      {name: "Friends",
      members: [{email: "lorenzo.red@email.com"},{ email: "andrea.red@email.com"}]},
      {name: "Sport",
        members: [{ email: "marcello.red@email.com"},{email: "terry.red@email.com"}]}
    ]);

    await getGroups(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.find).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        data: 
          [
            {name: "Family",
            members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]},
            {name: "Friends",
            members: [{email: "lorenzo.red@email.com"},{ email: "andrea.red@email.com"}]},
            {name: "Sport",
              members: [{ email: "marcello.red@email.com"},{email: "terry.red@email.com"}]}
          ],
        refreshedTokenMessage: 'refreshed token',
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  test("unathorized user requests all the groups", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });
    
    await getGroups(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: "Unauthorized"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
  test("authenticated admin fails request due to a db error", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'List of all the groups'},
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, 'find').mockImplementation(() => {
      throw new Error('Internal server error');
    });

    await getGroups(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.find).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: 'Internal server error'
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
  
})

describe("getGroup", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    User.findOne.mockClear();
    Group.findOne.mockClear();
  });

  test("success on user (user in the group)", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params: {
        name: 'Family'
      }
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, 'findOne').mockResolvedValueOnce({email: 'mario.red@email.com'});
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
    });

    await getGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        data: {
          group:{
            name: "Family",
            members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
          }
        },
        refreshedTokenMessage: 'refreshed token',
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);

  });
  test("fail on user (user not authorized)", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params: {
        name: 'Family'
      }
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValueOnce({ flag: false, cause: "Unauthorized" });
    jest.spyOn(utils, "verifyAuth").mockReturnValueOnce({ flag: false, cause: "Not an Admin" });

    
    await getGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: "Not an Admin"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(401);

  });
  test("group does not exist", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params: {
        name: 'Family'
      }
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);

    await getGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: "Group not found"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);

  });
  test("success on admin", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params: {
        name: 'Family'
      }
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),  
      locals: { refreshedTokenMessage:'refreshed token'},
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValueOnce({ flag: false });
    jest.spyOn(utils, "verifyAuth").mockReturnValueOnce({ flag: true, cause: "Authorized" });
    
    await getGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        data: {
          group: {
            name: "Family",
            members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
          }
        },
        refreshedTokenMessage: 'refreshed token',
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);

  });
  test("authentication fail", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params: {
        name: 'Family'
      }
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),  
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValueOnce({ flag: false });
    jest.spyOn(utils, "verifyAuth").mockReturnValueOnce({ flag: false, cause: "Unauthorized" });
    
    await getGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: "Unauthorized"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(401);

  });
  test("fail due to a db error", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params: {
        name: 'Family'
      }
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),  
    };
    jest.spyOn(Group, 'findOne').mockImplementation(() => {
      throw new Error('Internal server error');
    });

    await getGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: 'Internal server error'
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(500);

  });
 })



describe("addToGroup", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    User.findOne.mockClear();
    Group.findOne.mockClear();
    Group.find.mockClear();
    Group.findOneAndUpdate.mockClear();
  });
  test("successful add by admin", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com"]},
      url : 'api/groups/Family/insert', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name: "Family", members: 
    [{email: "mario.red@email.com"},
     {email: "luigi.red@email.com"}]});
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "find").mockResolvedValueOnce([
      {name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]},
      {name: "Friends",
      members: [{email: "lorenzo.red@email.com"},{ email: "andrea.red@email.com"}]},
      {name: "Sport",
      members: [{ email: "marcello.red@email.com"},{email: "terry.red@email.com"}]},
    ]);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({_id: 1});

    await addToGroup(mockReq, mockRes)

    
    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(Group.find).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();


    expect(mockRes.json).toHaveBeenCalledWith(
      {
        data: {
          group: {
            name: "Family",
            members: [
              {email: "mario.red@email.com"}, 
              {email: "luigi.red@email.com"}, 
              {email: "pietro.blue@email.com"}
            ]
          },
          membersNotFound: [], 
          alreadyInGroup: [], 
        },
        refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
      },
      
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    
  })
  test("successful add by user", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com"]},
      url : 'api/groups/Family/add', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name: "Family", members: 
    [{email: "mario.red@email.com"},
     {email: "luigi.red@email.com"}]});
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "find").mockResolvedValueOnce([
      {name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]},
      {name: "Friends",
      members: [{email: "lorenzo.red@email.com"},{ email: "andrea.red@email.com"}]},
      {name: "Sport",
      members: [{ email: "marcello.red@email.com"},{email: "terry.red@email.com"}]},
    ]);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({_id: 1});

    await addToGroup(mockReq, mockRes)

    
    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();


    expect(mockRes.json).toHaveBeenCalledWith(
      {
        data: {
          group: {
            name: "Family",
            members: [
              {email: "mario.red@email.com"}, 
              {email: "luigi.red@email.com"}, 
              {email: "pietro.blue@email.com"}
            ]
          },
          membersNotFound: [], 
          alreadyInGroup: [], 
        },
        refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
      },
      
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    
  })
  test("missing request body attributes", async () => {
    const mockReq = {
      params: { name: "Family" },
      body: {}, // Empty request body
      url: "api/groups/Family/insert",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name: "Family", members: 
    [{email: "mario.red@email.com"},
     {email: "luigi.red@email.com"}]});
     jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    
    await addToGroup(mockReq, mockRes);

    
    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Request body does not contain all the necessary attributes",
    });
  });
  test("group does not exist", async () => {
    const mockReq = {
      params: { name: "Family" }, // Non-existent group name
      body: { emails: ["mario.red@email.com"] },
      url: "api/groups/Family/insert",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(null); // Simulate group not found

    await addToGroup(mockReq, mockRes);

    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Group doesn't exist",
    });
  });
  test("all emails already in a group", async () => {
    const mockReq = {
      params: { name: "Family" },
      body: { emails: ["mario.red@email.com", "lorenzo.red@email.com"] }, // Emails already in the group
      url: "api/groups/Family/add",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"},
        {email: "luigi.red@email.com"}
      ],
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "find").mockResolvedValueOnce([
      {name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]},
      {name: "Friends",
      members: [{email: "lorenzo.red@email.com"},{ email: "andrea.red@email.com"}]},
      {name: "Sport",
      members: [{ email: "marcello.red@email.com"},{email: "terry.red@email.com"}]},
    ]);
    jest.spyOn(User, "findOne").mockResolvedValueOnce({
      _id: 1,
      email: "mario.red@email.com"
    });
    jest.spyOn(User, "findOne").mockResolvedValueOnce({
      _id: 2,
      email: "lorenzo.red@email.com"
    });

    await addToGroup(mockReq, mockRes);
    
    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(Group.find).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "All the emails either do not exist or are already in a group",
    });
  });
  test("all emails do not exist", async () => {
    const mockReq = {
      params: { name: "Family" },
      body: { emails: ["alicia.red@email.com", "pedro.red@email.com"] }, // Emails already in the group
      url: "api/groups/Family/add",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"},
        {email: "luigi.red@email.com"}
      ],
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "find").mockResolvedValueOnce([
      {name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]},
      {name: "Friends",
      members: [{email: "lorenzo.red@email.com"},{ email: "andrea.red@email.com"}]},
      {name: "Sport",
      members: [{ email: "marcello.red@email.com"},{email: "terry.red@email.com"}]},
    ]);
    jest.spyOn(User, "findOne").mockResolvedValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValueOnce(false);

    await addToGroup(mockReq, mockRes);
    
    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(Group.find).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "All the emails either do not exist or are already in a group",
    });
  });
  test("invalid email format", async () => {
    const mockReq = {
      params: { name: "Family" },
      body: { emails: ["invalid.email"] }, // Invalid email format
      url: "api/groups/Family/add",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "find").mockResolvedValueOnce([
      {name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]},
      {name: "Friends",
      members: [{email: "lorenzo.red@email.com"},{ email: "andrea.red@email.com"}]},
      {name: "Sport",
      members: [{ email: "marcello.red@email.com"},{email: "terry.red@email.com"}]},
    ]);
    await addToGroup(mockReq, mockRes);
    
    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(Group.find).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "One or more emails not valid",
    });
  });
  test("empty email", async () => {
    const mockReq = {
      params: { name: "Family" },
      body: { emails: [""] }, // Empty email
      url: "api/groups/Family/add",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "find").mockResolvedValueOnce([
      {name: "Family",
      members: [{email: "mario.red@email.com"}, {email: "luigi.red@email.com"}]},
      {name: "Friends",
      members: [{email: "lorenzo.red@email.com"},{ email: "andrea.red@email.com"}]},
      {name: "Sport",
      members: [{ email: "marcello.red@email.com"},{email: "terry.red@email.com"}]},
    ]);
    await addToGroup(mockReq, mockRes);
    
    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(Group.find).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "One or more emails not valid",
    });
  });
  test("unauthorized user (Group authType)", async () => {
    const mockReq = {
      params: { name: "Family" },
      body: { emails: ["pietro.blue@email.com"] },
      url: "api/groups/Family/add",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [{email: "lorenzo.red@email.com"},{ email: "andrea.red@email.com"}],
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });

    await addToGroup(mockReq, mockRes);

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Unauthorized",
    });
  });
  test("unauthorized user (Admin authType)", async () => {
    const mockReq = {
      params: { name: "Family" },
      body: { emails: ["example@example.com"] },
      url: "api/groups/Family/insert",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [],
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });

    await addToGroup(mockReq, mockRes);

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Unauthorized",
    });
  });
  test("fail due to a db error", async () => {
    const mockReq = {
      params: { name: "Family" }, // Non-existent group name
      body: { emails: ["mario.red@email.com"] },
      url: "api/groups/Family/insert",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, 'findOne').mockImplementation(() => {
      throw new Error('Internal server error');
    });

    await addToGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: 'Internal server error'
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(500);

  });
});

describe("removeFromGroup", () => {
  beforeEach(() => {
    User.find.mockClear();
    Group.findOne.mockClear();
  });
  test("successful remove by admin", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com"]},
      url : 'api/groups/Family/pull', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      data: 
      {
        group: 
        {
          name: "Family",
          members: [
            {email: "mario.red@email.com"}, 
            {email: "luigi.red@email.com"}
          ]
        },
        membersNotFound: [],
        notInGroup: []},
        refreshedTokenMessage: mockRes.locals.refreshedTokenMessage}
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);

  });
  test("successful remove by user", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com"]},
      url : 'api/groups/Family/remove', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      data: 
      {
        group: 
        {
          name: "Family",
          members: [
            {email: "mario.red@email.com"}, 
            {email: "luigi.red@email.com"}
          ]
        },
        membersNotFound: [],
        notInGroup: []},
        refreshedTokenMessage: mockRes.locals.refreshedTokenMessage}
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);

  });
  test("error remove by admin unauthorized root", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com"]},
      url : 'api/groups/Family/remove', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Unauthorized"
    });
    expect(mockRes.status).toHaveBeenCalledWith(401);

  });
  test("error remove by user unauthorized root", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com"]},
      url : 'api/groups/Family/pull', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Unauthorized"
    });
    expect(mockRes.status).toHaveBeenCalledWith(401);

  });
  test("error if request body does not contain necessary attributes", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {},
      url : 'api/groups/Family/pull', 
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "The request body does not contain all the necessary attributes"
    });
  });
  test("group does not exist", async () => {
    const mockReq = {
      params: { name: "Family" }, // Non-existent group name
      body: { emails: ["mario.red@email.com"] },
      url: "api/groups/Family/pull",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(null); // Simulate group not found

    await removeFromGroup(mockReq, mockRes);

    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Group doesn't exist",
    });
  });
  test("fail due to a db error", async () => {
    const mockReq = {
      params: { name: "Family" }, // Non-existent group name
      body: { emails: ["mario.red@email.com"] },
      url: "api/groups/Family/insert",
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Group, 'findOne').mockImplementation(() => {
      throw new Error('Internal server error');
    });

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: 'Internal server error'
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(500);

  });
  test("all emails do not belong to the group", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com"]},
      url : 'api/groups/Family/remove', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      error: "All the provided emails represent users that do not belong to the group or do not exist in the database"
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);

  });
  test("all emails do not exist in the DB", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["francesco.blue@email.com"]},
      url : 'api/groups/Family/remove', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'Members succesfully removed'},
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"},
        {email: "pietro.blue@email.com"} 
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      error: "All the provided emails represent users that do not belong to the group or do not exist in the database"
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);

  });
  test("all emails do not belong to the group or do not exist in the DB", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com", "francesco.blue@email.com"]},
      url : 'api/groups/Family/remove', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      error: "All the provided emails represent users that do not belong to the group or do not exist in the database"
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);

  });
  test("invalid email format", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com", "adrea.blue"]},
      url : 'api/groups/Family/remove', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      error: "There is at least one email with an invalid format"
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);

  });
  test("empty email", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com", "   "]},
      url : 'api/groups/Family/remove', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Empty strings are not accepted"
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);

  });
  test("group composed by only one member", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["pietro.blue@email.com"]},
      url : 'api/groups/Family/remove', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Cannot delete the last member of a group",
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);

  });
  test("successful remove by user leaving one member", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      params : { name: 'Family'},
      body: {emails: ["luigi.red@email.com", "pietro.blue@email.com","mario.red@email.com" ]},
      url : 'api/groups/Family/remove', 
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(User, "find").mockResolvedValueOnce([
      {email: "mario.red@email.com"}, 
      {email: "luigi.red@email.com"}, 
      {email: "pietro.blue@email.com"}
    ]);

    await removeFromGroup(mockReq, mockRes)

    expect(Group.findOne).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(utils.verifyAuth).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      data: 
      {
        group: 
        {
          name: "Family",
          members: [
            {email: "mario.red@email.com"}, 
          ]
        },
        membersNotFound: [],
        notInGroup: []},
        refreshedTokenMessage: mockRes.locals.refreshedTokenMessage}
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);

  });
 })

 describe("deleteUser", () => {
  let mockReq, mockRes, mockUser, mockGroup;

  beforeEach(() => {
  mockReq = {
    body: {
      email: "luigi.red@email.com"
    },
    cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
  };
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    locals: {
      refreshedTokenMessage: "expired token"
    }
  };

  mockUser = { email: "luigi.red@email.com", username: "Luigi", role: "Regular" };
  mockGroup = { name: "Family", members: [{ email: 'luigi.red@email.com' }, {email: 'mario.blue@email.com'}] };
  
  User.findOne.mockClear();
  Group.findOne.mockClear();
  Group.updateOne.mockClear();
  User.deleteOne.mockClear();
  transactions.deleteMany.mockClear();
  utils.verifyAuth.mockClear();
  jest.clearAllMocks();
  
});


afterEach(() => {
  jest.restoreAllMocks();
});

  test("should delete the user and return the result if autorized", async () => {

    User.findOne = jest.fn().mockResolvedValue(mockUser);
    Group.findOne = jest.fn().mockResolvedValue(mockGroup);
    jest.spyOn(Group, "updateOne").mockResolvedValue();
    jest.spyOn(User, "deleteOne").mockResolvedValue();
    jest.spyOn(transactions, "deleteMany").mockReturnValue({ deletedCount: 1 });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Autorized" });

    await deleteUser(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        deletedTransactions: 1, 
        deletedFromGroup: true 
      }),
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    }));
  });

  test("should delete the user and return the result if not in a group", async () => {
    User.findOne = jest.fn().mockReturnValue(mockUser)
    Group.findOne = jest.fn().mockReturnValue(null)
    jest.spyOn(User, "deleteOne").mockResolvedValue();
    jest.spyOn(transactions, "deleteMany").mockResolvedValue({ deletedCount: 1 });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });

    await deleteUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      data: { 
        deletedTransactions: 1, 
        deletedFromGroup: false,
      },
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    }));
  });

  test("should delete the user and the group if user is the last member", async () => {
    mockGroup = { name: "Family", members: [{ email: 'luigi.red@email.com' }] };
    User.findOne = jest.fn().mockReturnValue(mockUser)
    Group.findOne = jest.fn().mockReturnValue(mockGroup)
    jest.spyOn(User, "deleteOne").mockResolvedValue();
    jest.spyOn(transactions, "deleteMany").mockResolvedValue({ deletedCount: 1 });
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });

    await deleteUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      data: { 
        deletedTransactions: 1, 
        deletedFromGroup: true,
      },
      refreshedTokenMessage: mockRes.locals.refreshedTokenMessage,
    }));
  });

  test("should return a 400 error if user email does not exist", async () => {
    User.findOne = jest.fn().mockReturnValue(null)
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });

    await deleteUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String)});
  });

  test("should return a 400 error if user to be deleted is an Admin", async () => {
    mockUser.role = "Admin";
    User.findOne = jest.fn().mockReturnValue(mockUser)
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });

    await deleteUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test("should return a 400 error if request body is missing email", async () => {
    mockReq.body.email = undefined;
    User.findOne = jest.fn().mockReturnValue(null);
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });


    await deleteUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test("should return a 400 error if email in request body is an empty string", async () => {
    mockReq.body.email = "";
    User.findOne = jest.fn().mockReturnValue(null);
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });


    await deleteUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  test("should return a 400 error if email in request body is not in correct format", async () => {
    mockReq.body.email = "invalidemail";
    User.findOne = jest.fn().mockReturnValue(null);
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });


    await deleteUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error : expect.any(String)});
  });

  test("should return a 401 error if not authorized", async () => {
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });

    await deleteUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  test("should return a 500 error if an error occurs", async () => {
    const errorMessage = "Internal server error";
    User.findOne = jest.fn().mockRejectedValue(new Error(errorMessage));
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });

    await deleteUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({error: expect.any(String)});
  });
});

describe("deleteGroup", () => {
  beforeEach(() => {
      Group.find.mockClear();
      Group.deleteOne.mockClear();
  });
  test("succesful delete by admin", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body: {name: 'Family'},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { refreshedTokenMessage:'refreshed token'},
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({
      name: "Family",
      members: [
        {email: "mario.red@email.com"}, 
        {email: "luigi.red@email.com"}, 
        {email: "pietro.blue@email.com"}
      ]
    });
    jest.spyOn(Group, "deleteOne").mockResolvedValueOnce(true);

    await deleteGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(Group.deleteOne).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith( 
      {
        data: {
          message: "group succesfully deleted"
        },
        refreshedTokenMessage: mockRes.locals.refreshedTokenMessage
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    
  })
  test("unauthorized", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body: {name: 'Family'},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: false, cause: "Unauthorized" });
    

    await deleteGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith( 
      {
        error: "Unauthorized"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(401);
    
  })
  test("empty body", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body: {},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Unauthorized" });

    await deleteGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith( 
      {
        error: "the request body does not contain all the necessary attributes"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);
    
  })
  test("name passed is an empty string", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body: {name: "  "},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Unauthorized" });

    await deleteGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith( 
      {
        error: "the name passed in the request body is an empty string"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);
    
  })
  test("group does not exist", async ()=>{
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body: {name: 'Family'},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(false);

    await deleteGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith( 
      {
        error: "group doesn't exist"
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);
    
  })
  test("fail due to a db error", async () => {
    const mockReq = {
      cookies : { refreshToken:'fakeRefreshToken'},
      body: {name: 'Family'},
    };
    const mockRes= {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(utils, "verifyAuth").mockReturnValue({ flag: true, cause: "Authorized" });
    jest.spyOn(Group, 'findOne').mockImplementation(() => {
      throw new Error('Internal server error');
    });

    await deleteGroup(mockReq, mockRes)

    expect(utils.verifyAuth).toHaveBeenCalled();
    expect(Group.findOne).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith(
      {
        error: 'Internal server error'
      }
    );
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
})