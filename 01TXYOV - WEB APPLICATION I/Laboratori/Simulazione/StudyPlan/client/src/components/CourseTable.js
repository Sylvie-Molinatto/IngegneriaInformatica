import {Container, Table, Card} from 'react-bootstrap';
import {CourseData} from './CourseData'
import { useLocation } from 'react-router-dom'
import './Table.css';



function CourseTable(props) {

	return(
    
    <Container id="wrapper" fluid className="col-lg-8-auto grid-margin stretch-card">
      <Card className="text-center" id="Card-wrapper" >
        <Card.Header style={{backgroundColor: "purple",color: "white"}}>{props.tableTitle}</Card.Header>
          <Table striped className="table-fixed"  id="table-fixed">
            <CourseTableHeader/>
            <CourseTableBody coursesOfStudyPlan = {props.coursesOfStudyPlan} setDirty={props.setDirty} setCredits={props.setCredits} credits={props.credits} courses={props.courses} tableTitle={props.tableTitle} setCoursesOfStudyPlan={props.setCoursesOfStudyPlan}/>
          </Table>
      </Card>
    </Container>
    
	);
}

function CourseTableHeader(props){
  const location = useLocation();
  return(
    <thead id="header-fixed" >
      <tr>
          <th scope="col">Code</th>
          <th scope="col">Name</th>
          <th scope="col">Credits</th>
          <th scope="col">Enrolled Students</th>
          <th scope="col">Max Students</th>
          <th scope="col"></th>
        {
          location.pathname==='/editStudyPlan' && <th scope="col"></th>
        }
      </tr>
    </thead>
  );
}
function CourseTableBody(props){


  return(
    <tbody>
      {props.courses.map(e => <CourseRow course={e} key={e.code} setDirty={props.setDirty} tableTitle={props.tableTitle} setCredits={props.setCredits} credits={props.credits} setCoursesOfStudyPlan={props.setCoursesOfStudyPlan} coursesOfStudyPlan = {props.coursesOfStudyPlan} />)}
    </tbody>
  );
}

function CourseRow(props) {
	return(
      <CourseData course={props.course} tableTitle={props.tableTitle} setDirty={props.setDirty} setCredits={props.setCredits} credits={props.credits} coursesOfStudyPlan = {props.coursesOfStudyPlan}  setCoursesOfStudyPlan={props.setCoursesOfStudyPlan}/>
	);
}

export {CourseTable};