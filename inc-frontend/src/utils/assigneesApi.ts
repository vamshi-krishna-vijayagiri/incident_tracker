import { apiClient } from "./api";

export interface Assignee {
  id: number;
  name: string;
}

export const getAssignees = async (): Promise<Assignee[]> => {
  const response = await apiClient.get<Assignee[]>("/assignees");
  return response.data;
};
