export type IncidentStatus = "New" | "In Progress" | "Close" | "Hold";

export interface IncidentFormData {
  incidentNumber: string;
  assignedTo: string;
  status: IncidentStatus;
  assignedDate: string;
  expectedToComplete: string;
  completedDate: string;
}
