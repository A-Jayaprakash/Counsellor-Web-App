import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import store from "./redux/store";
import theme from "./theme/theme";
import AppInitializer from "./components/AppInitializer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import ODRequests from "./pages/ODRequests";
import Marks from "./pages/Marks";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppInitializer>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/od-requests" element={<ODRequests />} />
                <Route path="/marks" element={<Marks />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </Router>
        </AppInitializer>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
