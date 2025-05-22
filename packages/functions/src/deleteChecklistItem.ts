import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const params = {
    TableName: Resource.ChecklistItems.name,
    Key: {
      checklistId: event?.pathParameters?.checklistId,
      itemId: event?.pathParameters?.itemId,
    },
  };

  await dynamoDb.send(new DeleteCommand(params));
  
  return JSON.stringify({ status: true });
}); 