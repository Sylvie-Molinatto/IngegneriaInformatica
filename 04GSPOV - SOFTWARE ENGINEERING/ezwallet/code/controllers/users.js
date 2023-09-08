import { Group, User } from "../models/User.js";
import { transactions } from "../models/model.js";
import { verifyAuth } from "./utils.js";
import jwt from 'jsonwebtoken'

/**
 * Return all the users
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `email` and `role`
  - Optional behavior:
    - empty array is returned if there are no users
 */
export const getUsers = async (req, res) => {
  try {
    const adminAuth = verifyAuth(req, res, { authType: "Admin" })
    if (adminAuth.flag) {
      //Admin auth successful
      const users = await User.find({},
        {
          "_id": 0,
          "username": 1,
          "email": 1,
          "role": 1
        });
      res.status(200).json({
        data: users,
        refreshedTokenMessage: res.locals.refreshedTokenMessage
      });
    }
    else {
      res.status(401).json({ error: adminAuth.cause })
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}

/**
 * Return information of a specific user
  - Request Body Content: None
  - Response `data` Content: An object having attributes `username`, `email` and `role`.
  - Optional behavior:
    - error 400 is returned if the user is not found in the system
 */
export const getUser = async (req, res) => {
  try {
    const cookie = req.cookies
    const userAuth = verifyAuth(req, res, { authType: "User", username: req.params.username })
    if (userAuth.flag) {
      //User auth successful
      const username = req.params.username
      const user = await User.findOne({ refreshToken: cookie.refreshToken })
      res.status(200).json({
        data: {
          username: user.username,
          email: user.email,
          role: user.role
        },
        refreshedTokenMessage: res.locals.refreshedTokenMessage
      })
    }
    else {
      const adminAuth = verifyAuth(req, res, { authType: "Admin" })
      if (adminAuth.flag) {
        //Admin auth successful
        const user = await User.findOne({ username: req.params.username })
        if (!user) return res.status(400).json({ error: "User not found" })
        res.status(200).json({
          "data": {
            "username": user.username,
            "email": user.email,
            "role": user.role
          },
          refreshedTokenMessage: res.locals.refreshedTokenMessage
        })
      }
      else {
        res.status(401).json({ error: "userAuth: " + userAuth.cause + " - adminAuth: " + adminAuth.cause })
      }
    }
  } catch (error) {
    res.status(500).json(error.message)
  }
}

/**
 * Create a new group
  - Request Body Content: An object having a string attribute for the `name` of the group and an array that lists all the `memberEmails`
  - Response `data` Content: An object having an attribute `group` (this object must have a string attribute for the `name`
    of the created group and an array for the `members` of the group), an array that lists the `alreadyInGroup` members
    (members whose email is already present in a group) and an array that lists the `membersNotFound` (members whose email
    +does not appear in the system)
  - Optional behavior:
    - error 400 is returned if there is already an existing group with the same name
    - error 400 is returned if all the `memberEmails` either do not exist or are already in a group
 */
export const createGroup = async (req, res) => {
  try {
    const cookie = req.cookies
    const simpleAuth = verifyAuth(req, res, { authType: "Simple" })
    if (simpleAuth.flag) {
      //Simple auth successful
      const { name, memberEmails } = req.body;

      if (!name || !memberEmails) {
        return res.status(400).json({ error: "The request body does not contain all the necessary attributes" });
      }

      if (name.trim() === "") {
        return res.status(400).json({ error: "The name passed in the request body is an empty string" });
      }

      // Verify if the name already exists (the name is unique)
      const existingGroup = await Group.findOne({ name });
      if (existingGroup) {
        return res.status(400).json({ error: "Group with the same name already exists" });
      }
      const members = [];
      const alreadyInGroup = [];
      const membersNotFound = [];

      // If the user who calls createGroup is not in the array passed in the request body you must include him 
      // in the list of inserted members. However, if this user is already in a group, the function must resolve
      // with a 400 error; the group is not created with the other members in this scenario.

      const groupCreator = await User.findOne({ refreshToken: cookie.refreshToken });
      let addWhoRequested = false;
      if (!groupCreator || !memberEmails.includes(groupCreator.email)) {
        //const existingGroup = await Group.findOne({ "members.email": groupCreator.email });
        const existingGroup = await Group.findOne({ members: { $elemMatch: { email: groupCreator.email } } });
        if (existingGroup) {
          return res.status(400).json({ error: "The user that requests to create a group is already in another group" });
        }
        else {
          addWhoRequested = true;
        }
      }

      // Find users with the corresponding email
      for (const email of memberEmails) {
        const t_email = email.trim()
        if (t_email === '' || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(t_email))) {
          return res.status(400).json({ error: "Email not valid" })
        }
        const user = await User.findOne({ email: t_email });
        if (!user) {
          membersNotFound.push(t_email);
        } else {
          // Verify if a user is in another group
          const existingGroup = await Group.findOne({ members: { $elemMatch: { email: t_email } } });

          if (existingGroup) {
            alreadyInGroup.push(t_email);
          } else {
            members.push({
              email: t_email,
              user: user._id
            });
          }
        }
      }

      if (members.length == 0) {
        return res.status(400).json({ error: "All the `memberEmails` either do not exist or are already in a group" });
      }

      //User who requested the creation of the group
      //is not considered if he is not in the list 
      if (addWhoRequested) {
        members.push({
          email: groupCreator.email,
          user: groupCreator._id
        });
      }

      // New group creation
      const newGroup = await Group.create({
        name,
        members
      });

      res.status(200).json({
        "data": {
          "group": {
            "name": newGroup.name,
            "members": newGroup.members.map(member => ({ email: member.email }))
          },
          alreadyInGroup,
          membersNotFound
        },
        "refreshedTokenMessage": res.locals.refreshedTokenMessage
      });
    }
    else {
      return res.status(401).json({ error: simpleAuth.cause });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Return all the groups
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having a string attribute for the `name` of the group
    and an array for the `members` of the group
  - Optional behavior:
    - empty array is returned if there are no groups
 */
export const getGroups = async (req, res) => {
  try {
    const adminAuth = verifyAuth(req, res, { authType: "Admin" })
    if (adminAuth.flag) {
      //Admin auth successful
      const groups = await Group.find({},
        {
          "_id": 0,
          "name": 1,
          "members.email": 1
        });
      return res.status(200).json({
        "data": groups,
        "refreshedTokenMessage": res.locals.refreshedTokenMessage,
      });
    }
    else {
      return res.status(401).json({ error: adminAuth.cause })
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Return information of a specific group
  - Request Body Content: None
  - Response `data` Content: An object having a string attribute for the `name` of the group and an array for the 
    `members` of the group
  - Optional behavior:
    - error 400 is returned if the group does not exist
 */
export const getGroup = async (req, res) => {
  try {
    // Retrieve group members emails
    const group = await Group.findOne({ name: req.params.name }, {
      "_id": 0,
      "name": 1,
      "members.email": 1
    });
    if (!group) return res.status(400).json({ error: "Group not found" });
    const memberEmails = group.members.map((m) => m.email);
    const groupAuth = verifyAuth(req, res, { authType: "Group", emails: memberEmails });
    if (groupAuth.flag) {
      // Group auth successful
      const groupName = req.params.name;
      res.status(200).json({
        "data": {
          "group": {
            "name": group.name,
            "members": group.members
          },
        },
        "refreshedTokenMessage": res.locals.refreshedTokenMessage,
      })
    }
    else {
      const adminAuth = verifyAuth(req, res, { authType: "Admin" })
      if (adminAuth.flag) {
        //Admin auth successful
        res.status(200).json({
          "data": {
            "group": {
              "name": group.name,
              "members": group.members
            }
          },
          "refreshedTokenMessage": res.locals.refreshedTokenMessage,
        })
      }
      else {
        res.status(401).json({ error: adminAuth.cause })
      }
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Add new members to a group
  - Request Body Content: An array of strings containing the emails of the members to add to the group
  - Response `data` Content: An object having an attribute `group` (this object must have a string attribute for the `name` of the
    created group and an array for the `members` of the group, this array must include the new members as well as the old ones), 
    an array that lists the `alreadyInGroup` members (members whose email is already present in a group) and an array that lists 
    the `membersNotFound` (members whose email does not appear in the system)
  - Optional behavior:
    - error 400 is returned if the group does not exist
    - error 400 is returned if all the `memberEmails` either do not exist or are already in a group
 */
export const addToGroup = async (req, res) => {
  try {
    // Retrieve group members emails
    const group = await Group.findOne({ name: req.params.name });
    if (!group) {
      return res.status(400).json({ error: "Group doesn't exist" });
    }
    const memberEmails = group.members.map(member => member.email);

    //request done by administrator     
    if (req.url.indexOf("/groups/" + req.params.name + "/insert") >= 0) {
      const adminAuth = verifyAuth(req, res, { authType: "Admin" });
      if (!adminAuth.flag) {
        return res.status(401).json({ error: adminAuth.cause });
      }
    }
    // request done by group member
    else {
      const groupAuth = verifyAuth(req, res, { authType: "Group", emails: memberEmails });
      if (!groupAuth.flag) {
        return res.status(401).json({ error: groupAuth.cause });
      }
    }

    // Auth successful
    const newMemberEmails = req.body.emails;
    if (!newMemberEmails || newMemberEmails.length == 0) {
      return res.status(400).json({ error: "Request body does not contain all the necessary attributes" });
    }

    // Take all the users in the groups
    const groups = await Group.find({},
      {
        "_id": 0,
        "name": 1,
        "members": 1
      }
    );

    const allMembers = groups.flatMap((g) => g.members.flatMap((member) => member.email));
    const members = group.members.map((member) => member.email);

    const alreadyInGroup = [];
    const membersNotFound = [];

    // Find users with the corresponding email
    for (const email of newMemberEmails) {
      const t_email = email.trim();
      if (t_email === "" || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return res.status(400).json({ error: "One or more emails not valid" })
      }
      const user = await User.findOne({ email: t_email });
      if (!user) {
        membersNotFound.push(t_email);
      } else {
        // And verify if the user is already in a group
        if (members.includes(t_email) || allMembers.includes(t_email)) {
          alreadyInGroup.push(t_email);
        } else {
          // Otherwise add the new member
          group.members.push({
            email: t_email,
            user: user._id
          });
        }
      }
    }

    if (memberEmails.length === group.members.length) {
      res.status(400).json({ error: "All the emails either do not exist or are already in a group" });
      return;
    }

    // Save the updated group in the db
    await Group.findOneAndUpdate(
      { name: req.params.name },
      { members: group.members },
      { new: true }
    );

    res.status(200).json({
      "data": {
        "group": {
          "name": group.name,
          "members": group.members.map(member => ({ email: member.email }))
        },
        alreadyInGroup,
        membersNotFound
      },
      "refreshedTokenMessage": res.locals.refreshedTokenMessage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Remove members from a group
  - Request Body Content: A single email of the member that has to be removed from the group
  - Response Body Content: An object having an attribute `group` (this object must have a string attribute for the `name` of the
    created group and an array for the `members` of the group, this array must include only the remaining members),
    an array that lists the `notInGroup` members (members whose email is not in the group) and an array that lists 
    the `membersNotFound` (members whose email does not appear in the system)
  - Optional behavior:
    - error 400 is returned if the group does not exist
    - error 400 is returned if all the `memberEmails` either do not exist or are not in the group
 */
export const removeFromGroup = async (req, res) => {
  try {
    // Retrieve group members emails
    const group = await Group.findOne({ name: req.params.name });
    if (!group) {
      return res.status(400).json({ error: "Group doesn't exist" });
    }
    const memberEmails = group.members.map(member => member.email);

    //request done by administrator     
    if (req.url.indexOf("/groups/" + req.params.name + "/pull") >= 0) {
      const adminAuth = verifyAuth(req, res, { authType: "Admin" });
      if (!adminAuth.flag) {
        return res.status(401).json({ error: adminAuth.cause });
      }
    }
    // request done by group member
    else {
      const groupAuth = verifyAuth(req, res, { authType: "Group", emails: memberEmails });
      if (!groupAuth.flag) {
        return res.status(401).json({ error: groupAuth.cause });
      }
    }

    // Take all the users in the groups
    const users = await User.find({}, { email: 1 });

    // Extract the emails from the users
    const allEmails = users.map(user => user.email);

    let memberEmailsToRemove = req.body.emails;
    if (!memberEmailsToRemove) {
      return res.status(400).json({ error: "The request body does not contain all the necessary attributes" });
    }
    memberEmailsToRemove = memberEmailsToRemove.map(e => e.trim());
    if (memberEmailsToRemove.includes("")) {
      return res.status(400).json({ error: "Empty strings are not accepted" });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const invalidEmails = memberEmailsToRemove.filter((email) => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return res.status(400).json({ error: "There is at least one email with an invalid format" });
    }

    const remainingMembers = group.members.filter(
      (member) => !memberEmailsToRemove.includes(member.email)
    );

    // Only return an error if the function is called when the group contains only one user
    if (remainingMembers.length === 0 && memberEmails.length === 1) {
      return res.status(400).json({ error: "Cannot delete the last member of a group" });
    }

    // If the group contains more than one member, for example, and you call the function to remove 
    // all the members then the function is successful but the first member is not removed
    if (remainingMembers.length === 0 && memberEmails.length > 1) {
      const firstMember = group.members[0];
      remainingMembers.push(firstMember);
      memberEmailsToRemove.filter(
        (email) => email != firstMember.email
      )
    }

    const membersNotFound = memberEmailsToRemove.filter(
      (email) => !allEmails.includes(email)
    );

    const notInGroup = memberEmailsToRemove.filter(
      (email) => !memberEmails.includes(email) && !membersNotFound.includes(email)
    );

    if (membersNotFound.length + notInGroup.length === memberEmailsToRemove.length) {
      return res.status(400).json({ error: "All the provided emails represent users that do not belong to the group or do not exist in the database" });
    }

    // Remove members from the group
    group.members = remainingMembers;
    remainingMembers.map(member => member.email)

    // Save the updated group in the db
    await Group.findOneAndUpdate(
      { name: req.params.name },
      { members: group.members },
      { new: true }
    );

    const response = {
      group: {
        name: group.name,
        members: remainingMembers.map(member => ({ email: member.email })),
      },
      membersNotFound,
      notInGroup
    };
    res.status(200).json({
      data: response,
      refreshedTokenMessage: res.locals.refreshedTokenMessage
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Delete a user
  - Request Parameters: None
  - Request Body Content: A string equal to the `email` of the user to be deleted
  - Response `data` Content: An object having an attribute that lists the number of `deletedTransactions` and a boolean attribute that
    specifies whether the user was also `deletedFromGroup` or not.
  - Optional behavior:
    - error 400 is returned if the user does not exist 
 */
export const deleteUser = async (req, res) => {
  try {
    const adminAuth = verifyAuth(req, res, { authType: "Admin" })
    if (adminAuth.flag) {
      //Admin auth successful - adminAuth.authorized
      const email = req.body.email;
      if (!email || email.trim()==="") {
        return res.status(400).json({ error: "The request body does not contain all the necessary attributes" });
      }

      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return res.status(400).json({ error: "Email non valid" })
      }

      // Find user for email
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ error: 'User does not exist' });
      }

      // Cannot delete an admin
      if (user.role == "Admin") {
        return res.status(400).json({ error: 'Cannot delete an admin' });
      }
      //Delete transactions with the deleted user
      const deletedTransactions = await transactions.deleteMany({ username: user.username });

      //Delete user from groups
      const group = await Group.findOne({ "members.email": email });
      let deletedFromGroup = false;
      if (group) {
        group.members = group.members.filter((member) => member.email !== email);
        deletedFromGroup = true;
        if (group.members.length === 0) {
          // Delete the group if the user was the last member
          await Group.deleteOne({ _id: group._id });
        }
        // Delete the user from the group
        await Group.updateMany({ 'members.email': email }, { $pull: { members: { email } } });
      }

      //Delete user
      await User.deleteOne({ email: email });

      return res.status(200).json({
        data: {
          deletedTransactions: deletedTransactions.deletedCount,
          deletedFromGroup: deletedFromGroup
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

/**
 * Delete a group
  - Request Body Content: A string equal to the `name` of the group to be deleted
  - Response `data` Content: A message confirming successful deletion
  - Optional behavior:
    - error 400 is returned if the group does not exist
 */
export const deleteGroup = async (req, res) => {
  try {
    const adminAuth = verifyAuth(req, res, { authType: "Admin" })
    if (!adminAuth.flag) {
      return res.status(401).json({ error: adminAuth.cause });
    }
    const groupParam = req.body.name
    if (!groupParam) {
      return res.status(400).json({ error: "the request body does not contain all the necessary attributes" });
    }
    if (groupParam.trim() === "") {
      return res.status(400).json({ error: "the name passed in the request body is an empty string" });
    }
    const groupFind = await Group.findOne({ "name": groupParam })
    if (!groupFind) {
      return res.status(400).json({ error: "group doesn't exist" })
    }
    let groupResult = await Group.deleteOne({ name: groupParam });
    return res.status(200).json({
      data: {
        message: "group succesfully deleted"
      },
      refreshedTokenMessage: res.locals.refreshedTokenMessage
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
