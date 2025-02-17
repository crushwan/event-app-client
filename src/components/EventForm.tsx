import { useForm, Controller } from "react-hook-form";
import { Box, TextField, Button, FormControl, Typography, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type EventFormProps = {
  defaultValues?: any; // If provided, it's edit mode
  onSubmit: (data: any) => void;
  isLoading?: boolean; // Optional loading state
};

export default function EventForm({ defaultValues, onSubmit }: EventFormProps) {
  const isEditMode = !!defaultValues; // Check if it's update mode

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: defaultValues || {
      title: "",
      location: "",
      startDate: dayjs(), // Default: Today
      endDate: dayjs().add(1, "day"), // Default: Tomorrow
      status: "Ongoing", // Default status when creating a new event
      posterUrl: "",
    },
  });

  const [posterPreview, setPosterPreview] = useState<string | null>(defaultValues?.posterUrl || null);
  // const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Handle Image Upload to Supabase
  const handlePosterUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Get the existing poster URL (from form state)
    const existingPosterUrl = getValues("posterUrl");

    if (existingPosterUrl) {
      // Extract the correct file path (remove the base URL)
      const baseUrl = "https://vkoxiunflgpfgwqaddef.supabase.co/storage/v1/object/public/posters/";
      const oldFilePath = existingPosterUrl.replace(baseUrl, ""); // ✅ Extract file path only

      if (oldFilePath) {
        // Delete old poster from Supabase
        const { error: deleteError } = await supabase.storage.from("posters").remove([oldFilePath]);
        if (deleteError) {
          console.error("Failed to delete old image:", deleteError.message);
        } else {
          console.log("Old image deleted successfully:", oldFilePath);
        }
      }
    }

    const filePath = `posters/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("posters").upload(filePath, file);

    if (error) {
      console.error("Upload Error:", error.message);
      return;
    }

    // Get Public URL and Update Form State
    const publicUrl = supabase.storage.from("posters").getPublicUrl(filePath).data.publicUrl;
    setValue("posterUrl", publicUrl);
    setPosterPreview(publicUrl);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form
        onSubmit={handleSubmit((data) =>
          onSubmit({
            ...data,
            startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
          })
        )}
        style={{ display: "flex", flexDirection: "column", gap: 15, maxWidth: 400, margin: "auto" }}
      >
        {/* Event Name */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => <TextField {...field} label="Event Name" variant="outlined" required />}
        />

        {/* Location */}
        <Controller
          name="location"
          control={control}
          render={({ field }) => <TextField {...field} label="Location" variant="outlined" required />}
        />

        {/* Date Pickers */}
        <Box display="flex" gap={2}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Start Date"
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="End Date"
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
              />
            )}
          />
        </Box>

        {/* Status Dropdown - Only in Edit Mode */}
        {isEditMode && (
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Typography variant="body1" fontWeight="bold">Status</Typography>
                <Select {...field}>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        )}

        {/* Poster Upload */}
        <FormControl>
          <input
            type="file"
            accept="image/*"
            id="upload-poster"
            style={{ display: "none" }}
            onChange={handlePosterUpload}
          />
          <label htmlFor="upload-poster">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}
            >Upload Poster</Button>
          </label>
        </FormControl>

        {/* Poster Preview */}
        {posterPreview && <img src={posterPreview} alt="Event Poster" style={{ width: "100%", borderRadius: 10, marginTop: 10 }} />}

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary">
          {isEditMode ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </LocalizationProvider>
  );
}
