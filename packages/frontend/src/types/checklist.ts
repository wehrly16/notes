export interface ChecklistType {
  userId?: string;
  checklistId?: string;
  listName: string;
  done: boolean;
  createdAt?: string;
}

export interface ChecklistItemType {
  checklistId?: string;
  itemId?: string;
  content: string;
  done: boolean;
  createdAt?: string;
} 