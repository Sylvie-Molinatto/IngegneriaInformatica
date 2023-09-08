import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import "jest-extended"
import { handleDateFilterParams, verifyAuth, handleAmountFilterParams } from '../controllers/utils';

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

const othertesterAccessTokenValid = jwt.sign({
    email: "othertester@test.com",
    username: "othertester",
    role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

//These tokens can be used in order to test the specific authentication error scenarios inside verifyAuth (no need to have multiple authentication error tests for the same route)
const testerAccessTokenExpired = jwt.sign({
    email: "tester@test.com",
    username: "tester",
    role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '0s' })
const testerAccessTokenEmpty = jwt.sign({}, process.env.ACCESS_KEY, { expiresIn: "1y" })

describe("handleDateFilterParams", () => { 
    //Test only parameter data
    describe("Date tests", () =>{
        test("correct parameter", () => {
            const date = "2023-05-10"
            const formattedDateOne = new Date("2023-05-10T00:00:00.000Z")
            const formattedDateTwo = new Date("2023-05-10T23:59:59.999Z")
            const req = {query : {date : date}}

            const queryResult = handleDateFilterParams(req)
            expect(queryResult).toEqual({date: {
                                            $gte : formattedDateOne,
                                            $lte : formattedDateTwo
                                            }
                                        })
        })

        test("wrong year A023-05-21", () =>{
            const req = {query : {date : "A023-05-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format date is not valid"))
        })

        test("wrong year 20230-05-21", () => {
            const req = {query : {date : "20230-05-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format date is not valid"))
        })

        test("wrong month 2023-0D-21", () => {
            const req = {query : {date : "20230-0D-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format date is not valid"))
        })

        test("wrong month 2023-13-21", () => {
            const req = {query : {date : "2023-13-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format date is not valid"))
        })

        test("wrong day 2023-05-A0", () => {
            const req = {query : {date : "2023-05-A0"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format date is not valid"))
        })

        test("wrong day 2023-05-35", () => {
            const req = {query : {date : "2023-05-35"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format date is not valid"))
        })

        test("wrong format 12-05-2023", () => {
            const req = {query : {date : "12-05-2023"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format date is not valid"))
        })

        test("wrong format 2023/05/12", () => {
            const req = {query : {date : "2023/05/12"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format date is not valid"))
        })

        test("wrong format 2023\\05\\12", () => {
            const req = {query : {date : "2023\\05\\12"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format date is not valid"))
        })

    })

    //Test only parameter from
    describe("From tests", () => {
        test("correct parameter", () => {
            const date = "2023-04-30"
            const formattedDate = new Date("2023-04-30T00:00:00.000Z")
            const req = {query : {from : date }}
            const res = handleDateFilterParams(req)
            expect(res).toEqual({date : {
                                    $gte: formattedDate
                                    }
                                }) 
        })

        test("wrong year A023-05-21", () =>{
            const req = {query : {from : "A023-05-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from is not valid"))
        })

        test("wrong year 20230-05-21", () => {
            const req = {query : {from : "20230-05-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from is not valid"))
        })

        test("wrong month 2023-0D-21", () => {
            const req = {query : {from : "2023-0D-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from is not valid"))
        })

        test("wrong month 2023-13-21", () => {
            const req = {query : {from : "2023-13-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from is not valid"))
        })

        test("wrong day 2023-05-A0", () => {
            const req = {query : {from : "2023-05-A0"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from is not valid"))
        })

        test("wrong day 2023-05-35", () => {
            const req = {query : {from : "2023-05-35"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from is not valid"))
        })

        test("wrong format 12-05-2023", () => {
            const req = {query : {from : "12-05-2023"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from is not valid"))
        })

        test("wrong format 2023/05/12", () => {
            const req = {query : {from : "2023/05/12"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from is not valid"))
        })

        test("wrong format 2023\\05\\12", () => {
            const req = {query : {from : "2023\\05\\12"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from is not valid"))
        })
    })

    //Test only parameter upTo
    describe("upTo tests", () => {
        test("correct parameter", () => {
            const date = "2023-05-10"
            const formattedDate = new Date("2023-05-10T23:59:59.999Z")
            const req = {query : {upTo : date}}
            const queryResult = handleDateFilterParams(req)
            expect(queryResult).toEqual({date : {
                                            $lte : formattedDate
                                            }
                                        })
        })

        test("wrong year A023-05-21", () =>{
            const req = {query : {upTo : "A023-05-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format upTo is not valid"))
        })

        test("wrong year 20230-05-21", () => {
            const req = {query : {upTo : "20230-05-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format upTo is not valid"))
        })

        test("wrong month 2023-0D-21", () => {
            const req = {query : {upTo : "2023-0D-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format upTo is not valid"))
        })

        test("wrong month 2023-13-21", () => {
            const req = {query : {upTo : "2023-13-21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format upTo is not valid"))
        })

        test("wrong day 2023-05-A0", () => {
            const req = {query : {upTo : "2023-05-A0"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format upTo is not valid"))
        })

        test("wrong day 2023-05-35", () => {
            const req = {query : {upTo : "2023-05-35"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format upTo is not valid"))
        })

        test("wrong format 12-05-2023", () => {
            const req = {query : {upTo : "12-05-2023"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format upTo is not valid"))
        })

        test("wrong format 2023/05/12", () => {
            const req = {query : {upTo : "2023/05/21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format upTo is not valid"))
        })

        test("wrong format 2023\\05\\12", () => {
            const req = {query : {upTo : "2023\\05\\21"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format upTo is not valid"))
        })
    })

    //Test parameter date and upTo togheter or date and from
    describe("Date and upTo or from test", () => {
        test("date and upTo", () => {
            const req = {query : {date : "2023-05-22", 
                                  upTo : "2023-05-26"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error('Parameters are not valid'))
        })
        test("date and from", () => {
            const req = {query : {date : "2023-05-22", 
                                  from : "2023-05-26"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error('Parameters are not valid'))
        })

    })

    //Test from and upTo togheter
    describe("from and upTo", () => {
        test("both parameter", () => {
            const dateFrom = "2023-05-10"
            const dateUpTo = "2023-05-31"
            const formattedDateFrom = new Date("2023-05-10T00:00:00.000Z")
            const formattedDateUpTo = new Date("2023-05-31T23:59:59.999Z")
            const req = {query : {from : dateFrom,
                                  upTo : dateUpTo}}
            const queryResult = handleDateFilterParams(req)
            expect(queryResult).toEqual({date: {
                                            $gte : formattedDateFrom,
                                            $lte : formattedDateUpTo
                                            }
                                        })
        })

        test("from correct and upTo wrong", () =>{
            const req = {query : {from : "2023-05-30", 
                                  upTo : "202A-06-03"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from or upTo is not valid"))
        })

        test("from wrong and upTo correct", () =>{
            const req = {query : {from :"2022-13-05",
                                  upTo :"2023-05-31"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from or upTo is not valid"))
        })

        toString("from wrong and upTo wrong", () =>{
            const req = {query : {from: "202b-04-02",
                                  upTo: "2023-cc-31"}}
            expect(() => handleDateFilterParams(req)).toThrow(Error("Format from or upTo is not valid"))
        })

    })

})

describe("verifyAuth", () => {
    
    test("Undefined tokens", () => {
        const req = { cookies: {} }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Simple" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    })

    test("Access token is missing information (AuthType=Simple)", () => {
        const req = { cookies: { accessToken : testerAccessTokenEmpty, refreshToken: testerAccessTokenEmpty } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Simple" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Refresh token is missing information (AuthType=Simple)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: testerAccessTokenEmpty } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Simple" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid but with different values (AuthType=Simple)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: othertesterAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Simple" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid and belong to the requested user (AuthType = Simple)", () => {
        
        const req = { cookies: { accessToken: testerAccessTokenValid, refreshToken: testerAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Simple" })
      
        expect(Object.values(response).includes(true)).toBe(true)
    });

    test("Access token is missing information (AuthType=User)", () => {
        const req = { cookies: { accessToken : testerAccessTokenEmpty, refreshToken: testerAccessTokenEmpty } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Refresh token is missing information (AuthType=User)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: testerAccessTokenEmpty } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid but with different values (AuthType=User)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: othertesterAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid but not belonging to the requested user (AuthType=User)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: testerAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "User", username: "othertester" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid and belong to the requested user - AuthType = User", () => {
        const req = { cookies: { accessToken: testerAccessTokenValid, refreshToken: testerAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        //The response object must contain a field that is a boolean value equal to true, it does not matter what the actual name of the field is
        //Checks on the "cause" field are omitted since it can be any string
        expect(Object.values(response).includes(true)).toBe(true)
    });

    test("Access token is missing information (AuthType=Admin)", () => {
        const req = { cookies: { accessToken : testerAccessTokenEmpty, refreshToken: testerAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Admin"})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Refresh token is missing information (AuthType=Admin)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: testerAccessTokenEmpty } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Admin"})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid but with different values (AuthType=Admin)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: othertesterAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Admin"})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid but not belonging to the requested user (AuthType=Admin)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: testerAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Admin"})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid and belong to the requested user - AuthType = Admin", () => {
        const req = { cookies: { accessToken: adminAccessTokenValid, refreshToken: adminAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Admin"})
        //The response object must contain a field that is a boolean value equal to true, it does not matter what the actual name of the field is
        //Checks on the "cause" field are omitted since it can be any string
        expect(Object.values(response).includes(true)).toBe(true)
    });

    test("Access token is missing information (AuthType=Group)", () => {
        const req = { cookies: { accessToken : testerAccessTokenEmpty, refreshToken: testerAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Group"})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Refresh token is missing information (AuthType=Group)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: testerAccessTokenEmpty } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Group"})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid but with different values (AuthType=Group)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: othertesterAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Group"})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid but not belonging to the requested user (AuthType=Group)", () => {
        const req = { cookies: { accessToken : testerAccessTokenValid, refreshToken: testerAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Group", emails: ['othertester@test.com']})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Tokens are both valid and belong to the requested user - AuthType = Group", () => {
        const req = { cookies: { accessToken: testerAccessTokenValid, refreshToken: testerAccessTokenValid } }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Group", emails: ['tester@test.com', 'othertester@test.com']})
        //The response object must contain a field that is a boolean value equal to true, it does not matter what the actual name of the field is
        //Checks on the "cause" field are omitted since it can be any string
        expect(Object.values(response).includes(true)).toBe(true)
    });

    test("Access token expired and refresh token is missing information (AuthType=Simple)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenEmpty } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "Simple"})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Access token expired and refresh token valid (AuthType=Simple)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenValid } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "Simple"})
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(true)).toBe(true)
        expect(res.cookieArgs).toEqual({
            name: 'accessToken', //The cookie arguments must have the name set to "accessToken" (value updated)
            value: expect.any(String), //The actual value is unpredictable (jwt string), so it must exist
            options: { //The same options as during creation
                httpOnly: true,
                path: '/api',
                maxAge: 60 * 60 * 1000,
                sameSite: 'none',
                secure: true,
            },
        })
        //The response object must have a field that contains the message, with the name being either "message" or "refreshedTokenMessage"
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    });

    test("Access token expired and refresh token is missing information (AuthType=User)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenEmpty } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Access token expired and refresh token with wrong username (AuthType=User)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: othertesterAccessTokenValid } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Access token expired and refresh token valid (AuthType=User)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenValid } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "User", username:"tester" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(true)).toBe(true)
        expect(res.cookieArgs).toEqual({
            name: 'accessToken', //The cookie arguments must have the name set to "accessToken" (value updated)
            value: expect.any(String), //The actual value is unpredictable (jwt string), so it must exist
            options: { //The same options as during creation
                httpOnly: true,
                path: '/api',
                maxAge: 60 * 60 * 1000,
                sameSite: 'none',
                secure: true,
            },
        })
        //The response object must have a field that contains the message, with the name being either "message" or "refreshedTokenMessage"
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    });

    test("Access token expired and refresh token is missing information (AuthType=Admin)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenEmpty } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "Admin" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Access token expired and refresh token with wrong role (AuthType=Admin)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenValid } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "Admin" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Access token expired and refresh token valid (AuthType=Admin)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: adminAccessTokenValid } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "Admin" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(true)).toBe(true)
        expect(res.cookieArgs).toEqual({
            name: 'accessToken', //The cookie arguments must have the name set to "accessToken" (value updated)
            value: expect.any(String), //The actual value is unpredictable (jwt string), so it must exist
            options: { //The same options as during creation
                httpOnly: true,
                path: '/api',
                maxAge: 60 * 60 * 1000,
                sameSite: 'none',
                secure: true,
            },
        })
        //The response object must have a field that contains the message, with the name being either "message" or "refreshedTokenMessage"
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    });

    test("Access token expired and refresh token is missing information (AuthType=Group)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenEmpty } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "Group", emails:["tester@test.com"] })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Access token expired and refresh token not belong to the group (AuthType=Group)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenValid } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "Group", emails:['othertester@test.com'] })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    });
    test("Access token expired and refresh token valid (AuthType=Group)", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenValid } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "Group", emails:[ 'tester@test.com', 'othertester@test.com'] })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(true)).toBe(true)
        expect(res.cookieArgs).toEqual({
            name: 'accessToken', //The cookie arguments must have the name set to "accessToken" (value updated)
            value: expect.any(String), //The actual value is unpredictable (jwt string), so it must exist
            options: { //The same options as during creation
                httpOnly: true,
                path: '/api',
                maxAge: 60 * 60 * 1000,
                sameSite: 'none',
                secure: true,
            },
        })
        //The response object must have a field that contains the message, with the name being either "message" or "refreshedTokenMessage"
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    });

    /**
     * The only situation where the response object is actually interacted with is the case where the access token must be refreshed
     */
    test("Access token expired and refresh token belonging to the requested user -AuthType = User", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenValid } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        //The response must have a true value (valid refresh token and expired access token)
        expect(Object.values(response).includes(true)).toBe(true)
        expect(res.cookieArgs).toEqual({
            name: 'accessToken', //The cookie arguments must have the name set to "accessToken" (value updated)
            value: expect.any(String), //The actual value is unpredictable (jwt string), so it must exist
            options: { //The same options as during creation
                httpOnly: true,
                path: '/api',
                maxAge: 60 * 60 * 1000,
                sameSite: 'none',
                secure: true,
            },
        })
        //The response object must have a field that contains the message, with the name being either "message" or "refreshedTokenMessage"
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    });
})

describe("handleAmountFilterParams", () => {
    
    //Tests that use only min parameter
    describe("Test about only min combination", () =>{ 
        test("only min return query", () => {
            const req = {query : {min: 10}};
            const queryResult = handleAmountFilterParams(req);
            expect(queryResult).toEqual({amount : { $gte: 10 }});
        })
        test("only min with a space",() => {
            const req = {query : {min : " "}}
            expect(() => handleAmountFilterParams(req)).toThrow(Error("Min parameter is not a number"))
        })
        test("only min with a character",() =>{
            const req = {query : {min: "A"}};
            expect(() => handleAmountFilterParams(req)).toThrow(Error("Min parameter is not a number"));
        })
        test("only min with a number as char", () => {
            const req = {query : {min: "56"}}
            const queryResult = handleAmountFilterParams(req)
            expect(queryResult).toEqual({amount: {$gte: 56}})
        })
    })
    //Tests that use only max parameter
    describe("Test only max combination", ()=>{
        test("only max return query", () =>{
            const req = {query : {max: 50}};
            const result = handleAmountFilterParams(req);
            expect(result).toEqual({amount : {$lte : 50}});
        })
        test("only max with a space",() =>{
            const req = {query : {max : " "}}
            expect(() => handleAmountFilterParams(req)).toThrow(Error("Max parameter is not a number"))
        })
        test("only max with a character", () => {
            const req = {query : {max : "Bcd"}};
            expect(() => handleAmountFilterParams(req)).toThrow(Error("Max parameter is not a number"))
 
        })
    })

    //Tests that use min and max parameter
    describe("Test with min and max parameter",() =>{
        test("nothing parameter is passed", () =>{
            const req = {query : {min: "", max: ""}};
            const res = handleAmountFilterParams(req)
            expect(res).toEqual({})
        });
        test("min and max return query", () =>{
            const req = {query : {min : 10, max: 50}};
            const result = handleAmountFilterParams(req);
            expect(result).toEqual({amount: {
                                        $gte: 10,
                                        $lte : 50
                                        }
                                    });
        })
        test("with min and max with char", () => {
            const req = {query : {min : "c", max : "d"}}
            expect(() => handleAmountFilterParams(req)).toThrow(Error)
        })
    })
})
