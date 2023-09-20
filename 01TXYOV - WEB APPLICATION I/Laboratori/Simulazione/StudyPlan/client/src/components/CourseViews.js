import { useEffect, useState } from 'react';
import { Row, Col, Button, Container} from 'react-bootstrap';
import {CourseNavbar} from './CourseNavbar';
import {CourseTable} from './CourseTable';
import { Sidebar } from './UserSidebar';
import { useNavigate, Outlet } from "react-router-dom";
import { useParams} from "react-router-dom"
import { LoginForm } from './AuthComponents';
import {StudyPlanCreate} from './StudyPlanCreate'
import API from '../API';
import { StudyPlanDisplay } from './StudyPlanDisplay';
import { StudyPlanLegend } from './StudyPlanLegend';
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import './style.css'

let typeStudyPlan = new Map();
typeStudyPlan.set("PART-TIME",{Min:20,Max:40}) 
typeStudyPlan.set("FULL-TIME",{Min:60,Max:80}) 

function DefaultRoute() {
  return(
    <>
      <Row>
        <Col>
          <h1>Nothing here...</h1>
          <p>This is not the route you are looking for!</p>
        </Col>
      </Row>
    </>
  );
}

function Layout(props){
  return(
    <>
    <Row>
      <CourseNavbar toggleSidebar={props.toggleSidebar} handleLogout = {props.handleLogout} loggedUser = {props.loggedUser} setDirty={props.setDirty} setCredits={props.setCredits} setStudyPlan={props.setStudyPlan}/>  
      <ToastContainer />
    </Row>
    <Outlet />
  </>
  );
}



function CourseRoute(props) {

  return(
    <>
    <Container fluid className='mt-3 float-left' id="float-container">
      <Row>
        <Col>
          <CourseTable courses={props.courses} tableTitle={'All Courses'} />
        </Col>
      </Row>
    </Container>
    </>
  );
}

function SearchRoute() {


  let params = useParams();

  const [filteredCourses,setFilteredCourses]= useState([])
  useEffect(()=>{
    
      const searchCourse = async (code) => {
        try{
          const courses = await API.getCourseByCode(code);
          setFilteredCourses(courses);
        }catch(error){
          toast.error(error, { position: "top-center" })
        }
      }
    searchCourse(params.code);
  },[params.code])

  return(
    <>
    <Container fluid className='mt-3 float-left' id="float-container">
      <Row>
        <Col>
          <CourseTable courses={filteredCourses} tableTitle={`Search for ${params.code}`} />
        </Col>
      </Row>
    </Container>
    </>
  );
}


function LoginRoute(props) {
  return(
    <>
    <Container fluid className='mt-3 float-left' id="float-container">
      <LoginForm login={props.login} />
    </Container>
    </>
  );
}
function EditStudyPlan(props){

  const navigate = useNavigate();
  if(!props.studyPlan){
    navigate('/Home')
  }
  
  const allCourses = props.allCourses.filter(n =>  !props.courses.find(obj => {
    return n.code === obj.code;
    }) );

  
  const modifyStudyPlan = async (courses,id) =>{
   
    /*credits constraints */
    if(typeStudyPlan.get(props.studyPlan) && props.credits<typeStudyPlan.get(props.studyPlan).Min){
      toast.error(<div>Minimum number of credits not reached yet <br /> <strong>Actual Credits</strong>: {props.credits}<br /><strong>Needed Credits</strong>: {typeStudyPlan.get(props.studyPlan).Min-props.credits}</div>, { position: "top-center" },{ allowHtml: true });
    }else if(typeStudyPlan.get(props.studyPlan) && props.credits>typeStudyPlan.get(props.studyPlan).Max){
        toast.error(<div>Maximum number of credits overpassed <br /> <strong>Actual Credits</strong>: {props.credits } <br/><strong>Credits additional</strong>: {props.credits-typeStudyPlan.get(props.studyPlan).Max}</div>, { position: "top-center" },{ allowHtml: true });
    }else{
    try{
      
        await API.updateStudyPlan(id, props.studyPlan,props.credits)
        await API.updateCoursesOfStudyPlan(id,courses)

        toast.success(`Study Plan successfully updated`, { position: "top-center" } )    
        props.setDirty(true)
        navigate('/Home')
    }catch(error){
      toast.error(`${error}`,  { position: "top-center" })
      const studyPlan = await API.getStudyPlan(props.id);
      props.setStudyPlan(studyPlan.type);
      props.setCredits(studyPlan.credits);
      props.setDirty(true)
      navigate('/Home')
    }
  }
    
}

  const cancelModifications = async(id)=>{
    try{
      const studyPlan = await API.getStudyPlan(id);
      props.setStudyPlan(studyPlan.type);
      props.setCredits(studyPlan.credits);
      }catch(error){
        toast.error(error,{ position: "top-center" })
      }
      props.setDirty(true);
    
      navigate("/Home")

  }

  return (<>
    <ToastContainer />
    <Container fluid className='mt-3 float-left' id="float-container">
      <Row>
        <Sidebar showSidebar={props.showSidebar} studyPlan={props.studyPlan} credits={props.credits} loggedUser={props.loggedUser} />
        <Container fluid className='col-lg-8 col-md-8'>
      <Row>
      <Col>
        <StudyPlanDisplay studyPlan={props.studyPlan} typeStudyPlan={typeStudyPlan} credits={props.credits}/>
      </Col>
    </Row>
    <Row>
      <Col>
        <StudyPlanLegend />
      </Col>
    </Row>
    <Row>
      <Col>
        <CourseTable courses={props.courses} setCredits={props.setCredits} credits={props.credits} coursesOfStudyPlan = {props.courses} tableTitle={"Courses of Study Plan"} setCoursesOfStudyPlan={props.setCoursesOfStudyPlan} />
      </Col>
      <Row>
        <Container fluid  id='button' >
          <Button variant="success" onClick={()=> modifyStudyPlan(props.courses,props.id)}>Save</Button>&nbsp;
          <Button variant="danger" onClick={()=>cancelModifications(props.id)}>Cancel</Button>
        </Container>
      </Row>
    </Row>
    <Row>
      <Col>
        <CourseTable courses={allCourses} setCredits={props.setCredits} credits={props.credits} tableTitle={"All Courses"} coursesOfStudyPlan = {props.courses} setCoursesOfStudyPlan={props.setCoursesOfStudyPlan} />
      </Col>
    </Row>
    </Container>
   </Row>
  </Container>
  </>);
}

function ViewStudyPlan(props){

  const navigate = useNavigate();

  const deleteStudyPlan = async(id,courses)=>{
    try{
      await API.updateStudyPlan(id,"",0);
      await API.deleteCoursesFromStudyPlan(id,courses)
      toast.success(`Study Plan successfully deleted`, { position: "top-center" } )
    }catch(error){
      toast.error(`${error}`,  { position: "top-center" })
    }
    props.setDirty(true); 
    props.setStudyPlan('');
    props.setCoursesOfStudyPlan([]);
    navigate('/Home');
}

const submit = (id,courses) => {
  confirmAlert({
    title: 'Confirm to delete study plan',
    message: 'Are you sure to do this?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => deleteStudyPlan(id,courses)
      },
      {
        label: 'No',
        onClick: () => navigate('/Home')
      }
    ]
  });
};

    return (
    <>
    <ToastContainer />
    <Container fluid className='mt-3 float-left' id="float-container">
      <Row>
        <Sidebar showSidebar={props.showSidebar} studyPlan={props.studyPlan} credits={props.credits} loggedUser={props.loggedUser} />
        <Container fluid className='col-lg-8 col-md-8'>
        <Row>
          <Col>
            <StudyPlanDisplay studyPlan={props.studyPlan} typeStudyPlan={typeStudyPlan} credits={props.credits}/>
          </Col>
          <Row>
            <Container fluid  id='button' >
              <Button variant="danger" onClick={()=>submit(props.id,props.courses)}>Delete</Button>
            </Container>
          </Row>
        </Row>
        <Row>
          <Col>
            <CourseTable courses={props.courses} tableTitle={"Courses of Study Plan"} />
          </Col>
        <Row>
          <Container fluid  id="button"  >
            <Button variant="success" onClick={() => navigate('/editStudyPlan')}>Edit</Button>
          </Container>
        </Row>
      </Row>
      <Row>
        <Col>
          <CourseTable courses={props.allCourses} tableTitle={'All Courses'}/>
        </Col>
      </Row>
    </Container>
   </Row>
  </Container>
    
  </>);


}

function CreateStudyPlan(props){

  return(
    <>
    <Container fluid className='mt-3 float-left' id="float-container">
      <Row>
        <Sidebar showSidebar={props.showSidebar} studyPlan={props.studyPlan} credits={props.credits} loggedUser={props.loggedUser} />
        <Container fluid className='col-lg-8 col-md-8' id="container-create">
          <div id="row-create" className="col-lg-12 col-md-12 container-fluid">
            <StudyPlanCreate id={props.id} setStudyPlan={props.setStudyPlan} setCredits={props.setCredits} />
          </div> 
          <Row>
            <Col>
              <CourseTable courses={props.allCourses} tableTitle={'All Courses'}/>
            </Col>
          </Row>
      </Container>
     </Row>
    </Container>
    </>
  )

  



}
function HomePageLoggedIn(props){

   return(
    <>{props.studyPlan?  <ViewStudyPlan showSidebar={props.showSidebar} studyPlan={props.studyPlan} allCourses={props.allCourses} setCredits={props.setCredits} setCoursesOfStudyPlan = {props.setCoursesOfStudyPlan} setStudyPlan={props.setStudyPlan} setDirty={props.setDirty} credits={props.credits} id={props.id} loggedUser={props.loggedUser} courses={props.courses}></ViewStudyPlan>:
      <CreateStudyPlan id={props.id} loggedUser={props.loggedUser} showSidebar={props.showSidebar} setStudyPlan={props.setStudyPlan} allCourses={props.allCourses} setCredits={props.setCredits}></CreateStudyPlan>}
    </>

   )

}



export { CourseRoute, DefaultRoute, SearchRoute, Layout,LoginRoute,HomePageLoggedIn, EditStudyPlan};