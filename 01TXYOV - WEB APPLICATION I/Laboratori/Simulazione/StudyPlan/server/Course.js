'use strict';

/**
 * Constructor function for new Exam objects
 * @param {string} code course code (e.g., '02GOLOV')
 * @param {string} name course name
 * @param {number} credits number of credits (e.g., 6)
 * @param {number} maxStudents number of maxStudents (e.g., 3)
 * @param {number} enorlledStudents number of enrolledStudents (e.g., 2)
 * @param {object}  incompatibleWith code of course incompatible
 * @param {string} preparatoryCourse code of course preparatory
 * 
**/
function Course (code, name, credits, enrolledStudents=0, maxStudents, incompatibleWith = [], preparatoryCourse = null ) {
    this.code = code;
    this.name = name;
    this.credits=credits;
    this.maxStudents = maxStudents;
    this.enrolledStudents = enrolledStudents;
    this.incompatibleWith = [...incompatibleWith];
    this.preparatoryCourse = preparatoryCourse;
}

exports.Course = Course;