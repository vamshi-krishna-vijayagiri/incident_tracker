import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import IncidentForm from "../components/IncidentForm";
import { IncidentFormData } from "../types/incident";
import {
  getIncidentByNumber,
  createIncident,
  updateIncident,
  StoredIncident,
} from "../utils/incidentStorage";

const IncidentPage = () => {
  const { incidentNumber } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(incidentNumber);

  const [incidentToEdit, setIncidentToEdit] = useState<StoredIncident | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isEditMode || !incidentNumber) return;

    const fetchIncident = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getIncidentByNumber(incidentNumber);
        if (!data) {
          setError("Incident not found");
        } else {
          setIncidentToEdit(data);
        }
      } catch (e) {
        console.error("Failed to load incident", e);
        setError("Failed to load incident");
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [incidentNumber, isEditMode]);

  const handleSubmit = async (data: IncidentFormData) => {
    try {
      if (isEditMode && incidentNumber) {
        await updateIncident(incidentNumber, data);
      } else {
        await createIncident(data);
      }
      navigate("/dashboard");
    } catch (e) {
      console.error("Failed to save incident", e);
      setError("Failed to save incident");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error && isEditMode) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <IncidentForm
        initialData={isEditMode ? incidentToEdit ?? undefined : undefined}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default IncidentPage;

