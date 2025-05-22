import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import * as uuid from "uuid";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Resource.ChecklistItems.name,
    Item: {
      // The attributes of the item to be created
      checklistId: event?.pathParameters?.checklistId,
      itemId: uuid.v1(),
      content: data.content,
      done: false,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.send(new PutCommand(params));
  
  return JSON.stringify(params.Item);
}); 