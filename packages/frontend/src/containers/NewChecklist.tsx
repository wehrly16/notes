import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import {useNavigate} from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
//import config from "../config";
import "./NewChecklist.css";
import { API } from "aws-amplify";
import { ChecklistType } from "../types/checklist";
import { onError } from "../lib/errorLib";
//import { s3Upload } from "../lib/awsLib";

export default function NewChecklist() {
  const nav = useNavigate();
  const [listName, setListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return listName.length > 0;
  }

function createChecklist(checklist: ChecklistType) {
  return API.post("checklists", "/checklists", {
    body: checklist,
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

    await createChecklist({ listName });
    nav("/");
  } catch (e) {
    onError(e);
    setIsLoading(false);
  }
}


  return (
    <div className="NewChecklist">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="listName">
          <Form.Label>List Name</Form.Label>
          <Form.Control
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
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

