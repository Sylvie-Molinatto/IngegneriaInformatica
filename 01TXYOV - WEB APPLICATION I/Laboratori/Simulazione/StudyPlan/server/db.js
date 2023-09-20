'use strict';
const sqlite = require('sqlite3');
const crypto = require('crypto');
const { Course } = require('./Course');
const {User} = require('./User')
   /**
     *  + --------------------------------------------- +
     *  |                                               |
     *  |           DATABASE: CREATION                  |
     *  |                                               |
     *  + --------------------------------------------- +
     */
    const courses = [
      new Course('02GOLOV','Architetture dei sistemi di elaborazione',12,0,null,['02LSEOV'],null),
      new Course('02LSEOV','Computer architectures',12,0,null,['02GOLOV'],null),
      new Course('01SQJOV','Data Science and Database Technology',8,0,null,['01SQMOV','01SQLOV'],null),
      new Course('01SQMOV','Data Science e Tecnologie per le Basi di Dati',8,0,null,['01SQJOV','01SQLOV'],null),
      new Course('01SQLOV','Database systems ',8,0,null,['01SQJOV','01SQMOV'],null),
      new Course('01OTWOV','Computer network technologies and services',6,0,3,['02KPNOV'],null),
      new Course('02KPNOV','Tecnologie e servizi di rete ',6,0,3,['01OTWOV'],null),
      new Course('01TYMOV','Information systems security services ',12,0,null,['01UDUOV'],null),
      new Course('01UDUOV','Sicurezza dei sistemi informativi',12,0,null,['01TYMOV'],null),
      new Course('05BIDOV','Ingegneria del software ',6,0,null,['04GSPOV'],'02GOLOV'),
      new Course('04GSPOV','Software engineering',6,0,null,['05BIDOV'],'02LSEOV'),
      new Course('01UDFOV','Applicazioni Web I',6,0,null,['01TXYOV'],null),
      new Course('01TXYOV','Web Applications I',6,0,3,['01UDFOV'],null),
      new Course('01TXSOV','Web Applications II',6,0,null,[],'01TXYOV'),
      new Course('02GRSOV','Programmazione di sistema',6,0,null,['01NYHOV'],null),
      new Course('01NYHOV','System and device programming',6,0,3,['02GRSOV'],null),
      new Course('01SQOOV','Reti Locali e Data Center',6,0,null,[],null),
      new Course('01TYDOV','Software networking',7,0,null,[],null),
      new Course('03UEWOV','Challenge',5,0,null,[],null),
      new Course('01URROV','Computational intelligence',6,0,null,[],null),
      new Course('01OUZPD','Model based software design',4,0,null,[],null),
      new Course('01URSPD','Internet Video Streaming',2,0,null,[],null),
    ]


const users = [
  new User("Fabio","Stani","s0001","s0001@studenti.polito.it","password"),
  new User("Andrea","Scotti","s0002","s0002@studenti.polito.it","password"),
  new User("Tom","Jerry","s0003", "s0003@studenti.polito.it","password"),
  new User("Michele","Peroni","s0004","s0004@studenti.polito.it","password"),
  new User("Parnit","Singh","s0005","s0005@studenti.polito.it","password"),
]
function getIncompatibleCourses(){
    let incompatibleCourses=[];
     courses.forEach((course)=>{
      course.incompatibleWith.map((incompatibleCourse)=>{
        if(incompatibleCourses.filter((element)=>element.code1 === course.code && element.code2 === incompatibleCourse).length===0
        && incompatibleCourses.filter((element)=>element.code2 === course.code && element.code1 === incompatibleCourse).length===0)
          incompatibleCourses.push({code1: course.code, code2: incompatibleCourse})
      })
    })
    return incompatibleCourses;
  }

exports.database = function createDatabase(){
  const db = new sqlite.Database('database.sqlite', (err) => {
          if (err) throw err;});
   
    createTableCourses();
    createTableIncompatibleCourses();
    createTableUsers();
    createTableStudyPlan();
    createTableCoursesStudyPlan();
    
   

    /* ----- TABLES CREATION ----- */
      async function createTableCourses(){
        await new Promise(async (resolve, reject) => {
          const sql = ` CREATE TABLE IF NOT EXISTS COURSE( \
                          code VARCHAR(7),\
                          name VARCHAR(30),\
                          credits INTEGER,\
                          studentsEnrolled INTEGER,\
                          maxStudents INTEGER,\
                          preparatoryCourse VARCHAR(7),\
                          PRIMARY KEY(code)
                          )`;
         db.run(sql, function( error){
              if(error){
                console.log(error)
                  reject(error);     
              }else{
                resolve(this.lastID);
              }
            });
          
        });
        await insertCourses(); 
      } 
      async function dropTableCourses(){
        await new Promise(async (resolve, reject) => {
          const sql = ` DROP TABLE IF EXISTS COURSE`;
         db.run(sql, function( error){
              if(error){
                console.log(error)
                  reject(error);     
              }else{
                resolve(this.lastID);
              }
            });
          
        });       
      } 

      async function createTableIncompatibleCourses(){
        await new Promise( async(resolve, reject) => {
          const sql = ` CREATE TABLE IF NOT EXISTS INCOMPATIBLE_COURSES( \
                          code1 VARCHAR(7),\
                          code2 VARCHAR(7),\
                          PRIMARY KEY(code1,code2),
                          FOREIGN KEY(code1) REFERENCES COURSE(code),
                          FOREIGN KEY(code2) REFERENCES COURSE(code)
                          )`;
          db.run(sql, function(error){
              if(error){
                console.log(error)
                  reject(error);   
              }else{
                resolve(this.lastID);
              }
            });
        });
        await insertIncompatibleCourses();      
      }

      async function createTableUsers(){
        await new Promise( async(resolve, reject) => {
          const sql = ` CREATE TABLE IF NOT EXISTS USERS( \
                          id VARCHAR(5),\
                          mail VARCHAR(14),\
                          name VARCHAR(7),\
                          surname VARCHAR(7),\
                          password VARCHAR(32),
                          salt VARCHAR(16),
                          PRIMARY KEY(id)
                          
                          )`;
          db.run(sql, function(error){
              if(error){
                console.log(error)
                  reject(error);   
              }else{
                resolve(this.lastID);
              }
            });
        });
        await insertUser();      
      }
      async function createTableCoursesStudyPlan(){
        await new Promise( async(resolve, reject) => {
          const sql = ` CREATE TABLE IF NOT EXISTS COURSES_STUDY_PLAN( \
                          id VARCHAR(5),\
                          codeCourse VARCHAR(7),\
                          PRIMARY KEY(id,codeCourse)                        
                          )`;
          db.run(sql, function(error){
              if(error){
                console.log(error)
                  reject(error);   
              }else{
                resolve(this.lastID);
              }
            });
        });
        InitializeStudyPlan();
      }

      async function createTableStudyPlan(){
        await new Promise( async(resolve, reject) => {
          const sql = ` CREATE TABLE IF NOT EXISTS STUDY_PLAN( \
                          id VARCHAR(5),\
                          type VARCHAR(10),\
                          credits INTEGER,
                          PRIMARY KEY(id)                        
                          )`;
          db.run(sql, function(error){
              if(error){
                console.log(error)
                  reject(error);   
              }else{
                resolve(this.lastID);
              }
            });
        });
        
      }


      async function insertCourses() {
        courses.forEach( async (course)=>{ 
          await new Promise((resolve,reject) => {
          const sql = `INSERT OR IGNORE INTO COURSE(code,name,credits,studentsEnrolled,maxStudents,preparatoryCourse) \
                      VALUES(?,?,?,?,?,?)`;

            //console.log(course);
            db.run(sql,[course.code, course.name, course.credits,course.enrolledStudents,course.maxStudents,course.preparatoryCourse],function(error){
            if(error){
              console.log(error)
              reject(error);
            }else{
              resolve(this.lastID);
            }
          });
        })
      })
    }

    async function InitializeStudyPlan() {
      users.forEach( async (user)=>{ 
        await new Promise((resolve,reject) => {
        const sql = `INSERT OR IGNORE INTO STUDY_PLAN(id,type,credits) \
                    VALUES(?,?,?)`;

          
          db.run(sql,[user.id,"",0],function(error){
          if(error){
            console.log(error)
            reject(error);
          }else{
            resolve(this.lastID);
          }
        });
      })
    })
  }


    async function insertIncompatibleCourses() {
      getIncompatibleCourses().forEach( async (element)=>{ 
        await new Promise((resolve,reject) => {
        const sql = `INSERT OR IGNORE INTO INCOMPATIBLE_COURSES(code1,code2) \
                    VALUES(?,?)`;

          
          db.run(sql,[element.code1,element.code2],function(error){
          if(error){
            console.log(error)
            reject(error);
          }else{
            resolve(this.lastID);
          }
        });
      })
    })
  }

  async function insertUser() {
    users.forEach(async (user)=>{
      await new Promise((resolve, reject) => {
        const sql = "INSERT OR IGNORE INTO USERS(id,name,surname, mail, password, salt) VALUES(?,?,?,?,?,?)";
        const salt = crypto.randomBytes(8).toString('hex');
        crypto.scrypt(user.password, salt, 32, function(err, hashedPassword){
            if(err){
                reject(err);
            }else{
                db.run(sql, [user.id,user.name, user.surname, user.mail, hashedPassword.toString('hex'), salt], function(err){
                    if(err){
                        reject(err);
                    }else{
                        resolve(this.lastId);
                    }
                })
            }
        });
    })
   
  });
}


      

    return db;

}

