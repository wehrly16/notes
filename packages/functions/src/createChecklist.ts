import * as uuid from "uuid";
import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Resource.Checklists.name,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId || "TEST-USER-123",
      checklistId: uuid.v1(),
      listName: data.listName,
      done: false,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.send(new PutCommand(params));

  return JSON.stringify(params.Item);
});