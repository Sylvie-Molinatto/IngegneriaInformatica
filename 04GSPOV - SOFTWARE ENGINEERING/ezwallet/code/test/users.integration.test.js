import request from 'supertest';
import { app } from '../app';
import { User, Group } from '../models/User.js';
import { transactions, categories } from '../models/model';
import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';
import { response } from 'express';
import jwt from 'jsonwebtoken';
import "jest-extended"

/**
 * Necessary setup in order to create a new database for testing purposes before starting the execution of test cases.
 * Each test suite has its own database in order to avoid different tests accessing the same database at the same time and expecting different data.
 */
dotenv.config();
beforeAll(() => {
  const dbName = "testingDatabaseUsers";
  const url = `${process.env.MONGO_URI}/${dbName}`;

  mongoose.set('strictQuery', false);
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

});

//necessary setup to ensure that each test can insert the data it needs
beforeEach(async () => {
  await User.deleteMany({})
  await Group.deleteMany({})
  await transactions.deleteMany({})
  await categories.deleteMany({})

})

/**
 * Alternate way to create the necessary tokens for authentication without using the website
 */
const adminAccessTokenValid = jwt.sign({
  email: "admin@email.com",
  //id: existingUser.id, The id field is not required in any check, so it can be omitted
  username: "admin",
  role: "Admin"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenValid = jwt.sign({
  email: "mario.red@email.com",
  username: "Mario",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenValid_1 = jwt.sign({
  email: "luigi.red@email.com",
  username: "Luigi",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenValid_2 = jwt.sign({
  email: "sara.red@email.com",
  username: "Sara",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenValid_3 = jwt.sign({
  email: "mario.red@email.com",
  username: "Mario",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenEmpty = jwt.sign({}, process.env.ACCESS_KEY, { expiresIn: "1y" })

/**
 * After all test cases have been executed the database is deleted.
 * This is done so that subsequent executions of the test suite start with an empty database.
 */
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("getUsers", () => {
  test('Should return all users when admin authentication is successful', async () => {

    await User.insertMany([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }, {
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      role: 'Regular'
    },
    {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: 'securePass',
      role: 'Regular'
    }]);

    const response = await request(app)
      .get('/api/users')
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThan(0);

    expect(response.body.data).toEqual([
      { username: "admin", email: "admin@email.com", role: "Admin" },
      { username: "Mario", email: "mario.red@email.com", role: "Regular" },
      { username: "Luigi", email: "luigi.red@email.com", role: "Regular" },
    ])
  });

  test('Should return 401 is not an admin', async () => {

    await User.insertMany([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }, {
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      role: 'Regular'
    },
    {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: 'securePass',
      role: 'Regular'
    }]);

    const response = await request(app)
      .get('/api/users')
      .set("Cookie", `accessToken=${testerAccessTokenValid_3}; refreshToken=${testerAccessTokenValid_3}`)

    expect(response.statusCode).toBe(401);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });

});

describe("getUser", () => {
  test('Should return user data when authenticated as user', async () => {
    await User.insertMany([{
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      refreshToken: testerAccessTokenValid_3,
      role: 'Regular'
    }])
    const response = await request(app)
      .get('/api/users/Mario')
      .set('Cookie', `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)


    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('username', 'Mario');
    expect(response.body.data).toHaveProperty('email', 'mario.red@email.com');
    expect(response.body.data).toHaveProperty('role', 'Regular');
    expect(response.body.data).toEqual({
      username: 'Mario',
      email: 'mario.red@email.com',
      role: 'Regular'
    })

  });

  test('Should return user data when authenticated as admin', async () => {
    await User.insertMany([{
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      refreshToken: testerAccessTokenValid_3,
      role: 'Regular'
    }])
    const response = await request(app)
      .get('/api/users/Mario')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)


    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('username', 'Mario');
    expect(response.body.data).toHaveProperty('email', 'mario.red@email.com');
    expect(response.body.data).toHaveProperty('role', 'Regular');
    expect(response.body.data).toEqual({
      username: 'Mario',
      email: 'mario.red@email.com',
      role: 'Regular'
    })

  });

  test('Should return a 400 error if user does not exist - (verifyAuth=Admin)', async () => {
    await User.insertMany([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }, {
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      role: 'Regular'
    }]);
    const response = await request(app)
      .get('/api/users/Vincenzo')
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });

  test('Should return a 401 error if user is neither the same user one the route parameter nor an admin', async () => {
    await User.create({
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    })
    await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    })
    await User.create({
      username: "Luigi",
      email: "luigi.red@email.com",
      password: 'securePass',
      role: 'Regular'
    })
    const response = await request(app)
      .get('/api/users/Luigi')
      .set('Cookie', `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)

    expect(response.status).toBe(401);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
})

describe("createGroup", () => {
  test("user creates a group", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      data: {
        group: {
          name: "Family",
          members: [
            { email: "mario.red@email.com" },
            { email: "serena.red@email.com" },
          ],
        },
        membersNotFound: [],
        alreadyInGroup: [],
      },
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["mario.red@email.com", "serena.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty("alreadyInGroup")
    expect(response.body.data).toHaveProperty("group")
    expect(response.body.data).toHaveProperty("membersNotFound")
    expect(response.body).toEqual(expectedResponse)
  })
  test("admin success on creation", async () => {
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      data: {
        group: {
          name: "Family",
          members: [
            { email: "mario.red@email.com" },
            { email: "admin@email.com" },
          ],
        },
        membersNotFound: [],
        alreadyInGroup: [],
      },
    };
    //The API request must be awaited as well
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["mario.red@email.com", "admin@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty("alreadyInGroup")
    expect(response.body.data).toHaveProperty("group")
    expect(response.body.data).toHaveProperty("membersNotFound")
    expect(response.body).toEqual(expectedResponse)
    //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
  })
  test("user success with someone already in group", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      data: {
        group: {
          name: "Family",
          members: [
            { email: "mario.red@email.com" },
          ],
        },
        membersNotFound: [],
        alreadyInGroup: ["luigi.red@email.com"],
      },
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["mario.red@email.com", "luigi.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty("alreadyInGroup")
    expect(response.body.data).toHaveProperty("group")
    expect(response.body.data).toHaveProperty("membersNotFound")
    expect(response.body).toEqual(expectedResponse)
  })
  test("user success with a non existing member", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      data: {
        group: {
          name: "Family",
          members: [
            { email: "mario.red@email.com" },
            { email: "serena.red@email.com" },
          ],
        },
        membersNotFound: ["hello.red@email.com"],
        alreadyInGroup: [],
      },
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["mario.red@email.com", "serena.red@email.com", "hello.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty("alreadyInGroup")
    expect(response.body.data).toHaveProperty("group")
    expect(response.body.data).toHaveProperty("membersNotFound")
    expect(response.body).toEqual(expectedResponse)
  })
  test("request body empty", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "The request body does not contain all the necessary attributes"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({});

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("request body does not contain the memberEmails", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "The request body does not contain all the necessary attributes"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family" });

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("request body does not contain the name", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "The request body does not contain all the necessary attributes"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ memberEmails: ["mario.red@email.com", "serena.red@email.com", "hello.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("empty string as name", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "The name passed in the request body is an empty string"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "  ", memberEmails: ["mario.red@email.com", "serena.red@email.com", "hello.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("user creates a group and he does not have his email in the list", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      data: {
        group: {
          name: "Family",
          members: [
            { email: "serena.red@email.com" },
            { email: "mario.red@email.com" },
          ],
        },
        membersNotFound: [],
        alreadyInGroup: [],
      },
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["serena.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty("alreadyInGroup")
    expect(response.body.data).toHaveProperty("group")
    expect(response.body.data).toHaveProperty("membersNotFound")
    expect(response.body).toEqual(expectedResponse)
  })
  test("user creates a group with only himself, specifying his email\
  and other not existing emails", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      data: {
        group: {
          name: "Family",
          members: [
            { email: "mario.red@email.com" },
          ],
        },
        membersNotFound: ["hello.red@email.com",
          "maria.red@email.com"],
        alreadyInGroup: [],
      },
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["mario.red@email.com", "hello.red@email.com", "maria.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty("alreadyInGroup")
    expect(response.body.data).toHaveProperty("group")
    expect(response.body.data).toHaveProperty("membersNotFound")
    expect(response.body).toEqual(expectedResponse)
  })
  test("all the provided emails represent users that do not exist", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "All the `memberEmails` either do not exist or are already in a group"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["hello.red@email.com", "maria.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("all the provided emails belong to another group", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "All the `memberEmails` either do not exist or are already in a group"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["andrea.red@email.com", "luigi.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("group already exists", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "Group with the same name already exists"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "MyGroup", memberEmails: ["mario.red@email.com", "serena.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("user unauthorized", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "Token is missing information"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenEmpty}; refreshToken=${testerAccessTokenEmpty}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["mario.red@email.com", "serena.red@email.com"] });

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("user who creates the group is already in another group", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "The user that requests to create a group is already in another group"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["mario.red@email.com", "serena.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("empty emails", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "Email not valid"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["   ", ""] });

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
  test("not valid emails", async () => {
    //The API request must be awaited as well
    const users = await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    const groups = await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    }
    ])
    const expectedResponse = {
      error: "Email not valid"
    };
    const response = await request(app)
      .post("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "Family", memberEmails: ["mario1234", "luigi.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body).toEqual(expectedResponse)
  })
})

describe("getGroups", () => {
  beforeEach( async () => {
    await User.insertMany([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    await Group.insertMany([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    },
    {
      name: "Family",
      members: [
        { email: "mario.red@email.com" },
        { email: "serena.red@email.com" }
      ]
    }
    ])
  })
  test("authenticated admin requests all the groups", async () => {
    const expectedResponse = {
      data: [
        {
          name: "MyGroup",
          members: [
            { email: "andrea.red@email.com" },
            { email: "luigi.red@email.com" }
          ]
        },
        {
          name: "Family",
          members: [
            { email: "mario.red@email.com" },
            { email: "serena.red@email.com" }
          ]
        },
      ],
    };
    const response = await request(app)
      .get("/api/groups") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("unauthorized", async () => {
    const expectedResponse = {
      error: "Not an admin"
    };
    const response = await request(app)
      .get("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })

})

describe("getGroup", () => {
  beforeEach( async () => {
     //The API request must be awaited as well
     await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    },
    {
      name: "Family",
      members: [
        { email: "mario.red@email.com" },
        { email: "serena.red@email.com" }
      ]
    }
    ])
  })
  test("authenticated user requests info about his group", async () => {
    const expectedResponse = {
      data:
      {
        group: {
          name: "MyGroup",
          members: [
            { email: "andrea.red@email.com" },
            { email: "luigi.red@email.com" }
          ]
        }
      }
    };
    const response = await request(app)
      .get("/api/groups/MyGroup") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("unauthorized", async () => {
    const expectedResponse = {
      error: "Token is missing information"
    };
    const response = await request(app)
      .get("/api/groups/Family") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenEmpty}; refreshToken=${testerAccessTokenEmpty}`) //Setting cookies in the request

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("user requests info about a group that it is not his group", async () => {
    const expectedResponse = {
      error: "Not an admin"
    };
    const response = await request(app)
      .get("/api/groups/Family") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("authenticated admin requests info about a group", async () => {
    const expectedResponse = {
      data:
      {
        group: {
          name: "MyGroup",
          members: [
            { email: "andrea.red@email.com" },
            { email: "luigi.red@email.com" }
          ]
        }
      }
    };
    const response = await request(app)
      .get("/api/groups/MyGroup") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("group does not exist", async () => {
    const expectedResponse = {
      error: "Group not found"
    };
    const response = await request(app)
      .get("/api/groups/FamilyGroupAAA") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
})

describe("addToGroup", () => {
  beforeEach( async () => {
    await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    },
    {
      name: "Family",
      members: [
        { email: "mario.red@email.com" },
        { email: "admin@email.com" },
      ]
    }
    ])
  })
  test("successful add by user", async () => {
    const expectedResponse = {
      data:
      {
        group: {
          name: "MyGroup",
          members: [
            { email: "andrea.red@email.com" },
            { email: "luigi.red@email.com" },
            { email: "serena.red@email.com" }
          ],
        },
        alreadyInGroup: [],
        membersNotFound: []
      }
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/add") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["serena.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("unauthorized add by user because not a group member", async () => {
    const expectedResponse = {
      error: "Not a group member"
    };
    const response = await request(app)
      .patch("/api/groups/Family/add") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["serena.red@email.com"] });

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("unauthorized add by user because not an admin (invalid path)", async () => {
    const expectedResponse = {
      error: "Not an admin"
    };
    const response = await request(app)
      .patch("/api/groups/MyGroup/insert") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["serena.red@email.com"] });

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("successful add by admin in a group", async () => {
    const expectedResponse = {
      data:
      {
        group: {
          name: "MyGroup",
          members: [
            { email: "andrea.red@email.com" },
            { email: "luigi.red@email.com" },
            { email: "serena.red@email.com" }
          ],
        },
        alreadyInGroup: [],
        membersNotFound: []
      }
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/insert") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ emails: ["serena.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("admin uses user path to add someone in his group", async () => {
    const expectedResponse = {
      data:
      {
        group: {
          name: "Family",
          members: [
            { email: "mario.red@email.com" },
            { email: "admin@email.com" },
            { email: "serena.red@email.com" }
          ],
        },
        alreadyInGroup: [],
        membersNotFound: []
      }
    };

    const response = await request(app)
      .patch("/api/groups/Family/add") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ emails: ["serena.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("admin uses user path to add someone in a differernt group", async () => {
    const expectedResponse = {
      error: "Not a group member"
    };
    //the admin can do this operation, but using another path
    const response = await request(app)
      .patch("/api/groups/MyGroup/add") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ emails: ["serena.red@email.com"] });

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("missing request body attributes", async () => {
    const expectedResponse = {
      error: "Request body does not contain all the necessary attributes"
    };
    //the admin can do this operation, but using another path
    const response = await request(app)
      .patch("/api/groups/MyGroup/insert") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({});

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("group does not exist", async () => {
    const expectedResponse = {
      error: "Group doesn't exist"
    };
    //the admin can do this operation, but using another path
    const response = await request(app)
      .patch("/api/groups/HelloAAA/insert") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({});

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("all emails already in a group", async () => {
    const expectedResponse = {
      error: "All the emails either do not exist or are already in a group"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/add") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["luigi.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("all emails do not exist", async () => {
    const expectedResponse = {
      error: "All the emails either do not exist or are already in a group"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/add") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["maria.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("invalid email format", async () => {
    const expectedResponse = {
      error: "One or more emails not valid"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/add") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["maria.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("empty email", async () => {
    const expectedResponse = {
      error: "One or more emails not valid"
    };
    const response = await request(app)
      .patch("/api/groups/MyGroup/add") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: [" "] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })

})

describe("removeFromGroup", () => {
  beforeEach( async () => {
    await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Sara",
      email: "sara.red@email.com",
      password: "sara1234",
      refreshToken: testerAccessTokenValid_2
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    },
    {
      name: "Family",
      members: [
        { email: "admin@email.com" },
        { email: "mario.red@email.com" },
        { email: "serena.red@email.com" }
      ]
    },
    {
      name: "SaraGroup",
      members: [
        { email: "sara.red@email.com" }
      ]
    }
    ])
  })
  test("successful remove by user", async () => {
    const expectedResponse = {
      data:
      {
        group: {
          name: "MyGroup",
          members: [
            { email: "andrea.red@email.com" },
          ],
        },
        membersNotFound: [],
        notInGroup: []
      }
    };
    const response = await request(app)
      .patch("/api/groups/MyGroup/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["luigi.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("successful remove by admin", async () => {
    const expectedResponse = {
      data:
      {
        group: {
          name: "MyGroup",
          members: [
            { email: "andrea.red@email.com" },
          ],
        },
        membersNotFound: [],
        notInGroup: []
      }
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/pull") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ emails: ["luigi.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("user root does not allow admin to remove a component in another group", async () => {
    const expectedResponse = {
      error: "Not a group member"
    };
    const response = await request(app)
      .patch("/api/groups/MyGroup/remove") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ emails: ["luigi.red@email.com"] });

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("user root allows admin to remove a component in his group", async () => {
    const expectedResponse = {
      data:
      {
        group: {
          name: "Family",
          members: [
            { email: "admin@email.com" },
            { email: "serena.red@email.com" }
          ]
        },
        membersNotFound: [],
        notInGroup: []
      }
    };

    const response = await request(app)
      .patch("/api/groups/Family/remove") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ emails: ["mario.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("user root does not allow user to remove a component in another group", async () => {
    const expectedResponse = {
      error: "Not a group member"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ emails: ["luigi.red@email.com"] });

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("admin root does not allow user to remove a component in another group", async () => {
    const expectedResponse = {
      error: "Not an admin"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/pull") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ emails: ["luigi.red@email.com"] });

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("unauthorized", async () => {
    const expectedResponse = {
      error: "Token is missing information"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenEmpty}; refreshToken=${testerAccessTokenEmpty}`) //Setting cookies in the request
      .send({ emails: ["luigi.red@email.com"] });

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("group does not exist", async () => {
    const expectedResponse = {
      error: "Group doesn't exist"
    };

    const response = await request(app)
      .patch("/api/groups/helloAAA/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ emails: ["luigi.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("all emails do not exist or are not in the group", async () => {
    const expectedResponse = {
      error: "All the provided emails represent users that do not belong to the group or do not exist in the database"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["serena.red@email.com", "francesca.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("invalid email format", async () => {
    const expectedResponse = {
      error: "There is at least one email with an invalid format"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["serena.com", "francesca1234"] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("empty email", async () => {
    const expectedResponse = {
      error: "Empty strings are not accepted"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: [" ", "francesca1234"] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("not correct body", async () => {
    const expectedResponse = {
      error: "The request body does not contain all the necessary attributes"
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ ema: ["hello"] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("group composed by only one member", async () => {
    const expectedResponse = {
      error: "Cannot delete the last member of a group"
    };

    const response = await request(app)
      .patch("/api/groups/SaraGroup/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_2}; refreshToken=${testerAccessTokenValid_2}`) //Setting cookies in the request
      .send({ emails: ["sara.red@email.com"] });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("successful remove by user leaving one member", async () => {
    const expectedResponse = {
      data:
      {
        group: {
          name: "MyGroup",
          members: [
            { email: "andrea.red@email.com" },
          ],
        },
        membersNotFound: [],
        notInGroup: []
      }
    };

    const response = await request(app)
      .patch("/api/groups/MyGroup/remove") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_1}; refreshToken=${testerAccessTokenValid_1}`) //Setting cookies in the request
      .send({ emails: ["luigi.red@email.com", "andrea.red@email.com"] });

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
})

describe("deleteGroup", () => {
  beforeEach(async () => {
    await User.create([{
      username: "Mario",
      email: "mario.red@email.com",
      password: "mario1234",
      refreshToken: testerAccessTokenValid
    }, {
      username: "Serena",
      email: "serena.red@email.com",
      password: "serena1234"
    }, {
      username: "Luigi",
      email: "luigi.red@email.com",
      password: "luigi1234",
      refreshToken: testerAccessTokenValid_1
    }, {
      username: "Sara",
      email: "sara.red@email.com",
      password: "sara1234",
      refreshToken: testerAccessTokenValid_2
    }, {
      username: "Andrea",
      email: "andrea.red@email.com",
      password: "andrea1234"
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }]);
    await Group.create([{
      name: "MyGroup",
      members: [
        { email: "andrea.red@email.com" },
        { email: "luigi.red@email.com" }
      ]
    },
    {
      name: "Family",
      members: [
        { email: "admin@email.com" },
        { email: "mario.red@email.com" },
        { email: "serena.red@email.com" }
      ]
    },
    {
      name: "SaraGroup",
      members: [
        { email: "sara.red@email.com" }
      ]
    }
    ])

  });
  test("successful delete by admin", async () => {
    //The API request must be awaited as well
    const expectedResponse = {
      data:
      {
        message: "group succesfully deleted"
      }
    };

    const response = await request(app)
      .delete("/api/groups") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "MyGroup" });

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("unauthorized", async () => {
    //The API request must be awaited as well
    const expectedResponse = {
      error: "Not an admin"
    };

    const response = await request(app)
      .delete("/api/groups") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "MyGroup" });

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("group does not exist", async () => {
    //The API request must be awaited as well
    const expectedResponse = {
      error: "group doesn't exist"
    };

    const response = await request(app)
      .delete("/api/groups") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "HelloAAA" });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("empty body", async () => {
    //The API request must be awaited as well
    const expectedResponse = {
      error: "the request body does not contain all the necessary attributes"
    };

    const response = await request(app)
      .delete("/api/groups") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({});

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("name is an empty string", async () => {
    //The API request must be awaited as well
    const expectedResponse = {
      error: "the name passed in the request body is an empty string"
    };

    const response = await request(app)
      .delete("/api/groups") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "  " });

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
})

describe('deleteUser', () => {
  test('Should delete a user and return the deleted transaction count and group deletion status', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    }]);
    await Group.create({
      name: 'group-1',
      members: [
        {
          email: 'mario.red@email.com'
        }
      ]
    })

    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ email: 'mario.red@email.com' });

    expect(response.status).toBe(200);

    expect(response.body.data.deletedTransactions).toBeGreaterThanOrEqual(0);
    expect(typeof response.body.data.deletedFromGroup).toBe('boolean');
    expect(response.body.data.deletedFromGroup).toBe(true);
  });
  test('Should delete a user and return the deleted transaction count and group deletion status', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    }]);
    await Group.create({
      name: 'group-1',
      members: [
        {
          email: 'mario.red@email.com'
        },
        {
          email: 'luigi.blue@email.com'
        }
      ]
    })

    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ email: 'mario.red@email.com' });

    expect(response.status).toBe(200);

    expect(response.body.data.deletedTransactions).toBeGreaterThanOrEqual(0);
    expect(typeof response.body.data.deletedFromGroup).toBe('boolean');
    expect(response.body.data.deletedFromGroup).toBe(true);
  });
  test('Should delete a user and return the deleted transaction count and group deletion status', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    }]);
    await categories.create({type: 'Shopping', color: 'pink'})
    await transactions.create({username : "Mario", type: "Shopping", amount: 100});

    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ email: 'mario.red@email.com' });

    expect(response.status).toBe(200);

    expect(response.body.data.deletedTransactions).toBeGreaterThanOrEqual(0);
    expect(response.body.data.deletedTransactions).toEqual(1);
    expect(typeof response.body.data.deletedFromGroup).toBe('boolean');
    expect(response.body.data.deletedFromGroup).toBe(false);
  });
  test('Should return an error if the user to delete is an admin', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    },{
      username: "admin2",
      email: "admin2@email.com",
      password: "admin2",
      role: "Admin"
    }])

    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ email: 'admin2@email.com' });

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should delete a user and the group if they are the last member', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      //refreshToken: testerAccessTokenValid, 
      role: 'Regular'
    }])

    await Group.create({
      name: "Family",
      members: [{ email: 'mario.red@email.com' }]

    });

    // Esegui la richiesta di eliminazione dell'utente
    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ email: 'mario.red@email.com' });

    expect(response.status).toBe(200);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(false);
  });
  test('Should return a 400 error if the request body does not contain all the necessary attributes', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      role: 'Regular'
    }])

    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)


    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should return a 400 error if the email passed in the request body is an empty string', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      role: 'Regular'
    }])
    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ email: '' });

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should return a 400 error if the email passed in the request body is not in correct email format', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      role: 'Regular'
    }])
    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ email: 'invalidemail' });

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should return a 400 error if the email passed in the request body does not represent a user in the database', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      role: 'Regular'
    }])

    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ email: 'nonexistent@example.com' });

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should return a 400 error if the email passed in the request body represents an admin', async () => {
    await User.create([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    },{
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      role: 'Regular'
    },{
      username: "admin2",
      email: "admin@example.com",
      password: "admin",
      role: "Admin"
    }])

    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ email: 'admin@example.com' });

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
  test('Should return a 401 error if called by an authenticated user who is not an admin', async () => {
    await User.create({
      username: "Mario",
      email: 'mario.red@email.com',
      password: "securePass",
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    })

    const response = await request(app)
      .delete('/api/users')
      .set('Cookie', `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`);
    expect(response.status).toBe(401);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
})

describe('Integration Test for 500 error', () => {
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    const dbName = "testingDatabaseUsers";
    const url = `${process.env.MONGO_URI}/${dbName}`;

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  test("Should return 500 if there is an internal server error - register", async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ 
        username: 'Mario', 
        email: 'mario.red@email.com', 
        password: 'securePass', 
      });

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - registerAdmin", async () => {
    const response = await request(app)
      .post('/api/admin')
      .send({ 
        username: 'admin', 
        email: 'admin@email.com', 
        password: 'securePass', 
      });

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - login", async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ 
        username: 'admin', 
        email: 'admin@email.com', 
        password: 'securePass', 
      });

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - logout", async () => {
    const response = await request(app)
      .get('/api/logout')
      .set('Cookie', `refreshToken=${testerAccessTokenValid}`)

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - getUsers", async () => {

    const response = await request(app)
      .get("/api/users")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`);

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - getUser", async () => {
    
    const response = await request(app)
      .get("/api/users/Mario")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`);

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - createGroup", async () => {
    const response = await request(app)
      .post("/api/groups")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ name: "MyGroup", memberEmails: ["mario.red@email.com", "serena.red@email.com"] });
    
    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - getGroups", async () => {

    const response = await request(app)
      .get("/api/groups") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - getGroup", async () => {

    const response = await request(app)
      .get("/api/groups/Family")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`);

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - addToGroup", async () => {

    const response = await request(app)
      .patch("/api/groups/Family/insert")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`);

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - removeFromGroup", async () => {

    const response = await request(app)
      .patch("/api/groups/Family/pull")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`);

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - deleteGroup", async () => {

    const response = await request(app)
      .delete("/api/groups") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ name: "MyGroup" });
    
    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - deleteUser", async () => {

    const response = await request(app)
    .delete('/api/users')
    .set('Cookie', `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
    .send({ email: 'mario.red@email.com' });
    
    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - createCategory", async () => {

    const response = await request(app)
      .post("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ type: "food", color: "red" });
    
    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - updateCategory", async () => {

    const response = await request(app)
      .patch("/api/categories/food") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ type: "health", color: "red" })
    
    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - deleteCategory", async () => {

    const response = await request(app)
      .delete("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ types: ["health", "travel"] });

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - getCategories", async () => {

    const response = await request(app)
      .get("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
    
    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - createTransaction", async () => {

    const response = await request(app)
      .post("/api/users/Mario/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ username: "mario", amount: 100, type: "food" });
    
    expect(response.status).toBe(500);
  });

  /*
  test("Should return 500 if there is an internal server error - getAllTransactions", async () => {

    const response = await request(app)
      .get("/api/transactions")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      
    expect(response.status).toBe(500);
  });
  */

  test("Should return 500 if there is an internal server error - getTransactionsByUser", async () => {

    const response = await request(app)
      .get("/api/transactions/users/antonio01")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      
    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - getTransactionsByUserByCategory", async () => {

    const response = await request(app)
      .get("/api/users/Mario/transactions/category/Med")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      
    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - getTransactionsByGroup", async () => {

    const response = await request(app)
      .get("/api/transactions/groups/Family") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      
    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - getTransactionsByGroupByCategory", async () => {

    const response = await request(app)
      .get("/api/transactions/groups/Family/category/food") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - deleteTransaction", async () => {

    const response = await request(app)
      .delete(`/api/users/Mario/transactions`)
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ _id: '647c8ae9a8d8bc09a7aa3256' })

    expect(response.status).toBe(500);
  });

  test("Should return 500 if there is an internal server error - deleteTransactions", async () => {

    const response = await request(app)
      .delete('/api/transactions')
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ _ids: ['647c8ae9a8d8bc09a7aa3256'] });

    expect(response.status).toBe(500);
  });
  
});