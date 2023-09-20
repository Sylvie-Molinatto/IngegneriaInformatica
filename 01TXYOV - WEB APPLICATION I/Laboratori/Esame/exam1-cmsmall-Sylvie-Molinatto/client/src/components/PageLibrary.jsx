import { Table, Button, Row, Col, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useState } from "react";
import API from "../API";

function PagesList(props) {

    const sortedPages = props.pages.sort((a, b) => {
        const aDate = a.publicationDate ? dayjs(a.publicationDate) : dayjs('9999-12-31');
        const bDate = b.publicationDate ? dayjs(b.publicationDate) : dayjs('9999-12-31');
        
        return aDate - bDate;
    });

    return (
        <div className="below-nav">
            <Container>
                <Row xs={1} md={2} className="g-4">
                    {sortedPages.map((page) => (
                        <Col key={page.pageid}>
                            <PageRow
                                id={page.pageid}
                                pageData={page}
                                handleErrors={props.handleErrors}
                                user={props.user}
                                deletePageBlocks={props.deletePageBlocks}
                                deletePage={props.deletePage}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

function PageRow(props) {

    const location = useLocation();

    const isBackOffice = location.pathname.endsWith("/back-office");
    let isAuthor;
    let isAdmin;
    // Compare the author of the page with the logged-in user
    if (isBackOffice) {
        isAuthor = props.user && props.user.id === props.pageData.author;
        isAdmin = props.user && props.user.role === 'Admin';
    }

    return (
        <>
            <Col key={props.pageData.pageid}>
                <Card border="success" bg="dark" text="light">
                    <Card.Body>
                    <div className="d-flex justify-content-end">
                        <Card.Text>
                            {isBackOffice && (
                                !props.pageData.publicationDate ? <span className="draft status"> Draft </span> : dayjs(props.pageData.publicationDate) <= dayjs() ? <span className="published status"> Published </span> : <span className="scheduled status"> Scheduled </span>
                            )}
                        </Card.Text>
                    </div>
                        <Card.Title>
                            {props.pageData.title}
                        </Card.Title>
                        <Card.Text>
                            <UserInfo author={props.pageData.author} handleErrors={props.handleErrors} />
                        </Card.Text>
                        <Card.Text> Creation date: {dayjs(props.pageData.creationDate).format('DD/MM/YYYY')}</Card.Text>
                        <Card.Text>
                            Publication date: {!props.pageData.publicationDate || props.pageData.publicationDate === ""
                                ? "undefined"
                                : dayjs(props.pageData.publicationDate).format('DD/MM/YYYY')}
                        </Card.Text>
                        {(isBackOffice && (isAuthor || isAdmin)) && (
                            <>
                                <Link to={"/back-office/edit/" + props.pageData.pageid} state={{ nextpage: location.pathname }}>
                                    <Button variant="light" className="button"> <i className="bi bi-pencil-square"></i> </Button>
                                </Link>
                                <Button variant='light' className="button" onClick={() => { props.deletePageBlocks(props.pageData.pageid); props.deletePage(props.pageData.pageid) }}>
                                    <i className="bi bi-trash" />
                                </Button>
                            </>
                        )}
                        {(isBackOffice && !(isAuthor || isAdmin)) && (
                            <>
                                <Button variant="light" className="button" disabled> <i className="bi bi-pencil-square"></i> </Button>
                                <Button variant='light' className="button" onClick={() => { props.deletePageBlocks(props.pageData.pageid); props.deletePage(props.pageData.pageid) }} disabled>
                                    <i className="bi bi-trash" />
                                </Button>
                            </>
                        )}
                    </Card.Body>
                    {(isBackOffice ? 
                        <>
                        <Link to={"/back-office/pages/" + props.pageData.pageid} state={{ nextpage: location.pathname }}>
                        <Button variant='success'> View Page </Button>
                        </Link> 
                        </> :
                        <>
                        <Link to={"/pages/" + props.pageData.pageid} state={{ nextpage: location.pathname }}>
                        <Button variant='success'> View Page </Button>
                        </Link>
                        </>
                    )}
                    
                </Card>
            </Col>
        </>
    );
}

function UserInfo(props) {
    const [userInfo, setUserInfo] = useState({});
    const location = useLocation();

    useEffect(() => {
        API.getInfoUser(props.author)
            .then((author) => {
                setUserInfo(author);
            })
            .catch((e) => {
                props.handleErrors(e);
            });
    }, [props.author]);

    return <> Author : {userInfo.name + " " + userInfo.surname} </>;
}

export { PagesList };