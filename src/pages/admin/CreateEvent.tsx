import { useNavigate } from "react-router-dom";
import EventForm from "../../components/EventForm";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import api from "../../utils/api";

export default function CreateEvent() {
  const navigate = useNavigate();

  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      const formattedData = {
        ...data,
        startDate: data.startDate ? dayjs(data.startDate).format("YYYY-MM-DD") : null,
        endDate: data.endDate ? dayjs(data.endDate).format("YYYY-MM-DD") : null,
        posterUrl: data.posterUrl,
      };

      // const token = localStorage.getItem("token");
      // console.log(token)
      // const response = await fetch("http://localhost:4000/events", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${token}`, // Ensure token is sent
      //   },
      //   body: JSON.stringify(formattedData),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to create event");
      // }
      // return response.json();

      return await api.post("/events", formattedData);
    },

    onSuccess: () => {
      navigate("/admin/events"); // Redirect after success
    },
    onError: (error: any) => {
      console.error("Error creating event:", error.message);
    },
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Event</h2>
      {createEventMutation.isError && (
        <p style={{ color: "red" }}>{createEventMutation.error?.message}</p>
      )}
      <EventForm onSubmit={createEventMutation.mutate} isLoading={createEventMutation.isPending} />
    </div>
  );
}
