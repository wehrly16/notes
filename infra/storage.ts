// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads");

// Create the DynamoDB table
export const table = new sst.aws.Dynamo("Notes", {
  fields: {
    userId: "string",
    noteId: "string",
  },
  primaryIndex: { hashKey: "userId", rangeKey: "noteId" },
});

// Table for storing checklist metadata
export const checklistsTable = new sst.aws.Dynamo("Checklists", {
  fields: {
    userId: "string",
    checklistId: "string",
  },
  primaryIndex: { hashKey: "userId", rangeKey: "checklistId" },
});

// Table for storing checklist items
export const checklistItemsTable = new sst.aws.Dynamo("ChecklistItems", {
  fields: {
    checklistId: "string",
    itemId: "string",  
  },
  primaryIndex: { hashKey: "checklistId", rangeKey: "itemId" },
});
