import { Container, Card, ListGroup, ListGroupItem, Collapse} from 'react-bootstrap';
import { useState } from 'react';
import './Legend.css'

function StudyPlanLegend(props){
    const [open, setOpen] = useState(false);

    return(
        <>
           
        
            <Container fluid className="col-lg-6-auto grid-margin stretch-card" id="wrapper">
                <div className="btn" style={{backgroundColor: 'green', color: 'white'}}
                    onClick={() => setOpen(!open)}
                    aria-controls="collapse"
                    aria-expanded={open}>
                    <div className='bi bi-chevron-double-left'>{open===false? 'Legend' : ''}</div>		
                </div>
                <Collapse in={open} >
                    <div id="mySidepanel" className="sidepanel">
                    <Card style={{ width: '18rem' }}>
                        <Card.Header style={{backgroundColor: "#3c005a",color: "white"}} >LEGEND</Card.Header>
                        <ListGroup variant="flush"></ListGroup>
                        <ListGroupItem style={{backgroundColor: "red"}}>Incompatible Courses</ListGroupItem>
                        <ListGroupItem style={{backgroundColor: "yellowgreen"}}>Preparatory Course missing</ListGroupItem>
                        <ListGroupItem style={{backgroundColor: "lightblue"}}>Maximum number of students reached</ListGroupItem>
                        <ListGroupItem style={{backgroundColor: "#eabfff"}}>Courses unremovable</ListGroupItem>
                    </Card>
                    </div>
                </Collapse>
            </Container>
        
        </>

    );
}

export {StudyPlanLegend}