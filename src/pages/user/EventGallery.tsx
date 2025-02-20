import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Card, CardMedia, CardContent, TablePagination } from "@mui/material";
import dayjs from "dayjs";

const fetchEvents = async (page: number, rowsPerPage: number) => {
  const response = await fetch(`http://localhost:4000/events?page=${page + 1}&limit=${rowsPerPage}`);
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
};

export default function EventGallery() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["events", page, rowsPerPage],
    queryFn: () => fetchEvents(page, rowsPerPage),
    placeholderData: (prevData) => prevData ?? { data: [], total: 0 },
  });

  return (
    <Box p={4}>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
        {isLoading ? (
          <Typography>Loading events...</Typography>
        ) : isError ? (
          <Typography>Error fetching events</Typography>
        ) : (
          data?.data.map((event: any) => (
            <Card
              key={event.id}
              sx={{
                width: 300,
                textAlign: "center",
                boxShadow: 4,
                borderRadius: 3,
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(`/event/${event.id}`)}
            >
              <CardMedia
                component="img"
                height="180"
                image={event.posterUrl}
                alt={event.title}
                sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {event.location}
                </Typography>
                <Typography variant="body2" mt={1} fontWeight="medium">
                  🗓️ {event.startDate ? dayjs(event.startDate).format("DD-MM-YYYY") : ""} - {event.endDate ? dayjs(event.endDate).format("DD-MM-YYYY") : ""}
                </Typography>
                <Typography
                  variant="body2"
                  color={event.status === "Ongoing" ? "warning" : "success"}
                  fontWeight="bold"
                  mt={1}
                >
                  {event.status}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
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
      </Box>
    </Box>
  );
}
