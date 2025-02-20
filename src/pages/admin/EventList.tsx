
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  MenuItem,
  Select,
  FormControl,
  TablePagination,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import api from "../../utils/api";
import dayjs from "dayjs";

interface Event {
  id: number;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "Ongoing" | "Completed";
}

const fetchEvents = async (page: number, rowsPerPage: number, search: string, statusFilter: string) => {
  const response = await fetch(
    `http://localhost:4000/events?page=${page + 1}&limit=${rowsPerPage}&search=${search}&status=${statusFilter}`
  );
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
};

const deleteEvent = async ({ eventId, password }: { eventId: number; password: string }) => {
  const token = localStorage.getItem("token");

  // Make sure the token exists before sending the request
  if (!token) throw new Error("No token found");

  try {
    const response = await api.delete(`http://localhost:4000/events/${eventId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      data: { password }, // Send password as part of the body in the DELETE request
    });

    return response.data; // Return the response data if successful
  } catch (error: any) {
    // Handle errors, including unauthorized
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

const EventList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // const [orderBy, setOrderBy] = useState<keyof Event>("title");
  // const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deletePassword, setDeletePassword] = useState(""); // Password for deletion
  const [openDialog, setOpenDialog] = useState(false); // Dialog visibility
  const [currentEventId, setCurrentEventId] = useState<number | null>(null); // Store current event ID for deletion

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["events", page, rowsPerPage, search, statusFilter],
    queryFn: () => fetchEvents(page, rowsPerPage, search, statusFilter),
    placeholderData: (prevData) => prevData ?? { data: [], total: 0 }, // Keeps previous data
  });

  const mutation = useMutation({
    mutationFn: deleteEvent,
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
    onSuccess: () => {
      // alert("Event deleted successfully");
      setOpenDialog(false); // Close the dialog after success
      setDeletePassword(""); // Reset password field
      refetch();
    },
  });

  // remove already sorthandle by backend
  // const handleSort = (property: keyof Event) => {
  //   setOrder(order === "asc" ? "desc" : "asc");
  //   setOrderBy(property);
  // };

  const handleDelete = () => {
    if (!deletePassword || !currentEventId) {
      // alert("Please enter the password to delete the event");
      return;
    }
    mutation.mutate({ eventId: currentEventId, password: deletePassword });
  };

  const openDeleteDialog = (eventId: number) => {
    setCurrentEventId(eventId); // Store the eventId for deletion
    setOpenDialog(true); // Open the delete confirmation dialog
  };

  const closeDeleteDialog = () => {
    setOpenDialog(false); // Close the dialog without deleting
    setDeletePassword(""); // Reset the password field
  };

  return (
    <Paper sx={{ padding: 2 }}>
      {/* Search & Filter */}
      <Box display="flex" alignItems="center" gap={2} width="100%">
        <TextField
          sx={{ flex: 1 }}
          label="Search Event"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} displayEmpty>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Events Table */}
      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                {/* <TableSortLabel active={orderBy === "title"} direction={order} onClick={() => handleSort("title")}>
                </TableSortLabel> */}
                Event Title
              </TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading events...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Error fetching events
                </TableCell>
              </TableRow>
            ) : data?.data.length ? (
              data.data.map((event: Event) => (
                <TableRow
                  key={event.id}
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                >
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                    >
                      <EditIcon />
                    </Button>
                  </TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.startDate ? dayjs(event.startDate).format("DD-MM-YYYY") : ""}</TableCell>
                  <TableCell>{event.endDate ? dayjs(event.endDate).format("DD-MM-YYYY") : ""}</TableCell>
                  <TableCell>{event.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click when deleting
                        openDeleteDialog(event.id); // Open password dialog
                      }}
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No events found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={data?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 20]}
      />

      {/* Delete Confirmation Dialog */}
      {/* <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete} // Trigger deletion with the correct eventId
            color="error"
            disabled={mutation.isPending || !deletePassword}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center' }}>
          Enter Password
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            sx={{ marginBlock: 2 }} // Adds a gap between the TextField and the buttons
          />
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', paddingBlock: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete} // Trigger deletion with the correct eventId
            color="error"
            variant="outlined"
            disabled={mutation.isPending || !deletePassword}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Paper >
  );
};

export default EventList;