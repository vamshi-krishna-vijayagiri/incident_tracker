import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import InputField from "./InputField";
import PrimaryButton from "./PrimaryButton";
import { IncidentFormData, IncidentStatus } from "../types/incident";
import { getAssignees, Assignee } from "../utils/assigneesApi";

interface IncidentFormProps {
  initialData?: IncidentFormData;
  onSubmit: (data: IncidentFormData) => void;
}

const statuses: IncidentStatus[] = ["New", "In Progress", "Close", "Hold"];

const IncidentForm: React.FC<IncidentFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [formData, setFormData] = useState<IncidentFormData>({
    incidentNumber: "",
    assignedTo: "",
    status: "New",
    assignedDate: "",
    expectedToComplete: "",
    completedDate: "",
  });

  /** Fetch assignees (master data) */
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const data = await getAssignees();
        setAssignees(data);
      } catch (err) {
        console.error("Failed to load assignees", err);
      }
    };
    fetchAssignees();
  }, []);

  /** Populate data in Edit mode */
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleDateChange =
    (field: keyof Pick<IncidentFormData, "assignedDate" | "expectedToComplete" | "completedDate">) =>
    (newValue: Dayjs | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: newValue ? newValue.format("YYYY-MM-DD") : "",
      }));
    };

  const isFormComplete =
    Boolean(formData.incidentNumber) &&
    Boolean(formData.assignedTo) &&
    Boolean(formData.assignedDate) &&
    Boolean(formData.expectedToComplete);

  const handleSubmit = () => {
    if (!isFormComplete) return;
    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box display="flex" flexDirection="column" gap={2} width={400}>
        <Typography variant="h6" align="center">
          {initialData ? "Edit Incident" : "Add Incident"}
        </Typography>

        <InputField
          label="Incident Number"
          name="incidentNumber"
          required
          value={formData.incidentNumber}
          onChange={handleInputChange}
        />

        <FormControl required>
          <InputLabel>Assigned To</InputLabel>
          <Select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleSelectChange}
            label="Assigned To"
          >
            {assignees.map((assignee) => (
              <MenuItem key={assignee.id} value={assignee.name}>
                {assignee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl required>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleSelectChange}
            label="Status"
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Assigned Date"
          value={formData.assignedDate ? dayjs(formData.assignedDate) : null}
          onChange={handleDateChange("assignedDate")}
          slotProps={{
            textField: {
              required: true,
              fullWidth: true,
            } as any,
          }}
        />

        <DatePicker
          label="Expected to Complete"
          value={
            formData.expectedToComplete
              ? dayjs(formData.expectedToComplete)
              : null
          }
          onChange={handleDateChange("expectedToComplete")}
          slotProps={{
            textField: {
              required: true,
              fullWidth: true,
            } as any,
          }}
        />

        <DatePicker
          label="Completed Date"
          value={formData.completedDate ? dayjs(formData.completedDate) : null}
          onChange={handleDateChange("completedDate")}
          slotProps={{
            textField: {
              fullWidth: true,
            } as any,
          }}
        />

        <PrimaryButton
          label={initialData ? "Update Incident" : "Create Incident"}
          fullWidth
          disabled={!isFormComplete}
          onClick={handleSubmit}
        />
      </Box>
    </Paper>
  );
};

export default IncidentForm;
