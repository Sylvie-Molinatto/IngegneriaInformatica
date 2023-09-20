import { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom"
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import MessageContext from "../messageCtx";
import API from "../API";
import { LoginForm } from "./AuthComponents";
import { PagesList } from "./PageLibrary";
import PageForm from "./PageForm";
import Footer from "./Footer";
import dayjs from "dayjs";

function FrontOfficeLayout(props) {
  const [pages, setPages] = useState([]);
  const [dirty, setDirty] = useState(true);
  const location = useLocation();
  const { handleErrors } = useContext(MessageContext);

  useEffect(() => {
    setDirty(true);
  }, [])

  useEffect(() => {
    if (dirty) {
      API.getPublishedPages()
        .then(pages => {
          setPages(pages);
          setDirty(false);
        })
        .catch(e => { handleErrors(e); })
    }
  }, [dirty])

  return (
    <>
      <PagesList pages={pages} handleErrors={handleErrors}/>
      <Footer/>
    </>
  )
}

function PageDetailsLayout(props) {
  const { handleErrors } = useContext(MessageContext);
  const pageid = useParams();
  const location = useLocation();
  const [page, setPage] = useState({});
  const [dirty, setDirty] = useState(true);
  const [authorId, setAuthorId] = useState();
  const [authorInfo, setAuthorInfo] = useState({});
  const [pageBlocks, setPageBlocks] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    setDirty(true);
  }, [])

  useEffect(() => {
    if (dirty) {
      API.getPage(pageid.id)
        .then((page) => {
          // if the page is not yet published then it should not be visible in the front-end
          if(!location.pathname.includes('back-office') && (page.publicationDate==='' || dayjs(page.publicationDate)>dayjs())){
            navigate('/');
          }
          setPage(page);
          setAuthorId(page.author);
          return API.getInfoUser(page.author); 
        })
        .then((authorInfo) => {
          setAuthorInfo(authorInfo);
          setDirty(false);
        })
        .catch((e) => {
          if (e.error==="Page not found.") {
            navigate('/');
          } else {
            handleErrors(e);
          }
        });

      API.getPageBlocks(pageid.id)
        .then((pageBlocks) => {
          pageBlocks.sort((a, b) => a.position - b.position);
          setPageBlocks(pageBlocks);
          setDirty(false);
        })
        .catch((e) => {
          handleErrors(e);
        });
    }
  }, [dirty, pageid.id]);

  const isBackOffice = location.pathname.includes("/back-office");
  let isAuthor, isAdmin;
  // Compare the author of the page with the logged-in user
  if (isBackOffice) {
   isAuthor = props.user && props.user.id === page.author;
   isAdmin = props.user && props.user.role === 'Admin';
  }

  return (
    <>
      <div className="below-nav over-footer">
        <h1>{page.title}</h1>

        {pageBlocks.map((block, index) => {
          if (block.type === 'header') {
            return <h2 key={index}>{block.content}</h2>;
          } else if (block.type === 'paragraph') {
            return <p key={index}>{block.content}</p>;
          } else if (block.type === 'image') {
            return <img key={index} src={'/Images/' + block.content} className="img" />;
          }
          return null; // Ignore unrecognized block types
        })}
        {isBackOffice && (isAdmin || isAuthor) && (
          <div>
          <Link to={"/back-office/edit/"+page.pageid} state={location.pathname} className="over-footer">
            <Button variant="success" className="button"> Update page </Button>
          </Link>
          </div>
        )}

      </div>
      <footer className="footer bg-dark">
        <p className="left italic"> © Autor : {authorInfo.name + " " + authorInfo.surname} </p>
        <p className="right italic"> Publication date : {page.publicationDate || 'undefined'} </p>
        <p className="right italic"> Creation date : {page.creationDate} </p>
      </footer>
    </>
  )
}

function BackOfficeLayout(props) {
  const [pages, setPages] = useState([]);
  const [dirty, setDirty] = useState(true);
  const location = useLocation();
  const { handleErrors } = useContext(MessageContext);

  useEffect(() => {
    setDirty(true);
  }, [])

  useEffect(() => {
    if (dirty) {
      API.getPages()
        .then(pages => {
          setPages(pages);
          setDirty(false);
        })
        .catch(e => { handleErrors(e); })
    }
  }, [dirty])

  const deletePageBlocks = (pageid) => {
    API.deletePageBlocks(pageid)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e));
  }

  const deletePage = (pageid) => {
    API.deletePage(pageid)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e));
  }

  return (
    <>
      <PagesList pages={pages} handleErrors={handleErrors} user={props.user} deletePageBlocks={deletePageBlocks} deletePage={deletePage} className='over-footer' />
      <Link to="/back-office/create" state={location.pathname}> 
        <Button variant="success" className='button-create'> Create a new page </Button>
      </Link>
      <Footer/>
    </>
  )
}

function NewPageLayout(props) {

  const { handleErrors } = useContext(MessageContext);
  const createNewPage = async (page) => {
    try {
      const newPage = await API.createNewPage(page);
      return newPage;
    } catch (error) {
      handleErrors(error);
    }
  };

  const createBlock = (pageid, block) => {
    API.createBlock(pageid, block)
      .then()
      .catch(e => handleErrors(e));
  }
  return (
    <>
    <PageForm user={props.user} createNewPage={createNewPage} createBlock={createBlock} />
    <Footer/>
    </>
  )
}

function EditPageLayout(props) {

  const { handleErrors } = useContext(MessageContext);
  const navigate = useNavigate();
  const { pageid } = useParams();
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.getPage(pageid)
      .then(page => {
        setPage(page);
      })
      .catch(e => {
        handleErrors(e);
      });

    API.getPageBlocks(pageid)
      .then(blocks => {
        setBlocks(blocks);
      })
      .catch(e => {
        handleErrors(e);
      });
  }, [pageid])

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Get the page information from the server
        const page = await API.getPage(pageid);

        // Check if the logged-in user is the author of the page or is an admin
        if (page.author !== props.user.id && props.user.role !== 'Admin') {
          navigate('/')
        }

        // Retrieve the list of all users just if the logged in user is an admin
        if (props.user.role === 'Admin') {
          const users = await API.getUsers()
          setUsers(users)
        }

      } catch (err) {
        // Handle errors while fetching the page or other potential errors
      }
    };

    checkAuthorization();
  }, [props.user.id, pageid]);

  const updatePage = (page) => {
    API.updatePage(page)
      .catch(e => handleErrors(e));
  }

  const updatePageBlock = (block) => {
    API.updatePageBlock(block)
      .catch(e => handleErrors(e));
  }

  const createBlock = (pageid, block) => {
    API.createBlock(pageid, block)
      .then()
      .catch(e => handleErrors(e));
  }

  const deletePageBlock = (pageid, blockid) => {
    API.deletePageBlock(pageid, blockid)
      .then(() => { })
      .catch(e => handleErrors(e));
  }
  return (
    <>
    {(page && blocks) && <PageForm user={props.user} updatePage={updatePage} updatePageBlock={updatePageBlock} deletePageBlock={deletePageBlock} createBlock={createBlock} page={page} blocks={blocks} users={users} />}
    <Footer/>
    </>
  );
}

function NotFoundLayout() {
  return (
    <>
    <div className="below-nav">
      <h2>This is not the route you are looking for!</h2>
      <Link to="/">
        <Button variant="success">Go Home!</Button>
      </Link>
    </div>
    <Footer/>
    </>
  );
}

function NotLoggedLayout() {
  return (
    <>
    <div className="below-nav">
      <h2>This is a route only for logged users. If you want to access please login.</h2>
    </div>
    <Footer/>
    </>
  );
}

function ForbiddenLayout() {
  return (
    <>
    <div className="below-nav">
      <h2>Forbidden</h2>
      <p>You are not authorized to see this page.</p>
    </div>
    <Footer/>
    </>
  )
}

function LoginLayout(props) {
  return (
    <>
    <Row className="vh-100">
      <Col md={12} className="below-nav">
        <LoginForm login={props.login} />
      </Col>
    </Row>
    <Footer/>
    </>
  )
}

function LoadingLayout(props) {
  <Row className="vh-100">
    <Col md={4} bg="light" className="below-nav" id="left-sidebar">
    </Col>
    <Col md={8} className="below-nav">
      <h1>Content Management System ...</h1>
    </Col>
  </Row>
}

export { FrontOfficeLayout, PageDetailsLayout, BackOfficeLayout, NewPageLayout, EditPageLayout, NotFoundLayout, NotLoggedLayout, ForbiddenLayout, LoginLayout, LoadingLayout }