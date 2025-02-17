import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, TextField, Button, Typography, CircularProgress, Card, CardContent, Container } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface SignupFormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

// ✅ Yup Schema for Validation
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  name: yup.string().required("Name is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Signup() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // ✅ React Hook Form setup
  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
  });

  // ✅ TanStack Query Mutation for Signup API
  const mutation = useMutation<unknown, Error, SignupFormData>({
    mutationFn: async (data) => {
      const response = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Signup failed");
      return response.json();
    },
  });


  // ✅ Form Submission
  const onSubmit = async (data: SignupFormData) => {
    try {
      await mutation.mutateAsync(data);
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [success, navigate]);


  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Card sx={{ width: 400, boxShadow: 4, p: 3, textAlign: "center", borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Register</Typography>

            {/* ✅ Success Message */}
            {success && <Typography color="green">Signup Successful! You can now login.</Typography>}

            {/* ✅ Signup Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Name"
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    fullWidth
                    label="Password"
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    fullWidth
                    label="Confirm Password"
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? <CircularProgress size={24} /> : "Signup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
