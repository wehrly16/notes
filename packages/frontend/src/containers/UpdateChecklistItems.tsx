import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../lib/errorLib";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import LoaderButton from "../components/LoaderButton";
import { ChecklistItemType } from "../types/checklist";

export default function UpdateChecklistItems() {  
  const { id } = useParams();
  const { itemId } = useParams();
  const nav = useNavigate();
  const [checklistitem, setChecklistItem] = useState<null | ChecklistItemType>(null);
  const [content, setContent] = useState("");
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    function loadChecklistItem() {
      return API.get("checklists", `/checklists/${id}/items/${itemId}`, {});
    }

    async function onLoad() {
      try {
        const item = await loadChecklistItem();
        setChecklistItem(item);
        setContent(item.content);
        setDone(item.done);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id, itemId]);

  function validateForm() {
    return content.length > 0;
  }  
  
  function saveChecklistItem(checklistitem: ChecklistItemType) {
    return API.put("checklists", `/checklists/${id}/items/${itemId}`, {
      body: checklistitem,
    });
  }
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await saveChecklistItem({
        content: content,
        done: done,
      });
      nav(`/checklists/${id}/items`);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function deleteChecklistItem() {
    return API.del("checklists", `/checklists/${id}/items/${itemId}`, {});
  }
  
  async function handleDelete(event: React.FormEvent<HTMLModElement>) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteChecklistItem();
      nav(`/checklists/${id}/items`);
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className="ChecklistItems">
      {checklistitem && (
        <Form onSubmit={handleSubmit}>
          <Stack gap={3}>
            <Form.Group controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                size="lg"
                as="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="done">
              <Form.Check
                type="checkbox"
                label="Mark as done"
                checked={done}
                onChange={(e) => setDone(e.target.checked)}
              />
            </Form.Group>
            <Stack gap={1}>
              <LoaderButton
                size="lg"
                type="submit"
                isLoading={isLoading}
                disabled={!validateForm()}
              >
                Save
              </LoaderButton>
              <LoaderButton
                size="lg"
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete
              </LoaderButton>
            </Stack>
          </Stack>
        </Form>
      )}
    </div>
  );
}