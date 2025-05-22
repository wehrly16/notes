import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const params = {
    TableName: Resource.ChecklistItems.name,
    KeyConditionExpression: "checklistId = :checklistId",
    ExpressionAttributeValues: {
      ":checklistId": event?.pathParameters?.checklistId,
    },
  };

  const result = await dynamoDb.send(new QueryCommand(params));
  
  return JSON.stringify(result.Items);
}); 