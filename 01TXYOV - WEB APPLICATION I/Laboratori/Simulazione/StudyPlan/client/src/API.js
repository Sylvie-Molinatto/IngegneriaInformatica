import Course from './Course';

const SERVER_URL = 'http://localhost:3001';

const getAllCourses = async () => {
  const response = await fetch(SERVER_URL + '/api/courses');
  const coursesJson = await response.json();
  if(response.ok) {
    return coursesJson.map(course => new Course(course.code, course.name, course.credits,course.enrolledStudents, course.maxStudents, course.incompatibleWith, course.preparatoryCourse));
  }
  else
    throw coursesJson;
};

const getCourseByCode = async(code) => {
  const response = await fetch(SERVER_URL + `/api/courses/${code}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const coursesJson = await response.json();
  if(response.ok) {
    return coursesJson.map(course => new Course(course.code, course.name, course.credits,course.enrolledStudents, course.maxStudents, course.incompatibleWith, course.preparatoryCourse));
  }
  else{
    throw coursesJson;
  }
};

const logIn = async (credentials) => {
  
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const getStudyPlan = async(id) => {
  const response = await fetch(SERVER_URL + '/api/studyPlan/'+id,{
    credentials: 'include'
  });
  const studyPlan = await response.json();
  if(response.ok){
    return studyPlan;
  }else{
    throw studyPlan;
  }
}

const getCoursesOfStudyPlan = async(id) => {
  const response = await fetch(SERVER_URL + '/api/studyPlan/'+id+'/courses',{
    credentials: 'include'
  });
  const coursesJson = await response.json();

  if(response.ok) {
    const res = coursesJson.map(course => new Course(course.code, course.name, course.credits,course.enrolledStudents, course.maxStudents, course.incompatibleWith, course.preparatoryCourse));
    return res
  }
  else
    throw coursesJson;
}


/*const addCoursesToStudyPlan = async(id,courses)=>{
  const res = await fetch(SERVER_URL + '/api/studyPlan/'+id+'/courses' , {
    credentials: 'include',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id, courses})
  });
  if(!res.ok){
    const errMessage = await res.json();
    throw errMessage;
  }
  else return null;
}*/
const deleteCoursesFromStudyPlan = async(id, courses)=>{
  const res = await fetch(SERVER_URL + '/api/studyPlan/'+id+'/courses' , {
    credentials: 'include',
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id, courses})
  });
  if(!res.ok){
    const errMessage = await res.json();
    throw errMessage;
  }
  else return null;
}

const updateCoursesOfStudyPlan = async(id,courses)=>{
  const res = await fetch(SERVER_URL + '/api/studyPlan/'+id+'/courses' , {
    credentials: 'include',
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id, courses})
  });
  if(!res.ok){
    const errMessage = await res.json();
    throw errMessage;
  }
  else return null;
}



const updateStudyPlan = async(id,type,credits)=>{
  const res = await fetch(SERVER_URL + '/api/studyPlan/'+id,{
  credentials: 'include',
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({type:type, credits:credits})
  })
  if(!res.ok){
    const errMessage = await res.json();
    throw errMessage;
  }
  else return null;
}
const API = {getAllCourses, getCourseByCode,logIn,logOut,getUserInfo,getStudyPlan, updateCoursesOfStudyPlan, deleteCoursesFromStudyPlan, updateStudyPlan, getCoursesOfStudyPlan};
export default API;