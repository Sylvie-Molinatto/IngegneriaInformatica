import { handleDateFilterParams, verifyAuth, handleAmountFilterParams } from '../controllers/utils';
import jwt from 'jsonwebtoken';
const bcrypt = require("bcryptjs")
import dayjs from "dayjs"

jest.mock("dayjs")
jest.mock("bcryptjs")
jest.mock("jsonwebtoken")
jest.mock("../models/User.js")
jest.mock("../models/model.js")

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

    beforeEach( () => {
        jest.clearAllMocks();
    })

    test("Undefined tokens", () => {
        const req = { cookies: {} }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Simple" })
        expect(Object.values(response).includes(false)).toBe(true)
    })
    
    test("Access token is missing information (AuthType=Simple)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenInvalid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "",
            username: "",
            role: ""
        }

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "Simple"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Refresh token is missing information (AuthType=Simple)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenInvalid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.it",
            username: "tester",
            role: "Regular"
        }

        const decodedRefreshToken = {
            email: "",
            username: "",
            role: ""
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "Simple"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid but with different values (AuthType=Simple)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }

        const decodedRefreshToken = {
            email: "othertester@test.com",
            username: "othertester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "Simple"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid and belong to the requested user (AuthType=Simple)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValue(decodedAccessToken)
        jwt.verify.mockReturnValue(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "Simple"})
       
        expect(Object.values(response).includes(true)).toBe(true)
    })

    test("Access token is missing informations (AuthType=User)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenInValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "",
            username: "",
            role: ""
        }

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "User", username: "tester"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Refresh token is missing informations (AuthType=User)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenInvalid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.it",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "",
            username: "",
            role: ""
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "User", username: "tester"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid but with different values (AuthType=User)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }

        const decodedRefreshToken = {
            email: "othertester@test.com",
            username: "othertester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "User", username: "tester"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid but not belonging to the requested user (AuthType=User)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValue(decodedAccessToken)
        jwt.verify.mockReturnValue(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "User", username: "othertester"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid and belong to the requested user (AuthType=User)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValue(decodedAccessToken)
        jwt.verify.mockReturnValue(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "User", username: "tester"})
       
        expect(Object.values(response).includes(true)).toBe(true)
    })


    test("Access token is missing informations (AuthType=Admin)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenInValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "",
            username: "",
            role: ""
        }

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "Admin" })
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Refresh token is missing informations (AuthType=Admin)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenInvalid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.it",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "",
            username: "",
            role: ""
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "Admin", username: "tester"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid but with different values (AuthType=Admin)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }

        const decodedRefreshToken = {
            email: "othertester@test.com",
            username: "othertester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "Admin"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid but not belonging to the requested user (AuthType=Admin)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValue(decodedAccessToken)
        jwt.verify.mockReturnValue(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "Admin"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid and belong to the requested user (AuthType=Admin)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Admin"
        }
        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Admin"
        }
        
        jwt.verify.mockReturnValue(decodedAccessToken)
        jwt.verify.mockReturnValue(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "Admin"})
       
        expect(Object.values(response).includes(true)).toBe(true)
    })

    test("Access token is missing informations (AuthType=Group)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenInValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "",
            username: "",
            role: ""
        }

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "Group", emails:[ 'tester@test.com', 'othertester@test.com'] })
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Refresh token is missing informations (AuthType=Group)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenInvalid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "",
            username: "",
            role: ""
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "Group", emails: ['tester@test.com', 'othertester@test.com']})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid but with different values (AuthType=Group)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }

        const decodedRefreshToken = {
            email: "othertester@test.com",
            username: "othertester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "Group", emails:['tester@test.com', 'othertester@test.com']})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid but not belonging to the requested user (AuthType=Group)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValue(decodedAccessToken)
        jwt.verify.mockReturnValue(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "Group", emails:['othertester@test.com']})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Tokens are both valid and belong to the requested user (AuthType=Group)", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerRefreshTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
    
        const response = verifyAuth(req, res, { authType: "Group", emails: ['tester@test.com', 'othertester@test.com'] })
       
        expect(Object.values(response).includes(true)).toBe(true)
    })

    test("Access token expired and refresh token is missing informations (AuthType=Simple)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })

        const decodedRefreshToken = {
            email: "",
            username: "",
            role: ""
        }
        const decodedAccessToken = {
            email: "tester@test.it",
            username: "tester",
            role: "Regular"
        }
      
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        jwt.sign.mockReturnValueOnce("refreshedAccessToken")
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        const response = verifyAuth(req, res, { authType: "Simple"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Access token expired and refresh token valid (AuthType=Simple)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
      
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "Simple" })
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
       
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)    
    })

    test("Access token expired and refresh token is missing information (AuthType=User)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.it",
            username: "otheruser",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "",
            username: "",
            role: ""
        }
       
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        jwt.sign.mockReturnValue("refreshedAccessToken")
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Access token expired not recreated and refresh token not belonging to the requested user (AuthType=User)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedRefreshToken = {
            email: "tester@test.it",
            username: "tester",
            role: "Regular"
        }
       
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        jwt.sign.mockReturnValue("refreshedAccessToken")
        jwt.verify.mockReturnValueOnce()
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        
        const response = verifyAuth(req, res, { authType: "User", username: "othertester" })
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Access token expired and refresh token belonging to the requested user (AuthType=User)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
      
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
       
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
       
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    })
   
    test("Access token expired and refresh token is missing information (AuthType=Admin)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.it",
            username: "otheruser",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "",
            username: "",
            role: ""
        }
       
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        jwt.sign.mockReturnValue("refreshedAccessToken")
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        
        const response = verifyAuth(req, res, { authType: "Admin"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Access token expired and refresh token not belonging to the requested user (AuthType=Admin)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
       
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        jwt.sign.mockReturnValue("refreshedAccessToken")
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        
        const response = verifyAuth(req, res, { authType: "Admin" })
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Access token expired and refresh token belonging to the requested user (AuthType=Admin)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Admin"
        }
      
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "Admin"})
       
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
       
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    })
    
    test("Access token expired and refresh token is missing information (AuthType=Group)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "",
            username: "",
            role: ""
        }
       
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        jwt.sign.mockReturnValue("refreshedAccessToken")
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        
        const response = verifyAuth(req, res, { authType: "Group", emails: "tester@test.com"})
       
        expect(Object.values(response).includes(false)).toBe(true)
    })
    test("Access token expired and refresh token belonging to the requested user (AuthType=Group)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
       
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        jwt.sign.mockReturnValue("refreshedAccessToken")
        jwt.verify.mockReturnValueOnce(decodedAccessToken)
        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        
        const response = verifyAuth(req, res, { authType: "Group", emails: "tester@test.com"})
       
        expect(Object.values(response).includes(true)).toBe(true)
    })
    test("Access token expired and refresh token belonging to the requested user (AuthType=Group)", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
      
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "Group", emails: "tester@test.it, othertester@test.it" })
       
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
       
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    })

    test("Access token and refresh token are both invalid", () => {
        const req = { cookies: { accessToken: "invalidAccessToken", refreshToken: "invalidRefreshToken" } }
        const res = {}
       
        jwt.verify.mockImplementation((token, secret) => {
            const error = new Error('JsonWebTokenError')
            error.name = 'JsonWebTokenError'
            throw error
        })
        const response = verifyAuth(req, res, { authType: "Simple" })
        expect(Object.values(response).includes(false)).toBe(true)
    })
    
    test("Should manage generic error when refreshing access token", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerRefreshTokenValid" } }
    
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })

        const decodedRefreshToken = {
            email: "tester@test.it",
            username: "tester",
            role: "Regular"
        }
        const decodedAccessToken = {
            email: "tester@test.it",
            username: "tester",
            role: "Regular"
        }
      
        jest.spyOn(jwt, 'verify').mockReturnValueOnce(new Error('Error'))
        const response = verifyAuth(req, res, { authType: "Simple"})
        expect(Object.values(response).includes(false)).toBe(true)
    })
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
            expect(result).toEqual({amount: {
                                        $gte: 10,
                                        $lte : 50
                                        }
                                    });
        })
        test("with min and max with char", () => {
            const req = {query : {min : "1a", max : "3b"}}
            expect(() => handleAmountFilterParams(req)).toThrow(Error)
        })
    })
})
