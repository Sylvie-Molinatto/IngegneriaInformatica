const express = require('express');
const morgan = require('morgan'); // logging middleware
const dao = require('./course-dao'); // module for accessing the DB
const userDao = require('./user-dao'); // module for accessing the DB
const cors = require('cors');
const { validationHandler } = require("./Validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // for parsing json request body
// set up and enable cors
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

/*** APIs ***/
// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});


passport.deserializeUser(async (user, done) => {
  //we double check that the user is still in the database although it mustn't happen since we don't delete any user
  const result = await userDao.deserializeUser(user.id);
  if (!result.status)
    return done(result.error, null)
  else
    return done(null, result.result);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));
// GET /api/courses
app.get('/api/courses', (req, response)=>{
  dao.listCourses()
  .then(courses => response.json(courses))
  .catch(() => response.status(500).end());
});

app.get('/api/courses/:code',async (req, response)=>{
  try{
    const result = await dao.getCourseByCode(req.params.code)
    if(result.length===0){
      return response.status(404).json("Course not found");
    }
    return response.status(200).json(result)
  }catch(err){
    console.log(err)
    return response.status(500).end()}
    
});



app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err)
      return res.status(403).send(err);

    if (!user)
      return res.status(404).send('Wrong credentials');

    req.login(user, function (err) {
      if (err)
        return res.status(500).send(err);
      return res.status(201).send(req.user);
    });
  })(req, res, next);
});


app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
      res.status(204).end();
  });
});

app.get('/api/sessions/current', async (req, res) => {


  if(req.isAuthenticated()) {
    try{
    const studyPlan = await userDao.getStudyPlan(req.user.id);
    res.json({...req.user, type: studyPlan.type, credits: studyPlan.credits});
    }catch(error){
      throw error;
    }}
  else
    //res.json('')
    res.status(401).json({error: 'Not authenticated'});

});


app.get('/api/studyPlan/:id', [
  param('id').isLength({min: 5, max: 5}), 
],
validationHandler,async (req,response)=>{
 
  try{
      const result = await userDao.getStudyPlan(req.params.id)
      if(result){
        return response.status(200).json(result)
      }else{
        return response.status(404).json('Not Found')
      }
      
  }catch(err){
    response.status(500).end()
  }
 
});






app.put('/api/studyPlan/:id', [
  param('id').isLength({min: 5, max: 5}), 
  body().custom(value => {   
    
    if (value.type === undefined) {
      
    throw new Error('Missing parameters');
    } else if (value.credits ===undefined) {
     
    throw new Error('Missing parameters');
    }
    
    return true;
    })
],
validationHandler,async (req,response)=>{
  if(!req.user || req.user.id!==req.params.id){
    return response.status(401).end();
  }
  try{
    const res = await userDao.updateStudyPlan(req.params.id, req.body.type,req.body.credits);
    response.status(res.code).json(res.message);
  }catch(err){
    response.status(500).end();
}});

app.get('/api/studyPlan/:id/courses',  [
  param('id').isLength({min: 5, max: 5}), 
],
validationHandler,async (req,response)=>{
  if(!req.user || req.user.id!==req.params.id){
    return response.status(401).end();
  }
  try{
    const result = await userDao.getCoursesOfStudyPlan(req.params.id)
    if(result)
      return response.status(200).json(result)
    else return response.status(404).json("Not Found")
  }catch(err){
    response.status(500).end();
  }
});



app.delete('/api/studyPlan/:id/courses' ,[
  param('id').isLength({min: 5, max: 5}),   
  body().custom(value => {   
    
   if (value.courses ===undefined) {
     
    throw new Error('Missing parameters');
    }
    
    return true;
    }),
    body().custom(value => {
      
          value.courses.forEach((course) => {
              if (course.code.length!==7) {
                  throw new Error('Unprocessable Entity');
              } else if (course.preparatoryCourse===undefined) {
                  throw new Error('Unprocessable Entity');
              } 
          });
      
      return true;
  })
  
],
validationHandler,async (req,response)=>{
  if(!req.user || req.user.id!==req.params.id){
    return response.status(401).end();
  }
  try{
    const res =  await userDao.deleteCoursesFromStudyPlan(req.params.id,req.body.courses)
    response.status(res.code).json(res.message)
  }catch(err){
    console.log(err)
    response.status(500).end();
  }
});


app.put('/api/studyPlan/:id/courses' ,[
  param('id').isLength({min: 5, max: 5}), 
  body().custom(value => {   
    /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
    if (value.courses ===undefined) {
     
    throw new Error('Missing parameters');
    }
    
    return true;
    }),
    body().custom(value => {
      
          value.courses.forEach((course) => {
              if (course.code.length!==7) {
                  throw new Error('Unprocessable Entity');
              } else if (course.incompatibleWith===undefined || course.preparatoryCourse===undefined) {
                  throw new Error('Unprocessable Entity');
              } 
          });
      
      return true;
  })
  
],
validationHandler,async (req,response)=>{
  if(!req.user || req.user.id!==req.params.id){
    return response.status(401).end();
  }
  try{
    const res =  await userDao.updateCoursesOfStudyPlan(req.params.id,req.body.courses)
    response.status(res.code).json(res.message)
  }catch(err){
    console.log(err)
    response.status(500).end();
  }
});


// activate the server
app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));