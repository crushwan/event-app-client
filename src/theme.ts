import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  // palette: {
  //   primary: {
  //     light: "#757ce8",
  //     main: "#3f50b5",
  //     dark: "#002884",
  //     contrastText: "#fff",
  //   },
  //   secondary: {
  //     light: "#ff7961",
  //     main: "#f44336",
  //     dark: "#ba000d",
  //     contrastText: "#000",
  //   },
  // },
  palette: {
    primary: {
      light: "#67c6c0",
      main: "#009688",  // Teal
      dark: "#004d40",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff9800",
      main: "#f57c00",  // Deep Orange
      dark: "#e65100",
      contrastText: "#fff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",  // Avoids ALL CAPS default
        },
      },
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",  // Use Google Fonts
    h1: { fontWeight: 700, fontSize: "2.5rem" },
    h2: { fontWeight: 600, fontSize: "2rem" },
    button: { textTransform: "none", fontWeight: 500 },
  },
});

export default theme;
