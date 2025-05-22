import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import "./Home.css";
import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { NoteType } from "../types/note";
import { ChecklistType } from "../types/checklist";
import { onError } from "../lib/errorLib";
import { BsPencilSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Home() {
  const [notes, setNotes] = useState<Array<NoteType>>([]);
  const [checklists, setChecklists] = useState<Array<ChecklistType>>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const [notesData, checklistsData] = await Promise.all([
          loadNotes(),
          loadChecklists()
        ]);
        setNotes(notesData);
        setChecklists(checklistsData);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadNotes() {
    return API.get("notes", "/notes", {});
  }

  function loadChecklists() {
    return API.get("checklists", "/checklists", {});
  }

  function formatDate(str: undefined | string | number) {
    return !str ? "" : new Date(str).toLocaleString();
  }
  
  function renderNotesList(notes: NoteType[]) {
    return (
      <>
        <Nav.Link as={Link} to="/notes/new">        
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ms-2 fw-bold">Create a new note</span>
          </ListGroup.Item>
        </Nav.Link>

        {notes.map(({ noteId, content, createdAt }) => (
          <Nav.Link as={Link} key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action className="text-nowrap text-truncate">
              <span className="fw-bold">{content.trim().split("\n")[0]}</span>
              <br />
              <span className="text-muted">
                Created: {formatDate(createdAt)}
              </span>
            </ListGroup.Item>
          </Nav.Link>
        ))}
      </>
    );
  }

  function renderChecklistsList(checklists: ChecklistType[]) {
    return (
      <>
        <Nav.Link as={Link} to="/checklists/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ms-2 fw-bold">Create a new checklist</span>
          </ListGroup.Item>
        </Nav.Link>

        {checklists.map(({ checklistId, listName, createdAt }) => (
          <Nav.Link as={Link} key={checklistId} to={`/checklists/${checklistId}/items`}>
            <ListGroup.Item action className="text-nowrap text-truncate">
              <span className="fw-bold">{listName}</span>
              <br />
              <span className="text-muted">
                Created: {formatDate(createdAt)}
              </span>
            </ListGroup.Item>
          </Nav.Link>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
      </div>
    );
  }

  function renderContent() {
    return (
      <div className="content">
        <Row>
          <Col>
            <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
            <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
          </Col>
          <Col>
            <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Checklists</h2>
            <ListGroup>{!isLoading && renderChecklistsList(checklists)}</ListGroup>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderContent() : renderLander()}
    </div>
  );
}