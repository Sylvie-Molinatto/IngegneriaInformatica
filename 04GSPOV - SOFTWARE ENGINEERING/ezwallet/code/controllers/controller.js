import { categories, transactions } from "../models/model.js";
import { Group, User } from "../models/User.js";
import { handleDateFilterParams, handleAmountFilterParams, verifyAuth } from "./utils.js";
import dayjs from 'dayjs'
/**
 * Create a new category
  - Request Body Content: An object having attributes `type` and `color`
  - Response `data` Content: An object having attributes `type` and `color`
 */
export const createCategory = async (req, res) => {
    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" })
        if (adminAuth.flag) {
            //Admin auth successful
            const type = req.body.type;
            const color = req.body.color;

            if (!type || !color || type.trim() == "" || color.trim() == "") {
                return res.status(400).json({ error: "The request body does not contain all the necessary attributes or a empty string" });
            }

            const category_exists = await categories.findOne({ type });
            if (category_exists) {
                return res.status(400).json({ error: "This category type already exists" });
            }

            const new_categories = new categories({ type, color });

            const data = await new_categories.save();
            return res.status(200).json({
                data: {
                    type: data.type,
                    color: data.color,
                },
                refreshedTokenMessage: res.locals.refreshedTokenMessage,
            });
        }
        else {
            return res.status(401).json({ error: adminAuth.cause })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/**
 * Edit a category's type or color
  - Request Body Content: An object having attributes `type` and `color` equal to the new values to assign to the category
  - Response `data` Content: An object with parameter `message` that confirms successful editing and a parameter `count` that is equal to the count of transactions whose category was changed with the new type
  - Optional behavior:
    - error 400 returned if the specified category does not exist
    - error 400 is returned if new parameters have invalid values
 */
export const updateCategory = async (req, res) => {
    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" })
        if (adminAuth.flag) {
            //Admin auth successful

            // Find the category by type
            const category = await categories.findOne({ type: req.params.type });

            if (!category) {
                return res.status(400).json({ error: "Category not found" });
            }

            if (!req.body.type || !req.body.color || req.body.type.trim() == "" || req.body.color.trim() == "") {
                return res.status(400).json({ error: "The request body does not contain all the necessary attributes or empty string" });
            }

            if (category.type !== req.body.type) {
                // The new category type already exists
                const category_exists = await categories.findOne({ type: req.body.type });
                if (category_exists) {
                    return res.status(400).json({ error: "Updated category already exists" });
                }
            }

            // Update the category's type and color
            //category.type = req.body.type;
            //category.color = req.body.color;

            await categories.updateOne(
                { type: req.params.type },
                {
                    $set: {
                        type: req.body.type,
                        color: req.body.color
                    }
                }
            )

            let transactionCount = 0;
            // Update the type of transactions associated with the category only if this type has changed
            if (category.type !== req.body.type) {

                await transactions.updateMany(
                    { type: req.params.type }, // Find transactions with the old category type
                    { $set: { type: category.type } } // Update the category type to the new value
                );

                // Count the transactions with the new category type
                transactionCount = await transactions.countDocuments({
                    type: category.type,
                });
            }

            return res.status(200).json({
                data: {
                    "message": 'Category successfully edited.',
                    "count": transactionCount,
                },
                refreshedTokenMessage: res.locals.refreshedTokenMessage
            })
        }
        else {
            return res.status(401).json({ error: adminAuth.cause })
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/**
 * Delete a category
  - Request Body Content: An array of strings that lists the `types` of the categories to be deleted
  - Response `data` Content: An object with parameter `message` that confirms successful deletion and a parameter `count` that is equal to the count of affected transactions (deleting a category sets all transactions with that category to have `investment` as their new category)
  - Optional behavior:
    - error 400 is returned if the specified category does not exist
 */
export const deleteCategory = async (req, res) => {
    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" })
        if (adminAuth.flag) {
            //Admin auth successful

            const typesToDelete = req.body.types;
            if (!typesToDelete || !Array.isArray(typesToDelete) || typesToDelete.length === 0) {
                return res.status(400).json({ error: "The request body does not contain all the necessary attributes" });
            }

            // Find all categories
            const allCategories = await categories.find();
            if (allCategories.length == 1) {
                return res.status(400).json({ error: "There is only one category in the database" });
            }

            if (typesToDelete.includes("")) {
                return res.status(400).json({ error: "No empty string accepted in types array" });
            }

            // Find the categories to be deleted
            const deletedCategories = await categories.find({ type: { $in: typesToDelete } });

            // return an error if there is at least one type in the array that does not exist
            if (deletedCategories.length !== typesToDelete.length) {
                return res.status(400).json({ error: 'There is at least one type of category that does not exist' });
            }

            // At least one category must remain in the database after deletion. 
            // If there are three categories in the database and the method is called to delete all the categories, 
            // then the first category in the database cannot be deleted)

            // Get the oldest category type in the database
            let oldestCategory = await categories.find().sort({ createdAt: -1 }).limit(1).exec();
            oldestCategory = oldestCategory[0];

            // Check if all categories are being deleted
            if (deletedCategories.length === allCategories.length) {

                // Remove the oldest category type from typesToDelete
                const index = typesToDelete.indexOf(oldestCategory.type);
                typesToDelete.splice(index, 1);

            }

            if (deletedCategories.length < allCategories.length) {
                // Find the oldest category that is not in the types array
                oldestCategory = await categories.find({ type: { $nin: typesToDelete } }).sort({ createdAt: -1 }).limit(1).exec();
                oldestCategory = oldestCategory[0];
            }


            // Delete the categories
            await categories.deleteMany({ type: { $in: typesToDelete } });

            // Count the affected transactions
            const affectedTransactionCount = await transactions.countDocuments({
                type: { $in: typesToDelete }
            });

            await transactions.updateMany(
                { type: { $in: typesToDelete } }, // Find transactions with the deleted categories
                { $set: { type: oldestCategory.type } } // Update the category to the oldest category type
            );

            return res.status(200).json({
                data: {
                    message: 'Categories successfully deleted.',
                    count: affectedTransactionCount,
                },
                refreshedTokenMessage: res.locals.refreshedTokenMessage
            })
        }
        else {
            return res.status(401).json({ error: adminAuth.cause })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/**
 * Return all the categories
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `type` and `color`
  - Optional behavior:
    - empty array is returned if there are no categories
 */
export const getCategories = async (req, res) => {
    try {
        const simpleAuth = verifyAuth(req, res, { authType: "Simple" })
        if (simpleAuth.flag) {
            //Admin auth successful
            let data = await categories.find({})

            let filter = data.map(v => Object.assign({}, { type: v.type, color: v.color }))

            return res.status(200).json({
                data: filter,
                refreshedTokenMessage: res.locals.refreshedTokenMessage
            })
        }
        else {
            return res.status(401).json({ error: simpleAuth.cause })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/**
 * Create a new transaction made by a specific user
  - Request Body Content: An object having attributes `username`, `type` and `amount`
  - Response `data` Content: An object having attributes `username`, `type`, `amount` and `date`
  - Optional behavior:
    - error 400 is returned if the username or the type of category does not exist
 */
export const createTransaction = async (req, res) => {
    try {
        const cookie = req.cookies
        const userAuth = verifyAuth(req, res, { authType: "User", "username": req.params.username })

        if (!userAuth.flag)
            return res.status(401).json({ error: userAuth.cause })
        const { username, amount, type } = req.body;
        //If body does not contain all the necessary attributes or empty

        if (!username || !amount || !type || username.trim()==="" || type.trim()==="")
            return res.status(400).json({ error: "body does not contain all the necessary attributes" })
        const userParam = req.params.username
        const user = await User.findOne({ "username": username })
        const categoryFind = await categories.findOne({ "type": type })
        const userParamFind = await User.findOne({ "username": userParam })
        if (!user || !categoryFind) {
            return res.status(400).json({ error: "Username or type doesn't exist" })
        }
        //username of parameter and body are not equal 
        if (username !== userParam) {
            return res.status(400).json({ error: "Username not valid" })
        }
        const value = Number(amount)
        if (Number.isNaN(value))
            return res.status(400).json({ error: "Amount is a value not valid" })
        if (user.refreshToken !== req.cookies.refreshToken) {
            return res.status(400).json({ error: "Token not valid" })
        }
        const new_transactions = new transactions({ username, amount, type });
        new_transactions.save()
            .then(data => res.status(200).json({
                "data": {
                    "username": data.username,
                    "type": data.type,
                    "amount": data.amount,
                    "date": dayjs(data.date).format('YYYY-MM-DDTHH:mm:ss')
                },
                refreshedTokenMessage: res.locals.refreshedTokenMessage
            }))
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/**
 * Return all transactions made by all users
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`
  - Optional behavior:
    - empty array must be returned if there are no transactions
 */
export const getAllTransactions = async (req, res) => {
    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" })
        if (adminAuth.flag) {
            //Admin auth successful
            /**
             * MongoDB equivalent to the query "SELECT * FROM transactions, categories WHERE transactions.type = categories.type"
             */
            transactions.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "type",
                        foreignField: "type",
                        as: "categories_info"
                    }
                },
                { $unwind: "$categories_info" }
            ]).then((result) => {
                let data = result.map(v => Object.assign({}, { username: v.username, type: v.type, amount: v.amount, date: dayjs(v.date).format('YYYY-MM-DDTHH:mm:ss'), color: v.categories_info.color }))
                res.status(200).json({
                    "data": data,
                    "refreshedTokenMessage": res.locals.refreshedTokenMessage
                });
            })
        }
        else {
            return res.status(401).json({ error: adminAuth.cause });
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/**
 * Return all transactions made by a specific user
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`
  - Optional behavior:
    - error 400 is returned if the user does not exist
    - empty array is returned if there are no transactions made by the user
    - if there are query parameters and the function has been called by a Regular user then the returned transactions must be filtered according to the query parameters
 */
export const getTransactionsByUser = async (req, res) => {
    try {
        //Distinction between route accessed by Admins or Regular users for functions that can be called by both
        //and different behaviors and access rights
        const userParam = req?.params?.username
        let matchDate;
        let matchAmount;
        let matchDateGte;
        let matchDateLte;
        let matchAmountGte;
        let matchAmountLte;
        //request done by administrator     
        if (req.url.indexOf("/transactions/users/") >= 0) {
            const adminAuth = verifyAuth(req, res, { authType: "Admin" })
            if (!adminAuth.flag) {
                return res.status(401).json({ error: adminAuth.cause })
            }
            const existUser = await User.findOne({ username: userParam })
            if (!existUser) {
                return res.status(400).json({ error: "User doesn't exist" })
            }
            //if request is done by admin, we pass to query empty value
            matchDate = [{}, {}]
            matchAmount = [{}, {}]
        }
        //request done by user
        else {
            const userAuth = verifyAuth(req, res, { authType: "User", "username": req.params.username })
            if (!userAuth.flag) {
                return res.status(401).json({ error: userAuth.cause })
            }
            const existUser = await User.findOne({ username: userParam })
            if (!existUser) {
                return res.status(400).json({ error: "User doesn't exist" })
            }
            //If request is done by user, this parameter are setted from the function
            matchDate = handleDateFilterParams(req)
            matchAmount = handleAmountFilterParams(req)
            matchDateGte = matchDate?.date?.$gte ? { date: { $gte: new Date(matchDate.date.$gte.toISOString().slice(0, 19)) } } : {}
            matchDateLte = matchDate?.date?.$lte ? { date: { $lte: new Date(matchDate.date.$lte.toISOString().slice(0, 19)) } } : {}
            matchDate = [matchDateGte, matchDateLte]
            matchAmountGte = matchAmount?.amount?.$gte ? { amount: { $gte: matchAmount.amount.$gte } } : {}
            matchAmountLte = matchAmount?.amount?.$lte ? { amount: { $lte: matchAmount.amount.$lte } } : {}
            matchAmount = [matchAmountGte, matchAmountLte]

        }
        await transactions.aggregate([
            {
                $match: {
                    $and: [
                        { username: userParam },
                        matchDate[0],
                        matchDate[1],
                        matchAmount[0],
                        matchAmount[1]
                    ]
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "type",
                    foreignField: "type",
                    as: "categories_info"
                }
            },
            { $unwind: "$categories_info" }
        ]).then((result) => {
            let data = result.map(v => Object.assign({}, { username: v.username, type: v.type, amount: v.amount, date: dayjs(v.date).format('YYYY-MM-DDTHH:mm:ss'), color: v.categories_info.color }))
            res.status(200).json({
                "data": data,
                "refreshedTokenMessage": res.locals.refreshedTokenMessage
            })
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/**
 * Return all transactions made by a specific user filtered by a specific category
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`, filtered so that `type` is the same for all objects
  - Optional behavior:
    - empty array is returned if there are no transactions made by the user with the specified category
    - error 400 is returned if the user or the category does not exist
 */
export const getTransactionsByUserByCategory = async (req, res) => {
    try {
        let userParam = req?.params?.username
        let categoryParam = req?.params?.category

        //The same query if the request is done by user or by admin
        //request done by administrator     
        if (req.url.indexOf("/transactions/users/") >= 0) {
            const adminAuth = verifyAuth(req, res, { authType: "Admin" })
            if (!adminAuth.flag) {
                return res.status(401).json({ error: adminAuth.cause })
            }
            const existUser = await User.findOne({ username: userParam })
            const existCategory = await categories.findOne({ type: categoryParam })
            if (!existUser || !existCategory) {
                return res.status(400).json({ error: "User or category doesn't exist" })
            }
        }
        //request done by user
        else {
            const userAuth = verifyAuth(req, res, { authType: "User", "username": req.params.username })
            if (!userAuth.flag) {
                return res.status(401).json({ error: userAuth.cause })
            }
            const existUser = await User.findOne({ username: userParam })
            const existCategory = await categories.findOne({ type: categoryParam })
            if (!existUser || !existCategory) {
                return res.status(400).json({ error: "User or category doesn't exist" })
            }
        }
        const result = await transactions.aggregate([
            {
                $match: {
                    $and: [
                        { username: userParam },
                        { type: categoryParam }
                    ]
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "type",
                    foreignField: "type",
                    as: "categories"
                }
            },
            {
                $unwind: "$categories"
            },
            {
                $project: {
                    _id: 0,
                    username: 1,
                    type: 1,
                    amount: 1,
                    date: 1,
                    color: "$categories.color"
                }
            }
        ]).then((result) => {
            let data = result.map(v => Object.assign({}, { username: v.username, type: v.type, amount: v.amount, date: dayjs(v.date).format('YYYY-MM-DDTHH:mm:ss'), color: v.color }))
            res.status(200).json({
                "data": data,
                "refreshedTokenMessage": res.locals.refreshedTokenMessage
            })
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}


/**
 * Return all transactions made by members of a specific group
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`
  - Optional behavior:
    - error 400 is returned if the group does not exist
    - empty array must be returned if there are no transactions made by the group
 */
export const getTransactionsByGroup = async (req, res) => {
    try {
        //Distinction between route accessed by Admins or Regular users for functions that can be called by both
        //and different behaviors and access rights
        const groupParam = req.params.name
        const existGroup = await Group.findOne({ name: groupParam })
        if (!existGroup) {
            return res.status(400).json({ error: "Group doesn't exist" })
        }
        const memberEmails = existGroup.members.map((member) => member.email);
        //request done by administrator     
        if (req.url.indexOf("/transactions/groups/") >= 0) {
            const adminAuth = verifyAuth(req, res, { authType: "Admin" })
            if (!adminAuth.flag) {
                return res.status(401).json({ error: adminAuth.cause });
            }
        }
        //request done by member group
        else {
            const groupAuth = verifyAuth(req, res, { authType: "Group", "emails": memberEmails })
            if (!groupAuth.flag) {
                return res.status(401).json({ error: groupAuth.cause });
            }
        }

        const users = await User.find({ email: { $in: memberEmails } });
        const usernames = users.map(user => user.username);
        const transactionResult = await transactions.aggregate([
            {
                $match: {
                    $and: [
                        { username: { $in: usernames } },
                    ]
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "type",
                    foreignField: "type",
                    as: "categories"
                }
            },
            {
                $unwind: "$categories"
            },
            {
                $project: {
                    _id: 0,
                    username: 1,
                    type: 1,
                    amount: 1,
                    date: 1,
                    color: "$categories.color"
                }
            }
        ]).then((result) => {
            let data = result.map(v => Object.assign({}, { username: v.username, type: v.type, amount: v.amount, date: dayjs(v.date).format('YYYY-MM-DDTHH:mm:ss'), color: v.color }))
            res.status(200).json({
                "data": data,
                "refreshedTokenMessage": res.locals.refreshedTokenMessage
            })
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/**
* Return all transactions made by members of a specific group filtered by a specific category
- Request Body Content: None
- Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`, filtered so that `type` is the same for all objects.
- Optional behavior:
- error 400 is returned if the group or the category does not exist
- empty array must be returned if there are no transactions made by the group with the specified category
*/
export const getTransactionsByGroupByCategory = async (req, res) => {
    try {
        //Distinction between route accessed by Admins or Regular users for functions that can be called by both
        //and different behaviors and access rights
        const groupParam = req.params.name
        const categoryParam = req.params.category

        const existGroup = await Group.findOne({ name: groupParam })
        const existCategory = await categories.findOne({ type: categoryParam });
        if (!existGroup || !existCategory) {
            return res.status(400).json({ error: "Group or category doesn't exist" })
        }
        const memberEmails = existGroup.members.map((member) => member.email);

        //request done by administrator     
        if (req.url.indexOf("/transactions/groups") >= 0) {
            const adminAuth = verifyAuth(req, res, { authType: "Admin" })
            if (!adminAuth.flag) {
                return res.status(401).json({ error: adminAuth.cause });
            }
        }
        //request done by group member
        else {
            const groupAuth = verifyAuth(req, res, { authType: "Group", "emails": memberEmails })
            if (!groupAuth.flag) {
                return res.status(401).json({ error: groupAuth.cause });
            }
        }

        const users = await User.find({ email: { $in: memberEmails } });
        const usernames = users.map(user => user.username);
        const transactionResult = await transactions.aggregate([
            {
                $match: {
                    $and: [
                        { username: { $in: usernames } },
                        { type: categoryParam }
                    ]
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "type",
                    foreignField: "type",
                    as: "categories"
                }
            },
            {
                $unwind: "$categories"
            },
            {
                $project: {
                    _id: 0,
                    username: 1,
                    type: 1,
                    amount: 1,
                    date: 1,
                    color: "$categories.color"
                }
            }
        ]).then((result) => {
            let data = result.map(v => Object.assign({}, { username: v.username, type: v.type, amount: v.amount, date: dayjs(v.date).format('YYYY-MM-DDTHH:mm:ss'), color: v.color }))
            res.status(200).json({
                "data": data,
                "refreshedTokenMessage": res.locals.refreshedTokenMessage
            })
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/**
* Delete a transaction made by a specific user
- Request Body Content: The `_id` of the transaction to be deleted
- Response `data` Content: A string indicating successful deletion of the transaction
- Optional behavior:
- error 400 is returned if the user or the transaction does not exist
*/
export const deleteTransaction = async (req, res) => {
    try {
        const userAuth = verifyAuth(req, res, { authType: "User", "username": req.params.username })
        if (userAuth.flag) {
            if(!req.body._id || req.body._id.trim()===""){
                return res.status(400).json({ error: "The request body does not contain all the necessary attributes"})
            }
            const userFind = await User.findOne({ username: req.params.username }, { username: 1 })
            const transactionFind = await transactions.findOne({ _id: req.body._id }, { _id: 1, username: 1 })
            if (!userFind || !transactionFind) {
                return res.status(400).json({ error: "User or transaction doesn't exist" })
            }
            if (userFind.username !== transactionFind.username)
                return res.status(400).json({ error: "User tries to delete a transaction not valid" })
            let data = await transactions.deleteOne({ _id: req.body._id });
            return res.status(200).json({
                data: { message: "Transactions deleted" },
                refreshedTokenMessage: res.locals.refreshedTokenMessage
            });
        }
        else {
            res.status(401).json({ error: userAuth.cause })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



/**
 * Delete multiple transactions identified by their ids
  - Request Body Content: An array of strings that lists the `_ids` of the transactions to be deleted
  - Response `data` Content: A message confirming successful deletion
  - Optional behavior:
    - error 400 is returned if at least one of the `_ids` does not have a corresponding transaction. Transactions that have an id are not deleted in this case
 */
export const deleteTransactions = async (req, res) => {
    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" })
        if (adminAuth.flag) {
            const transactionIds = req.body._ids;

            if (!transactionIds) {
                return res.status(400).json({ error: "The request body does not contain all the necessary attributes" });
            }

            if (transactionIds.includes("") || transactionIds.includes(" ")) {
                return res.status(400).json({ error: "At least one of the ids in the array is an empty string" })
            }

            // Check if all transactionIds have corresponding transactions (optional behavior)
            const deletedTransactions = await transactions.find({ _id: { $in: transactionIds } });

            // return an error if there is at least one id in the array that does not exist
            if (deletedTransactions.length !== transactionIds.length) {
                return res.status(400).json({ error: 'At least one of the ids does not valid' });
            }

            // Delete transactions
            const result = await transactions.deleteMany({ _id: { $in: transactionIds } });

            return res.status(200).json({
                data: {
                    "message": "Transactions succesfully deleted"
                },
                refreshedTokenMessage: res.locals.refreshedTokenMessage
            });

        }
        else {
            res.status(401).json({ error: adminAuth.cause })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

