import { Container, Card, ListGroup} from 'react-bootstrap';
import './style.css';


function StudyPlanDisplay(props){
    return(
        <>
            <Container id="wrapper2" fluid className="col-lg-8-auto grid-margin stretch-card">
                <Card>
                    <Card.Header className="text-center" style={{backgroundColor: "purple",color: "white"}}>STUDY PLAN</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><strong>Type</strong>: {props.studyPlan} </ListGroup.Item>
                        <ListGroup.Item><strong>Credits</strong>: {props.credits}</ListGroup.Item>
                        <ListGroup.Item><strong>Minimum credits allowed</strong>: {props.typeStudyPlan.get(props.studyPlan).Min}</ListGroup.Item>
                        <ListGroup.Item><strong>Maximum credits allowed</strong>:  {props.typeStudyPlan.get(props.studyPlan).Max}</ListGroup.Item>
                    </ListGroup>
                </Card>
            </Container>
        </>
    )}
export {StudyPlanDisplay}