import { Row,  Button, Container, Card} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";



function StudyPlanCreate(props){

    const navigate = useNavigate();

    const saveStudyPlan = async(studyPlan)=>{
        props.setStudyPlan(studyPlan);
        props.setCredits(0);
        navigate('/editStudyPlan');
    }
    
      return(
        <>
            <Card className="text-center" style={{padding: 0}}>
             <Card.Header style={{backgroundColor: "purple",color: "white"}}>Create a Study Plan</Card.Header>
             <Card.Body>
                <Card.Title>You don't have a study plan yet</Card.Title>
                <Card.Text>Choose your study Plan</Card.Text>
                <Container fluid>
                    <Row>
                    <div className="col justify-content-center">
                    <Card>
                        <Card.Header style={{backgroundColor: "#3c005a",color: "white"}}>Full Time</Card.Header>
                        <Card.Body>
                            <Card.Text>From 60 to 80 credits</Card.Text>
                            <Button variant="dark" onClick={()=>{ saveStudyPlan("FULL-TIME"); }} >Select</Button>
                        </Card.Body>
                    </Card>
                    </div>
                    <div className="col justify-content-center">
                    <Card>
                        <Card.Header style={{backgroundColor: "#3c005a",color: "white"}}>Part Time</Card.Header>
                        <Card.Body>
                            <Card.Text>From 20 to 40 credits</Card.Text>
                            <Button variant="dark" onClick={()=>{ saveStudyPlan("PART-TIME"); }} >Select</Button>
                        </Card.Body>
                    </Card>
                    </div>
                    </Row>
                </Container>
            </Card.Body>
           </Card>
        </>);
}
export {StudyPlanCreate};