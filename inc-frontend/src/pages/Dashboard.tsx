import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import PrimaryButton from "../components/PrimaryButton";
import ConfirmDialog from "../components/ConfirmDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import InputField from "../components/InputField";
import {
  getIncidents,
  deleteIncident as deleteIncidentApi,
  StoredIncident,
} from "../utils/incidentStorage";
import { IncidentStatus } from "../types/incident";
import { useAuth } from "../context/AuthContext";
import { dashboardTableStyles } from "../styles/dashboardStyles";

const statusOptions: ("all" | IncidentStatus)[] = [
  "all",
  "New",
  "In Progress",
  "Close",
  "Hold",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { username } = useAuth();

  const [rows, setRows] = useState<StoredIncident[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchIncidentNumber, setSearchIncidentNumber] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | IncidentStatus>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /** Confirm dialog state */
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIncidentNumber, setSelectedIncidentNumber] = useState<string | null>(null);

  /** Load incidents */
  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const data = await getIncidents();
        setRows(data);
      } catch (error) {
        console.error("Failed to load incidents", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  /** Open confirm dialog */
  const handleDeleteClick = (incidentNumber: string) => {
    setSelectedIncidentNumber(incidentNumber);
    setOpenDialog(true);
  };

  /** Confirm delete */
  const handleConfirmDelete = () => {
    if (!selectedIncidentNumber) return;

    const handleDelete = async () => {
      await deleteIncidentApi(selectedIncidentNumber, username);
      const updated = rows.filter(
        (incident) => incident.incidentNumber !== selectedIncidentNumber
      );
      setRows(updated);
    };

    handleDelete().catch((error) =>
      console.error("Failed to delete incident", error)
    );

    setOpenDialog(false);
    setSelectedIncidentNumber(null);
  };

  /** Cancel delete */
  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedIncidentNumber(null);
  };

  /** Print handler */
  const handlePrint = () => {
    const printContent = document.getElementById("print-area");
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;

    window.print();

    document.body.innerHTML = originalContent;
  };

  /** Pagination handlers */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /** Filters */
  const filteredRows = rows.filter((row) => {
    const searchLower = searchIncidentNumber.toLowerCase();
    
    const matchesSearch =
      row.incidentNumber.toLowerCase().includes(searchLower) ||
      row.assignedTo.toLowerCase().includes(searchLower) ||
      row.assignedDate.toLowerCase().includes(searchLower) ||
      row.expectedToComplete.toLowerCase().includes(searchLower) ||
      row.completedDate.toLowerCase().includes(searchLower) ||
      row.id.toString().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /** Pagination */
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchIncidentNumber, statusFilter]);

  const totalIncidents = rows.length;
  const newIncidents = rows.filter((i) => i.status === "New").length;
  const inProgressIncidents = rows.filter((i) => i.status === "In Progress")
    .length;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Incident Dashboard</Typography>
        <PrimaryButton
          label="Create Incident"
          onClick={() => navigate("/incident/add")}
        />
      </Box>

      {/* Cards + Filters */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        mb={3}
      >
        <Box display="flex" gap={2}>
          <InfoCard count={totalIncidents.toString()} title="Total Incidents" />
          <InfoCard count={newIncidents.toString()} title="New Incidents" />
          <InfoCard
            count={inProgressIncidents.toString()}
            title="In Progress"
          />
        </Box>

        <Box display="flex" gap={2} alignItems="flex-end">
          <InputField
            label="Search Incidents"
            value={searchIncidentNumber}
            onChange={(e) => setSearchIncidentNumber(e.target.value)}
            fullWidth={false}
            size="small"
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | IncidentStatus)
              }
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status === "all" ? "All" : status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton color="primary" onClick={handlePrint}>
            <PrintIcon />
          </IconButton>
        </Box>
      </Box>

      <Box id="print-area">
        <TableContainer component={Paper}>
          <Table sx={dashboardTableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Incident Number</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned Date</TableCell>
                <TableCell>Expected to Complete</TableCell>
                <TableCell>Completed Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading incidents...
                  </TableCell>
                </TableRow>
              )}

              {!loading && filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No incidents found
                  </TableCell>
                </TableRow>
              )}

              {paginatedRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.incidentNumber}</TableCell>
                  <TableCell>{row.assignedTo}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.assignedDate}</TableCell>
                  <TableCell>{row.expectedToComplete}</TableCell>
                  <TableCell>{row.completedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/incident/edit/${row.incidentNumber}`)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(row.incidentNumber)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={openDialog}
        title="Delete Incident"
        description="Are you sure you want to delete this incident?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default Dashboard;
