import request from 'supertest';
import { app } from '../app';
import { User, Group } from '../models/User.js';
import { categories, transactions } from '../models/model';
import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';
import "jest-extended"
import jwt from 'jsonwebtoken';
import { verifyAuth, handleDateFilterParams } from '../controllers/utils';
import dayjs, { Dayjs } from 'dayjs';

dotenv.config();

beforeAll(async () => {
  const dbName = "testingDatabaseController";
  const url = `${process.env.MONGO_URI}/${dbName}`;

  mongoose.set('strictQuery', false);
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
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
  email: "tester@test.com",
  username: "tester",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenValid_1 = jwt.sign({
  email: "luigi.red@email.com",
  username: "Luigi",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenValid_3 = jwt.sign({
  email: "mario.red@email.com",
  username: "Mario",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const othertesterAccessTokenValid = jwt.sign({
  email: "othertester@test.com",
  username: "othertester",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenEmpty = jwt.sign({}, process.env.ACCESS_KEY, { expiresIn: "1y" })

describe("createCategory", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test("createCategory: Successfully creates a new category", async () => {
    const response = await request(app)
      .post("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ type: "food", color: "red" });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("type", "food");
    expect(response.body.data).toHaveProperty("color", "red");
    expect(response.body.data).toEqual({ type: 'food', color: 'red' })
  });
  test("createCategory: Returns a 400 error if request body is missing attributes", async () => {
    const response = await request(app)
      .post("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ color: "red" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  test("createCategory: Returns a 400 error if request body contains empty strings", async () => {
    const response = await request(app)
      .post("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ type: "", color: "red" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  test("createCategory: Returns a 400 error if category type already exists", async () => {
    await categories.create({ type: "food", color: "red" });

    const response = await request(app)
      .post("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ type: "food", color: "blue" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  test("createCategory: Returns a 401 error for non-admin users", async () => {
    const response = await request(app)
      .post("/api/categories")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ type: "food", color: "red" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
});

describe("updateCategory", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test("updateCategory: Returns a message for confirmation and the number of updated transactions", async () => {
    await categories.create({ type: "food", color: "red" })
    await User.insertMany([{
      username: "tester",
      email: "tester@test.com",
      password: "tester",
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    await transactions.insertMany([{
      username: "tester",
      type: "food",
      amount: 20
    }, {
      username: "tester",
      type: "food",
      amount: 100
    }])
    //The API request must be awaited as well
    const response = await request(app)
      .patch("/api/categories/food") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ type: "health", color: "red" })

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty("message")
    expect(response.body.data).toHaveProperty("count", 2)
    //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
  })

  test("updateCategory: update just the color of the category", async () => {
    await categories.create({ type: "food", color: "red" })
    await User.insertMany([{
      username: "tester",
      email: "tester@test.com",
      password: "tester",
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    await transactions.insertMany([{
      username: "tester",
      type: "food",
      amount: 20
    }, {
      username: "tester",
      type: "food",
      amount: 100
    }])
    //The API request must be awaited as well
    const response = await request(app)
      .patch("/api/categories/food") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ type: "food", color: "orange" })

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty("message")
    expect(response.body.data).toHaveProperty("count", 0)
    //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
  })

  test("updateCategory: Returns a 400 error if the type of the category does not represent any ctagory in the database", async () => {
    await categories.create({ type: "food", color: "red" })
    await User.insertMany([{
      username: "tester",
      email: "tester@test.com",
      password: "tester",
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    await transactions.insertMany([{
      username: "tester",
      type: "food",
      amount: 20
    }, {
      username: "tester",
      type: "food",
      amount: 100
    }])
    //The API request must be awaited as well
    const response = await request(app)
      .patch("/api/categories/transports") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      .send({ type: "health", color: "red" })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error")
  })

  test("updateCategory: Returns a 400 error if the type of the new category is the same as one that exists already and that category is not the requested one", async () => {
    await categories.insertMany([{
      type: "food",
      color: "red"
    }, {
      type: "health",
      color: "blue"
    }])
    await User.create({
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    })
    const response = await request(app)
      .patch("/api/categories/food")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ type: "health", color: "green" }) //The passed type is one that already exists and is not the same one in the route (we are not updating the color of a category but we are trying to change its type to be a duplicate => error scenario)

    //The response status must signal a wrong request
    expect(response.status).toBe(400)
    //The response body must contain a field named either "error" or "message" (both names are accepted but at least one must be present)
    const errorMessage = response.body.error ? true : response.body.message ? true : false
    //The test passes if the response body contains at least one of the two fields
    expect(errorMessage).toBe(true)
  })

  test("updateCategory: Returns a 400 error if the request body does not contain all the necessary parameters", async () => {
    await categories.create({
      type: "food",
      color: "red"
    })
    await User.create({
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    })
    const response = await request(app)
      .patch("/api/categories/food")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
    //The ".send()" block is missing, meaning that the request body will be empty
    //Appending ".send({}) leads to the same scenario, so both options are equivalent"

    expect(response.status).toBe(400)
    const errorMessage = response.body.error ? true : response.body.message ? true : false
    expect(errorMessage).toBe(true)
  })

  test("updateCategory: Returns a 401 error if called by a user who is not an Admin", async () => {
    await categories.create({
      type: "food",
      color: "red"
    })
    await User.insertMany([{
      username: "tester",
      email: "tester@test.com",
      password: "tester",
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    const response = await request(app)
      .patch("/api/categories/food")
      //The cookies we set are those of a regular user, which will cause the verifyAuth check to fail
      //Other combinations that can cause the authentication check to fail are also accepted:
      //      - mismatched tokens: .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      //      - empty tokens: .set("Cookie", `accessToken=${testerAccessTokenEmpty}; refreshToken=${testerAccessTokenEmpty}`)
      //      - expired tokens: .set("Cookie", `accessToken=${testerAccessTokenExpired}; refreshToken=${testerAccessTokenExpired}`)
      //      - missing tokens: .set("Cookie", `accessToken=${}; refreshToken=${}`) (not calling ".set()" at all also works)
      //Testing just one authentication failure case is enough, there is NO NEED to check all possible token combination for each function
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ type: "food", color: "green" })

    expect(response.status).toBe(401)
    const errorMessage = response.body.error ? true : response.body.message ? true : false
    expect(errorMessage).toBe(true)
  })
})

describe("deleteCategory", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test("deleteCategory: Returns a 400 error if the request body does not contain all the necessary attributes", async () => {

    const response = await request(app)
      .delete("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("deleteCategory: Returns a 400 error if there is only one category in the database", async () => {

    await categories.create({ type: "health", color: "green" })
    const response = await request(app)
      .delete("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ types: ["health"] });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("deleteCategory: Returns a 400 error if at least one of the types in the array is an empty string", async () => {

    const response = await request(app)
      .delete("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ types: ["health", ""] });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("deleteCategory: Returns a 400 error if the array passed in the request body is empty", async () => {

    const response = await request(app)
      .delete("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ types: [] });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("deleteCategory: Returns a 400 error if at least one of the types in the array does not represent a category in the database", async () => {

    const response = await request(app)
      .delete("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ types: ["nonexistent"] });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("deleteCategory: Returns a 401 error if called by an authenticated user who is not an admin", async () => {

    const response = await request(app)
      .delete("/api/categories")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ types: ["health"] });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("deleteCategory: Deletes categories and updates transactions correctly", async () => {

    await categories.create({ type: "health", color: "green" })
    await categories.create({ type: "travel", color: "blue" })
    await categories.create({ type: "food", color: "red" })
    await transactions.insertMany([
      {
        username: "tester",
        type: "health",
        amount: 20
      },
      {
        username: "tester",
        type: "health",
        amount: 100
      },
      {
        username: "tester",
        type: "travel",
        amount: 100
      }
    ])
    const response = await request(app)
      .delete("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ types: ["health", "travel"] });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("message");
    expect(response.body.data).toHaveProperty("count", 3);

    // Additional assertions to check if categories and transactions were manipulated correctly
  });

  test("deleteCategory: Try to delete all categories and updates transactions correctly", async () => {

    await categories.create({ type: "health", color: "green" })
    await categories.create({ type: "travel", color: "blue" })
    await categories.create({ type: "food", color: "red" })
    await transactions.insertMany([
      {
        username: "tester",
        type: "travel",
        amount: 200
      },
      {
        username: "tester",
        type: "health",
        amount: 100
      },
      {
        username: "tester",
        type: "food",
        amount: 30
      }
    ])
    const response = await request(app)
      .delete("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ types: ["health", "travel", "food"] });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("message");
    expect(response.body.data).toHaveProperty("count", 2);

    // Additional assertions to check if categories and transactions were manipulated correctly
  });
});

describe("getCategories", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test("getCategories: Returns a 401 error if called by a user who is not authenticated", async () => {

    await categories.create({ type: "health", color: "green" })
    await categories.create({ type: "travel", color: "blue" })
    await categories.create({ type: "food", color: "red" })
    const response = await request(app)
      .get("/api/categories")

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("getCategories: Returns an array of category objects if called by an authenticated user", async () => {

    await categories.create({ type: "health", color: "green" })
    await categories.create({ type: "travel", color: "blue" })
    await categories.create({ type: "food", color: "red" })
    const response = await request(app)
      .get("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data).toEqual([
      {
        type: 'health',
        color: 'green'
      },
      {
        type: 'travel',
        color: 'blue'
      },
      {
        type: 'food',
        color: 'red'
      }
    ]);
  });

  test("getCategories: Returns an empty array if there are no categories", async () => {

    const response = await request(app)
      .get("/api/categories")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(0);
    expect(response.body.data).toEqual([]);
  });
});

describe("createTransaction", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test("createTransaction: Returns a 401 error if called by an authenticated user who is not the same user as the one in the route parameter", async () => {

    const response = await request(app)
      .post("/api/users/John/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenEmpty}; refreshToken=${testerAccessTokenEmpty}`)
      .send({ username: "John", amount: 100, type: "food" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("createTransaction: Returns a 400 error if the request body does not contain all the necessary attributes", async () => {

    const response = await request(app)
      .post("/api/users/tester/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ username: "tester", amount: 100 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("createTransaction: Returns a 400 error if at least one of the parameters in the request body is an empty string", async () => {

    const response = await request(app)
      .post("/api/users/tester/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ username: "", amount: 100, type: "food" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("createTransaction: Returns a 400 error if the type of category passed in the request body does not represent a category in the database", async () => {

    await User.insertMany([{
      username: "tester",
      email: "tester@test.com",
      password: "tester",
      refreshToken: testerAccessTokenValid
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    const response = await request(app)
      .post("/api/users/tester/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ username: "tester", amount: 100, type: "food" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("createTransaction: Returns a 400 error if the username passed in the request body is not equal to the one passed as a route parameter", async () => {

    await categories.create({ type: "food", color: "red" })
    await User.insertMany([{
      username: "tester",
      email: "tester@test.com",
      password: "tester",
      refreshToken: testerAccessTokenValid
    },
    {
      username: "othertester",
      email: "othertester@test.com",
      password: "othertester",
      refreshToken: othertesterAccessTokenValid
    },
    {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    const response = await request(app)
      .post("/api/users/tester/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ username: "othertester", amount: 100, type: "food" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("createTransaction: Returns a 400 error if the username passed in the request body does not represent a user in the database", async () => {
    await categories.create({ type: "food", color: "red" })
    await User.insertMany([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    const response = await request(app)
      .post("/api/users/tester/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ username: "tester", amount: 100, type: "food" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("createTransaction: Returns a 400 error if token not valid", async () => {
    await categories.create({ type: "food", color: "red" })
    await User.insertMany([{
      username: "tester",
      email: "tester@test.com",
      password: "tester",
      refreshToken: testerAccessTokenValid
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    const response = await request(app)
      .post("/api/users/tester/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ username: "tester", amount: "invalid", type: "food" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("createTransaction: Returns a 400 error if the amount passed in the request body cannot be parsed as a floating value", async () => {
    await categories.create({ type: "food", color: "red" })
    await User.insertMany([{
      username: "tester",
      email: "tester@test.com",
      password: "tester",
      refreshToken: testerAccessTokenEmpty
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    const response = await request(app)
      .post("/api/users/tester/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ username: "tester", amount: "100", type: "food" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("createTransaction: Returns a 200 status and the transaction object if all conditions are met", async () => {

    await categories.create({ type: "food", color: "red" })
    await User.insertMany([{
      username: "tester",
      email: "tester@test.com",
      password: "tester",
      refreshToken: testerAccessTokenValid
    }, {
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    }])
    const response = await request(app)
      .post("/api/users/tester/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ username: "tester", amount: 100, type: "food" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("username", "tester");
    expect(response.body.data).toHaveProperty("amount", 100);
    expect(response.body.data).toHaveProperty("type", "food");
    expect(response.body.data).toHaveProperty("date");
    expect(response.body.data).toEqual({
      username: 'tester',
      amount: 100,
      type: 'food',
      date: expect.any(String)
    })
  });
});

describe("getAllTransactions", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test("should return all transactions made by all users", async () => {
    await categories.create({ type: "Med", color: "red" });
    await categories.create({ type: "Sport", color: "green" });
    await categories.create({ type: "Shopping", color: "blue" })
    await transactions.create({ username: "antonio01", type: "Med", amount: 50 });
    await transactions.create({ username: "antonio02", type: "Sport", amount: 62.5 });
    await transactions.create({ username: "antonio03", type: "Shopping", amount: 100 });

    const response = await request(app)
      .get("/api/transactions")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data).toEqual([
      {
        username: "antonio01",
        type: "Med",
        amount: 50,
        color: "red",
        date: expect.any(String)
      },
      {
        username: "antonio02",
        type: "Sport",
        amount: 62.5,
        color: "green",
        date: expect.any(String)
      },
      {
        username: "antonio03",
        type: "Shopping",
        amount: 100,
        color: "blue",
        date: expect.any(String)
      }
    ]);
  })

  test("should return error 401 if not authorized", async () => {
    const response = await request(app)
      .get("/api/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: expect.any(String) })
  })

  test("should return error 500 if Internal Server Error happens", async () => {
  })
})

describe("getTransactionsByUser", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})

    await User.insertMany([
      {
        username: "antonio01",
        email: "antonio01@studenti.polito.it",
        password: "1234"
      },
      {
        username: "antonio02",
        email: "antonio02@studenti.polito.it",
        password: "1234"
      }
    ])
    await categories.insertMany([
      { type: "Med", color: "red" },
      { type: "Sport", color: "green" },
      { type: "Shopping", color: "blue" }
    ]);
    await transactions.insertMany([
      { username: "antonio01", type: "Med", amount: 23, date: new Date(`2023-04-30T10:00:00.000Z`) },
      { username: "antonio01", type: "Med", amount: 55, date: new Date(`2023-05-10T10:00:00.000Z`) },
      { username: "antonio01", type: "Sport", amount: 15.6, date: new Date(`2023-04-30T10:00:00.000Z`) },
      { username: "antonio01", type: "Shopping", amount: 126,  date: new Date(`2023-05-05T10:00:00.000Z`) },
      { username: "antonio02", type: "Sport", amount: 1.2, date: new Date(`2023-04-30T10:00:00.000Z`) },
      { username: "antonio02", type: "Med", amount: 89, date: new Date(`2023-04-28T10:00:00.000Z`) },
      { username: "antonio02", type: "Sport", amount: 125, date: new Date(`2023-05-08T10:00:00.000Z`) },
      { username: "antonio02", type: "Shopping", amount: 252, date: new Date(`2023-02-12T10:00:00.000Z`) },
    ]);
  })
  test("Request by admin, only username parameter", async () => {
    const response = await request(app)
      .get("/api/transactions/users/antonio01")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([
      { username: "antonio01", type: "Med", amount: 23, date: expect.any(String), color: "red" },
      { username: "antonio01", type: "Med", amount: 55, date: expect.any(String), color: "red" },
      { username: "antonio01", type: "Sport", amount: 15.6, date: expect.any(String), color: "green" },
      { username: "antonio01", type: "Shopping", amount: 126, date: expect.any(String), color: "blue" }
    ])

  })
  test("Requested by user with date, min and max", async () => {
    const antonio02AccessTokenValid = jwt.sign({
      email: "antonio02@studenti.polito.it",
      username: "antonio02",
      role: "Regular"
    }, process.env.ACCESS_KEY, { expiresIn: '1y' })

    const response = await request(app)
      .get(`/api/users/antonio02/transactions`)
      .set("Cookie", `accessToken=${antonio02AccessTokenValid}; refreshToken=${antonio02AccessTokenValid}`)
      .query({ from: "2023-04-30", upTo: "2023-05-09" })

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data).toEqual([
      { username: "antonio02", type: "Sport", amount: 1.2, date: expect.any(String), color: "green" },
      { username: "antonio02", type: "Sport", amount: 125, date: expect.any(String), color: "green" }
    ])

  })
  test("Request by user with from and upTo, min and max", async () => {
    const antonio01AccessTokenValid = jwt.sign({
      email: "antonio01@studenti.polito.it",
      username: "antonio01",
      role: "Regular"
    }, process.env.ACCESS_KEY, { expiresIn: '1y' })

    const response = await request(app)
      .get("/api/users/antonio01/transactions")
      .set("Cookie", `accessToken=${antonio01AccessTokenValid}; refreshToken=${antonio01AccessTokenValid}`)
      .query({ from: "2023-04-30", upTo: "2023-06-05", min: 1, max: 100 })

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(3);
    expect(response.body.data).toEqual([
      { username: "antonio01", type: "Med", amount: 23, date: expect.any(String), color: "red" },
      { username: "antonio01", type: "Med", amount: 55, date: expect.any(String), color: "red" },
      { username: "antonio01", type: "Sport", amount: 15.6, date: expect.any(String), color: "green" },
    ])

  })
  test("Request by user with date, min and max but there aren't transactions in that date", async () => {
    const antonio02AccessTokenValid = jwt.sign({
      email: "antonio02@studenti.polito.it",
      username: "antonio02",
      role: "Regular"
    }, process.env.ACCESS_KEY, { expiresIn: '1y' })

    const response = await request(app)
      .get("/api/users/antonio02/transactions?date=2023-05-05&min=1&max=20")
      .set("Cookie", `accessToken=${antonio02AccessTokenValid}; refreshToken=${antonio02AccessTokenValid}`)

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([])
  })
  test("Request by user without date, min and max", async () => {
    const antonio02AccessTokenValid = jwt.sign({
      email: "antonio02@studenti.polito.it",
      username: "antonio02",
      role: "Regular"
    }, process.env.ACCESS_KEY, { expiresIn: '1y' })

    const response = await request(app)
      .get("/api/users/antonio02/transactions")
      .set("Cookie", `accessToken=${antonio02AccessTokenValid}; refreshToken=${antonio02AccessTokenValid}`)

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([
      { username: "antonio02", type: "Sport", amount: 1.2, date: expect.any(String), color: 'green' },
      { username: "antonio02", type: "Med", amount: 89, date: expect.any(String), color: 'red' },
      { username: "antonio02", type: "Sport", amount: 125, date: expect.any(String), color: 'green' },
      { username: "antonio02", type: "Shopping", amount: 252, date: expect.any(String), color: 'blue' }
    ])
  })
  test("Admin not authorized and should return 401", async () => {
    const response = await request(app)
      .get("/api/transactions/users/antonio01")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: expect.any(String) });
  })
  test("Admin request with user not found, error 400", async () => {
    const response = await request(app)
      .get("/api/transactions/users/antonio04")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: expect.any(String) });
  })
  test("User not authorized and should return 401", async () => {
    const response = await request(app)
      .get("/api/users/antonio01/transactions")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${testerAccessTokenEmpty}`)

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: expect.any(String) })
  })
  test("User request with user not found, error 400", async () => {
    const response = await request(app)
      .get("/api/users/tester/transactions")
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: expect.any(String) })
  })
})

describe("getTransactionsByUserByCategory", () => {

  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})

    await User.insertMany([
      {
        username: "antonio01",
        email: "antonio01@studenti.polito.it",
        password: "1234"
      },
      {
        username: "antonio02",
        email: "antonio02@studenti.polito.it",
        password: "1234"
      }
    ])
    await categories.insertMany([
      { type: "Med", color: "red" },
      { type: "Sport", color: "green" },
      { type: "Shopping", color: "blue" }
    ]);
    await transactions.insertMany([
      { username: "antonio01", type: "Med", amount: 23 },
      { username: "antonio01", type: "Med", amount: 55 },
      { username: "antonio01", type: "Sport", amount: 15.6 },
      { username: "antonio01", type: "Shopping", amount: 126 },
      { username: "antonio02", type: "Sport", amount: 1.2 },
      { username: "antonio02", type: "Med", amount: 89 },
      { username: "antonio02", type: "Sport", amount: 125 },
      { username: "antonio02", type: "Shopping", amount: 252 },
    ]);
  })
  test("User correct request", async () => {
    const antonio01AccessTokenValid = jwt.sign({
      email: "antonio01@studenti.polito.it",
      username: "antonio01",
      role: "Regular"
    }, process.env.ACCESS_KEY, { expiresIn: '1y' })

    const response = await request(app)
      .get("/api/users/antonio01/transactions/category/Med")
      .set("Cookie", `accessToken=${antonio01AccessTokenValid}; refreshToken=${antonio01AccessTokenValid}`)

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([
      { username: "antonio01", type: "Med", amount: 23, date: expect.any(String), color: "red" },
      { username: "antonio01", type: "Med", amount: 55, date: expect.any(String), color: "red" },
    ])

  })

  test("Admin correct request", async () => {
    const response = await request(app)
      .get("/api/transactions/users/antonio02/category/Shopping")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([
      { username: "antonio02", type: "Shopping", amount: 252, date: expect.any(String), color: "blue" }
    ])
  })

  test("Admin not authorized, error 401", async () => {
    const response = await request(app)
      .get("/api/transactions/users/antonio02/category/Shopping")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${testerAccessTokenEmpty}`)
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: expect.any(String) });

  })

  test("User not authorized, error 401", async () => {
    const antonio01AccessTokenValid = jwt.sign({
      email: "antonio01@studenti.polito.it",
      username: "antonio01",
      role: "Regular"
    }, process.env.ACCESS_KEY, { expiresIn: '1y' })

    const response = await request(app)
      .get("/api/users/antonio01/transactions/category/Med")
      .set("Cookie", `accessToken=${antonio01AccessTokenValid}; refreshToken=${testerAccessTokenEmpty}`)
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: expect.any(String) })
  })

  test("Admin request and user doesn't exist, error 400", async () => {
    const response = await request(app)
      .get("/api/transactions/users/antonio04/category/Shopping")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: expect.any(String) })
  })

  test("Admin request and category doesn't exist, error 400", async () => {
    const response = await request(app)
      .get("/api/transactions/users/antonio01/category/Gym")
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: expect.any(String) })
  })

  test("User request and category doesn't exist, error 400", async () => {
    const antonio01AccessTokenValid = jwt.sign({
      email: "antonio01@studenti.polito.it",
      username: "antonio01",
      role: "Regular"
    }, process.env.ACCESS_KEY, { expiresIn: '1y' })

    const response = await request(app)
      .get("/api/users/antonio01/transactions/category/Gym")
      .set("Cookie", `accessToken=${antonio01AccessTokenValid}; refreshToken=${antonio01AccessTokenValid}`)
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: expect.any(String) })
  })

  test("Error 500", async () => {

  })
})

describe("getTransactionsByGroup", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})

    await User.insertMany([
      { username: "Mario", email: "mario.red@email.com", password: "mario1234", refreshToken: testerAccessTokenValid_3 },
      { username: "Luigi", email: "luigi.red@email.com", password: "luigi1234", refreshToken: testerAccessTokenValid_1 },
      { username: "admin", email: "admin@email.com", password: "admin", refreshToken: adminAccessTokenValid, role: "Admin" }]);
    await categories.insertMany([
      { type: "food", color: "#fcbe44" },
      { type: "health", color: "#fcbe55" }]);
    await transactions.insertMany([
      { username: "Mario", type: "food", amount: 20 },
      { username: "Mario", type: "food", amount: 100 },
      { username: "Luigi", type: "health", amount: 70 },
      { username: "Luigi", type: "food", amount: 100 }]);
    await Group.insertMany([
      { name: "Family", members: [{ email: "mario.red@email.com" }, { email: "luigi.red@email.com" }] },
      { name: "AdminGroup", members: [{ email: "admin@email.com" }] }])
  })

  test("success on user", async () => {
    const expectedResponse = {
      data: [
        { amount: 20, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
        { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
        { amount: 70, color: "#fcbe55", date: expect.any(String), type: 'health', username: 'Luigi' },
        { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Luigi' }
      ]
    };
    const response = await request(app)
      .get("/api/groups/Family/transactions") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_3}; refreshToken=${testerAccessTokenValid_3}`) //Setting cookies in the request

    expect(response.status).toBe(200)
    expect(response.body.data).toEqual([
      { amount: 20, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
      { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
      { amount: 70, color: "#fcbe55", date: expect.any(String), type: 'health', username: 'Luigi' },
      { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Luigi' }
    ])
  })
  test("admin uses user root and fails", async () => {
    const expectedResponse = {
      error: "Not a group member"
    };
    const response = await request(app)
      .get("/api/groups/Family/transactions") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("admin uses user root and have success", async () => {
    const response = await request(app)
      .get("/api/groups/AdminGroup/transactions") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(200)
    expect(response.body.data).toEqual([])
  })
  test("success on admin", async () => {
    const response = await request(app)
      .get("/api/transactions/groups/Family") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(200)
    expect(response.body.data).toEqual([
      { amount: 20, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
      { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
      { amount: 70, color: "#fcbe55", date: expect.any(String), type: 'health', username: 'Luigi' },
      { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Luigi' }
    ])
  })
  test("user uses admin root and fails", async () => {
    const expectedResponse = {
      error: "Not an admin"
    };
    const response = await request(app)
      .get("/api/transactions/groups/Family") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("group does not exist", async () => {
    const expectedResponse = {
      error: "Group doesn't exist"
    };
    const response = await request(app)
      .get("/api/transactions/groups/HELLOAAA") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
})

describe("getTransactionsByGroupByCategory", () => {

  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})

    await User.insertMany([
      { username: "Mario", email: "mario.red@email.com", password: "mario1234", refreshToken: testerAccessTokenValid },
      { username: "Luigi", email: "luigi.red@email.com", password: "luigi1234", refreshToken: testerAccessTokenValid_1 },
      { username: "admin", email: "admin@email.com", password: "admin", refreshToken: adminAccessTokenValid, role: "Admin" }
    ]);
    await categories.insertMany([
      { type: "food", color: "#fcbe44" },
      { type: "health", color: "#fcbe55" }
    ]);
    await transactions.insertMany([
      { username: "Mario", type: "food", amount: 20 },
      { username: "Mario", type: "food", amount: 100 },
      { username: "Luigi", type: "health", amount: 70 },
      { username: "Luigi", type: "food", amount: 100 }
    ]);
    await Group.insertMany([
      { name: "Family", members: [{ email: "mario.red@email.com" }, { email: "luigi.red@email.com" }] },
      { name: "AdminGroup", members: [{ email: "admin@email.com" }] }
    ])
  })

  test("success on user", async () => {
    const response = await request(app)
      .get("/api/groups/Family/transactions/category/food") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid_3}; refreshToken=${testerAccessTokenValid_3}`) //Setting cookies in the request

    expect(response.status).toBe(200)
    expect(response.body.data).toEqual([
      { amount: 20, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
      { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
      { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Luigi' }
    ])
  })
  test("admin uses user root and fails", async () => {
    const expectedResponse = {
      error: "Not a group member"
    };
    const response = await request(app)
      .get("/api/groups/Family/transactions/category/food") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("admin uses user root and have success", async () => {
    const expectedResponse = {
      data: []
    };
    const response = await request(app)
      .get("/api/groups/AdminGroup/transactions/category/food") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test("success on admin", async () => {
    const response = await request(app)
      .get("/api/transactions/groups/Family/category/food") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(200)
    expect(response.body.data).toEqual([
      { amount: 20, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
      { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Mario' },
      { amount: 100, color: "#fcbe44", date: expect.any(String), type: 'food', username: 'Luigi' }
    ]
    )
  })
  test("user uses admin root and fails", async () => {
    const expectedResponse = {
      error: "Not an admin"
    };
    const response = await request(app)
      .get("/api/transactions/groups/Family/category/food") //Route to call
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(401)
    expect(response.body).toEqual(expectedResponse)
  })
  test("group does not exist", async () => {
    const expectedResponse = {
      error: "Group or category doesn't exist"
    };
    const response = await request(app)
      .get("/api/transactions/groups/HELLOAAA/category/food") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
  test("category does not exist", async () => {
    const expectedResponse = {
      error: "Group or category doesn't exist"
    };
    const response = await request(app)
      .get("/api/transactions/groups/Family/category/home") //Route to call
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedResponse)
  })
})

describe("deleteTransaction", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test('Should delete a transaction and return a success message', async () => {
    const user = await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      refreshToken: testerAccessTokenValid_3,
      role: 'Regular'
    })
    await categories.create({
      type: "Family",
      color: "red"

    });
    const transaction = await transactions.create({
      username: 'Mario',
      type: "Family",
      amount: 40,

    });

    const response = await request(app)
      .delete(`/api/users/${user.username}/transactions`)
      .set("Cookie", `accessToken=${testerAccessTokenValid_3}; refreshToken=${testerAccessTokenValid_3}`)
      .send({ _id: transaction._id })

    expect(response.status).toBe(200);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(false);

  });

  test('should return an error if user or transaction does not exist', async () => {
    const user = await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      refreshToken: testerAccessTokenValid_3,
      role: 'Regular'
    })
    await categories.create({
      type: "Family",
      color: "red"

    });
    const transaction = await transactions.create({
      username: 'Mario',
      type: "Family",
      amount: 40,

    });
    const response = await request(app)
      .delete(`/api/users/${user.username}/transactions`)
      .set("Cookie", `accessToken=${testerAccessTokenValid_3}; refreshToken=${testerAccessTokenValid_3}`)
      .send({ _id: '647c8ae9a8d8bc09a7aa3256' })


    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });

  test('Should return an error if user tries to delete an invalid transaction', async () => {
    const user = await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      refreshToken: testerAccessTokenValid_3,
      role: 'Regular'
    })

    await categories.create({
      type: "Family",
      color: "red"

    });
    const transaction = await transactions.create({
      username: 'Luigi',
      type: "Family",
      amount: 40,

    });

    const response = await request(app)
      .delete(`/api/users/${user.username}/transactions`)
      .set("Cookie", `accessToken=${testerAccessTokenValid_3}; refreshToken=${testerAccessTokenValid_3}`)
      .send({ _id: transaction._id })

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });

  test('Should return an error if the user is not authorized', async () => {
    const user = await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      refreshToken: testerAccessTokenValid_3,
      role: 'Regular'
    })

    const response = await request(app)
      .delete(`/api/users/${user.username}/transactions`)
      .send({ _id: 'transactionId' })

    expect(response.status).toBe(401);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });

  test('Should return an error if the the request body does not contain all the necessary attributes', async () => {
    const user = await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      refreshToken: testerAccessTokenValid_3,
      role: 'Regular'
    })
    await categories.create({
      type: "Family",
      color: "red"

    });
    const transaction = await transactions.create({
      username: 'Mario',
      type: "Family",
      amount: 40,

    });

    const response = await request(app)
      .delete(`/api/users/${user.username}/transactions`)
      .set("Cookie", `accessToken=${testerAccessTokenValid_3}; refreshToken=${testerAccessTokenValid_3}`)

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);

  });
})

describe("deleteTransactions", () => {
  beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test('Should delete transactions and return success message', async () => {
    await User.create({
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
    })
    const user = await User.create({
      username: "Mario",
      email: "mario.red@email.com",
      password: 'securePass',
      refreshToken: testerAccessTokenValid,
      role: 'Regular'
    })
    await categories.create({
      type: "Family",
      color: "red"

    });
    const t1 = await transactions.create({
      username: 'Mario',
      type: "Family",
      amount: 40,

    });
    const t2 = await transactions.create({
      username: 'Mario',
      type: "Family",
      amount: 70,

    });

    const response = await request(app)
      .delete('/api/transactions')
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ _ids: [t1._id, t2._id] });

    expect(response.status).toBe(200);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(false);

  });

  test('Should return a 400 error if the request body does not contain all the necessary attributes', async () => {
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
    await categories.create({
      type: "Family",
      color: "red"

    });
    const t1 = await transactions.create({
      username: 'Mario',
      type: "Family",
      amount: 40,

    });
    const response = await request(app)
      .delete('/api/transactions')
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({});

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);

  });

  test('Should return a 400 error if at least one of the ids in the array is an empty string', async () => {
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
    await categories.create({
      type: "Family",
      color: "red"

    });
    const t1 = await transactions.create({
      username: 'Mario',
      type: "Family",
      amount: 40,

    });

    const response = await request(app)
      .delete('/api/transactions')
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ _ids: [t1._id, ''] });

    expect(response.status).toBe(400);

  })

  test('should return a 400 error if at least one of the ids in the array does not represent a transaction in the database', async () => {
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
    await categories.create({
      type: "Family",
      color: "red"

    });
    const t1 = await transactions.create({
      username: 'Mario',
      type: "Family",
      amount: 40,

    });

    const response = await request(app)
      .delete('/api/transactions')
      .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
      .send({ _ids: [t1._id, "646b2a058f95d55dae108be6"] });

    expect(response.status).toBe(400);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });

  test('Should return a 401 error if called by an authenticated user who is not an admin', async () => {
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
    await categories.create({
      type: "Family",
      color: "red"

    });
    const t1 = await transactions.create({
      username: 'Mario',
      type: "Family",
      amount: 40,

    });

    const response = await request(app)
      .delete('/api/transactions')
      .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
      .send({ _ids: [t1._id] });

    expect(response.status).toBe(401);
    const errorMessage = response.body.error ? true : response.body.message ? true : false;
    expect(errorMessage).toBe(true);
  });
});
