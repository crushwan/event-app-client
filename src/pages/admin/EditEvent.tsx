import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EventForm from "../../components/EventForm";
import dayjs from "dayjs";

const fetchEvent = async (id: string) => {
  const response = await fetch(`http://localhost:4000/events/${id}`);
  if (!response.ok) throw new Error("Failed to fetch event");
  const data = await response.json();
  return {
    ...data,
    startDate: data.startDate ? dayjs(data.startDate) : null,
    endDate: data.endDate ? dayjs(data.endDate) : null,
  };
};

export default function EditEvent() {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Fetch event data using TanStack Query
  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["event", id], // Cache key for event
    queryFn: () => fetchEvent(id!),
    enabled: !!id, // Only run if id exists
  });

  // ✅ Mutation for updating the event
  const updateEvent = useMutation({
    mutationFn: async (data: any) => {
      const formattedData = {
        ...data,
        startDate: data.startDate ? dayjs(data.startDate).format("YYYY-MM-DD") : null,
        endDate: data.endDate ? dayjs(data.endDate).format("YYYY-MM-DD") : null,
        // startDate: data.startDate ? data.startDate.toISOString() : null,
        // endDate: data.endDate ? data.endDate.toISOString() : null,
        posterUrl: data.posterUrl,
      };

      const response = await fetch(`http://localhost:4000/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error("Failed to update event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] }); // ✅ Refetch updated event
      navigate("/admin/events"); // ✅ Redirect after update
    },
  });

  if (isLoading) return <p>Loading event...</p>;
  if (isError) return <p>Error loading event</p>;
  if (!event) return <p>Event not found</p>;


  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Event</h2>
      <EventForm defaultValues={event} onSubmit={updateEvent.mutate} />
    </div>
  );
}
