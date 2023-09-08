import jwt from 'jsonwebtoken'

/**
 * Handle possible date filtering options in the query parameters for getTransactionsByUser when called by a Regular user.
 * @param req the request object that can contain query parameters
 * @returns an object that can be used for filtering MongoDB queries according to the `date` parameter.
 *  The returned object must handle all possible combination of date filtering parameters, including the case where none are present.
 *  Example: {date: {$gte: "2023-04-30T00:00:00.000Z"}} returns all transactions whose `date` parameter indicates a date from 30/04/2023 (included) onwards
 * @throws an error if the query parameters include `date` together with at least one of `from` or `upTo`
 */
export const handleDateFilterParams = (req) => {
    let matchStage = {}

    //Patter to verify if the data passed is correct standard
    let patternDate = /^\d\d\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/

    const from = req.query.from
    const upTo = req.query.upTo
    const date = req.query.date

    //To verify if togheter date there is value from or upTo
    if(date && (from || upTo))
        throw new Error('Parameters are not valid');

    //If we pass date, it creates the structure for that day to pass to mongoDB
    if(date){
        if (!patternDate.test(date))
            throw new Error('Format date is not valid');
        let dateStart = new Date(date + "T00:00:00.000Z")
        let dateEnd = new Date(date + "T23:59:59.999Z")
        matchStage = {date :
                        { $gte : dateStart,
                          $lte : dateEnd}
                    }
    }
    //Create the structure of the date to obtain transactions in a specific interval
    else{
        if(from && !upTo){
            if (!patternDate.test(from))
                throw new Error('Format from is not valid');
            const dateFrom = new Date(from + "T00:00:00.000Z")
            matchStage ={date : {$gte : dateFrom}}
        }
        if(!from && upTo){
            if (!patternDate.test(upTo))
                throw new Error('Format upTo is not valid'); 
            const dateUpTo = new Date(upTo + "T23:59:59.999Z")
            matchStage = {date : {$lte : dateUpTo}}
        }
        if(from && upTo){
            if (!patternDate.test(upTo) || !patternDate.test(from))
                throw new Error('Format from or upTo is not valid');  
            const dateFrom = new Date(from + "T00:00:00.000Z")
            const dateUpTo = new Date(upTo + "T23:59:59.999Z")
            matchStage = {date : 
                            {$gte : dateFrom,
                             $lte : dateUpTo
                            }
                        }
        } 
    }
    return matchStage
}

/**
 * Handle possible authentication modes depending on `authType`
 * @param req the request object that contains cookie information
 * @param res the result object of the request
 * @param info an object that specifies the `authType` and that contains additional information, depending on the value of `authType`
 *      Example: {authType: "Simple"}
 *      Additional criteria:
 *          - authType === "User":
 *              - either the accessToken or the refreshToken have a `username` different from the requested one => error 401
 *              - the accessToken is expired and the refreshToken has a `username` different from the requested one => error 401
 *              - both the accessToken and the refreshToken have a `username` equal to the requested one => success
 *              - the accessToken is expired and the refreshToken has a `username` equal to the requested one => success
 *          - authType === "Admin":
 *              - either the accessToken or the refreshToken have a `role` which is not Admin => error 401
 *              - the accessToken is expired and the refreshToken has a `role` which is not Admin => error 401
 *              - both the accessToken and the refreshToken have a `role` which is equal to Admin => success
 *              - the accessToken is expired and the refreshToken has a `role` which is equal to Admin => success
 *          - authType === "Group":
 *              - either the accessToken or the refreshToken have a `email` which is not in the requested group => error 401
 *              - the accessToken is expired and the refreshToken has a `email` which is not in the requested group => error 401
 *              - both the accessToken and the refreshToken have a `email` which is in the requested group => success
 *              - the accessToken is expired and the refreshToken has a `email` which is in the requested group => success
 * @returns true if the user satisfies all the conditions of the specified `authType` and false if at least one condition is not satisfied
 *  Refreshes the accessToken if it has expired and the refreshToken is still valid
const simpleAuth = verifyAuth(req, res, {authType: "Simple"})
const userAuth = verifyAuth(req, res, {authType: "User", username: req.params.username})
const adminAuth = verifyAuth(req, res, {authType: "Admin"})
const groupAuth = verifyAuth(req, res, {authType: "Group", emails: <array of emails>}) 

*/

export const verifyAuth = (req, res, info) => {
    const cookie = req.cookies
    if (!cookie.accessToken || !cookie.refreshToken) {
        return { flag: false, cause: "Unauthorized" };
    }
    try {
        const decodedAccessToken = jwt.verify(cookie.accessToken, process.env.ACCESS_KEY);
        const decodedRefreshToken = jwt.verify(cookie.refreshToken, process.env.ACCESS_KEY);

        if(info.authType==="Simple"){
            if (!decodedAccessToken.username || !decodedAccessToken.email || !decodedAccessToken.role) {
                return { flag: false, cause: "Token is missing information" };
            }
            if (!decodedRefreshToken.username || !decodedRefreshToken.email || !decodedRefreshToken.role) {
                return { flag: false, cause: "Token is missing information" };
            }
            if (decodedAccessToken.username !== decodedRefreshToken.username || decodedAccessToken.email !== decodedRefreshToken.email || decodedAccessToken.role !== decodedRefreshToken.role) {
                return { flag: false, cause: "Mismatched users" };
            }
            return { flag: true, cause: "Authorized" };
        }
        else if(info.authType==="User"){
            if (!decodedAccessToken.username || !decodedAccessToken.email || !decodedAccessToken.role) {
                return { flag: false, cause: "Token is missing information" };
            }
            if (!decodedRefreshToken.username || !decodedRefreshToken.email || !decodedRefreshToken.role) {
                return { flag: false, cause: "Token is missing information" };
            }
            if (decodedAccessToken.username !== decodedRefreshToken.username || decodedAccessToken.email !== decodedRefreshToken.email || decodedAccessToken.role !== decodedRefreshToken.role) {
                return { flag: false, cause: "Mismatched users" };
            }    
            if(decodedAccessToken.username!==info.username || decodedRefreshToken.username!==info.username){
                return { flag: false, cause: "Mismatched users"};
            }
          
            return { flag: true, cause: "Authorized"};
        }
        else if(info.authType==="Admin"){
            if (!decodedAccessToken.username || !decodedAccessToken.email || !decodedAccessToken.role) {
                return { flag: false, cause: "Token is missing information" };
            }
            if (!decodedRefreshToken.username || !decodedRefreshToken.email || !decodedRefreshToken.role) {
                return { flag: false, cause: "Token is missing information" };
            }
            if (decodedAccessToken.username !== decodedRefreshToken.username || decodedAccessToken.email !== decodedRefreshToken.email || decodedAccessToken.role !== decodedRefreshToken.role) {
                return { flag: false, cause: "Mismatched users" };
            }
            if(decodedAccessToken.role!=="Admin" || decodedRefreshToken.role!=="Admin"){
                return { flag: false, cause: "Not an admin"};
            }
           
            return { flag: true, cause: "Authorized"};
        }
        else{ // info.authType==='Group'
            if (!decodedAccessToken.username || !decodedAccessToken.email || !decodedAccessToken.role) {
                return { flag: false, cause: "Token is missing information" };
            }
            if (!decodedRefreshToken.username || !decodedRefreshToken.email || !decodedRefreshToken.role) {
                return { flag: false, cause: "Token is missing information" };
            }
            if (decodedAccessToken.username !== decodedRefreshToken.username || decodedAccessToken.email !== decodedRefreshToken.email || decodedAccessToken.role !== decodedRefreshToken.role) {
                return { flag: false, cause: "Mismatched users" };
            }
            const requestedGroup = info.emails; 
            if (!requestedGroup.includes(decodedAccessToken.email) || !requestedGroup.includes(decodedRefreshToken.email)){
                return { flag: false, cause: "Not a group member"};
            }
           
            return { flag: true, cause: "Authorized"};
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            try {
                const decodedRefreshToken = jwt.verify(cookie.refreshToken, process.env.ACCESS_KEY)
                const newAccessToken = jwt.sign({
                    username: decodedRefreshToken.username,
                    email: decodedRefreshToken.email,
                    id: decodedRefreshToken.id,
                    role: decodedRefreshToken.role
                }, process.env.ACCESS_KEY, { expiresIn: '1h' })
                res.cookie('accessToken', newAccessToken, { httpOnly: true, path: '/api', maxAge: 60 * 60 * 1000, sameSite: 'none', secure: true })
                res.locals.refreshedTokenMessage= 'Access token has been refreshed. Remember to copy the new one in the headers of subsequent calls'
                
                const decodedAccessToken = jwt.verify(newAccessToken, process.env.ACCESS_KEY);

                // Here I have to check the refreshToken
                if(info.authType==="Simple"){
                    if (!decodedRefreshToken.username || !decodedRefreshToken.email || !decodedRefreshToken.role) {
                        return { flag: false, cause: "Token is missing information" };
                    }
                    return { flag: true, cause: "Authorized" };
                }
                else if(info.authType==="User"){
                    if (!decodedRefreshToken.username || !decodedRefreshToken.email || !decodedRefreshToken.role) {
                        return { flag: false, cause: "Token is missing information" };
                    }
                    if(decodedRefreshToken.username!==info.username){
                        return { flag: false, cause: "Mismatched users"};
                    }
                  
                    return { flag: true, cause: "Authorized"};
                }
                else if(info.authType==="Admin"){
                    if (!decodedRefreshToken.username || !decodedRefreshToken.email || !decodedRefreshToken.role) {
                        return { flag: false, cause: "Token is missing information" };
                    }
                    if(decodedAccessToken.role!=="Admin" || decodedRefreshToken.role!=="Admin"){
                        return { flag: false, cause: "Not an admin"};
                    }
                    
                    return { flag: true, cause: "Authorized"};
                }
                else{
                    if (!decodedRefreshToken.username || !decodedRefreshToken.email || !decodedRefreshToken.role) {
                        return { flag: false, cause: "Token is missing information" };
                    }
                    const requestedGroup = info.emails; 
                    if (!requestedGroup.includes(decodedAccessToken.email) || !requestedGroup.includes(decodedRefreshToken.email)){
                        return { flag: false, cause: "Not a group member"};
                    }
                
                    return { flag: true, cause: "Authorized"};
                }
            } catch (err) {
                return { flag: false, cause: err.name }
            }
        } else {
            return { flag: false, cause: err.name };
        }
    }
}

/**
 * Handle possible amount filtering options in the query parameters for getTransactionsByUser when called by a Regular user.
 * @param req the request object that can contain query parameters
 * @returns an object that can be used for filtering MongoDB queries according to the `amount` parameter.
 *  The returned object must handle all possible combination of amount filtering parameters, including the case where none are present.
 *  Example: {amount: {$gte: 100}} returns all transactions whose `amount` parameter is greater or equal than 100
 */
export const handleAmountFilterParams = (req) => {
    let matchStage = {}
    let min = req.query.min
    let max = req.query.max

    //regex to verify if the value passed is a number value
    const regexNumber = /^[0-9]*$/
    if(min && !regexNumber.test(min))
        throw new Error("Min parameter is not a number")
    if(max && !regexNumber.test(max))
        throw new Error("Max parameter is not a number")
    
    //mongoDB structure to filter on a specific range of amount    
    if(min && !max)
        matchStage = {amount : {$gte : Number(min)}} 
    if(!min && max)
        matchStage = {amount : {$lte : Number(max)}}
    if(min && max)
        matchStage = {amount : {
                        $gte: Number(min),
                        $lte: Number(max)
                     }}
    return matchStage
}