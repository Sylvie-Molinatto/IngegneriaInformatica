'use strict';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';
import { useEffect, useState } from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import { Container} from 'react-bootstrap';
import { CourseRoute, DefaultRoute, Layout, SearchRoute,LoginRoute, HomePageLoggedIn, EditStudyPlan } from './components/CourseViews';
import API from './API';
import {LoadingSpinner} from "./components/LoadingSpinner";


function App() {
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState('');
  const [CoursesOfStudyPlan, setCoursesOfStudyPlan] = useState([]);
  const [studyPlan,setStudyPlan] = useState('');
  const [credits, setCredits] = useState(0);
  const [dirty,setDirty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar(value => !value);
  }


  useEffect(() => {
    if(loggedIn){
      setDirty(true);  
    }
    
  }, [loggedIn]);



  
  useEffect(() => {
    const checkAuth = async () => {
      try{
        const user = await API.getUserInfo(); // we have the user info here
        setLoggedUser(user);
        setStudyPlan(user.type);
        setCredits(user.credits);
        
        if(user){
          setIsLoading(true);
          setLoggedIn(true);   
        }

      }catch(error){
        console.log(error)
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);  
      setLoggedUser(user);
      setStudyPlan(user.type);
      setCredits(user.credits);
      setLoggedIn(true);
      setIsLoading(true);
      toast.success(`Welcome, ${user.name}`, {position: "top-center"});
    }catch(err) {
      toast.error(`Incorrect username and/or password`, { position: "top-center" },{toastId: 1});
    }
  }

  const handleLogout = async () => {
    try {
      await API.logOut();
      toast.success(`Good bye, ${loggedUser.name}`, {position: "top-center"});
      setLoggedUser('');
      setLoggedIn(false);
    }catch(err) {
      toast.error(`LogOut error`, { position: "top-center" },{toastId: 1});
    }
  }




  useEffect(()=>{
    const getCourses = async() => {
      const courses = await API.getAllCourses();
      setCourses(courses);
    };
    const getCoursesOfStudyPlan = async(id) => {
      let courses = await API.getCoursesOfStudyPlan(id);
      setCoursesOfStudyPlan(courses.sort((a,b)=>a.name.localeCompare(b.name)))
    };

    setIsLoading(true);
    if(dirty){

      if(studyPlan){
        getCoursesOfStudyPlan(loggedUser.id)  
      }else{
        setCoursesOfStudyPlan([]);
      } 
        
    getCourses();
        
    setDirty(false)
    setIsLoading(false);
        
    }
    
  },[dirty,loggedUser.id,studyPlan])

 

  return (
    <Container fluid>
        <Routes>
          <Route path='/' element={ <Layout handleLogout = {handleLogout} toggleSidebar={toggleSidebar} setCredits = {setCredits} setDirty={setDirty} loggedUser = {loggedUser} setStudyPlan = {setStudyPlan} />} >
            
          <Route index element={isLoading? loggedIn ? <HomePageLoggedIn id={loggedUser.id} setCourses={setCourses} allCourses={courses} courses={CoursesOfStudyPlan} studyPlan={studyPlan}  setCoursesOfStudyPlan={setCoursesOfStudyPlan} setStudyPlan={setStudyPlan} />  :
           <CourseRoute   courses={courses}   /> : <LoadingSpinner/>}/>
          <Route path='/search/:code' element={ <SearchRoute/>} />
          <Route path='/Login' element={isLoading ? loggedIn? <Navigate replace to='/Home' /> : <LoginRoute login={handleLogin} /> : <LoadingSpinner />} />
          <Route path='/Home' element={isLoading? loggedIn? <HomePageLoggedIn isLoading={isLoading} loggedUser={loggedUser} showSidebar={showSidebar} setIsLoading={setIsLoading} setCredits={setCredits} setCourses={setCourses} setDirty={setDirty} allCourses={courses} setCoursesOfStudyPlan={setCoursesOfStudyPlan} setStudyPlan={setStudyPlan}   id={loggedUser.id}  dirty={dirty} credits={credits} courses={CoursesOfStudyPlan} studyPlan={studyPlan}  />  
          : <CourseRoute courses={courses} tableTitle={'All Courses'}  /> : <LoadingSpinner />} />
          <Route path='/editStudyPlan' element={isLoading? loggedIn? <EditStudyPlan loggedUser={loggedUser} showSidebar={showSidebar} setStudyPlan = {setStudyPlan} setDirty={setDirty} dirty={dirty} setCoursesOfStudyPlan={setCoursesOfStudyPlan}  setCredits = {setCredits} courses={CoursesOfStudyPlan} allCourses={courses} studyPlan={studyPlan}  credits={credits} id={loggedUser.id}  />: <Navigate replace to='/Login' /> : <LoadingSpinner />} />
          <Route path='*' element={ <DefaultRoute/> } />
        </Route>
      </Routes>
    </Container>
    
  );
}

export default App;
