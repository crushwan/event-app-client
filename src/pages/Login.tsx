import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  password: string;
};

// ✅ Yup Schema for Validation
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  //  TanStack Query Mutation for Login API
  const mutation = useMutation<{ accessToken: string; refreshToken: string }, Error, FormData>({
    mutationFn: async (data) => {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",  // This ensures cookies are sent with the request
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Login API Response:", data);  // ✅ Debug full response
      localStorage.setItem("token", data.accessToken);
      console.log("Stored Access Token:", data.accessToken);
      navigate("/admin");
    },

    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  // ✅ Form Submission
  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    mutation.mutate(data);
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Paper elevation={4} sx={{ width: 400, padding: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Login</Typography>

          {/* ✅ Display Error Message */}
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>

          <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/signup")}>
            Register
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

function Login() {
  return <LoginForm />;
}

export default Login;
