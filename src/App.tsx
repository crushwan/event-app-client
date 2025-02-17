import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from ".";
import Loader from "./components/Loader";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
