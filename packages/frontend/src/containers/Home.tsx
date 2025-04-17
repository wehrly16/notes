//import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
//import { useAppContext } from "../lib/contextLib";
import "./Home.css";
import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { NoteType } from "../types/note";
//import { onError } from "../lib/errorLib";
import { BsPencilSquare } from "react-icons/bs";
//import { LinkContainer } from "react-router-bootstrap";


export default function Home() {
  const [notes, setNotes] = useState<Array<NoteType>>([]);
  const { isAuthenticated } = true;//useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
  async function onLoad() {
    if (!isAuthenticated) {
      return;
    }

    try {
      const notes = await loadNotes();
      setNotes(notes);
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

function formatDate(str: undefined | string) {
  return !str ? "" : new Date(str).toLocaleString();
}

function renderNotesList(notes: NoteType[]) {//call the list api - render the list//added nav.link in place of linkcontainer
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

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return (//renderLander()} - should go in place of 2nd renderNotes()
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderNotes()} 
    </div>
  );
}

