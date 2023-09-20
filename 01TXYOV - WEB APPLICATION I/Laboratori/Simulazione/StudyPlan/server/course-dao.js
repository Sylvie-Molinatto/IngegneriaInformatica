'use strict';
/* Data Access Object (DAO) module for accessing courses */

const { database } = require('./db');
const db = new database();

const { Course } = require('./Course');

exports.listCourses = async () => {
  let courses = await new Promise((resolve, reject) => {
    const sql =`SELECT *  \
                FROM COURSE
                ORDER BY name \ `;
    db.all(sql, [], (err, rows) => {
      if(err)
        reject(err);
      else {
        const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.studentsEnrolled, row.maxStudents, [], row.preparatoryCourse));
        resolve(courses);
      }
    });

  });
  await Promise.all(courses.map( async (course) => {
    let incompatibleCourses = await new Promise((resolve,reject)=>{
      const sql = `SELECT code2   
                  FROM INCOMPATIBLE_COURSES
                  WHERE code1==?`;
      db.all(sql,[course.code],(err,rows)=>{
        if(err){
          console.log(err);
          reject(err);
        }
         
        else{
          const incompatibleCourses = rows.map(row=> row.code2);
          resolve(incompatibleCourses);
        }
      })
      
    })

  let result = await new Promise((resolve,reject)=>{
    const sql = `SELECT code1   
                FROM INCOMPATIBLE_COURSES
                WHERE code2==?`;
    db.all(sql,[course.code],(err,rows)=>{
      if(err){
        console.log(err)
        reject(err);
      }
        
      else{
        const result = rows.map(row=> row.code1);
        resolve(result);
      }
    })
    
  });
  course.incompatibleWith = incompatibleCourses.concat(result);
  return course;
  }));


  return courses;

};

exports.getCourseByCode = async (Coursecode) => {
  let courses = await new Promise((resolve, reject) => {
    const sql =`SELECT *  \
                FROM COURSE
                WHERE code LIKE ?
                ORDER BY name \ `;
    db.all(sql, [`%${Coursecode}%`], (err, rows) => {
      if(err){
        console.log(err)
        reject(err);
      }
      else {
       
        const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.studentsEnrolled, row.maxStudents, [], row.preparatoryCourse));
        resolve(courses);
      }
    });

  });
  await Promise.all(courses.map( async (course) => {
    let incompatibleCourses = await new Promise((resolve,reject)=>{
      const sql = `SELECT code2   
                  FROM INCOMPATIBLE_COURSES
                  WHERE code1==?`;
      db.all(sql,[course.code],(err,rows)=>{
        if(err){
          console.log(err);
          reject(err);
        }
         
        else{
          const incompatibleCourses = rows.map(row=> row.code2);
          resolve(incompatibleCourses);
        }
      })
      
    })

  let result = await new Promise((resolve,reject)=>{
    const sql = `SELECT code1   
                FROM INCOMPATIBLE_COURSES
                WHERE code2==?`;
    db.all(sql,[course.code],(err,rows)=>{
      if(err){
        console.log(err)
        reject(err);
      }
        
      else{
        const result = rows.map(row=> row.code1);
        
        resolve(result);
      }
    })
    
  });
  course.incompatibleWith = incompatibleCourses.concat(result);
  return course;
  }));

  
  
  return courses;
  

};

exports.modifyCourseStudentsDetailed = async(code,number)=>{
 
  await new Promise((resolve, reject) => {
    const sql =`UPDATE COURSE \
                SET maxStudents = maxStudents+?\
                WHERE code=? AND maxStudents IS NOT NULL \ `;
    
    db.run(sql, [number,code], (err, rows) => {
      if(err)
        reject(err);
      else {
        resolve(this.changes);
      }
    });

  });

  await new Promise((resolve, reject) => {
    const sql =`UPDATE COURSE \
                SET studentsEnrolled = studentsEnrolled+? \
                WHERE code=? \ `;
    console.log(-number)
                db.run(sql, [-number,code], (err, rows) => {
      if(err)
        reject(err);
      else {
        resolve(this.changes);
      }
    });

  });

}

