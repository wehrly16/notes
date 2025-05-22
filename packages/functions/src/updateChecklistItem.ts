import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Resource.ChecklistItems.name,
    Key: {
      checklistId: event?.pathParameters?.checklistId,
      itemId: event?.pathParameters?.itemId,
    },
    UpdateExpression: "SET content = :content, done = :done",
    ExpressionAttributeValues: {
      ":content": data.content,
      ":done": data.done,
    },   
  };

  await dynamoDb.send(new UpdateCommand(params));

  return JSON.stringify({ status: true });
}); 