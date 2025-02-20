import { useParams } from "react-router-dom";
import { Box, Typography, Card, Chip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const fetchEventById = async (id: string) => {
  const response = await fetch(`http://localhost:4000/events/${id}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export default function EventDetail() {
  const { id } = useParams();

  // Fetch event details using useQuery
  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id, // Only fetch when id is available
  });

  if (isLoading) return <Typography variant="h6" align="center">Loading event details...</Typography>;
  if (error) return <Typography variant="h6" color="error">Failed to load event details</Typography>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <Card
        sx={{
          width: "90%",
          maxWidth: 1200,
          height: 550,
          position: "relative",
          boxShadow: 4,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${event.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)",
          }}
        />
        {/* Glassmorphic Content */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            bgcolor: "rgba(255, 255, 255, 0.2)", // Semi-transparent glass effect
            backdropFilter: "blur(10px)", // Glassmorphic effect
            borderRadius: 3,
            boxShadow: 3,
            textAlign: "center",
            p: 3,
            color: "white",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {event.title}
          </Typography>
          <Typography variant="body1" mt={1}>
            📍 {event.location}
          </Typography>
          <Typography variant="body1" fontWeight="medium" mt={2}>
            🗓️ {event.startDate ? dayjs(event.startDate).format("DD-MM-YYYY") : ""} - {event.endDate ? dayjs(event.endDate).format("DD-MM-YYYY") : ""}
          </Typography>
          <Chip
            label={event.status}
            sx={{
              mt: 2,
              fontSize: "1rem",
              fontWeight: "bold",
              color: "white",
              bgcolor: event.status === "Ongoing" ? "orange" : "green",
              backdropFilter: "blur(5px)",
            }}
          />
        </Box>
      </Card>
    </Box>

  );
}
