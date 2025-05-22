import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../lib/errorLib";
import { BsPencilSquare } from "react-icons/bs";
import { ChecklistItemType, ChecklistType } from "../types/checklist";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import "./ChecklistItems.css";
import Stack from "react-bootstrap/esm/Stack";
import LoaderButton from "../components/LoaderButton";

export default function ChecklistItems() {
  const { id } = useParams();
  const nav = useNavigate();
  const [checklistItems, setChecklistItems] = useState<Array<ChecklistItemType>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistType | null>(null);

  useEffect(() => {
    async function onLoad() {
      try {
        const [items, checklistData] = await Promise.all([
          loadChecklistItems(),
          loadChecklist()
        ]);
        setChecklistItems(items);
        setChecklist(checklistData);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [id]);

  function loadChecklistItems() {
    return API.get("checklists", `/checklists/${id}/items`, {});
  }

  function loadChecklist() {
    return API.get("checklists", `/checklists/${id}`, {});
  }

  async function handleCheckboxChange(itemId: string | undefined, done: boolean, e: React.ChangeEvent<HTMLInputElement>) {
    if (!itemId) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const item = checklistItems.find(item => item.itemId === itemId);
      if (!item) return;

      await API.put("checklists", `/checklists/${id}/items/${itemId}`, {
        body: {
          content: item.content,
          done: done
        }
      });
      
      setChecklistItems(items => 
        items.map(item => 
          item.itemId === itemId ? { ...item, done } : item
        )
      );
    } catch (e) {
      onError(e);
    }
  }

  function formatDate(str: undefined | string) {
    return !str ? "" : new Date(str).toLocaleString();
  }

  function renderChecklistItemsList(checklistItems: ChecklistItemType[]) {
    return (
      <>
        <Nav.Link as={Link} to={`/checklists/${id}/items/new`}>        
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ms-2 fw-bold">Create a new item</span>
          </ListGroup.Item>
        </Nav.Link>

        {checklistItems.map(({ itemId, content, done, createdAt }) => (
          <Nav.Link as={Link} key={itemId} to={`/checklists/${id}/items/${itemId}`}>
            <ListGroup.Item action className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                checked={done}
                onChange={(e) => handleCheckboxChange(itemId, e.target.checked, e)}
                className="me-3"
                onClick={(e) => e.stopPropagation()}
              />
              <div className={`flex-grow-1 ${done ? 'text-decoration-line-through text-muted' : ''}`}>
                <span className="fw-bold">{content}</span>
                <br />
                <span className="text-muted">
                  Created: {formatDate(createdAt)}
                </span>
              </div>
            </ListGroup.Item>
          </Nav.Link>
        ))}
      </>
    );
  }

  function deleteChecklist() {
    return API.del("checklists", `/checklists/${id}`, {});
  }

  async function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this checklist and all its items?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteChecklist();
      nav("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  function renderChecklistItems() {
    return (
      <div className="checklistItems">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">{checklist?.listName}</h2>
        <ListGroup>{!isLoading && renderChecklistItemsList(checklistItems)}</ListGroup>
        <Stack gap={1} className="mt-4">
          <LoaderButton
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete Checklist
          </LoaderButton>
        </Stack>
      </div>
    );
  }

  return (
    <div className="Home">
      {renderChecklistItems()}
    </div>
  );
}