import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const params = {
    TableName: Resource.Checklists.name,
    // 'Key' defines the partition key and sort key of
    // the item to be retrieved
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId || "TEST-USER-123", // The id of the author
      checklistId: event?.pathParameters?.id, // The id of the checklist from the path
    },
  };

  const result = await dynamoDb.send(new GetCommand(params));
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return JSON.stringify(result.Item);
});
