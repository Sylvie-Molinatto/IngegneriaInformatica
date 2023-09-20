import { Button, Card, Form } from "react-bootstrap";
import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";
import MessageContext from "../messageCtx";
import dayjs from "dayjs";

const PageForm = (props) => {
  const [title, setTitle] = useState(props.page ? props.page.title : '');
  const [publicationDate, setPublicationDate] = useState((props.page && props.page.publicationDate) ? dayjs(props.page.publicationDate).format('YYYY-MM-DD') : '');
  const [selectedBlockType, setSelectedBlockType] = useState("header");
  const [blocks, setBlocks] = useState(props.blocks || []);
  const [removedBlocks, setRemovedBlocks] = useState([]);
  const [author, setAuthor] = useState(props.page ? props.page.author : '');
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { handleErrors } = useContext(MessageContext);

  const isAdmin = props.user ? props.user.role === 'Admin': false;

  // useNavigate hook is necessary to change page
  const navigate = useNavigate();
  const location = useLocation();

  // if the page is saved (eventually modified) we return to the list of all pages,
  // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
  const nextpage = location.state?.nextpage || "/back-office";

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if at least one header block exists
    const hasHeaderBlock = blocks.some((block) => block.type === "header");

    // Check if at least one paragraph or image block exists
    const hasParagraphOrImageBlock = blocks.some(
      (block) => block.type === "paragraph" || block.type === "image"
    );

    if (!hasHeaderBlock || !hasParagraphOrImageBlock) {
      // Show an error message or perform necessary actions
      setErrorMessage("Page must have at least one header and one paragraph or image");
      setShow(true);
      return;
    }

    // Get the current date for creationDate 
    const creationDate = dayjs().format("YYYY-MM-DD").toString();

    const newPage = {
      title,
      author,
      publicationDate,
    };

    if(!props.page){

      newPage.creationDate=creationDate;

      if(newPage.publicationDate!=="" && newPage.publicationDate<creationDate){
        setErrorMessage("Publication date cannot be before the creation date");
        setShow(true);
        return;
      }

      // Get the author of the page
      const author = props.user.id; 
      newPage.author = author;
      const handleCreateNewPage = async () => {
        try {
          const pageCreated = await props.createNewPage(newPage);
      
          const createBlockPromises = blocks.map((block, index) => {
            block.position = index + 1;
            return props.createBlock(pageCreated.pageid, block);
          });
      
          await Promise.all(createBlockPromises);
        } catch (error) {
          handleErrors(error);
        }
      };

      handleCreateNewPage();
      navigate(nextpage);
    }
    else{

      setBlocks(props.blocks.sort((a, b) => a.position - b.position));

      newPage.pageid=Number(props.page.pageid);
      newPage.creationDate=props.page.creationDate;

      if(newPage.publicationDate!=="" && newPage.publicationDate<newPage.creationDate){
        setErrorMessage("Publication date cannot be before the creation date");
        setShow(true);
        return;
      }

      if(newPage.publicationDate!=="" && dayjs(newPage.publicationDate)<dayjs(props.page.publicationDate)){
        setErrorMessage("Publication date cannot be before the previous one");
        setShow(true);
        return;
      }

      const handleUpdatePage = async () => {
        try {
          const pageUpdated = await props.updatePage(newPage);

          const deleteBlockPromises = removedBlocks.map((block, index) => {
            return props.deletePageBlock(block.pageid, block.blockid)
          });

          await Promise.all(deleteBlockPromises);
      
          const updateBlockPromises = blocks.map((block, index) => {
            block.position = index + 1;
            if(block.blockid){
              return props.updatePageBlock(block);
            }
            else{
              return props.createBlock(newPage.pageid, block)
            }
          });
      
          await Promise.all(updateBlockPromises);
        } catch (error) {
          handleErrors(error);
        }
      };

      handleUpdatePage();
      navigate(nextpage);
    }
  };

  const handleAddBlock = () => {
    // Add a new block to the blocks array
    setBlocks([...blocks, { type: selectedBlockType, content: "" }]);
    setSelectedBlockType("header");
  };

  const handleRemoveBlock = (index) => {

    if(props.page){
      removedBlocks.push(blocks[index])
      setRemovedBlocks([...removedBlocks])
    }
    // Remove the block at the given index
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index, 1);
    setBlocks(updatedBlocks);
  };

  const handleChangeBlockContent = (index, content) => {
    // Update the content of the block at the given index
    const updatedBlocks = [...blocks];
    updatedBlocks[index].content = content;
    setBlocks(updatedBlocks);
  };

  const handleChangeBlockType = (index, type) => {
    // Update the type of the block at the given index
    const updatedBlocks = [...blocks];
    updatedBlocks[index].type = type;
    setBlocks(updatedBlocks);
  };

  const getImagePreview = (imageName) => {
    if (imageName) {
      return <img src={`/Images/${imageName}`} alt="Selected" className="img" />;
    }
    return null;
  };

  const handleMoveBlockUp = (index) => {
    if (index > 0) {
      const updatedBlocks = [...blocks];
      const temp = updatedBlocks[index];
      updatedBlocks[index] = updatedBlocks[index - 1];
      updatedBlocks[index - 1] = temp;
      setBlocks(updatedBlocks);
    }
  };

  const handleMoveBlockDown = (index) => {
    if (index < blocks.length - 1) {
      const updatedBlocks = [...blocks];
      const temp = updatedBlocks[index];
      updatedBlocks[index] = updatedBlocks[index + 1];
      updatedBlocks[index + 1] = temp;
      setBlocks(updatedBlocks);
    }
  };

  const handleCancel = () => {
    navigate(nextpage);
  };

  return (
    <div className="below-nav d-flex flex-column align-items-center">
      <div>
        {props.page ? <h1> Update page </h1> : <h1> Create a new page</h1>} 
      </div>
      <Form onSubmit={handleSubmit}>
        <Card style={{ width: '40rem' }} bg="light" className="card" >
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            required={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="publicationDate">
          <Form.Label>Publication Date</Form.Label>
          <Form.Control
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
        </Form.Group>
        { isAdmin && props.page ? (
        <Form.Group controlId="author">
          <Form.Label>Author</Form.Label>
          <Form.Select
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
          >
          <option value="">Select an author</option>
          {props.users.map((user) => (
          <option key={user.id} value={user.id}>
          {user.name} {user.surname}
          </option>
          ))}
          </Form.Select>
        </Form.Group>
        ): <></>}
        </Card>
        <Card style={{width: '40rem'}}>
        <h3>Blocks</h3>
        {blocks.map((block, index) => (
          <div key={index}>
            <Form.Group controlId={`block-${index}`}>
              <div>
              <Form.Label>Select Block Type</Form.Label>
              </div>
              <Form.Select
                value={block.type}
                disabled={ props.blocks &&
                  props.blocks.some((b) => b.blockid === block.blockid)}
                onChange={(e) => {
                  handleChangeBlockType(index, e.target.value);
                }}
              >
                <option value="header">Header</option>
                <option value="paragraph">Paragraph</option>
                <option value="image">Image</option>
              </Form.Select>
              {block.type === "header" && (
                <>
                  <Form.Label>Block Content</Form.Label>
                  <Form.Control
                    type="text"
                    value={block.content}
                    required={true}
                    onChange={(e) => handleChangeBlockContent(index, e.target.value)}
                  />
                </>
              )}
              {block.type === "paragraph" && (
                <>
                  <Form.Label>Block Content</Form.Label>
                  <Form.Control
                    as="textarea" // Use textarea for bigger text input
                    value={block.content}
                    required={true}
                    onChange={(e) => handleChangeBlockContent(index, e.target.value)}
                    className='textarea'
                  />
                </>
              )}
              {block.type === "image" && (
                <Form.Group controlId={`image-${index}`}>
                  <Form.Label>Select Image:</Form.Label>
                  <Form.Control
                    as="select"
                    value={block.content}
                    required={true}
                    onChange={(e) => handleChangeBlockContent(index, e.target.value)}
                  >
                    <option value="">Select an image</option>
                    <option value="bee.jpg">Image 1</option>
                    <option value="butterfly.jpg">Image 2</option>
                    <option value="flower.JPG">Image 3</option>
                    <option value="tree.jpg">Image 4</option>
                  </Form.Control>
                  {getImagePreview(block.content)}
                </Form.Group>
              )}

              {/* ... remove block button */}
              <Button variant="danger" onClick={() => handleRemoveBlock(index)}  className="button">
                Remove Block
              </Button>
              {/* ... move block up button */}
              <Button
                className="button"
                variant="secondary"
                disabled={index === 0}
                required={true}
                onClick={() => handleMoveBlockUp(index)}
              >
                <i className="bi bi-arrow-up-square"></i>
              </Button>

              {/* ... move block down button */}
              <Button
                className="button"
                variant="secondary"
                disabled={index === blocks.length - 1}
                onClick={() => handleMoveBlockDown(index)}
              >
                <i className="bi bi-arrow-down-square"></i>
              </Button>
            </Form.Group>
          </div>
        ))}
        </Card>
        <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
        </Alert>
        <Button variant="dark" onClick={handleAddBlock}  className="button-create">
          Add Block
        </Button>
        { !props.page ?  
        <Button variant="success" type="submit"  className="button-create">
          Create Page
        </Button>
        :
        <Button variant="success" type="submit"  className="button-create">
          Save Page
        </Button>
        }
        <Button variant="danger" type="reset"  className="button-create" onClick={handleCancel}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default PageForm;
