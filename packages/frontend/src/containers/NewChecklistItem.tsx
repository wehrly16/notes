import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import {useNavigate, useParams} from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
//import config from "../config";
import "./NewChecklistItem.css";
import { API } from "aws-amplify";
import { ChecklistItemType } from "../types/checklist";
import { onError } from "../lib/errorLib";
//import { s3Upload } from "../lib/awsLib";

export default function NewChecklistItem() {
  const nav = useNavigate();
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function createChecklistItem(checklistItem: ChecklistItemType) {
    return API.post("checklists", `/checklists/${id}/items`, {
      body: checklistItem,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

 //if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
   //alert(
     //`Please pick a file smaller than ${
       //config.MAX_ATTACHMENT_SIZE / 1000000
      //} MB.`
   //);
   //return;
  //}

    setIsLoading(true);

    try {
      //const attachment = file.current
      //  ? await s3Upload(file.current)
      //  : undefined;

      await createChecklistItem({ content, done: false });
      nav(`/checklists/${id}/items`);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }


  return (
    <div className="NewChecklistItem">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Label>Item Content</Form.Label>
          <Form.Control
            value={content}
            type="text"            
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>     
        
        <Stack>
          <LoaderButton
            size="lg"
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Create
          </LoaderButton>
        </Stack>
      </Form>
    </div>
  );
}

