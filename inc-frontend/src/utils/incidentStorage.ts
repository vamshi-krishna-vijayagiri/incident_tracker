import { IncidentFormData } from "../types/incident";
import { apiClient } from "./api";

export interface StoredIncident extends IncidentFormData {
  id: number;
}

export const getIncidents = async (): Promise<StoredIncident[]> => {
  const response = await apiClient.get<StoredIncident[]>("/incidents");
  return response.data;
};

export const getIncidentByNumber = async (
  incidentNumber: string
): Promise<StoredIncident | null> => {
  const response = await apiClient.get<StoredIncident>(
    `/incidents/${encodeURIComponent(incidentNumber)}`
  );
  return response.data ?? null;
};

export const createIncident = async (
  data: IncidentFormData
): Promise<StoredIncident> => {
  const response = await apiClient.post<StoredIncident>("/incidents", data);
  return response.data;
};

export const updateIncident = async (
  incidentNumber: string,
  data: IncidentFormData
): Promise<StoredIncident> => {
  const response = await apiClient.put<StoredIncident>(
    `/incidents/${encodeURIComponent(incidentNumber)}`,
    data
  );
  return response.data;
};

export const deleteIncident = async (
  incidentNumber: string
): Promise<void> => {
  await apiClient.delete(
    `/incidents/${encodeURIComponent(incidentNumber)}`
  );
};

