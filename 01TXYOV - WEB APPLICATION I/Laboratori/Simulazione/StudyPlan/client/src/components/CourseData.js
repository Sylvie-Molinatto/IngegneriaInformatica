import { Collapse, Tooltip, OverlayTrigger} from 'react-bootstrap';
import { useState } from 'react';
import { useLocation } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.min.css';


function CourseData(props) {
	

	const [open, setOpen] = useState(false);
	const location=useLocation();

	const courseIncompatible = location.pathname==='/editStudyPlan' && props.tableTitle==='All Courses' 
	&& props.course.incompatibleWith.find(incompatibleCourse=>{
		return props.coursesOfStudyPlan.find(course=>{return incompatibleCourse===course.code})!==undefined
	}) 
	const marked=courseIncompatible? true : false;
	
	const markedPreparatory = location.pathname==='/editStudyPlan' && props.tableTitle==='All Courses' 
	&& props.course.preparatoryCourse!==null && props.coursesOfStudyPlan.find(course=>
		{return props.course.preparatoryCourse===course.code})===undefined ? true : false;
	
	const studentsConstraint = location.pathname==='/editStudyPlan' && props.tableTitle==='All Courses' && props.course.maxStudents===0;
	const courseUnremovable = location.pathname==='/editStudyPlan' && props.tableTitle==='Courses of Study Plan'? props.coursesOfStudyPlan.find(course=>course.preparatoryCourse===props.course.code): undefined;
	const markedUnremovable = courseUnremovable? true: false;
	
	const message = marked? <div>The course <strong>{props.course.code}</strong> is incompatible with <strong>{courseIncompatible}</strong>.</div> 
		: markedPreparatory? <div>The course <strong>{props.course.preparatoryCourse}</strong> is not present.</div> : studentsConstraint? <div>The course <strong>{props.course.code}</strong> has already reached the maximum number of students</div> 
		: markedUnremovable? <div>The course <strong>{props.course.code}</strong> is the preparatory course of <strong>{courseUnremovable.code}</strong></div>  : ""
	const updateCourses = async (course) => {	

			const list = [...props.coursesOfStudyPlan,course]
			props.setCoursesOfStudyPlan(list.sort((a,b)=>a.name.localeCompare(b.name)))
			const credits = props.credits+course.credits;
			props.setCredits(credits)
		}

	const removeCourses = async (course) => {

			props.setCoursesOfStudyPlan(props.coursesOfStudyPlan.filter(n=>n.code!==course.code))
			const credits = props.credits-props.course.credits;
			props.setCredits(credits)
		
	}

	 
	return(
		<>
	
		<tr style={location.pathname==='/editStudyPlan'? props.tableTitle==='All Courses' ? marked? {backgroundColor:"red"}: markedPreparatory?{backgroundColor:"yellowgreen"}: studentsConstraint? {backgroundColor:"lightblue"}:{} : props.tableTitle==='Courses of Study Plan' && markedUnremovable? {backgroundColor:"#eabfff"} :{} :{}}>
			<td style={{ flexShrink: 1 }}>{props.course.code}</td>
			<td>{props.course.name}</td>
			<td>{props.course.credits}</td>
			<td>{props.course.enrolledStudents}</td>
			<td>{props.course.maxStudents}</td>
			<td>
				{(props.course.preparatoryCourse || props.course.incompatibleWith.length!==0) && <div className="btn"
					onClick={() => setOpen(!open)}
					aria-controls="collapse"
					aria-expanded={open}>
					<div className='bi bi-chevron-up'></div>
					
				</div>
				}
			</td>
		
			{location.pathname==='/editStudyPlan' && <td>
				{ props.tableTitle==='All Courses' && !marked && !markedPreparatory && !studentsConstraint && <div className={ "btn btn-outline-success bi-plus"} id="adding" onClick={()=> updateCourses(props.course)}></div> }
				{ props.tableTitle==='Courses of Study Plan' && !markedUnremovable && <div className="btn btn-outline-danger bi-trash" onClick={()=> removeCourses(props.course)}></div> }
				{(marked || markedPreparatory || studentsConstraint || markedUnremovable) && <OverlayTrigger
				placement={'bottom'}
				overlay={
					<Tooltip id={'tooltip'}>
					{message}
					</Tooltip>
				}>
				<div className="bi bi-exclamation-circle"></div>
				</OverlayTrigger> }
			</td>}
		</tr>
		
		
      <Collapse in={open} >
		<tr className="row-auto">
			<td className='col' colSpan={7}>
				<table className="table-fixed table table-responsive table table-striped">
					<thead>
						<tr className="row-auto">
							<th className="col">Preparatory course</th>
							<th className='col'>Incompatible Course</th>
						</tr>
					</thead>
					<tbody>
						<tr className='row-auto'>
							<td className='col'>{props.course.preparatoryCourse}</td>
							<td className='col'>{props.course.incompatibleWith.map((e)=>{return <span key={props.course.code+e}>{e}<br></br></span> })}</td>
						</tr>	
					</tbody>
				</table>
			</td>
		</tr>
      </Collapse>
	</>	
	);
}

export {CourseData};