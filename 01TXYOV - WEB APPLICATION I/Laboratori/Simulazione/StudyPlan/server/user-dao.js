'use strict';


const { database } = require('./db');
const { Course } = require('./Course');
const db = new database();
const crypto = require('crypto');
const dao = require('./course-dao'); // module for accessing the DB

exports.getUser = (id, password) => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM USERS U, STUDY_PLAN S WHERE U.id = ? AND U.id=S.id';
    db.get(sql, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id,  name: row.name, surname: row.surname, mail: row.mail, type : row.type, credits: row.credits};
        
        crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};


// Deserialization

exports.deserializeUser = async (id) => {
  const query = "SELECT * FROM USERS U, STUDY_PLAN S WHERE U.id = ? AND U.id=S.id";
  return new Promise((res, rej) => {
      db.get(query, [id], (err, row) => {
          if (err)
              res({ status: false, error: err });
          else if(row===undefined)
              res({status: false, error: "Not Found"})
          else res({
              status: true, result:  {id: row.id,  name: row.name, surname: row.surname, mail: row.mail, type : row.type, credits: row.credits}
          });
      });
  });
}

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USERS WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({error: 'User not found!'}); 
      }
      else {
        const user = {id: row.id,  name: row.name, surname: row.surname, mail: row.mail, type : row.type, credits: row.credits};
        resolve(user);
      }
    });
  });
};

exports.getStudyPlan =  async (id) => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM STUDY_PLAN WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else{ 
       
          resolve(row)
       
      }
    });
  });
  
};


exports.addCourseToStudyPlan = (id, codeCourse) => {


  return new Promise((resolve, reject) => {
        let sql = 'INSERT OR IGNORE INTO COURSES_STUDY_PLAN(id, codeCourse) VALUES(?, ?)';
        db.run(sql, [id, codeCourse], (err) => {
          if(err){
            reject(err);
          }
          else{
            resolve(this.changes);
          }
        });
  });
}



exports.deleteCourseFromStudyPlan = (id, codeCourse) => {
  return new Promise((resolve, reject) =>{
    let sql = 'DELETE FROM COURSES_STUDY_PLAN WHERE id = ? AND codeCourse = ?';
    db.run(sql, [id, codeCourse], (err) => {
      if(err){
        reject(err);
      }
      else{
        resolve();
      }
    });
  });
}


exports.deleteStudyPlan = async (id) => {
  await new Promise((resolve, reject) => {
    const sql = 'UPDATE STUDY_PLAN SET type=?, credits=? WHERE id=?';
    db.run(sql, ["", 0, id], (err) => {
      if(err){
        reject(err);
      }
      else{
        resolve(this.changes);
      }
    });
  });

  await new Promise((resolve,reject)=>{
    const sql = 'DELETE COURSES_STUDY_PLAN WHERE id=?';
    db.run(sql,[id],(err)=>{
      if(err){
        reject(err);
      }
      else{
        resolve(this.changes);
      }
    });
  });

}

exports.deleteCoursesFromStudyPlan = async(id,courses)=>{
  
  const result = await Promise.all(courses.map(async(course)=>{

    try{
      const res = await dao.getCourseByCode(course.code);
      
      if(res.length==0){
        return {code: 404, course: course.code}
      }

      await this.deleteCourseFromStudyPlan(id,course.code);
      await dao.modifyCourseStudentsDetailed(course.code,+1);
      return {code:204}
    }catch(err){
      throw err
    }
    
      
  })

  ).then(result=>{
    const exception = result.find((res)=>res.code===404);
    if(exception){
      
      return {code:404,message:`Course ${exception.course} not found`}
    }
    else return {code:204,message:"success"}
  })

  let sum = 0;
  const studyPlan = await this.getStudyPlan(id);
  const coursesSaved = await this.getCoursesOfStudyPlan(id)
  coursesSaved.forEach((course)=>{
    sum += course.credits;
  })
  if(sum!==studyPlan.credits){
    return {code: 500, message:"StudyPlan not saved properly"}
  }


  return result;

}


exports.updateCoursesOfStudyPlan = async (id,courses) => {
  let coursesCopydb = await this.getCoursesOfStudyPlan(id);

  const coursesTobeAdded = courses.filter(n => !coursesCopydb.find(obj => {
    return n.code === obj.code;
  }) );

  const coursesToBeDeleted = coursesCopydb.filter(n => !courses.find(obj => {
    return n.code === obj.code;
}) );

  
  if(coursesTobeAdded.length!==0){
    
    if(coursesTobeAdded.find((courseAdded)=>{
      return courseAdded.maxStudents === 0 ||
      courseAdded.incompatibleWith.find(incompatibleCourse=>{
        return courses.find(course=>{ return incompatibleCourse===course.code})!==undefined
      })
    })){
      return {code: 422, message: "Course constraints not satisfied"}
    }
    if(coursesTobeAdded.find((courseAdded)=>{
      return courseAdded.preparatoryCourse!==null && courses.find(course=>
        {return courseAdded.preparatoryCourse===course.code})===undefined
    })){
      return {code: 422, message: "Course constraints not satisfied"}
    }
    
    try{
        const result = await this.addCoursesToStudyPlan(id,coursesTobeAdded)
        if(result.code!==201){
          return result;
        }
        
      }catch(error){

        throw error

      }
  }
  



    if(coursesToBeDeleted.length!==0){
      if(coursesToBeDeleted.find(courseToBeDeleted=> {return courses.find(course=>{return course.preparatoryCourse===courseToBeDeleted})})){
        return {code: 422, message: "Course constraints not satisfied"}
      }
      try{
        const result = await this.deleteCoursesFromStudyPlan(id,coursesToBeDeleted)
        if(result.code!==204){
          return result;
        }
        
      }catch(error){

        throw error

      }
    }

    return {code:200, message: "Success"}


}
exports.addCoursesToStudyPlan = async (id,courses) =>{

    const result = await Promise.all(courses.map(async(course)=>{

      try{
        const res = await dao.getCourseByCode(course.code);
        
        if(res.length==0){
          return {code: 404, course: course.code}
        }

        await this.addCourseToStudyPlan(id,course.code);
        await dao.modifyCourseStudentsDetailed(course.code,-1);
        return {code:201}
      }catch(err){
        throw err
      }
      
        
    })

    ).then(result=>{
      const exception = result.find((res)=>res.code===404);
      if(exception){
        
        return {code:404,message:`Course ${exception.course} not found`}
      }
      else return {code:201,message:"success"}
    })

       
   
    return result;
    
}


exports.updateStudyPlan = async (id,type,credits) => {

  if(type==="PART-TIME" && (credits<20||credits>40)){
    return {code: 422, message: "Credits constraints not satisfied"}
  }
  if(type==="FULL-TIME" && (credits<60|| credits>80)){
    return {code: 422, message: "Credits constraints not satisfied"}
  }
  if(type==="" && credits!==0){
    return {code: 422, message: "Credits constraints not satisfied"}
  }
  

  try{
    const changes = await  new Promise((resolve, reject) => {
      let sql = 'UPDATE STUDY_PLAN SET type = ? , credits=? WHERE id = ?';

      db.run(sql, [type, credits, id], (err) => {
        if(err){
          reject(err);
        }
        else{
          resolve(this.changes);
        }
      });
    });
    if(changes===0){
      return {code:404, message: "Study plan associated to the user does not exist"}
    }
    return {code:200, message: ""}

  }catch(err){
    throw err;
  }
}

exports.getCoursesOfStudyPlan =  async (id) => {
  let courses = await new Promise((resolve, reject) => {
    let sql = 'SELECT codeCourse FROM COURSES_STUDY_PLAN WHERE id = ?';
    db.all(sql, [id], (err, rows) => {
      if (err) { 
        reject(err); 
      }
      else{ 
        resolve(rows); 
      }
    });
  });


  const coursesRes = await Promise.all(courses.map(async (course)=>{
   
    const res = await dao.getCourseByCode(course.codeCourse)

    return res[0]

  }))

  return coursesRes.sort((a,b)=>a.name-b.name)
  
};

exports.addStudyPlan =  (id, studyPlan, credits) => {
  /*if(studyPlan==="FULL-TIME")
    studyPlan=true
  else studyPlan=false;*/
  return new Promise((resolve, reject) => {
    let sql = 'INSERT INTO STUDY_PLAN(id,type,credits) VALUES(?,?,?)';
    db.run(sql, [id,studyPlan,credits], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else{ 
        resolve(row); 
      }
    });
  });
  
};
