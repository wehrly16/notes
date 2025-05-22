import { table } from "./storage";
import { checklistsTable, checklistItemsTable } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [table],      
      },
     args: {
       auth: { iam: true }
     },
    }
  }
});

export const api2 = new sst.aws.ApiGatewayV2("Api2", {
  transform: {
    route: {
      handler: {
        link: [checklistsTable, checklistItemsTable],
      },
     // args: {
     //  auth: { iam: true }
     // },
    }
  }
});

// Create the API routes
api.route("POST /notes", "packages/functions/src/create.main");
api.route("GET /notes/{id}", "packages/functions/src/get.main");
api.route("GET /notes", "packages/functions/src/list.main");
api.route("PUT /notes/{id}", "packages/functions/src/update.main");
api.route("DELETE /notes/{id}", "packages/functions/src/delete.main");

// Checklist routes
api2.route("POST /checklists", "packages/functions/src/createChecklist.main");
api2.route("GET /checklists", "packages/functions/src/listChecklists.main");
api2.route("GET /checklists/{id}", "packages/functions/src/getChecklist.main");
api2.route("PUT /checklists/{id}", "packages/functions/src/updateChecklist.main");
api2.route("DELETE /checklists/{id}", "packages/functions/src/deleteChecklist.main");

// Checklist items routes
api2.route("POST /checklists/{checklistId}/items", "packages/functions/src/createChecklistItem.main");
api2.route("GET /checklists/{checklistId}/items", "packages/functions/src/listChecklistItems.main");
api2.route("GET /checklists/{checklistId}/items/{itemId}", "packages/functions/src/getChecklistItem.main");
api2.route("PUT /checklists/{checklistId}/items/{itemId}", "packages/functions/src/updateChecklistItem.main");
api2.route("DELETE /checklists/{checklistId}/items/{itemId}", "packages/functions/src/deleteChecklistItem.main");