import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { verifyAuth } from './utils.js';

/**
 * Register a new user in the system
  - Request Body Content: An object having attributes `username`, `email` and `password`
  - Response `data` Content: A message confirming successful insertion
  - Optional behavior:
    - error 400 is returned if there is already a user with the same username and/or email
 */
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({error: 'The request body does not contain all the necessary attributes'});
        }
        const existingUser = await User.findOne(
        {$or: [
                    {username : req.body.username},
                    {email : req.body.email }]
                });
        if (existingUser) return res.status(400).json({ error: "you are already registered" });
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            return res.status(400).json({error : "Email non valid"})
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        
        res.status(200).json({
            "data" : {
                "message": 'user added successfully'
            }
        });
        
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * Register a new user in the system with an Admin role
  - Request Body Content: An object having attributes `username`, `email` and `password`
  - Response `data` Content: A message confirming successful insertion
  - Optional behavior:
    - error 400 is returned if there is already a user with the same username and/or email
 */
export const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if(!username || !email || !password){
            return res.status(400).json({error: 'The request body does not contain all the necessary attributes'});
        }
        const existingUser = await User.findOne(
            {$or: [
                {username : req.body.username},
                {email : req.body.email }]
            });
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            return res.status(400).json({error : "Email non valid"})
        }
        if (existingUser) return res.status(400).json({ error: "you are already registered" });
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "Admin"
        });
        res.status(200).json({
            "data" : {
                "message" : 'admin added successfully'
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }

}

/**
 * Perform login 
  - Request Body Content: An object having attributes `email` and `password`
  - Response `data` Content: An object with the created accessToken and refreshToken
  - Optional behavior:
    - error 400 is returned if the user does not exist
    - error 400 is returned if the supplied password does not match with the one in the database
 */
export const login = async (req, res) => {
    
    try {
        const { email, password } = req.body
        const cookie = req.cookies
   
        if(!email || !password){
            return res.status(400).json({error: 'The request body does not contain all the necessary attributes'});
        }
        if(email.trim()=="" || password.trim()==""){
            return res.status(400).json({error: 'At least one of the parameters is an empty string'});
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            return res.status(400).json({error : "Email non valid"})
        }
        const existingUser = await User.findOne({ email: email })
        if (!existingUser) return res.status(400).json({error: 'please you need to register'})
            const match = await bcrypt.compare(password, existingUser.password)
        if (!match) return res.status(400).json({error:'wrong credentials'})
        //CREATE ACCESSTOKEN
        const accessToken = jwt.sign({
            email: existingUser.email,
            id: existingUser.id,
            username: existingUser.username,
            role: existingUser.role
        }, process.env.ACCESS_KEY, { expiresIn: '1h' })
        //CREATE REFRESH TOKEN
        const refreshToken = jwt.sign({
            email: existingUser.email,
            id: existingUser.id,
            username: existingUser.username,
            role: existingUser.role
        }, process.env.ACCESS_KEY, { expiresIn: '7d' })
        //SAVE REFRESH TOKEN TO DB
        await User.updateOne(
            { email: existingUser.email },
            { $set: { refreshToken: refreshToken } }
        )
        res.cookie("accessToken", accessToken, { httpOnly: true, domain: "localhost", path: "/api", maxAge: 60 * 60 * 1000, sameSite: "none", secure: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, domain: "localhost", path: '/api', maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
        res.status(200).json({ 
            "data": { 
                accessToken: accessToken, 
                refreshToken: refreshToken 
            } 
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

/**
 * Perform logout
  - Auth type: Simple
  - Request Body Content: None
  - Response `data` Content: A message confirming successful logout
  - Optional behavior:
    - error 400 is returned if the user does not exist
 */
export const logout = async (req, res) => {
   
    try {
        const cookie = req.cookies
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(400).json({error: "user not found"})
        const user = await User.findOne({ refreshToken: refreshToken })
        if (!user) return res.status(400).json({error: 'user not found'})
        res.cookie("accessToken", "", { httpOnly: true, path: '/api', maxAge: 0, sameSite: 'none', secure: true })
        res.cookie('refreshToken', "", { httpOnly: true, path: '/api', maxAge: 0, sameSite: 'none', secure: true })
        await User.updateOne(
            { refreshToken: user.refreshToken },
            { $set: { refreshToken: null }}
        )
        return res.status(200).json({
            data: {
                message: 'logged out'
            }
        });
              
    } catch (error) {
        res.status(500).json(error)
    }

}
